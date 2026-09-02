import React, { useState } from 'react';
import {
  Users,
  ShieldCheck,
  ShieldAlert,
  UserPlus,
  Key,
  Lock,
  CheckCircle2,
  XCircle,
  Eye,
  Edit2,
  Trash2,
  Check,
  X
} from 'lucide-react';
import { AdminUser, AdminRole } from '../../types';

interface AdminRolesViewProps {
  adminUsers: AdminUser[];
  onAddAdminUser?: (user: AdminUser) => void;
}

export const AdminRolesView: React.FC<AdminRolesViewProps> = ({
  adminUsers: initialUsers,
  onAddAdminUser
}) => {
  const [usersList, setUsersList] = useState<AdminUser[]>(initialUsers);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState<AdminRole>('Investor Manager');

  const permissionsMatrix = [
    { module: 'Executive Dashboard', super: true, finance: true, ops: true, rm: true, audit: true },
    { module: 'Investor Accounts & KYC', super: true, finance: false, ops: false, rm: true, audit: true },
    { module: 'Investment Plans & Pricing', super: true, finance: true, ops: false, rm: false, audit: true },
    { module: 'Facilities & ASIC Machines', super: true, finance: false, ops: true, rm: false, audit: true },
    { module: 'Production Ledger & Engine', super: true, finance: true, ops: true, rm: false, audit: true },
    { module: 'Company Treasury Wallets', super: true, finance: true, ops: false, rm: false, audit: true },
    { module: 'Authorize Payouts (Broadcast)', super: true, finance: true, ops: false, rm: false, audit: false },
    { module: 'Financial Statements & P&L', super: true, finance: true, ops: false, rm: false, audit: true },
    { module: 'Support Desk CRM', super: true, finance: false, ops: false, rm: true, audit: true },
    { module: 'Security Audit Logs', super: true, finance: true, ops: true, rm: true, audit: true },
    { module: 'Admin Roles & Permissions', super: true, finance: false, ops: false, rm: false, audit: false },
    { module: 'System Global Settings', super: true, finance: false, ops: false, rm: false, audit: false }
  ];

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newEmail) return;

    const newUser: AdminUser = {
      id: `ADM-00${usersList.length + 1}`,
      name: newName,
      email: newEmail,
      role: newRole,
      status: 'Active',
      twoFactorEnabled: true,
      lastLogin: 'Never',
      permissions: ['read', 'write']
    };

    setUsersList([...usersList, newUser]);
    setShowAddModal(false);
    setNewName('');
    setNewEmail('');
    if (onAddAdminUser) onAddAdminUser(newUser);
  };

  const handleToggleStatus = (id: string) => {
    setUsersList((prev) =>
      prev.map((u) =>
        u.id === id
          ? { ...u, status: u.status === 'Active' ? 'Suspended' : 'Active' }
          : u
      )
    );
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="p-6 rounded-3xl bg-[#0F172A] border border-gray-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-[11px] font-mono text-purple-400 mb-2">
            <Lock className="w-3.5 h-3.5" />
            <span>ROLE-BASED ACCESS CONTROL (RBAC) & MULTI-FACTOR AUTH</span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Admin Users, Roles & Permissions Matrix</h2>
          <p className="text-xs text-gray-400 mt-1 max-w-2xl">
            Granular privilege segregation separating financial signatories, infrastructure engineers, investor relationship managers, and independent auditors.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 rounded-xl bg-[#F7931A] hover:bg-[#E58514] text-gray-950 font-bold text-xs font-mono flex items-center gap-2 transition-colors cursor-pointer shadow-md"
        >
          <UserPlus className="w-4 h-4" />
          <span>Provision Admin User</span>
        </button>
      </div>

      {/* Admin Users Table */}
      <div className="rounded-3xl bg-[#0F172A] border border-gray-800 overflow-hidden shadow-xl">
        <div className="p-4 bg-gray-900/90 border-b border-gray-800">
          <h3 className="text-xs font-mono font-bold uppercase text-gray-300">
            Active Administrative Personnel ({usersList.length})
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-gray-900/40 text-gray-400 font-mono text-[11px] uppercase tracking-wider border-b border-gray-800">
                <th className="py-3.5 px-4">Admin Name</th>
                <th className="py-3.5 px-3">Assigned Role</th>
                <th className="py-3.5 px-3">2FA Security</th>
                <th className="py-3.5 px-3">Status</th>
                <th className="py-3.5 px-3">Last Active</th>
                <th className="py-3.5 px-4 text-center">Manage Access</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/80 font-mono text-gray-300">
              {usersList.map((user) => (
                <tr key={user.id} className="hover:bg-gray-800/40 transition-colors">
                  <td className="py-3.5 px-4 font-sans">
                    <div className="font-bold text-white">{user.name}</div>
                    <div className="text-[10px] text-gray-400 font-mono">{user.id} • {user.email}</div>
                  </td>

                  <td className="py-3.5 px-3">
                    <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${
                      user.role === 'Super Admin' ? 'bg-amber-500/20 text-amber-300' :
                      user.role === 'Finance Admin' ? 'bg-purple-500/20 text-purple-300' :
                      user.role === 'Mining Operations' ? 'bg-blue-500/20 text-blue-300' :
                      user.role === 'Investor Manager' ? 'bg-emerald-500/20 text-emerald-300' :
                      'bg-gray-700 text-gray-300'
                    }`}>
                      {user.role}
                    </span>
                  </td>

                  <td className="py-3.5 px-3">
                    {user.twoFactorEnabled ? (
                      <span className="text-emerald-400 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Hardware 2FA Active
                      </span>
                    ) : (
                      <span className="text-rose-400 font-bold flex items-center gap-1">
                        <XCircle className="w-3.5 h-3.5" /> 2FA Inactive
                      </span>
                    )}
                  </td>

                  <td className="py-3.5 px-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      user.status === 'Active' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                    }`}>
                      {user.status}
                    </span>
                  </td>

                  <td className="py-3.5 px-3 text-gray-400">{user.lastLogin}</td>

                  <td className="py-3.5 px-4 text-center">
                    <button
                      onClick={() => handleToggleStatus(user.id)}
                      className={`px-3 py-1 rounded-lg text-[11px] font-mono transition-colors cursor-pointer ${
                        user.status === 'Active'
                          ? 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      }`}
                    >
                      {user.status === 'Active' ? 'Revoke / Suspend' : 'Re-Activate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Roles & Permissions Matrix */}
      <div className="rounded-3xl bg-[#0F172A] border border-gray-800 overflow-hidden shadow-xl">
        <div className="p-4 bg-gray-900/90 border-b border-gray-800">
          <h3 className="text-xs font-mono font-bold uppercase text-gray-300">
            Granular Permission Matrix by Role
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-gray-900/40 text-gray-400 font-mono text-[11px] uppercase tracking-wider border-b border-gray-800">
                <th className="py-3.5 px-4">Functional Module</th>
                <th className="py-3.5 px-3 text-center">Super Admin</th>
                <th className="py-3.5 px-3 text-center">Finance Admin</th>
                <th className="py-3.5 px-3 text-center">Mining Ops</th>
                <th className="py-3.5 px-3 text-center">Investor Mgr</th>
                <th className="py-3.5 px-3 text-center">Auditor (Read-Only)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/80 font-mono text-gray-300">
              {permissionsMatrix.map((row, idx) => (
                <tr key={idx} className="hover:bg-gray-800/30">
                  <td className="py-3 px-4 font-semibold text-white">{row.module}</td>
                  
                  <td className="py-3 px-3 text-center">
                    {row.super ? <Check className="w-4 h-4 text-emerald-400 mx-auto" /> : <X className="w-4 h-4 text-gray-600 mx-auto" />}
                  </td>

                  <td className="py-3 px-3 text-center">
                    {row.finance ? <Check className="w-4 h-4 text-emerald-400 mx-auto" /> : <X className="w-4 h-4 text-gray-600 mx-auto" />}
                  </td>

                  <td className="py-3 px-3 text-center">
                    {row.ops ? <Check className="w-4 h-4 text-emerald-400 mx-auto" /> : <X className="w-4 h-4 text-gray-600 mx-auto" />}
                  </td>

                  <td className="py-3 px-3 text-center">
                    {row.rm ? <Check className="w-4 h-4 text-emerald-400 mx-auto" /> : <X className="w-4 h-4 text-gray-600 mx-auto" />}
                  </td>

                  <td className="py-3 px-3 text-center">
                    {row.audit ? (
                      <span className="text-[10px] font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded">
                        Read Only
                      </span>
                    ) : (
                      <X className="w-4 h-4 text-gray-600 mx-auto" />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#0B1120] border border-gray-700 rounded-3xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-800">
              <h3 className="text-base font-bold text-white font-mono">Provision New Admin User</h3>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleAddUser} className="space-y-4 text-xs">
              <div>
                <label className="block text-gray-400 font-mono text-[10px] uppercase mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Salim Al-Harthy"
                  className="w-full px-3 py-2 rounded-xl bg-gray-950 border border-gray-800 text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-gray-400 font-mono text-[10px] uppercase mb-1">Work Email</label>
                <input
                  type="email"
                  required
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="salim@finovateckmining.om"
                  className="w-full px-3 py-2 rounded-xl bg-gray-950 border border-gray-800 text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-gray-400 font-mono text-[10px] uppercase mb-1">Assign Role</label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value as AdminRole)}
                  className="w-full px-3 py-2 rounded-xl bg-gray-950 border border-gray-800 text-white font-mono"
                >
                  <option value="Super Admin">Super Admin</option>
                  <option value="Finance Admin">Finance Admin</option>
                  <option value="Mining Operations">Mining Operations</option>
                  <option value="Investor Manager">Investor Manager</option>
                  <option value="Auditor / Read Only">Auditor / Read Only</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 font-mono"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#F7931A] hover:bg-[#E58514] text-gray-950 font-bold font-mono"
                >
                  Provision User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
