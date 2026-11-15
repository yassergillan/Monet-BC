import React, { useState } from 'react';
import { Building2, ShieldCheck, Lock, User, KeyRound, Eye, EyeOff, Crown, HardHat, ArrowRight, Info, AlertCircle, CheckCircle2 } from 'lucide-react';
import { UserAccount } from '../types';
import { DEFAULT_USER_ACCOUNTS } from '../constants';
import { loginUser, loginAsUserDirect } from '../utils/storage';

interface LoginScreenProps {
  onLoginSuccess: (user: UserAccount) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess }) => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [activeTabRole, setActiveTabRole] = useState<'HEAD_MANAGER' | 'STAFF_BC'>('HEAD_MANAGER');

  const headAccounts = DEFAULT_USER_ACCOUNTS.filter((u) => u.role === 'HEAD_MANAGER');
  const staffAccounts = DEFAULT_USER_ACCOUNTS.filter((u) => u.role === 'STAFF_BC');

  const handleFormLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!identifier) {
      setErrorMessage('Silakan masukkan Username, Nama, atau Email.');
      return;
    }

    const result = loginUser(identifier, password);
    if (result.success && result.user) {
      onLoginSuccess(result.user);
    } else {
      setErrorMessage(result.message || 'Login gagal.');
    }
  };

  const handleQuickLogin = (user: UserAccount) => {
    const loggedUser = loginAsUserDirect(user.id);
    onLoginSuccess(loggedUser);
  };

  return (
    <div className="min-h-screen bg-slate-900 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(30,58,138,0.4),rgba(255,255,255,0))] text-slate-100 flex flex-col justify-between p-4 sm:p-6 font-sans">
      {/* Top Header Branding */}
      <div className="max-w-5xl mx-auto w-full flex items-center justify-between py-2 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600/30 border border-blue-500/40 flex items-center justify-center text-blue-400">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <div className="text-sm font-black tracking-tight text-white flex items-center gap-2">
              KOTA BARU PARAHYANGAN
              <span className="text-[10px] font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30 px-2 py-0.5 rounded-full uppercase tracking-wider">
                Sistem Monitoring Renovasi
              </span>
            </div>
            <div className="text-xs text-slate-400 font-medium">
              Town Management &amp; Building Control System
            </div>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Sistem Akses Terenkripsi</span>
        </div>
      </div>

      {/* Main Login Card Area */}
      <div className="max-w-4xl mx-auto w-full my-6 sm:my-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left Form: Manual Login */}
        <div className="lg:col-span-5 bg-slate-800/90 border border-slate-700/80 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col justify-between relative overflow-hidden backdrop-blur-md">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl pointer-events-none"></div>

          <div>
            <div className="mb-6">
              <div className="inline-flex items-center gap-1.5 text-xs font-extrabold text-blue-400 bg-blue-950/90 border border-blue-800/80 px-3 py-1 rounded-full mb-3 shadow-xs">
                <Lock className="w-3.5 h-3.5 text-emerald-400" /> SISTEM MONITORING RENOVASI
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Portal Masuk
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Silakan masukkan kredensial atau jabatan akun Building Control KBP
              </p>
            </div>

            {errorMessage && (
              <div className="mb-4 p-3 bg-rose-950/80 border border-rose-700/80 text-rose-200 text-xs rounded-xl flex items-start gap-2 animate-in fade-in">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleFormLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                  Username / Jabatan / Email
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="Contoh: head, manager, supervisor, benny"
                    className="w-full bg-slate-900/90 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                  Kata Sandi (Password)
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Default kata sandi: 123"
                    className="w-full bg-slate-900/90 border border-slate-700 rounded-xl pl-10 pr-10 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-200 transition"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs py-3 rounded-xl transition shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 active:scale-98 cursor-pointer"
              >
                <span>Masuk Sekarang</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-700/60 text-[11px] text-slate-400 flex items-center gap-2">
            <Info className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              Password default demo: <strong className="text-amber-300 font-mono">123</strong> (atau gunakan tombol pilih akun di sebelah kanan).
            </span>
          </div>
        </div>

        {/* Right Area: Direct Account Picker by Role */}
        <div className="lg:col-span-7 bg-slate-800/60 border border-slate-700/60 rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col justify-between backdrop-blur-md">
          <div>
            <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                  <span>Pilih Akun Demo / Langsung</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Pilih salah satu personil untuk masuk sesuai batasan jabatannya
                </p>
              </div>

              {/* Role Selection Tabs */}
              <div className="flex gap-1 p-1 bg-slate-900/80 rounded-xl border border-slate-700/80">
                <button
                  type="button"
                  onClick={() => setActiveTabRole('HEAD_MANAGER')}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition flex items-center gap-1.5 cursor-pointer ${
                    activeTabRole === 'HEAD_MANAGER'
                      ? 'bg-amber-500 text-slate-950 shadow-xs'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Crown className="w-3.5 h-3.5" />
                  <span>Head / Manager ({headAccounts.length})</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTabRole('STAFF_BC')}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition flex items-center gap-1.5 cursor-pointer ${
                    activeTabRole === 'STAFF_BC'
                      ? 'bg-blue-500 text-white shadow-xs'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <HardHat className="w-3.5 h-3.5" />
                  <span>Staff BC ({staffAccounts.length})</span>
                </button>
              </div>
            </div>

            {/* Privilege Notice Banner */}
            {activeTabRole === 'HEAD_MANAGER' ? (
              <div className="mb-4 p-3 bg-amber-950/40 border border-amber-800/50 rounded-xl text-xs text-amber-200/90 leading-relaxed">
                <strong className="text-amber-400 font-bold block mb-0.5 flex items-center gap-1">
                  <Crown className="w-3.5 h-3.5 text-amber-400" /> Akses Penuh Manager &amp; Head of:
                </strong>
                Dapat membuka <strong>Dashboard Analitik</strong>, menyetujui jadwal, mengunduh rekapitulasi, dan memantau seluruh seluruh kluster/tatar.
              </div>
            ) : (
              <div className="mb-4 p-3 bg-blue-950/40 border border-blue-800/50 rounded-xl text-xs text-blue-200/90 leading-relaxed">
                <strong className="text-blue-400 font-bold block mb-0.5 flex items-center gap-1">
                  <HardHat className="w-3.5 h-3.5 text-blue-400" /> Akses Terbatas Staff Inspektor BC:
                </strong>
                Tidak bisa melihat Dashboard. Tampilan Jadwal <strong>otomatis disaring hanya untuk tugas PIC staff ybs</strong>.
              </div>
            )}

            {/* Account List Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[320px] overflow-y-auto pr-1">
              {(activeTabRole === 'HEAD_MANAGER' ? headAccounts : staffAccounts).map((acc) => (
                <button
                  key={acc.id}
                  onClick={() => handleQuickLogin(acc)}
                  className="p-3 bg-slate-900/80 hover:bg-slate-900 border border-slate-700/70 hover:border-blue-500/80 rounded-2xl text-left transition flex items-center justify-between group active:scale-98 cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-xl ${acc.avatarColor || 'bg-blue-600'} text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-md`}>
                      {acc.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-bold text-xs text-white group-hover:text-blue-300 transition flex items-center gap-1.5">
                        <span>{acc.name}</span>
                        {acc.role === 'HEAD_MANAGER' && (
                          <span className="text-[9px] bg-amber-400/20 text-amber-300 border border-amber-400/30 px-1.5 py-0.2 rounded font-extrabold">Akses Penuh</span>
                        )}
                        {acc.role === 'STAFF_BC' && (
                          <span className="text-[9px] bg-blue-400/20 text-blue-300 border border-blue-400/30 px-1.5 py-0.2 rounded font-extrabold">PIC {acc.picName}</span>
                        )}
                      </div>
                      <div className="text-[10px] text-slate-400 line-clamp-1">
                        {acc.roleTitle}
                      </div>
                    </div>
                  </div>

                  <span className="text-[10px] font-bold text-slate-400 group-hover:text-blue-400 group-hover:translate-x-0.5 transition flex items-center gap-0.5 shrink-0 ml-1">
                    Masuk &rarr;
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-700/60 text-center text-[10px] text-slate-500 font-mono">
            Town Management Kota Baru Parahyangan &copy; 2026 PT Bela Parahyangan Investindo
          </div>
        </div>

      </div>

      {/* Footer copyright */}
      <div className="max-w-5xl mx-auto w-full text-center text-[11px] text-slate-500 py-2">
        Sistem Pengawasan &amp; Monitoring Bangunan Gedung (Building Control) &middot; Padalarang, Kabupaten Bandung Barat
      </div>
    </div>
  );
};
