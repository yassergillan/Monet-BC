import React, { useState } from 'react';
import { X, ShieldCheck, UserCheck, Crown, HardHat, Check, Info } from 'lucide-react';
import { UserAccount } from '../types';
import { DEFAULT_USER_ACCOUNTS } from '../constants';

interface ModalUserSwitchProps {
  currentUser: UserAccount;
  isOpen: boolean;
  onClose: () => void;
  onSelectUser: (user: UserAccount) => void;
}

export const ModalUserSwitch: React.FC<ModalUserSwitchProps> = ({
  currentUser,
  isOpen,
  onClose,
  onSelectUser,
}) => {
  if (!isOpen) return null;

  const headAccounts = DEFAULT_USER_ACCOUNTS.filter((u) => u.role === 'HEAD_MANAGER');
  const staffAccounts = DEFAULT_USER_ACCOUNTS.filter((u) => u.role === 'STAFF_BC');

  const [activeRoleTab, setActiveRoleTab] = useState<'HEAD_MANAGER' | 'STAFF_BC'>(currentUser.role);

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-lg w-full p-5 sm:p-6 shadow-2xl border border-slate-200 relative flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Pilih Akun / Hak Akses</h3>
              <p className="text-xs text-slate-500 font-medium">
                Simulasi Login Pengguna Sistem BC KBP
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Active Badge */}
        <div className="mt-4 p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs">
          <div className="flex items-center gap-2.5">
            <div className={`w-8 h-8 rounded-full ${currentUser.avatarColor || 'bg-slate-700'} text-white font-bold flex items-center justify-center text-xs shadow-xs`}>
              {currentUser.name.charAt(0)}
            </div>
            <div>
              <div className="font-bold text-slate-900 flex items-center gap-1.5">
                <span>{currentUser.name}</span>
                {currentUser.role === 'HEAD_MANAGER' ? (
                  <span className="px-1.5 py-0.2 bg-amber-100 text-amber-800 font-extrabold text-[9px] rounded border border-amber-200 inline-flex items-center gap-0.5">
                    <Crown className="w-3 h-3 text-amber-600" /> Head / Manager
                  </span>
                ) : (
                  <span className="px-1.5 py-0.2 bg-blue-100 text-blue-800 font-extrabold text-[9px] rounded border border-blue-200 inline-flex items-center gap-0.5">
                    <HardHat className="w-3 h-3 text-blue-600" /> Staff BC ({currentUser.picName})
                  </span>
                )}
              </div>
              <div className="text-[11px] text-slate-500">{currentUser.roleTitle}</div>
            </div>
          </div>
          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
            Aktif
          </span>
        </div>

        {/* Access Rights Information Banner */}
        <div className="mt-3 p-3 bg-blue-50/70 border border-blue-200 rounded-xl text-[11px] text-blue-900 leading-relaxed">
          <div className="font-bold flex items-center gap-1 mb-1 text-blue-950">
            <Info className="w-3.5 h-3.5 text-blue-600" /> Aturan Hak Akses:
          </div>
          <ul className="list-disc pl-4 space-y-0.5 text-slate-700">
            <li>
              <strong>Head of / Manager</strong>: Akses penuh termasuk melihat <strong>Dashboard Analytic</strong> dan seluruh jadwal monitoring PIC.
            </li>
            <li>
              <strong>Staff BC</strong>: Tidak bisa melihat Dashboard. Tampilan Jadwal <strong>otomatis difilter hanya untuk PIC Staff ybs</strong>.
            </li>
          </ul>
        </div>

        {/* Role Tabs */}
        <div className="flex gap-2 mt-4 p-1 bg-slate-100 rounded-xl">
          <button
            onClick={() => setActiveRoleTab('HEAD_MANAGER')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition flex items-center justify-center gap-1.5 cursor-pointer ${
              activeRoleTab === 'HEAD_MANAGER'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Crown className="w-3.5 h-3.5 text-amber-500" />
            <span>Head of / Manager ({headAccounts.length})</span>
          </button>
          <button
            onClick={() => setActiveRoleTab('STAFF_BC')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition flex items-center justify-center gap-1.5 cursor-pointer ${
              activeRoleTab === 'STAFF_BC'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <HardHat className="w-3.5 h-3.5 text-blue-500" />
            <span>Staff BC ({staffAccounts.length})</span>
          </button>
        </div>

        {/* Account List */}
        <div className="mt-3 overflow-y-auto space-y-2 pr-1 max-h-60 flex-1">
          {(activeRoleTab === 'HEAD_MANAGER' ? headAccounts : staffAccounts).map((acc) => {
            const isSelected = acc.id === currentUser.id;
            return (
              <button
                key={acc.id}
                onClick={() => {
                  onSelectUser(acc);
                  onClose();
                }}
                className={`w-full p-3 rounded-xl border transition text-left flex items-center justify-between cursor-pointer active:scale-98 ${
                  isSelected
                    ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                    : 'bg-white text-slate-800 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-full ${acc.avatarColor || 'bg-slate-700'} text-white font-bold flex items-center justify-center text-xs shadow-xs`}>
                    {acc.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-bold text-xs flex items-center gap-1.5">
                      <span>{acc.name}</span>
                      {acc.role === 'STAFF_BC' && (
                        <span className={`text-[10px] font-extrabold px-1.5 py-0.2 rounded ${isSelected ? 'bg-slate-800 text-blue-300' : 'bg-blue-50 text-blue-700'}`}>
                          PIC {acc.picName}
                        </span>
                      )}
                    </div>
                    <div className={`text-[11px] ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                      {acc.roleTitle}
                    </div>
                  </div>
                </div>

                <div>
                  {isSelected ? (
                    <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center">
                      <Check className="w-4 h-4" />
                    </div>
                  ) : (
                    <span className="text-xs font-semibold text-blue-600 hover:underline">Pilih</span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="mt-4 pt-3 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
