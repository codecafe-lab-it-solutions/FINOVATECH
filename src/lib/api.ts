export interface AuthUser {
  id: string;
  username: string;
  role: 'investor' | 'admin';
  name: string;
}

export interface AuthResponse {
  token: string;
  user: AuthUser;
}

class ApiError extends Error {}

async function handleResponse<T>(res: Response): Promise<T> {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new ApiError((data as { error?: string }).error || 'Something went wrong. Please try again.');
  }
  return data as T;
}

export interface BtcMarketData {
  usd: number;
  change24hPercent: number;
  difficultyT: number;
  updatedAt: string;
}

export async function fetchBtcMarketData(): Promise<BtcMarketData> {
  const res = await fetch('/api/market/btc-price');
  return handleResponse<BtcMarketData>(res);
}

export async function loginRequest(username: string, password: string): Promise<AuthResponse> {
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  return handleResponse<AuthResponse>(res);
}

export async function registerRequest(
  username: string,
  password: string,
  name: string,
  referredByCode?: string
): Promise<AuthResponse> {
  const res = await fetch('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password, name, referredByCode })
  });
  return handleResponse<AuthResponse>(res);
}

export async function fetchCurrentUser(token: string): Promise<{ user: AuthUser }> {
  const res = await fetch('/api/auth/me', {
    headers: { Authorization: `Bearer ${token}` }
  });
  return handleResponse<{ user: AuthUser }>(res);
}

export async function updateCredentialsRequest(
  token: string,
  updates: { currentPassword: string; newUsername?: string; newPassword?: string }
): Promise<AuthResponse> {
  const res = await fetch('/api/auth/credentials', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(updates)
  });
  return handleResponse<AuthResponse>(res);
}

// --- Investor profile / wallet / payouts ---

export interface ApiInvestorProfile {
  userId: string;
  username: string;
  name: string;
  email: string;
  phone: string;
  country: string;
  kycStatus: 'Verified' | 'Pending' | 'Action Required';
  accountStatus: 'Active' | 'Under Review';
  plan: string;
  agreementNumber: string;
  startDate: string;
  maturityDate: string;
  referralCode: string;
  referrerName: string;
  payoutBtcAddress: string;
  bankName: string;
  bankAccountHolder: string;
  bankAccountNumber: string;
  bankIban: string;
  bankSwift: string;
  totalInvestmentUsd: number;
  currentPortfolioValueUsd: number;
  totalBtcAllocated: number;
  btcMined: number;
  btcPendingAccrued: number;
  miningSharePercent: number;
  updatedAt: string;
}

export interface ApiWalletTransaction {
  id: string;
  investorUserId: string;
  type: string;
  amountBtc: number;
  amountUsd: number;
  status: string;
  note: string;
  createdAt: string;
}

export interface ApiPayout {
  id: string;
  investorUserId: string;
  investorName?: string;
  amountBtc: number;
  destinationWallet: string;
  status: 'Requested' | 'Processing' | 'Completed' | 'Rejected';
  requestedAt: string;
  processedAt: string | null;
  notes: string;
}

function authHeaders(token: string) {
  return { Authorization: `Bearer ${token}` };
}

export async function fetchInvestorProfile(token: string): Promise<{ profile: ApiInvestorProfile }> {
  const res = await fetch('/api/investor/profile', { headers: authHeaders(token) });
  return handleResponse(res);
}

export async function updateInvestorProfileApi(
  token: string,
  updates: Partial<
    Pick<
      ApiInvestorProfile,
      'email' | 'phone' | 'country' | 'payoutBtcAddress' | 'bankName' | 'bankAccountHolder' | 'bankAccountNumber' | 'bankIban' | 'bankSwift'
    >
  >
): Promise<{ profile: ApiInvestorProfile }> {
  const res = await fetch('/api/investor/profile', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', ...authHeaders(token) },
    body: JSON.stringify(updates)
  });
  return handleResponse(res);
}

export async function fetchInvestorTransactions(token: string): Promise<{ transactions: ApiWalletTransaction[] }> {
  const res = await fetch('/api/investor/transactions', { headers: authHeaders(token) });
  return handleResponse(res);
}

export async function fetchInvestorPayouts(token: string): Promise<{ payouts: ApiPayout[] }> {
  const res = await fetch('/api/investor/payouts', { headers: authHeaders(token) });
  return handleResponse(res);
}

export async function requestPayoutApi(
  token: string,
  amountBtc: number,
  destinationWallet: string
): Promise<{ payout: ApiPayout }> {
  const res = await fetch('/api/investor/payouts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders(token) },
    body: JSON.stringify({ amountBtc, destinationWallet })
  });
  return handleResponse(res);
}

// --- Admin management of investors ---

export async function fetchAdminInvestors(token: string): Promise<{ investors: ApiInvestorProfile[] }> {
  const res = await fetch('/api/admin/investors', { headers: authHeaders(token) });
  return handleResponse(res);
}

export async function fetchAdminInvestorDetail(
  token: string,
  investorUserId: string
): Promise<{ profile: ApiInvestorProfile; transactions: ApiWalletTransaction[]; payouts: ApiPayout[] }> {
  const res = await fetch(`/api/admin/investors/${investorUserId}`, { headers: authHeaders(token) });
  return handleResponse(res);
}

export async function updateAdminInvestorProfile(
  token: string,
  investorUserId: string,
  updates: Partial<ApiInvestorProfile>
): Promise<{ profile: ApiInvestorProfile }> {
  const res = await fetch(`/api/admin/investors/${investorUserId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...authHeaders(token) },
    body: JSON.stringify(updates)
  });
  return handleResponse(res);
}

export async function deleteAdminInvestor(token: string, investorUserId: string): Promise<{ ok: true }> {
  const res = await fetch(`/api/admin/investors/${investorUserId}`, {
    method: 'DELETE',
    headers: authHeaders(token)
  });
  return handleResponse(res);
}

export async function addAdminInvestorTransaction(
  token: string,
  investorUserId: string,
  tx: { type: string; amountBtc: number; amountUsd: number; status?: string; note?: string }
): Promise<{ transaction: ApiWalletTransaction }> {
  const res = await fetch(`/api/admin/investors/${investorUserId}/transactions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders(token) },
    body: JSON.stringify(tx)
  });
  return handleResponse(res);
}

export async function fetchAdminPayouts(token: string): Promise<{ payouts: ApiPayout[] }> {
  const res = await fetch('/api/admin/payouts', { headers: authHeaders(token) });
  return handleResponse(res);
}

export async function updateAdminPayoutStatus(
  token: string,
  payoutId: string,
  status: ApiPayout['status'],
  notes?: string
): Promise<{ payout: ApiPayout }> {
  const res = await fetch(`/api/admin/payouts/${payoutId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', ...authHeaders(token) },
    body: JSON.stringify({ status, notes })
  });
  return handleResponse(res);
}

// --- Admin: Investment Plans ---

export interface ApiPlan {
  id: string;
  name: string;
  tagline: string;
  minInvestmentUsd: number;
  maxInvestmentUsd: number;
  durationMonths: number;
  managementFeePercent: number;
  payoutFrequency: 'Daily' | 'Weekly' | 'Monthly';
  status: 'Active' | 'Draft' | 'Deactivated';
  activeInvestorsCount: number;
  createdAt: string;
  updatedAt: string;
}

export async function fetchAdminPlans(token: string): Promise<{ plans: ApiPlan[] }> {
  const res = await fetch('/api/admin/plans', { headers: authHeaders(token) });
  return handleResponse(res);
}

export async function createAdminPlan(
  token: string,
  plan: Omit<ApiPlan, 'id' | 'activeInvestorsCount' | 'createdAt' | 'updatedAt'>
): Promise<{ plan: ApiPlan }> {
  const res = await fetch('/api/admin/plans', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders(token) },
    body: JSON.stringify(plan)
  });
  return handleResponse(res);
}

export async function updateAdminPlan(token: string, id: string, updates: Partial<ApiPlan>): Promise<{ ok: true }> {
  const res = await fetch(`/api/admin/plans/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...authHeaders(token) },
    body: JSON.stringify(updates)
  });
  return handleResponse(res);
}

// --- Admin: Company Wallets ---

export interface ApiCompanyWallet {
  id: string;
  walletName: string;
  type: 'Cold Vault' | 'Hot Payout' | 'Treasury' | 'Operational OPEX' | 'USDT Reserve';
  currency: 'BTC' | 'USDT';
  address: string;
  balance: number;
  requiresMultisig: boolean;
  status: 'Secure' | 'Active' | 'Restricted';
  updatedAt: string;
}

export async function fetchAdminWallets(token: string): Promise<{ wallets: ApiCompanyWallet[] }> {
  const res = await fetch('/api/admin/wallets', { headers: authHeaders(token) });
  return handleResponse(res);
}

export async function createAdminWallet(
  token: string,
  wallet: Omit<ApiCompanyWallet, 'id' | 'updatedAt'>
): Promise<{ wallet: ApiCompanyWallet }> {
  const res = await fetch('/api/admin/wallets', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders(token) },
    body: JSON.stringify(wallet)
  });
  return handleResponse(res);
}

export async function updateAdminWallet(token: string, id: string, updates: Partial<ApiCompanyWallet>): Promise<{ ok: true }> {
  const res = await fetch(`/api/admin/wallets/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...authHeaders(token) },
    body: JSON.stringify(updates)
  });
  return handleResponse(res);
}

// --- Admin: Documents ---

export interface ApiDocument {
  id: string;
  title: string;
  category: 'Investment Agreement' | 'Amendment' | 'Investor Statement' | 'Tax Document' | 'KYC Document' | 'Payment Receipt' | 'Mining Audit';
  investorUserId: string | null;
  investorName?: string;
  uploadedBy: string;
  status: 'Active' | 'Archived';
  createdAt: string;
}

export async function fetchAdminDocuments(token: string): Promise<{ documents: ApiDocument[] }> {
  const res = await fetch('/api/admin/documents', { headers: authHeaders(token) });
  return handleResponse(res);
}

export async function createAdminDocument(
  token: string,
  doc: { title: string; category: ApiDocument['category']; investorUserId?: string | null }
): Promise<{ document: ApiDocument }> {
  const res = await fetch('/api/admin/documents', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders(token) },
    body: JSON.stringify(doc)
  });
  return handleResponse(res);
}

export async function updateAdminDocumentStatus(
  token: string,
  id: string,
  status: ApiDocument['status']
): Promise<{ ok: true }> {
  const res = await fetch(`/api/admin/documents/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', ...authHeaders(token) },
    body: JSON.stringify({ status })
  });
  return handleResponse(res);
}

export async function fetchInvestorDocuments(token: string): Promise<{ documents: ApiDocument[] }> {
  const res = await fetch('/api/investor/documents', { headers: authHeaders(token) });
  return handleResponse(res);
}

// --- Admin: All Transactions (Investment Txns view) ---

export interface ApiTransactionWithInvestor {
  id: string;
  investorUserId: string;
  investorName: string;
  type: string;
  amountBtc: number;
  amountUsd: number;
  status: string;
  note: string;
  createdAt: string;
}

export async function fetchAdminAllTransactions(token: string): Promise<{ transactions: ApiTransactionWithInvestor[] }> {
  const res = await fetch('/api/admin/transactions', { headers: authHeaders(token) });
  return handleResponse(res);
}

// --- Investor: Earnings & Monthly Statements (computed from the real ledger) ---

export interface ApiEarningRow {
  id: string;
  date: string;
  amountBtc: number;
  amountUsd: number;
  status: string;
}

export async function fetchInvestorEarnings(token: string): Promise<{ earnings: ApiEarningRow[] }> {
  const res = await fetch('/api/investor/earnings', { headers: authHeaders(token) });
  return handleResponse(res);
}

export interface ApiMonthlyStatement {
  month: string;
  miningCreditsBtc: number;
  miningCreditsUsd: number;
  payoutsBtc: number;
  payoutsUsd: number;
  netUsd: number;
  transactionCount: number;
}

export async function fetchInvestorStatements(token: string): Promise<{ statements: ApiMonthlyStatement[] }> {
  const res = await fetch('/api/investor/statements', { headers: authHeaders(token) });
  return handleResponse(res);
}

// --- Investor: Notifications ---

export interface ApiNotification {
  id: string;
  investorUserId: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
}

export async function fetchInvestorNotifications(token: string): Promise<{ notifications: ApiNotification[] }> {
  const res = await fetch('/api/investor/notifications', { headers: authHeaders(token) });
  return handleResponse(res);
}

export async function setNotificationReadApi(token: string, id: string, isRead: boolean): Promise<{ ok: true }> {
  const res = await fetch(`/api/investor/notifications/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', ...authHeaders(token) },
    body: JSON.stringify({ isRead })
  });
  return handleResponse(res);
}

export async function markAllNotificationsReadApi(token: string): Promise<{ ok: true }> {
  const res = await fetch('/api/investor/notifications/mark-all-read', {
    method: 'POST',
    headers: authHeaders(token)
  });
  return handleResponse(res);
}

// --- Investor: Security / Sessions ---

export interface ApiSession {
  id: string;
  userId: string;
  device: string;
  ipAddress: string;
  createdAt: string;
  revoked: boolean;
  isCurrent: boolean;
}

export async function fetchInvestorSessions(token: string): Promise<{ sessions: ApiSession[] }> {
  const res = await fetch('/api/investor/sessions', { headers: authHeaders(token) });
  return handleResponse(res);
}

export async function revokeSessionApi(token: string, id: string): Promise<{ ok: true }> {
  const res = await fetch(`/api/investor/sessions/${id}`, { method: 'DELETE', headers: authHeaders(token) });
  return handleResponse(res);
}

// --- Investor & Admin: Support Tickets ---

export interface ApiTicketMessage {
  id: string;
  ticketId: string;
  senderRole: 'investor' | 'admin';
  senderName: string;
  message: string;
  createdAt: string;
}

export interface ApiTicket {
  id: string;
  investorUserId: string;
  investorName?: string;
  subject: string;
  category: string;
  status: 'Open' | 'In Progress' | 'Resolved';
  createdAt: string;
  updatedAt: string;
  messages: ApiTicketMessage[];
}

export async function fetchInvestorTickets(token: string): Promise<{ tickets: ApiTicket[] }> {
  const res = await fetch('/api/investor/tickets', { headers: authHeaders(token) });
  return handleResponse(res);
}

export async function createInvestorTicket(
  token: string,
  ticket: { subject: string; category: string; message: string }
): Promise<{ ticket: ApiTicket }> {
  const res = await fetch('/api/investor/tickets', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders(token) },
    body: JSON.stringify(ticket)
  });
  return handleResponse(res);
}

export async function addInvestorTicketMessage(token: string, ticketId: string, message: string): Promise<{ message: ApiTicketMessage }> {
  const res = await fetch(`/api/investor/tickets/${ticketId}/messages`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders(token) },
    body: JSON.stringify({ message })
  });
  return handleResponse(res);
}

export async function fetchAdminTickets(token: string): Promise<{ tickets: ApiTicket[] }> {
  const res = await fetch('/api/admin/tickets', { headers: authHeaders(token) });
  return handleResponse(res);
}

export async function addAdminTicketMessage(token: string, ticketId: string, message: string): Promise<{ message: ApiTicketMessage }> {
  const res = await fetch(`/api/admin/tickets/${ticketId}/messages`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders(token) },
    body: JSON.stringify({ message })
  });
  return handleResponse(res);
}

export async function updateAdminTicketStatus(token: string, ticketId: string, status: ApiTicket['status']): Promise<{ ok: true }> {
  const res = await fetch(`/api/admin/tickets/${ticketId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', ...authHeaders(token) },
    body: JSON.stringify({ status })
  });
  return handleResponse(res);
}

// --- Investor: Referrals ---

export interface ApiReferredInvestor {
  name: string;
  username: string;
  joinedDate: string;
  plan: string;
}

export async function fetchInvestorReferrals(token: string): Promise<{ referralCode: string; referredUsers: ApiReferredInvestor[] }> {
  const res = await fetch('/api/investor/referrals', { headers: authHeaders(token) });
  return handleResponse(res);
}

// --- Investor & Admin: Mining Machines / Fleet ---

export interface ApiMachine {
  id: string;
  investorUserId: string | null;
  investorName?: string;
  podId: string;
  model: string;
  hashrateTh: number;
  powerDrawWatts: number;
  tempCelsius: number;
  status: 'Online' | 'Offline' | 'Maintenance';
  pool: string;
  uptimePercent: number;
  updatedAt: string;
}

export async function fetchInvestorMachines(token: string): Promise<{ machines: ApiMachine[] }> {
  const res = await fetch('/api/investor/machines', { headers: authHeaders(token) });
  return handleResponse(res);
}

export async function fetchAdminMachines(token: string): Promise<{ machines: ApiMachine[] }> {
  const res = await fetch('/api/admin/machines', { headers: authHeaders(token) });
  return handleResponse(res);
}

export async function createAdminMachine(
  token: string,
  machine: Omit<ApiMachine, 'id' | 'updatedAt' | 'investorName'>
): Promise<{ machine: ApiMachine }> {
  const res = await fetch('/api/admin/machines', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders(token) },
    body: JSON.stringify(machine)
  });
  return handleResponse(res);
}

export async function updateAdminMachine(token: string, id: string, updates: Partial<ApiMachine>): Promise<{ ok: true }> {
  const res = await fetch(`/api/admin/machines/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...authHeaders(token) },
    body: JSON.stringify(updates)
  });
  return handleResponse(res);
}
