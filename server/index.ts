import 'dotenv/config';
import path from 'node:path';
import fs from 'node:fs';
import express from 'express';
import bcrypt from 'bcryptjs';
import { createUser, findUserById, findUserByUsername, seedIfEmpty, updateCredentials } from './db';
import { initSchema } from './database';
import { signToken, verifyToken, TokenPayload } from './auth';
import { createSession, isSessionRevoked, listSessionsForUser, revokeSession } from './sessions';
import {
  getProfile,
  listInvestorProfiles,
  updateProfile,
  listTransactions,
  addTransaction,
  listPayoutsForInvestor,
  listAllPayouts,
  createPayoutRequest,
  updatePayoutStatus,
  ProfileUpdate
} from './investors';
import {
  listPlans,
  createPlan,
  updatePlan,
  listWallets,
  createWallet,
  updateWallet,
  listDocuments,
  listDocumentsForInvestor,
  createDocument,
  setDocumentStatus,
  listAllTransactions
} from './adminData';
import {
  listNotifications,
  createNotification,
  setNotificationRead,
  markAllNotificationsRead,
  listTicketsForInvestor,
  listAllTickets,
  getTicketMessages,
  createTicket,
  addTicketMessage,
  updateTicketStatus,
  getReferralStats,
  listMachinesForInvestor,
  listAllMachines,
  createMachine,
  updateMachine,
  listEarnings,
  listMonthlyStatements
} from './investorExtras';

const app = express();
app.use(express.json());

// In production this same process serves the built frontend (vite build's
// dist/) alongside the API, so there's just one server to run and one port
// to point a reverse proxy at.
const DIST_DIR = path.resolve(process.cwd(), 'dist');
const isProduction = process.env.NODE_ENV === 'production';

const PORT = process.env.API_PORT ? Number(process.env.API_PORT) : 8787;

function publicUser(u: { id: string; username: string; role: string; name: string }) {
  return { id: u.id, username: u.username, role: u.role, name: u.name };
}

function clientDevice(req: express.Request): string {
  return (req.headers['user-agent'] as string) || 'Unknown device';
}

function clientIp(req: express.Request): string {
  return req.ip || req.socket.remoteAddress || 'Unknown';
}

// Verifies the JWT AND checks the session it was issued for hasn't been
// revoked — a "Revoke Session" click in Security Center actually invalidates
// that token on its very next request, not just a cosmetic DB flag.
async function requireAuth(req: express.Request): Promise<TokenPayload> {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
  if (!token) {
    throw new Error('NOT_AUTHENTICATED');
  }
  const payload = verifyToken(token);
  if (await isSessionRevoked(payload.sid)) {
    throw new Error('NOT_AUTHENTICATED');
  }
  return payload;
}

async function requireRole(req: express.Request, role: 'admin' | 'investor'): Promise<TokenPayload> {
  const payload = await requireAuth(req);
  if (payload.role !== role) {
    throw new Error('FORBIDDEN');
  }
  return payload;
}

function handleAuthError(err: unknown, res: express.Response): boolean {
  if (err instanceof Error && err.message === 'NOT_AUTHENTICATED') {
    res.status(401).json({ error: 'Not authenticated.' });
    return true;
  }
  if (err instanceof Error && err.message === 'FORBIDDEN') {
    res.status(403).json({ error: 'You do not have permission to do that.' });
    return true;
  }
  return false;
}

async function issueSessionToken(user: { id: string; username: string; role: 'investor' | 'admin'; name: string }, req: express.Request) {
  const sid = await createSession(user.id, clientDevice(req), clientIp(req));
  return signToken({ sub: user.id, sid, username: user.username, role: user.role, name: user.name });
}

app.post('/api/auth/register', async (req, res) => {
  const { username, password, name, referredByCode } = req.body ?? {};

  if (typeof username !== 'string' || typeof password !== 'string' || typeof name !== 'string') {
    return res.status(400).json({ error: 'Username, password, and full name are required.' });
  }
  if (username.trim().length < 3) {
    return res.status(400).json({ error: 'Username must be at least 3 characters.' });
  }
  if (password.length < 5) {
    return res.status(400).json({ error: 'Password must be at least 5 characters.' });
  }
  if (name.trim().length < 2) {
    return res.status(400).json({ error: 'Full name is required.' });
  }

  try {
    // Self-service registration always creates an investor account.
    // Admin accounts are provisioned separately and are not publicly self-serve.
    const user = await createUser({
      username,
      password,
      name,
      role: 'investor',
      referredByCode: typeof referredByCode === 'string' && referredByCode.trim() ? referredByCode : undefined
    });
    const token = await issueSessionToken(user, req);
    res.status(201).json({ token, user: publicUser(user) });
  } catch (err) {
    if (err instanceof Error && err.message === 'USERNAME_TAKEN') {
      return res.status(409).json({ error: 'That username is already taken.' });
    }
    console.error('Registration failed:', err);
    res.status(500).json({ error: 'Registration failed. Please try again.' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body ?? {};

  if (typeof username !== 'string' || typeof password !== 'string') {
    return res.status(400).json({ error: 'Username and password are required.' });
  }

  try {
    const user = await findUserByUsername(username);
    if (!user || !bcrypt.compareSync(password, user.passwordHash)) {
      return res.status(401).json({ error: 'Invalid username or password.' });
    }

    const token = await issueSessionToken(user, req);
    res.json({ token, user: publicUser(user) });
  } catch (err) {
    console.error('Login failed:', err);
    res.status(500).json({ error: 'Login failed. Please try again.' });
  }
});

app.put('/api/auth/credentials', async (req, res) => {
  let payload: TokenPayload;
  try {
    payload = await requireAuth(req);
  } catch {
    return res.status(401).json({ error: 'Session expired. Please sign in again.' });
  }

  const { currentPassword, newUsername, newPassword } = req.body ?? {};

  if (typeof currentPassword !== 'string') {
    return res.status(400).json({ error: 'Current password is required.' });
  }
  if (newUsername !== undefined && (typeof newUsername !== 'string' || newUsername.trim().length < 3)) {
    return res.status(400).json({ error: 'New username must be at least 3 characters.' });
  }
  if (newPassword !== undefined && (typeof newPassword !== 'string' || newPassword.length < 5)) {
    return res.status(400).json({ error: 'New password must be at least 5 characters.' });
  }
  if (newUsername === undefined && newPassword === undefined) {
    return res.status(400).json({ error: 'Nothing to update.' });
  }

  try {
    const user = await findUserById(payload.sub);
    if (!user || !bcrypt.compareSync(currentPassword, user.passwordHash)) {
      return res.status(401).json({ error: 'Current password is incorrect.' });
    }

    const updated = await updateCredentials(user.id, {
      username: newUsername,
      password: newPassword
    });

    // Reissue the session token — the old one still carries the previous
    // username/name claims, which are now stale.
    const token = await issueSessionToken(updated, req);
    res.json({ token, user: publicUser(updated) });
  } catch (err) {
    if (err instanceof Error && err.message === 'USERNAME_TAKEN') {
      return res.status(409).json({ error: 'That username is already taken.' });
    }
    console.error('Credentials update failed:', err);
    res.status(500).json({ error: 'Could not update credentials. Please try again.' });
  }
});

app.get('/api/auth/me', async (req, res) => {
  try {
    const payload = await requireAuth(req);
    res.json({ user: { id: payload.sub, username: payload.username, role: payload.role, name: payload.name } });
  } catch {
    res.status(401).json({ error: 'Session expired. Please sign in again.' });
  }
});

// --- Investor self-service (own data only) ---

app.get('/api/investor/profile', async (req, res) => {
  try {
    const payload = await requireRole(req, 'investor');
    const profile = await getProfile(payload.sub);
    if (!profile) return res.status(404).json({ error: 'Profile not found.' });
    res.json({ profile });
  } catch (err) {
    if (handleAuthError(err, res)) return;
    console.error('Fetch investor profile failed:', err);
    res.status(500).json({ error: 'Could not load profile.' });
  }
});

app.patch('/api/investor/profile', async (req, res) => {
  try {
    const payload = await requireRole(req, 'investor');
    // Investors may only edit their own contact/banking/payout details —
    // KYC status, account status, and portfolio figures stay admin-managed.
    const { email, phone, country, payoutBtcAddress, bankName, bankAccountHolder, bankAccountNumber, bankIban, bankSwift } =
      req.body ?? {};
    const profile = await updateProfile(payload.sub, {
      email,
      phone,
      country,
      payoutBtcAddress,
      bankName,
      bankAccountHolder,
      bankAccountNumber,
      bankIban,
      bankSwift
    });
    res.json({ profile });
  } catch (err) {
    if (handleAuthError(err, res)) return;
    console.error('Update investor profile failed:', err);
    res.status(500).json({ error: 'Could not update profile.' });
  }
});

app.get('/api/investor/transactions', async (req, res) => {
  try {
    const payload = await requireRole(req, 'investor');
    const transactions = await listTransactions(payload.sub);
    res.json({ transactions });
  } catch (err) {
    if (handleAuthError(err, res)) return;
    console.error('Fetch investor transactions failed:', err);
    res.status(500).json({ error: 'Could not load transactions.' });
  }
});

app.get('/api/investor/payouts', async (req, res) => {
  try {
    const payload = await requireRole(req, 'investor');
    const payouts = await listPayoutsForInvestor(payload.sub);
    res.json({ payouts });
  } catch (err) {
    if (handleAuthError(err, res)) return;
    console.error('Fetch investor payouts failed:', err);
    res.status(500).json({ error: 'Could not load payouts.' });
  }
});

app.post('/api/investor/payouts', async (req, res) => {
  try {
    const payload = await requireRole(req, 'investor');
    const { amountBtc, destinationWallet } = req.body ?? {};

    if (typeof amountBtc !== 'number' || amountBtc <= 0) {
      return res.status(400).json({ error: 'Enter a valid BTC amount.' });
    }
    if (typeof destinationWallet !== 'string' || destinationWallet.trim().length < 6) {
      return res.status(400).json({ error: 'Enter a valid destination wallet address.' });
    }

    const profile = await getProfile(payload.sub);
    if (!profile) {
      return res.status(404).json({ error: 'Investor profile not found.' });
    }
    if (amountBtc > profile.totalBtcAllocated) {
      return res.status(400).json({ error: 'Requested amount exceeds your allocated BTC balance.' });
    }

    const payout = await createPayoutRequest({
      investorUserId: payload.sub,
      amountBtc,
      destinationWallet: destinationWallet.trim()
    });
    await createNotification(
      payload.sub,
      'Payout Request Submitted',
      `Your request to withdraw ${amountBtc} BTC has been submitted and is awaiting admin review.`,
      'payout'
    );
    res.status(201).json({ payout });
  } catch (err) {
    if (handleAuthError(err, res)) return;
    console.error('Create payout request failed:', err);
    res.status(500).json({ error: 'Could not submit payout request.' });
  }
});

app.get('/api/investor/earnings', async (req, res) => {
  try {
    const payload = await requireRole(req, 'investor');
    res.json({ earnings: await listEarnings(payload.sub) });
  } catch (err) {
    if (handleAuthError(err, res)) return;
    console.error('Fetch investor earnings failed:', err);
    res.status(500).json({ error: 'Could not load earnings.' });
  }
});

app.get('/api/investor/statements', async (req, res) => {
  try {
    const payload = await requireRole(req, 'investor');
    res.json({ statements: await listMonthlyStatements(payload.sub) });
  } catch (err) {
    if (handleAuthError(err, res)) return;
    console.error('Fetch investor statements failed:', err);
    res.status(500).json({ error: 'Could not load statements.' });
  }
});

app.get('/api/investor/notifications', async (req, res) => {
  try {
    const payload = await requireRole(req, 'investor');
    res.json({ notifications: await listNotifications(payload.sub) });
  } catch (err) {
    if (handleAuthError(err, res)) return;
    console.error('Fetch investor notifications failed:', err);
    res.status(500).json({ error: 'Could not load notifications.' });
  }
});

app.patch('/api/investor/notifications/:id', async (req, res) => {
  try {
    const payload = await requireRole(req, 'investor');
    const { isRead } = req.body ?? {};
    await setNotificationRead(req.params.id, payload.sub, Boolean(isRead));
    res.json({ ok: true });
  } catch (err) {
    if (handleAuthError(err, res)) return;
    console.error('Update notification failed:', err);
    res.status(500).json({ error: 'Could not update notification.' });
  }
});

app.post('/api/investor/notifications/mark-all-read', async (req, res) => {
  try {
    const payload = await requireRole(req, 'investor');
    await markAllNotificationsRead(payload.sub);
    res.json({ ok: true });
  } catch (err) {
    if (handleAuthError(err, res)) return;
    console.error('Mark all notifications read failed:', err);
    res.status(500).json({ error: 'Could not update notifications.' });
  }
});

app.get('/api/investor/sessions', async (req, res) => {
  try {
    const payload = await requireRole(req, 'investor');
    const sessions = await listSessionsForUser(payload.sub);
    res.json({ sessions: sessions.map((s) => ({ ...s, isCurrent: s.id === payload.sid })) });
  } catch (err) {
    if (handleAuthError(err, res)) return;
    console.error('Fetch investor sessions failed:', err);
    res.status(500).json({ error: 'Could not load sessions.' });
  }
});

app.delete('/api/investor/sessions/:id', async (req, res) => {
  try {
    const payload = await requireRole(req, 'investor');
    if (req.params.id === payload.sid) {
      return res.status(400).json({ error: "Can't revoke your current session — log out instead." });
    }
    await revokeSession(req.params.id, payload.sub);
    res.json({ ok: true });
  } catch (err) {
    if (handleAuthError(err, res)) return;
    console.error('Revoke session failed:', err);
    res.status(500).json({ error: 'Could not revoke session.' });
  }
});

app.get('/api/investor/tickets', async (req, res) => {
  try {
    const payload = await requireRole(req, 'investor');
    const tickets = await listTicketsForInvestor(payload.sub);
    const withMessages = await Promise.all(
      tickets.map(async (t) => ({ ...t, messages: await getTicketMessages(t.id) }))
    );
    res.json({ tickets: withMessages });
  } catch (err) {
    if (handleAuthError(err, res)) return;
    console.error('Fetch investor tickets failed:', err);
    res.status(500).json({ error: 'Could not load tickets.' });
  }
});

app.post('/api/investor/tickets', async (req, res) => {
  try {
    const payload = await requireRole(req, 'investor');
    const { subject, category, message } = req.body ?? {};
    if (typeof subject !== 'string' || !subject.trim()) {
      return res.status(400).json({ error: 'Subject is required.' });
    }
    if (typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({ error: 'Message is required.' });
    }
    const ticket = await createTicket({
      investorUserId: payload.sub,
      subject: subject.trim(),
      category: typeof category === 'string' && category ? category : 'General',
      firstMessage: message.trim(),
      senderName: payload.name
    });
    res.status(201).json({ ticket });
  } catch (err) {
    if (handleAuthError(err, res)) return;
    console.error('Create ticket failed:', err);
    res.status(500).json({ error: 'Could not create ticket.' });
  }
});

app.post('/api/investor/tickets/:id/messages', async (req, res) => {
  try {
    const payload = await requireRole(req, 'investor');
    const { message } = req.body ?? {};
    if (typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({ error: 'Message is required.' });
    }
    const msg = await addTicketMessage({
      ticketId: req.params.id,
      senderRole: 'investor',
      senderName: payload.name,
      message: message.trim()
    });
    res.status(201).json({ message: msg });
  } catch (err) {
    if (handleAuthError(err, res)) return;
    console.error('Add ticket message failed:', err);
    res.status(500).json({ error: 'Could not send message.' });
  }
});

app.get('/api/investor/referrals', async (req, res) => {
  try {
    const payload = await requireRole(req, 'investor');
    res.json(await getReferralStats(payload.sub));
  } catch (err) {
    if (handleAuthError(err, res)) return;
    console.error('Fetch investor referrals failed:', err);
    res.status(500).json({ error: 'Could not load referrals.' });
  }
});

app.get('/api/investor/machines', async (req, res) => {
  try {
    const payload = await requireRole(req, 'investor');
    res.json({ machines: await listMachinesForInvestor(payload.sub) });
  } catch (err) {
    if (handleAuthError(err, res)) return;
    console.error('Fetch investor machines failed:', err);
    res.status(500).json({ error: 'Could not load machines.' });
  }
});

app.get('/api/investor/documents', async (req, res) => {
  try {
    const payload = await requireRole(req, 'investor');
    res.json({ documents: await listDocumentsForInvestor(payload.sub) });
  } catch (err) {
    if (handleAuthError(err, res)) return;
    console.error('Fetch investor documents failed:', err);
    res.status(500).json({ error: 'Could not load documents.' });
  }
});

// --- Admin management of investors ---

app.get('/api/admin/investors', async (req, res) => {
  try {
    await requireRole(req, 'admin');
    const investors = await listInvestorProfiles();
    res.json({ investors });
  } catch (err) {
    if (handleAuthError(err, res)) return;
    console.error('List investors failed:', err);
    res.status(500).json({ error: 'Could not load investors.' });
  }
});

app.get('/api/admin/investors/:id', async (req, res) => {
  try {
    await requireRole(req, 'admin');
    const [profile, transactions, payouts] = await Promise.all([
      getProfile(req.params.id),
      listTransactions(req.params.id),
      listPayoutsForInvestor(req.params.id)
    ]);
    if (!profile) return res.status(404).json({ error: 'Investor not found.' });
    res.json({ profile, transactions, payouts });
  } catch (err) {
    if (handleAuthError(err, res)) return;
    console.error('Fetch investor detail failed:', err);
    res.status(500).json({ error: 'Could not load investor.' });
  }
});

app.put('/api/admin/investors/:id', async (req, res) => {
  try {
    await requireRole(req, 'admin');
    const updates = req.body as ProfileUpdate;
    const before = await getProfile(req.params.id);
    const profile = await updateProfile(req.params.id, updates);

    if (updates.kycStatus && before && before.kycStatus !== updates.kycStatus) {
      await createNotification(
        req.params.id,
        'KYC Status Updated',
        `Your KYC verification status is now: ${updates.kycStatus}.`,
        'kyc'
      );
    }
    res.json({ profile });
  } catch (err) {
    if (handleAuthError(err, res)) return;
    console.error('Update investor profile failed:', err);
    res.status(500).json({ error: 'Could not update investor.' });
  }
});

app.post('/api/admin/investors/:id/transactions', async (req, res) => {
  try {
    await requireRole(req, 'admin');
    const { type, amountBtc, amountUsd, status, note } = req.body ?? {};

    if (typeof type !== 'string' || !type.trim()) {
      return res.status(400).json({ error: 'Transaction type is required.' });
    }
    if (typeof amountBtc !== 'number' || typeof amountUsd !== 'number') {
      return res.status(400).json({ error: 'BTC and USD amounts are required.' });
    }

    const transaction = await addTransaction({
      investorUserId: req.params.id,
      type: type.trim(),
      amountBtc,
      amountUsd,
      status: typeof status === 'string' ? status : undefined,
      note: typeof note === 'string' ? note : undefined
    });
    res.status(201).json({ transaction });
  } catch (err) {
    if (handleAuthError(err, res)) return;
    console.error('Add transaction failed:', err);
    res.status(500).json({ error: 'Could not add transaction.' });
  }
});

app.get('/api/admin/payouts', async (req, res) => {
  try {
    await requireRole(req, 'admin');
    const payouts = await listAllPayouts();
    res.json({ payouts });
  } catch (err) {
    if (handleAuthError(err, res)) return;
    console.error('List payouts failed:', err);
    res.status(500).json({ error: 'Could not load payouts.' });
  }
});

app.patch('/api/admin/payouts/:id', async (req, res) => {
  try {
    await requireRole(req, 'admin');
    const { status, notes } = req.body ?? {};
    const validStatuses = ['Requested', 'Processing', 'Completed', 'Rejected'];
    if (typeof status !== 'string' || !validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status.' });
    }

    const payout = await updatePayoutStatus(req.params.id, status as never, typeof notes === 'string' ? notes : undefined);
    await createNotification(
      payout.investorUserId,
      'Payout Status Updated',
      `Your payout of ${payout.amountBtc} BTC is now: ${status}.`,
      'payout'
    );
    res.json({ payout });
  } catch (err) {
    if (handleAuthError(err, res)) return;
    console.error('Update payout status failed:', err);
    res.status(500).json({ error: 'Could not update payout.' });
  }
});

// --- Admin: Investment Plans ---

app.get('/api/admin/plans', async (req, res) => {
  try {
    await requireRole(req, 'admin');
    res.json({ plans: await listPlans() });
  } catch (err) {
    if (handleAuthError(err, res)) return;
    console.error('List plans failed:', err);
    res.status(500).json({ error: 'Could not load plans.' });
  }
});

app.post('/api/admin/plans', async (req, res) => {
  try {
    await requireRole(req, 'admin');
    const { name, tagline, minInvestmentUsd, maxInvestmentUsd, durationMonths, managementFeePercent, payoutFrequency, status } = req.body ?? {};
    if (typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({ error: 'Plan name is required.' });
    }
    const plan = await createPlan({
      name: name.trim(),
      tagline: tagline || '',
      minInvestmentUsd: Number(minInvestmentUsd) || 0,
      maxInvestmentUsd: Number(maxInvestmentUsd) || 0,
      durationMonths: Number(durationMonths) || 12,
      managementFeePercent: Number(managementFeePercent) || 0,
      payoutFrequency: payoutFrequency || 'Monthly',
      status: status || 'Draft'
    });
    res.status(201).json({ plan });
  } catch (err) {
    if (handleAuthError(err, res)) return;
    console.error('Create plan failed:', err);
    res.status(500).json({ error: 'Could not create plan.' });
  }
});

app.put('/api/admin/plans/:id', async (req, res) => {
  try {
    await requireRole(req, 'admin');
    await updatePlan(req.params.id, req.body ?? {});
    res.json({ ok: true });
  } catch (err) {
    if (handleAuthError(err, res)) return;
    console.error('Update plan failed:', err);
    res.status(500).json({ error: 'Could not update plan.' });
  }
});

// --- Admin: Company Wallets ---

app.get('/api/admin/wallets', async (req, res) => {
  try {
    await requireRole(req, 'admin');
    res.json({ wallets: await listWallets() });
  } catch (err) {
    if (handleAuthError(err, res)) return;
    console.error('List wallets failed:', err);
    res.status(500).json({ error: 'Could not load wallets.' });
  }
});

app.post('/api/admin/wallets', async (req, res) => {
  try {
    await requireRole(req, 'admin');
    const { walletName, type, currency, address, balance, requiresMultisig, status } = req.body ?? {};
    if (typeof walletName !== 'string' || !walletName.trim()) {
      return res.status(400).json({ error: 'Wallet name is required.' });
    }
    const wallet = await createWallet({
      walletName: walletName.trim(),
      type: type || 'Treasury',
      currency: currency || 'BTC',
      address: address || '',
      balance: Number(balance) || 0,
      requiresMultisig: Boolean(requiresMultisig),
      status: status || 'Active'
    });
    res.status(201).json({ wallet });
  } catch (err) {
    if (handleAuthError(err, res)) return;
    console.error('Create wallet failed:', err);
    res.status(500).json({ error: 'Could not create wallet.' });
  }
});

app.put('/api/admin/wallets/:id', async (req, res) => {
  try {
    await requireRole(req, 'admin');
    await updateWallet(req.params.id, req.body ?? {});
    res.json({ ok: true });
  } catch (err) {
    if (handleAuthError(err, res)) return;
    console.error('Update wallet failed:', err);
    res.status(500).json({ error: 'Could not update wallet.' });
  }
});

// --- Admin: Documents (metadata) ---

app.get('/api/admin/documents', async (req, res) => {
  try {
    await requireRole(req, 'admin');
    res.json({ documents: await listDocuments() });
  } catch (err) {
    if (handleAuthError(err, res)) return;
    console.error('List documents failed:', err);
    res.status(500).json({ error: 'Could not load documents.' });
  }
});

app.post('/api/admin/documents', async (req, res) => {
  try {
    const payload = await requireRole(req, 'admin');
    const { title, category, investorUserId } = req.body ?? {};
    if (typeof title !== 'string' || !title.trim()) {
      return res.status(400).json({ error: 'Document title is required.' });
    }
    if (typeof category !== 'string') {
      return res.status(400).json({ error: 'Document category is required.' });
    }
    const document = await createDocument({
      title: title.trim(),
      category: category as never,
      investorUserId: typeof investorUserId === 'string' && investorUserId ? investorUserId : null,
      uploadedBy: payload.name
    });
    res.status(201).json({ document });
  } catch (err) {
    if (handleAuthError(err, res)) return;
    console.error('Create document failed:', err);
    res.status(500).json({ error: 'Could not create document.' });
  }
});

app.patch('/api/admin/documents/:id', async (req, res) => {
  try {
    await requireRole(req, 'admin');
    const { status } = req.body ?? {};
    if (status !== 'Active' && status !== 'Archived') {
      return res.status(400).json({ error: 'Invalid status.' });
    }
    await setDocumentStatus(req.params.id, status);
    res.json({ ok: true });
  } catch (err) {
    if (handleAuthError(err, res)) return;
    console.error('Update document status failed:', err);
    res.status(500).json({ error: 'Could not update document.' });
  }
});

// --- Admin: all wallet transactions (Investment Txns view) ---

app.get('/api/admin/transactions', async (req, res) => {
  try {
    await requireRole(req, 'admin');
    res.json({ transactions: await listAllTransactions() });
  } catch (err) {
    if (handleAuthError(err, res)) return;
    console.error('List all transactions failed:', err);
    res.status(500).json({ error: 'Could not load transactions.' });
  }
});

// --- Admin: Support Tickets ---

app.get('/api/admin/tickets', async (req, res) => {
  try {
    await requireRole(req, 'admin');
    const tickets = await listAllTickets();
    const withMessages = await Promise.all(
      tickets.map(async (t) => ({ ...t, messages: await getTicketMessages(t.id) }))
    );
    res.json({ tickets: withMessages });
  } catch (err) {
    if (handleAuthError(err, res)) return;
    console.error('List all tickets failed:', err);
    res.status(500).json({ error: 'Could not load tickets.' });
  }
});

app.post('/api/admin/tickets/:id/messages', async (req, res) => {
  try {
    const payload = await requireRole(req, 'admin');
    const { message } = req.body ?? {};
    if (typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({ error: 'Message is required.' });
    }
    const msg = await addTicketMessage({
      ticketId: req.params.id,
      senderRole: 'admin',
      senderName: payload.name,
      message: message.trim()
    });
    res.status(201).json({ message: msg });
  } catch (err) {
    if (handleAuthError(err, res)) return;
    console.error('Add admin ticket message failed:', err);
    res.status(500).json({ error: 'Could not send message.' });
  }
});

app.patch('/api/admin/tickets/:id', async (req, res) => {
  try {
    await requireRole(req, 'admin');
    const { status } = req.body ?? {};
    const valid = ['Open', 'In Progress', 'Resolved'];
    if (typeof status !== 'string' || !valid.includes(status)) {
      return res.status(400).json({ error: 'Invalid status.' });
    }
    await updateTicketStatus(req.params.id, status as never);
    res.json({ ok: true });
  } catch (err) {
    if (handleAuthError(err, res)) return;
    console.error('Update ticket status failed:', err);
    res.status(500).json({ error: 'Could not update ticket.' });
  }
});

// --- Admin: Mining Machines / Fleet ---

app.get('/api/admin/machines', async (req, res) => {
  try {
    await requireRole(req, 'admin');
    res.json({ machines: await listAllMachines() });
  } catch (err) {
    if (handleAuthError(err, res)) return;
    console.error('List machines failed:', err);
    res.status(500).json({ error: 'Could not load machines.' });
  }
});

app.post('/api/admin/machines', async (req, res) => {
  try {
    await requireRole(req, 'admin');
    const { investorUserId, podId, model, hashrateTh, powerDrawWatts, tempCelsius, status, pool, uptimePercent } = req.body ?? {};
    if (typeof model !== 'string' || !model.trim()) {
      return res.status(400).json({ error: 'Machine model is required.' });
    }
    const machine = await createMachine({
      investorUserId: typeof investorUserId === 'string' && investorUserId ? investorUserId : null,
      podId: podId || '',
      model: model.trim(),
      hashrateTh: Number(hashrateTh) || 0,
      powerDrawWatts: Number(powerDrawWatts) || 0,
      tempCelsius: Number(tempCelsius) || 0,
      status: status || 'Online',
      pool: pool || '',
      uptimePercent: Number(uptimePercent) || 0
    });
    res.status(201).json({ machine });
  } catch (err) {
    if (handleAuthError(err, res)) return;
    console.error('Create machine failed:', err);
    res.status(500).json({ error: 'Could not create machine.' });
  }
});

app.put('/api/admin/machines/:id', async (req, res) => {
  try {
    await requireRole(req, 'admin');
    await updateMachine(req.params.id, req.body ?? {});
    res.json({ ok: true });
  } catch (err) {
    if (handleAuthError(err, res)) return;
    console.error('Update machine failed:', err);
    res.status(500).json({ error: 'Could not update machine.' });
  }
});

// Serve the built frontend (only present after `npm run build`). The app
// uses hash-based routing (#login, #portal, ...), so a single index.html
// fallback for any non-API GET request is all client-side routing needs.
if (isProduction && fs.existsSync(DIST_DIR)) {
  app.use(express.static(DIST_DIR));
  app.get(/^(?!\/api\/).*/, (_req, res) => {
    res.sendFile(path.join(DIST_DIR, 'index.html'));
  });
}

async function start() {
  try {
    await initSchema();
    await seedIfEmpty();
  } catch (err) {
    console.error('[finovatech-api] Could not connect to MySQL. Is the MySQL server running, and did you run server/scripts/setup-mysql.sql against it?');
    console.error(err);
    process.exit(1);
  }

  app.listen(PORT, () => {
    console.log(`[finovatech-api] listening on http://localhost:${PORT}${isProduction ? ' (serving built frontend + API)' : ''}`);
  });
}

start();
