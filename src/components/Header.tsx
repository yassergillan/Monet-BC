import React from 'react';
import { Building2, RefreshCw, FileSpreadsheet, UserCheck, Crown, HardHat, ChevronDown, LogOut, Download } from 'lucide-react';
import { initSampleDataIfEmpty, getPengajuanList, getJadwalList, getTemuanList } from '../utils/storage';
import { UserAccount } from '../types';

interface HeaderProps {
  currentUser: UserAccount;
  onOpenUserSwitch: () => void;
  onLogout: () => void;
  onRefreshData: () => void;
  onShowToast: (msg: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  onOpenUserSwitch,
  onLogout,
  onRefreshData,
  onShowToast,
}) => {
  const handleResetSample = () => {
    if (window.confirm('Reset data dan isi kembali dengan data sampel awal?')) {
      localStorage.removeItem('pengajuan_list');
      localStorage.removeItem('jadwal_list');
      localStorage.removeItem('temuan_list');
      initSampleDataIfEmpty();
      onRefreshData();
      onShowToast('Data berhasil di-reset dengan sampel.');
    }
  };

  const handleExportCSV = () => {
    const pengajuan = getPengajuanList();
    const jadwal = getJadwalList();
    const temuan = getTemuanList();

    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += '=== PENGAJUAN PERIZINAN RENOVASI ===\n';
    csvContent += 'No Izin,Nama Pemilik,Tatar,Blok,PIC,Pekerjaan,Tgl Mulai,Tgl Selesai,Status\n';
    
    const today = new Date();
    today.setHours(0,0,0,0);

    pengajuan.forEach(p => {
      const isExpired = new Date(p.tglSelesai) < today;
      csvContent += `"${p.izin}","${p.nama}","${p.tatar}","${p.blok}","${p.pic}","${p.jenis}","${p.tglMulai}","${p.tglSelesai}","${isExpired ? 'Kedaluwarsa' : 'Aktif'}"\n`;
    });

    csvContent += '\n=== JADWAL INSPEKSI MONITORING ===\n';
    csvContent += 'ID Jadwal,No Izin,Tatar,Blok,PIC,Tahap,Tanggal,Status,Hasil Kepatuhan\n';
    jadwal.forEach(j => {
      csvContent += `"${j.id}","${j.izin}","${j.tatar}","${j.blok}","${j.pic}","${j.tahapLabel}","${j.tanggal.split('T')[0]}","${j.status}","${j.hasil ? j.hasil.status : '-'}"\n`;
    });

    csvContent += '\n=== TEMUAN LAPANGAN ===\n';
    csvContent += 'ID Temuan,Tanggal,Tatar,Blok,PIC Penemu,Kategori,Keterangan\n';
    temuan.forEach(t => {
      csvContent += `"${t.id}","${t.tanggal.split('T')[0]}","${t.tatar}","${t.blok}","${t.pic}","${t.kategori}","${t.keterangan}"\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `monitoring_renovasi_bc_kbp_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    onShowToast('Laporan CSV berhasil diunduh.');
  };

  return (
    <header className="bg-slate-900 text-white border-b border-slate-800/80 sticky top-0 z-30 shadow-lg backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-3.5 sm:px-4 py-2.5 sm:py-3 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 sm:gap-3">
        {/* Brand & Title */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-blue-600/30 to-indigo-600/30 border border-blue-500/40 flex items-center justify-center text-blue-400 shrink-0 shadow-inner">
              <Building2 className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <h1 className="text-sm sm:text-base font-black tracking-tight text-white">
                  Sistem Monitoring Renovasi
                </h1>
                <span className="text-[9px] sm:text-[10px] font-black bg-blue-500/20 text-blue-300 border border-blue-500/40 px-2 py-0.5 rounded-full uppercase tracking-wider">
                  BC KBP
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-slate-400 font-medium line-clamp-1">
                Town Management &middot; Kota Baru Parahyangan
              </p>
            </div>
          </div>

          {/* Quick Logout for mobile top corner */}
          <div className="flex items-center gap-1 sm:hidden">
            <button
              onClick={onLogout}
              title="Keluar / Logout"
              className="p-2 text-rose-300 hover:text-white bg-rose-950/60 hover:bg-rose-900 border border-rose-800/60 rounded-xl transition active:scale-95 touch-manipulation"
              aria-label="Logout"
            >
              <LogOut className="w-4 h-4 text-rose-400" />
            </button>
          </div>
        </div>

        {/* User Account Pill & Actions */}
        <div className="flex items-center justify-between sm:justify-end gap-2 w-full sm:w-auto pt-1 sm:pt-0 border-t border-slate-800/80 sm:border-t-0">
          {/* User Role Switcher Trigger Button */}
          <button
            onClick={onOpenUserSwitch}
            className="flex-1 sm:flex-initial flex items-center justify-between sm:justify-start gap-2 px-2.5 py-1.5 bg-slate-800/90 hover:bg-slate-750 text-slate-100 border border-slate-700/80 rounded-xl transition active:scale-95 cursor-pointer touch-manipulation group shadow-xs"
            title="Klik untuk ganti akun / hak akses"
          >
            <div className="flex items-center gap-2">
              <div className={`w-6 h-6 rounded-full ${currentUser.avatarColor || 'bg-blue-600'} text-white font-black text-[10px] flex items-center justify-center ring-2 ring-slate-700`}>
                {currentUser.name.charAt(0)}
              </div>
              <div className="text-left">
                <div className="text-[11px] font-black leading-tight flex items-center gap-1 text-white group-hover:text-blue-300 transition">
                  <span className="truncate max-w-[120px] sm:max-w-none">{currentUser.name}</span>
                  {currentUser.role === 'HEAD_MANAGER' ? (
                    <Crown className="w-3 h-3 text-amber-400 shrink-0" />
                  ) : (
                    <HardHat className="w-3 h-3 text-blue-400 shrink-0" />
                  )}
                </div>
                <div className="text-[9px] text-slate-400 font-medium">
                  {currentUser.role === 'HEAD_MANAGER' ? 'Head / Manager' : `Staff BC (${currentUser.picName})`}
                </div>
              </div>
            </div>
            <span className="text-[10px] font-bold bg-slate-700 group-hover:bg-blue-600 group-hover:text-white text-blue-300 px-1.5 py-0.5 rounded-md flex items-center gap-0.5 transition">
              Ganti <ChevronDown className="w-3 h-3" />
            </span>
          </button>

          {/* Action buttons */}
          <div className="flex items-center gap-1">
            <a
              href="/monitoring-renovasi-kbp.html"
              download="monitoring-renovasi-bc-kbp.html"
              title="Unduh File HTML (Akses Offline / Mandiri)"
              className="flex items-center gap-1 p-2 sm:px-2.5 sm:py-1.5 text-xs font-semibold bg-blue-600/90 hover:bg-blue-600 text-white border border-blue-500/50 rounded-xl transition active:scale-95 touch-manipulation cursor-pointer shadow-xs"
            >
              <Download className="w-4 h-4 sm:w-3.5 sm:h-3.5 text-white" />
              <span className="hidden md:inline">Unduh HTML</span>
            </a>
            <button
              onClick={handleExportCSV}
              title="Export Rekap CSV"
              className="flex items-center gap-1 p-2 sm:px-2.5 sm:py-1.5 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl transition active:scale-95 touch-manipulation cursor-pointer"
            >
              <FileSpreadsheet className="w-4 h-4 sm:w-3.5 sm:h-3.5 text-emerald-400" />
              <span className="hidden md:inline">Export CSV</span>
            </button>
            <button
              onClick={handleResetSample}
              title="Reset Data Sampel"
              className="flex items-center gap-1 p-2 sm:px-2.5 sm:py-1.5 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl transition active:scale-95 touch-manipulation cursor-pointer"
            >
              <RefreshCw className="w-4 h-4 sm:w-3.5 sm:h-3.5 text-blue-400" />
              <span className="hidden md:inline">Reset</span>
            </button>
            <button
              onClick={onLogout}
              title="Keluar / Logout"
              className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold bg-rose-950/60 hover:bg-rose-900 text-rose-200 border border-rose-800/80 rounded-xl transition active:scale-95 touch-manipulation cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5 text-rose-400" />
              <span>Keluar</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

