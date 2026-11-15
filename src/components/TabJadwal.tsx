import React, { useState } from 'react';
import {
  CalendarDays,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Eye,
  Layers,
  UserCheck,
  Calendar,
  Download,
} from 'lucide-react';
import { PIC, TATAR, formatDateIndo } from '../constants';
import { Jadwal, Pengajuan, UserAccount } from '../types';
import { getJadwalList } from '../utils/storage';
import { exportJadwalCSV } from '../utils/export';

interface TabJadwalProps {
  onOpenMonitorModal: (j: Jadwal) => void;
  onOpenReviewModal: (j: Jadwal) => void;
  onOpenRescheduleModal?: (j: Jadwal) => void;
  initialStatusFilter?: string;
  onShowToast?: (msg: string) => void;
  currentUser?: UserAccount;
}

export const TabJadwal: React.FC<TabJadwalProps> = ({
  onOpenMonitorModal,
  onOpenReviewModal,
  onOpenRescheduleModal,
  initialStatusFilter = '',
  onShowToast,
  currentUser,
}) => {
  const isStaff = currentUser?.role === 'STAFF_BC';
  const staffPic = currentUser?.picName;

  const [selectedPic, setSelectedPic] = useState<string | null>(isStaff && staffPic ? staffPic : null);
  const [filterStatus, setFilterStatus] = useState<string>(initialStatusFilter);
  const [filterTatar, setFilterTatar] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const jadwalList = getJadwalList();

  // Effective PIC filter: Staff BC is strictly locked to their own PIC
  const activePicFilter = isStaff && staffPic ? staffPic : selectedPic;

  const filteredJadwal = jadwalList.filter((j) => {
    const matchPic = !activePicFilter || j.pic === activePicFilter;

    let matchStatus = true;
    if (filterStatus === 'Deviasi') {
      matchStatus = !!(j.hasil && j.hasil.status !== 'Sesuai');
    } else if (filterStatus) {
      matchStatus = j.status === filterStatus;
    }

    const matchTatar = !filterTatar || j.tatar === filterTatar;
    const matchSearch =
      j.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      j.izin.toLowerCase().includes(searchQuery.toLowerCase()) ||
      j.blok.toLowerCase().includes(searchQuery.toLowerCase()) ||
      j.pic.toLowerCase().includes(searchQuery.toLowerCase()) ||
      j.tatar.toLowerCase().includes(searchQuery.toLowerCase());

    return matchPic && matchStatus && matchTatar && matchSearch;
  });

  // Sort by date ascending
  filteredJadwal.sort(
    (a, b) => new Date(a.tanggal).getTime() - new Date(b.tanggal).getTime()
  );

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 shadow-xs">
        {/* Staff Access Banner */}
        {isStaff && (
          <div className="bg-blue-50/90 border border-blue-200 rounded-xl p-3 mb-4 flex items-center justify-between text-xs text-blue-900 shadow-2xs">
            <div className="flex items-center gap-2">
              <span className="p-1 bg-blue-100 rounded-lg text-blue-700 font-bold shrink-0">👷 Staff BC</span>
              <span>
                <strong>Tampilan Terfilter</strong>: Menampilkan jadwal monitoring khusus tugas <strong>PIC {staffPic}</strong>.
              </span>
            </div>
            <span className="hidden sm:inline-block px-2 py-0.5 bg-blue-200/60 text-blue-900 text-[10px] font-bold rounded-md">
              Akses Dibatasi Per PIC
            </span>
          </div>
        )}

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <div className="flex items-center gap-2 text-blue-600 font-bold text-xs uppercase tracking-wider mb-1">
              <CalendarDays className="w-4 h-4" /> Agenda Inspeksi Lapangan
            </div>
            <h2 className="text-lg font-bold text-slate-900">Jadwal Monitoring Renovasi</h2>
            <p className="text-xs text-slate-500">
              Total {filteredJadwal.length} jadwal inspeksi ditemukan {isStaff ? `(PIC ${staffPic})` : ''}
            </p>
          </div>
          <button
            onClick={() => {
              if (filteredJadwal.length === 0) {
                onShowToast?.('Tidak ada data jadwal untuk di-export');
                return;
              }
              exportJadwalCSV(filteredJadwal);
              onShowToast?.(`Export ${filteredJadwal.length} data jadwal berhasil!`);
            }}
            className="self-start sm:self-auto px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-700 font-bold text-xs rounded-xl transition flex items-center gap-1.5 touch-manipulation cursor-pointer active:scale-95"
          >
            <Download className="w-4 h-4 text-emerald-600" />
            <span>Export Rekap CSV</span>
          </button>
        </div>

        {/* PIC Filter Tabs - Horizontal Scroll on Mobile (Disabled for Staff BC) */}
        {!isStaff ? (
          <div className="flex gap-1.5 overflow-x-auto pb-2.5 pt-0.5 scrollbar-none border-b border-slate-200 mb-4 touch-pan-x overscroll-contain">
            <button
              onClick={() => setSelectedPic(null)}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl transition whitespace-nowrap touch-manipulation cursor-pointer active:scale-95 flex items-center gap-1.5 ${
                selectedPic === null
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/30'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <span>Semua PIC</span>
              <span className={`px-1.5 py-0.2 text-[10px] rounded-full ${selectedPic === null ? 'bg-blue-700 text-white' : 'bg-slate-200 text-slate-600'}`}>
                {jadwalList.length}
              </span>
            </button>
            {PIC.map((p) => {
              const isActive = selectedPic === p;
              const countForPic = jadwalList.filter((j) => j.pic === p).length;
              return (
                <button
                  key={p}
                  onClick={() => setSelectedPic(p)}
                  className={`px-3 py-1.5 text-xs font-bold rounded-xl transition whitespace-nowrap touch-manipulation cursor-pointer active:scale-95 flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/30'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <span>{p}</span>
                  <span className={`px-1.5 py-0.2 text-[10px] rounded-full ${isActive ? 'bg-blue-700 text-white' : 'bg-slate-200 text-slate-600'}`}>
                    {countForPic}
                  </span>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="flex items-center gap-2 pb-3 border-b border-slate-200 mb-4">
            <span className="text-xs font-bold text-slate-500">Tugas Inspeksi PIC:</span>
            <span className="px-3 py-1 text-xs font-extrabold bg-blue-600 text-white rounded-xl shadow-xs">
              {staffPic}
            </span>
          </div>
        )}

        {/* Status Quick Filter Chips for Mobile / Touch Screens */}
        <div className="flex gap-1.5 overflow-x-auto pb-2 scrollbar-none mb-3">
          {[
            { id: '', label: 'Semua Status' },
            { id: 'Terjadwal', label: 'Terjadwal' },
            { id: 'Selesai', label: 'Selesai' },
            { id: 'Terlewat', label: 'Terlewat' },
            { id: 'Deviasi', label: 'Deviasi Izin' },
          ].map((st) => {
            const isSelected = filterStatus === st.id;
            return (
              <button
                key={st.id}
                onClick={() => setFilterStatus(st.id)}
                className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition whitespace-nowrap cursor-pointer touch-manipulation active:scale-95 ${
                  isSelected
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200/60'
                }`}
              >
                {st.label}
              </button>
            );
          })}
        </div>

        {/* Filters & Search */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-5">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari ID, No Izin, Blok, PIC, Tatar..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          <select
            value={filterTatar}
            onChange={(e) => setFilterTatar(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          >
            <option value="">Semua Cluster / Tatar</option>
            {TATAR.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        {/* Table View (Desktop) & Cards (Mobile) */}
        {filteredJadwal.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-slate-200 rounded-xl text-xs text-slate-400">
            Tidak ada jadwal monitoring yang sesuai filter.
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden lg:block overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                    <th className="p-3">ID</th>
                    <th className="p-3">Tanggal</th>
                    <th className="p-3">PIC</th>
                    <th className="p-3">Lokasi</th>
                    <th className="p-3">No. Izin</th>
                    <th className="p-3">Fase Konstruksi &amp; Rutinan</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Referensi</th>
                    <th className="p-3 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filteredJadwal.map((j) => {
                    return (
                      <tr key={j.id} className="hover:bg-slate-50/80 transition">
                        <td className="p-3 font-bold text-slate-900">{j.id}</td>
                        <td className="p-3 font-semibold text-slate-700">
                          {formatDateIndo(j.tanggal)}
                        </td>
                        <td className="p-3 font-bold text-slate-800">{j.pic}</td>
                        <td className="p-3 text-slate-600">
                          {j.tatar}, Blok {j.blok}
                        </td>
                        <td className="p-3 text-slate-600 font-medium">{j.izin}</td>
                        <td className="p-3">
                          <div className="space-y-0.5">
                            <div className="text-xs font-bold text-slate-800 flex items-center gap-1">
                              <span className="text-[10px] font-semibold px-1.5 py-0.2 bg-blue-50 text-blue-700 rounded border border-blue-200">
                                Fase
                              </span>
                              <span>{j.hasil?.progress ? j.hasil.progress.replace(/^Fase Konstruksi:\s*/i, '') : 'Belum Monitoring'}</span>
                            </div>
                            <div className="text-[11px] text-slate-500 font-normal flex items-center gap-1">
                              <span className="text-[10px] font-semibold px-1.5 py-0.2 bg-slate-100 text-slate-600 rounded">
                                Rutinan
                              </span>
                              <span>{j.tahapLabel}</span>
                            </div>
                          </div>
                        </td>
                        <td className="p-3">
                          {j.status === 'Selesai' && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Selesai
                            </span>
                          )}
                          {j.status === 'Terjadwal' && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                              <Clock className="w-3 h-3 text-slate-500" /> Terjadwal
                            </span>
                          )}
                          {j.status === 'Terlewat' && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800">
                              <AlertTriangle className="w-3 h-3 text-rose-600" /> Terlewat
                            </span>
                          )}
                        </td>
                        <td className="p-3">
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => onOpenReviewModal(j)}
                              className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-[11px] rounded-lg transition inline-flex items-center gap-1"
                            >
                              <Eye className="w-3 h-3" /> Tinjau
                            </button>
                            {onOpenRescheduleModal && (
                              <button
                                onClick={() => onOpenRescheduleModal(j)}
                                className="px-2 py-1 bg-amber-50 hover:bg-amber-100 text-amber-700 font-semibold text-[11px] rounded-lg border border-amber-200 transition inline-flex items-center gap-1"
                                title="Reschedule / Ubah Tanggal"
                              >
                                <Calendar className="w-3 h-3 text-amber-600" /> Reschedule
                              </button>
                            )}
                          </div>
                        </td>
                        <td className="p-3 text-right">
                          {j.status !== 'Selesai' ? (
                            <button
                              onClick={() => onOpenMonitorModal(j)}
                              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg shadow-2xs transition inline-flex items-center gap-1 active:scale-95 touch-manipulation"
                            >
                              <Layers className="w-3.5 h-3.5" /> Monitor
                            </button>
                          ) : (
                            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded border border-emerald-200">
                              {j.hasil?.status || 'Selesai'}
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="lg:hidden space-y-3.5">
              {filteredJadwal.map((j) => (
                <div
                  key={j.id}
                  className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-sm space-y-3 transition active:border-blue-300"
                >
                  {/* Card Header: ID, Date & Status */}
                  <div className="flex items-start justify-between gap-2 pb-2.5 border-b border-slate-100">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-black text-slate-900 text-sm">{j.id}</span>
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-blue-50 text-blue-800 border border-blue-200/60">
                          PIC: {j.pic}
                        </span>
                      </div>
                      <div className="text-slate-500 text-[11px] font-semibold mt-0.5 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>{formatDateIndo(j.tanggal)}</span>
                      </div>
                    </div>

                    {j.status === 'Selesai' && (
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-black bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1 shrink-0">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Selesai
                      </span>
                    )}
                    {j.status === 'Terjadwal' && (
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-black bg-slate-100 text-slate-700 border border-slate-200 flex items-center gap-1 shrink-0">
                        <Clock className="w-3.5 h-3.5 text-slate-500" /> Terjadwal
                      </span>
                    )}
                    {j.status === 'Terlewat' && (
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-black bg-rose-100 text-rose-800 border border-rose-200 flex items-center gap-1 shrink-0 animate-pulse">
                        <AlertTriangle className="w-3.5 h-3.5 text-rose-600" /> Terlewat
                      </span>
                    )}
                  </div>

                  {/* Location & License info */}
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 space-y-1 text-xs">
                    <div className="flex items-center justify-between">
                      <div className="font-bold text-slate-900 flex items-center gap-1.5">
                        <span className="text-blue-600 font-extrabold">{j.tatar}</span>
                        <span className="text-slate-400">&bull;</span>
                        <span className="font-mono bg-white px-1.5 py-0.5 rounded border border-slate-200 text-slate-800">
                          Blok {j.blok}
                        </span>
                      </div>
                    </div>
                    <div className="text-slate-600 text-[11px]">
                      No. Izin: <strong className="text-slate-800 font-mono">{j.izin}</strong>
                    </div>
                  </div>

                  {/* Stage & Routine badges */}
                  <div className="space-y-1.5 text-xs">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[10px] font-extrabold px-2 py-0.5 bg-blue-50 text-blue-700 rounded-md border border-blue-200">
                        Fase
                      </span>
                      <span className="font-bold text-slate-800 text-xs">
                        {j.hasil?.progress ? j.hasil.progress.replace(/^Fase Konstruksi:\s*/i, '') : 'Belum Ada Input Monitoring'}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md">
                        Rutinan
                      </span>
                      <span className="font-semibold text-slate-600 text-[11px]">{j.tahapLabel}</span>
                    </div>
                  </div>

                  {/* Monitoring Result preview if available */}
                  {j.hasil && (
                    <div className="p-2.5 bg-emerald-50/70 rounded-xl border border-emerald-200/80 text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-extrabold text-emerald-800 uppercase tracking-wider">Hasil Lapangan</span>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-black ${
                            j.hasil.status === 'Sesuai'
                              ? 'bg-emerald-200/80 text-emerald-900'
                              : 'bg-amber-200/80 text-amber-900'
                          }`}
                        >
                          {j.hasil.status}
                        </span>
                      </div>
                      {j.hasil.catatan && (
                        <p className="text-slate-600 text-[11px] italic bg-white/80 p-1.5 rounded-lg">
                          "{j.hasil.catatan}"
                        </p>
                      )}
                    </div>
                  )}

                  {/* Action Buttons: Big Touch CTAs */}
                  <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row gap-2">
                    {j.status !== 'Selesai' ? (
                      <button
                        onClick={() => onOpenMonitorModal(j)}
                        className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 active:from-blue-700 active:to-indigo-700 text-white font-extrabold text-xs rounded-xl shadow-md shadow-blue-500/20 transition flex items-center justify-center gap-2 touch-manipulation cursor-pointer active:scale-98"
                      >
                        <Layers className="w-4 h-4" />
                        <span>Input Hasil Monitoring</span>
                      </button>
                    ) : (
                      <div className="w-full py-2 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-center text-xs font-bold flex items-center justify-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Inspeksi Selesai Dikerjakan</span>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => onOpenReviewModal(j)}
                        className="py-2 px-3 bg-slate-50 border border-slate-200 text-slate-700 font-bold text-xs rounded-xl hover:bg-slate-100 active:bg-slate-200 transition flex items-center justify-center gap-1.5 touch-manipulation cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5 text-blue-600" />
                        <span>Tinjau Berkas</span>
                      </button>

                      {onOpenRescheduleModal && (
                        <button
                          onClick={() => onOpenRescheduleModal(j)}
                          className="py-2 px-3 bg-amber-50 border border-amber-200 text-amber-900 font-bold text-xs rounded-xl hover:bg-amber-100 active:bg-amber-200 transition flex items-center justify-center gap-1.5 touch-manipulation cursor-pointer"
                        >
                          <Calendar className="w-3.5 h-3.5 text-amber-600" />
                          <span>Reschedule</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
