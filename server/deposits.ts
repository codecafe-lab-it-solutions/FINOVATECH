import crypto from 'node:crypto';
import type { RowDataPacket } from 'mysql2';
import { pool } from './database';

function now(): string {
  return new Date().toISOString().slice(0, 19).replace('T', ' ');
}

// --- Deposit Addresses (admin-managed) ---

export interface DepositAddress {
  id: string;
  address: string;
  network: string;
  isActive: boolean;
  visibility: 'All' | 'Specific';
  visibleInvestorIds: string[];
  createdAt: string;
}

interface AddressRow extends RowDataPacket {
  id: string;
  address: string;
  network: string;
  is_active: number;
  visibility: 'All' | 'Specific';
  created_at: string;
}

async function attachVisibility(row: AddressRow): Promise<DepositAddress> {
  const [visRows] = await pool.query<RowDataPacket[]>(
    'SELECT investor_user_id FROM deposit_address_visibility WHERE deposit_address_id = ?',
    [row.id]
  );
  return {
    id: row.id,
    address: row.address,
    network: row.network,
    isActive: !!row.is_active,
    visibility: row.visibility,
    visibleInvestorIds: visRows.map((r) => r.investor_user_id as string),
    createdAt: row.created_at
  };
}

export async function listDepositAddresses(): Promise<DepositAddress[]> {
  const [rows] = await pool.query<AddressRow[]>('SELECT * FROM deposit_addresses ORDER BY created_at DESC');
  return Promise.all(rows.map(attachVisibility));
}

export async function getActiveDepositAddressForInvestor(investorUserId: string): Promise<DepositAddress | undefined> {
  const [rows] = await pool.query<AddressRow[]>('SELECT * FROM deposit_addresses WHERE is_active = TRUE LIMIT 1');
  const row = rows[0];
  if (!row) return undefined;

  const address = await attachVisibility(row);
  if (address.visibility === 'All') return address;
  return address.visibleInvestorIds.includes(investorUserId) ? address : undefined;
}

export async function createDepositAddress(params: {
  address: string;
  network: string;
  visibility: 'All' | 'Specific';
  visibleInvestorIds?: string[];
}): Promise<DepositAddress> {
  const id = crypto.randomUUID();

  // Only one address can be active — creating a new one deactivates the rest.
  await pool.query('UPDATE deposit_addresses SET is_active = FALSE');

  await pool.query(
    'INSERT INTO deposit_addresses (id, address, network, is_active, visibility, created_at) VALUES (?, ?, ?, TRUE, ?, ?)',
    [id, params.address, params.network, params.visibility, now()]
  );

  if (params.visibility === 'Specific' && params.visibleInvestorIds?.length) {
    for (const investorId of params.visibleInvestorIds) {
      await pool.query(
        'INSERT INTO deposit_address_visibility (id, deposit_address_id, investor_user_id) VALUES (?, ?, ?)',
        [crypto.randomUUID(), id, investorId]
      );
    }
  }

  const [rows] = await pool.query<AddressRow[]>('SELECT * FROM deposit_addresses WHERE id = ?', [id]);
  return attachVisibility(rows[0]);
}

// --- Deposit Requests (investor-submitted, admin-reviewed) ---

export interface DepositRequest {
  id: string;
  investorUserId: string;
  investorName?: string;
  referenceNumber: string;
  amountUsd: number;
  depositAddress: string;
  network: string;
  proofFilename: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  adminNote: string;
  createdAt: string;
  reviewedAt: string | null;
}

interface RequestRow extends RowDataPacket {
  id: string;
  investor_user_id: string;
  investor_name?: string;
  reference_number: string;
  amount_usd: string;
  deposit_address: string;
  network: string;
  proof_filename: string;
  status: DepositRequest['status'];
  admin_note: string;
  created_at: string;
  reviewed_at: string | null;
}

function toRequest(row: RequestRow): DepositRequest {
  return {
    id: row.id,
    investorUserId: row.investor_user_id,
    investorName: row.investor_name,
    referenceNumber: row.reference_number,
    amountUsd: Number(row.amount_usd),
    depositAddress: row.deposit_address,
    network: row.network,
    proofFilename: row.proof_filename,
    status: row.status,
    adminNote: row.admin_note,
    createdAt: row.created_at,
    reviewedAt: row.reviewed_at
  };
}

function generateReferenceNumber(): string {
  return `DEP-${crypto.randomInt(10000000, 99999999)}`;
}

export async function createDepositRequest(params: {
  investorUserId: string;
  amountUsd: number;
  depositAddress: string;
  network: string;
  proofFilename: string;
}): Promise<DepositRequest> {
  const id = crypto.randomUUID();
  const referenceNumber = generateReferenceNumber();
  const createdAt = now();

  await pool.query(
    'INSERT INTO deposit_requests (id, investor_user_id, reference_number, amount_usd, deposit_address, network, proof_filename, status, admin_note, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [id, params.investorUserId, referenceNumber, params.amountUsd, params.depositAddress, params.network, params.proofFilename, 'Pending', '', createdAt]
  );

  return {
    id,
    investorUserId: params.investorUserId,
    referenceNumber,
    amountUsd: params.amountUsd,
    depositAddress: params.depositAddress,
    network: params.network,
    proofFilename: params.proofFilename,
    status: 'Pending',
    adminNote: '',
    createdAt,
    reviewedAt: null
  };
}

export async function listDepositRequestsForInvestor(investorUserId: string): Promise<DepositRequest[]> {
  const [rows] = await pool.query<RequestRow[]>(
    'SELECT * FROM deposit_requests WHERE investor_user_id = ? ORDER BY created_at DESC',
    [investorUserId]
  );
  return rows.map(toRequest);
}

export async function listAllDepositRequests(): Promise<DepositRequest[]> {
  const [rows] = await pool.query<RequestRow[]>(
    `SELECT d.*, u.name AS investor_name FROM deposit_requests d
     JOIN users u ON u.id = d.investor_user_id
     ORDER BY d.created_at DESC`
  );
  return rows.map(toRequest);
}

export async function getDepositRequest(id: string): Promise<DepositRequest | undefined> {
  const [rows] = await pool.query<RequestRow[]>(
    `SELECT d.*, u.name AS investor_name FROM deposit_requests d
     JOIN users u ON u.id = d.investor_user_id
     WHERE d.id = ?`,
    [id]
  );
  return rows[0] ? toRequest(rows[0]) : undefined;
}

export async function updateDepositRequestStatus(
  id: string,
  status: 'Approved' | 'Rejected',
  adminNote?: string
): Promise<DepositRequest> {
  await pool.query('UPDATE deposit_requests SET status = ?, admin_note = ?, reviewed_at = ? WHERE id = ?', [
    status,
    adminNote ?? '',
    now(),
    id
  ]);
  const request = await getDepositRequest(id);
  if (!request) throw new Error('DEPOSIT_REQUEST_NOT_FOUND');
  return request;
}
