import React, { useState } from 'react';
import { Plus, AlertTriangle, ClipboardList, Calendar, Download, X, FileSpreadsheet, FileCode } from 'lucide-react';
import { TabType } from './Navbar';
import { getPengajuanList, getJadwalList, getTemuanList } from '../utils/storage';
import { exportPengajuanCSV, exportJadwalCSV, exportTemuanCSV } from '../utils/export';

interface FloatingMobileActionsProps {
  onNavigateTab: (tab: TabType, statusFilter?: string) => void;
  onShowToast: (msg: string) => void;
}

export const FloatingMobileActions: React.FC<FloatingMobileActionsProps> = ({
  onNavigateTab,
  onShowToast,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);

  const handleExportPengajuan = () => {
    const data = getPengajuanList();
    if (data.length === 0) return onShowToast('Belum ada data Pengajuan untuk di-export');
    exportPengajuanCSV(data);
    onShowToast(`Export ${data.length} data pengajuan berhasil!`);
    setShowExportMenu(false);
    setIsOpen(false);
  };

  const handleExportJadwal = () => {
    const data = getJadwalList();
    if (data.length === 0) return onShowToast('Belum ada data Jadwal untuk di-export');
    exportJadwalCSV(data);
    onShowToast(`Export ${data.length} data jadwal berhasil!`);
    setShowExportMenu(false);
    setIsOpen(false);
  };

  const handleExportTemuan = () => {
    const data = getTemuanList();
    if (data.length === 0) return onShowToast('Belum ada data Temuan untuk di-export');
    exportTemuanCSV(data);
    onShowToast(`Export ${data.length} data temuan berhasil!`);
    setShowExportMenu(false);
    setIsOpen(false);
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <div className="fixed bottom-20 right-4 z-40 sm:bottom-6 sm:right-6">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`w-14 h-14 rounded-full shadow-xl flex items-center justify-center text-white transition-all transform active:scale-90 touch-manipulation cursor-pointer ${
            isOpen ? 'bg-rose-600 rotate-45 scale-105' : 'bg-blue-600 hover:bg-blue-700'
          }`}
          aria-label="Aksi Cepat Mobile"
        >
          <Plus className="w-7 h-7" />
        </button>
      </div>

      {/* Overlay backdrop when open */}
      {isOpen && (
        <div
          onClick={() => {
            setIsOpen(false);
            setShowExportMenu(false);
          }}
          className="fixed inset-0 z-35 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150"
        />
      )}

      {/* Quick Action Menu Sheet / Popup */}
      {isOpen && (
        <div className="fixed bottom-36 right-4 z-40 w-76 bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-200/90 p-3.5 space-y-2 animate-in fade-in slide-in-from-bottom-5 duration-200">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 px-2">
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-500 flex items-center gap-1">
              ⚡ Aksi Cepat Lapangan
            </span>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
              aria-label="Tutup"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {!showExportMenu ? (
            <div className="space-y-1">
              <button
                onClick={() => {
                  onNavigateTab('temuan');
                  setIsOpen(false);
                }}
                className="w-full flex items-center gap-3 p-2.5 rounded-2xl hover:bg-rose-50 active:bg-rose-100 text-rose-800 transition active:scale-98 cursor-pointer text-left"
              >
                <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0 shadow-xs">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold leading-tight">Catat Pelanggaran / Temuan</div>
                  <div className="text-[10px] text-rose-500 font-medium">Input temuan tanpa izin / pelanggaran</div>
                </div>
              </button>

              <button
                onClick={() => {
                  onNavigateTab('pengajuan');
                  setIsOpen(false);
                }}
                className="w-full flex items-center gap-3 p-2.5 rounded-2xl hover:bg-blue-50 active:bg-blue-100 text-blue-800 transition active:scale-98 cursor-pointer text-left"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 shadow-xs">
                  <ClipboardList className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold leading-tight">Input Pengajuan Baru</div>
                  <div className="text-[10px] text-blue-500 font-medium">Pendaftaran perizinan renovasi</div>
                </div>
              </button>

              <button
                onClick={() => {
                  onNavigateTab('jadwal');
                  setIsOpen(false);
                }}
                className="w-full flex items-center gap-3 p-2.5 rounded-2xl hover:bg-slate-100 active:bg-slate-200 text-slate-800 transition active:scale-98 cursor-pointer text-left"
              >
                <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center shrink-0 shadow-xs">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold leading-tight">Jadwal Monitoring Hari Ini</div>
                  <div className="text-[10px] text-slate-500 font-medium">Daftar inspeksi rutin pengawasan</div>
                </div>
              </button>

              <button
                onClick={() => setShowExportMenu(true)}
                className="w-full flex items-center gap-3 p-2.5 rounded-2xl hover:bg-emerald-50 active:bg-emerald-100 text-emerald-800 transition active:scale-98 cursor-pointer text-left border-t border-slate-100 mt-1"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 shadow-xs">
                  <Download className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold leading-tight">Export Rekap CSV</div>
                  <div className="text-[10px] text-emerald-600 font-medium">Download data perizinan &amp; jadwal</div>
                </div>
              </button>
            </div>
          ) : (
            <div className="space-y-1.5 p-1">
              <div className="flex items-center justify-between pb-1 text-xs font-bold text-emerald-700">
                <span className="flex items-center gap-1.5">
                  <FileSpreadsheet className="w-4 h-4 text-emerald-600" /> Choose Export Data:
                </span>
                <button
                  onClick={() => setShowExportMenu(false)}
                  className="text-[10px] text-slate-500 underline"
                >
                  Kembali
                </button>
              </div>

              <button
                onClick={handleExportPengajuan}
                className="w-full py-2 px-3 bg-blue-50 hover:bg-blue-100 text-blue-800 rounded-lg text-xs font-semibold text-left transition flex justify-between items-center"
              >
                <span>1. Rekap Pengajuan</span>
                <Download className="w-3.5 h-3.5 text-blue-600" />
              </button>
              <button
                onClick={handleExportJadwal}
                className="w-full py-2 px-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-lg text-xs font-semibold text-left transition flex justify-between items-center"
              >
                <span>2. Rekap Jadwal Monitoring</span>
                <Download className="w-3.5 h-3.5 text-emerald-600" />
              </button>
              <button
                onClick={handleExportTemuan}
                className="w-full py-2 px-3 bg-rose-50 hover:bg-rose-100 text-rose-800 rounded-lg text-xs font-semibold text-left transition flex justify-between items-center"
              >
                <span>3. Rekap Renovasi Tanpa Izin</span>
                <Download className="w-3.5 h-3.5 text-rose-600" />
              </button>

              <a
                href="/monitoring-renovasi-kbp.html"
                download="monitoring-renovasi-bc-kbp.html"
                className="w-full py-2 px-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-900 rounded-lg text-xs font-bold text-left transition flex justify-between items-center border border-indigo-200 mt-1"
              >
                <span>4. Unduh File HTML Aplikasi</span>
                <FileCode className="w-3.5 h-3.5 text-indigo-600" />
              </a>
            </div>
          )}
        </div>
      )}
    </>
  );
};
