import React, { useState } from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';
import { PIC, formatDateIndo } from '../constants';
import { getPengajuanList, getJadwalList, getTemuanList } from '../utils/storage';
import {
  ClipboardList,
  Calendar,
  CheckCircle2,
  Clock,
  AlertOctagon,
  AlertTriangle,
  CalendarX,
  FileClock,
  ArrowRight,
  ShieldAlert,
  MapPin,
  User,
} from 'lucide-react';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);

import { TabType } from './Navbar';

interface TabDashboardProps {
  onNavigateTab: (tab: TabType, statusFilter?: string) => void;
}

export const TabDashboard: React.FC<TabDashboardProps> = ({ onNavigateTab }) => {
  const [selectedPic, setSelectedPic] = useState<string | null>(null);

  const pListAll = getPengajuanList();
  const jListAll = getJadwalList();
  const tListAll = getTemuanList();

  const pengajuan = selectedPic
    ? pListAll.filter((p) => p.pic === selectedPic)
    : pListAll;
  const jadwal = selectedPic
    ? jListAll.filter((j) => j.pic === selectedPic)
    : jListAll;
  const temuan = selectedPic
    ? tListAll.filter((t) => t.pic === selectedPic)
    : tListAll;

  // KPI Calculations
  const totalPengajuan = pengajuan.length;
  const totalJadwal = jadwal.length;
  const totalSelesai = jadwal.filter((j) => j.status === 'Selesai').length;
  const totalTerlewat = jadwal.filter((j) => j.status === 'Terlewat').length;
  const totalDeviasi = jadwal.filter(
    (j) => j.hasil && j.hasil.status !== 'Sesuai'
  ).length;
  const totalTemuan = temuan.length;

  // Izin Kadaluarsa Items & Count
  const temuanKadaluarsa = temuan.filter((t) => t.kategori === 'Izin Kadaluarsa');
  const monitoringKadaluarsa = jadwal.filter(
    (j) => j.hasil && j.hasil.kategoriPelanggaran && j.hasil.kategoriPelanggaran.includes('Izin Kadaluarsa')
  );
  const totalIzinKadaluarsa = temuanKadaluarsa.length + monitoringKadaluarsa.length;

  // List of all Kadaluarsa entries for table display
  const allKadaluarsaEntries = [
    ...temuanKadaluarsa.map((t) => ({
      id: t.id,
      sumber: 'Temuan Lapangan' as const,
      tatar: t.tatar,
      blok: t.blok,
      pic: t.pic,
      tanggal: t.tanggal,
      keterangan: t.keterangan || 'Izin renovasi telah habis masa berlakunya.',
    })),
    ...monitoringKadaluarsa.map((j) => ({
      id: j.id,
      sumber: 'Hasil Monitoring Inspeksi' as const,
      tatar: j.tatar,
      blok: j.blok,
      pic: j.pic,
      tanggal: j.tanggal,
      keterangan: j.hasil?.catatan || 'Ditemukan pelanggaran izin kadaluarsa pada saat inspeksi.',
    })),
  ];

  // 1. Status Chart Data
  const statusCounts = {
    Terjadwal: jadwal.filter((j) => j.status === 'Terjadwal').length,
    Selesai: totalSelesai,
    Terlewat: totalTerlewat,
  };

  const statusChartData = {
    labels: ['Terjadwal', 'Selesai', 'Terlewat'],
    datasets: [
      {
        data: [statusCounts.Terjadwal, statusCounts.Selesai, statusCounts.Terlewat],
        backgroundColor: ['#94A3B8', '#10B981', '#F43F5E'],
        borderWidth: 0,
      },
    ],
  };

  // 2. Pengajuan per Kategori
  const kategoriMap: Record<string, number> = {};
  pengajuan.forEach((p) => {
    kategoriMap[p.kategoriTerberat] = (kategoriMap[p.kategoriTerberat] || 0) + 1;
  });

  const kategoriChartData = {
    labels: Object.keys(kategoriMap).length ? Object.keys(kategoriMap) : ['Belum Ada'],
    datasets: [
      {
        label: 'Jumlah Pengajuan',
        data: Object.keys(kategoriMap).length ? Object.values(kategoriMap) : [0],
        backgroundColor: '#0F172A',
        borderRadius: 6,
      },
    ],
  };

  // 3. Distribusi Wilayah per Tatar
  const tatarMap: Record<string, number> = {};
  jadwal.concat(temuan as any).forEach((item: any) => {
    if (item.tatar) {
      tatarMap[item.tatar] = (tatarMap[item.tatar] || 0) + 1;
    }
  });

  const tatarChartData = {
    labels: Object.keys(tatarMap).length ? Object.keys(tatarMap) : ['Belum Ada'],
    datasets: [
      {
        label: 'Aktivitas Monitoring',
        data: Object.keys(tatarMap).length ? Object.values(tatarMap) : [0],
        backgroundColor: '#3B82F6',
        borderRadius: 6,
      },
    ],
  };

  // 4. PIC Distribution or Violations Breakdown
  const picMap: Record<string, number> = {};
  jListAll.forEach((j) => {
    picMap[j.pic] = (picMap[j.pic] || 0) + 1;
  });

  const picChartData = {
    labels: Object.keys(picMap),
    datasets: [
      {
        data: Object.values(picMap),
        backgroundColor: [
          '#0F172A',
          '#3B82F6',
          '#10B981',
          '#F59E0B',
          '#8B5CF6',
          '#EC4899',
          '#06B6D4',
          '#64748B',
        ],
        borderWidth: 0,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          font: { family: 'Inter', size: 11 },
          padding: 12,
        },
      },
    },
  };

  return (
    <div className="space-y-6">
      {/* PIC Filter Bar */}
      <div className="flex gap-1.5 overflow-x-auto pb-2 scrollbar-none bg-white p-3 rounded-2xl border border-slate-200">
        <button
          onClick={() => setSelectedPic(null)}
          className={`px-3 py-1.5 text-xs font-bold rounded-xl transition whitespace-nowrap touch-manipulation cursor-pointer ${
            selectedPic === null
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          Rekap Keseluruhan
        </button>
        {PIC.map((p) => (
          <button
            key={p}
            onClick={() => setSelectedPic(p)}
            className={`px-3 py-1.5 text-xs font-bold rounded-xl transition whitespace-nowrap touch-manipulation cursor-pointer ${
              selectedPic === p
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {p}
          </button>
        ))}
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
        <button
          onClick={() => onNavigateTab('pengajuan')}
          className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200 text-center shadow-2xs hover:border-blue-400 hover:shadow-md hover:-translate-y-0.5 active:scale-95 transition cursor-pointer group text-left sm:text-center w-full touch-manipulation"
        >
          <div className="w-8 h-8 mx-auto rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-1.5 group-hover:scale-110 transition-transform">
            <ClipboardList className="w-4 h-4" />
          </div>
          <div className="text-2xl font-black text-slate-900 leading-none">{totalPengajuan}</div>
          <div className="text-[11px] font-medium text-slate-500 mt-1">Total Pengajuan</div>
          <span className="text-[10px] font-bold text-blue-600 opacity-80 group-hover:opacity-100 transition mt-1.5 block">
            Lihat Data &rarr;
          </span>
        </button>

        <button
          onClick={() => onNavigateTab('jadwal', '')}
          className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200 text-center shadow-2xs hover:border-slate-400 hover:shadow-md hover:-translate-y-0.5 active:scale-95 transition cursor-pointer group text-left sm:text-center w-full touch-manipulation"
        >
          <div className="w-8 h-8 mx-auto rounded-full bg-slate-100 text-slate-700 flex items-center justify-center mb-1.5 group-hover:scale-110 transition-transform">
            <Calendar className="w-4 h-4" />
          </div>
          <div className="text-2xl font-black text-slate-900 leading-none">{totalJadwal}</div>
          <div className="text-[11px] font-medium text-slate-500 mt-1">Total Jadwal</div>
          <span className="text-[10px] font-bold text-slate-700 opacity-80 group-hover:opacity-100 transition mt-1.5 block">
            Lihat Data &rarr;
          </span>
        </button>

        <button
          onClick={() => onNavigateTab('jadwal', 'Selesai')}
          className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200 text-center shadow-2xs hover:border-emerald-400 hover:shadow-md hover:-translate-y-0.5 active:scale-95 transition cursor-pointer group text-left sm:text-center w-full touch-manipulation"
        >
          <div className="w-8 h-8 mx-auto rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mb-1.5 group-hover:scale-110 transition-transform">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div className="text-2xl font-black text-emerald-600 leading-none">{totalSelesai}</div>
          <div className="text-[11px] font-medium text-slate-500 mt-1">Jadwal Selesai</div>
          <span className="text-[10px] font-bold text-emerald-600 opacity-80 group-hover:opacity-100 transition mt-1.5 block">
            Lihat Data &rarr;
          </span>
        </button>

        <button
          onClick={() => onNavigateTab('jadwal', 'Terlewat')}
          className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200 text-center shadow-2xs hover:border-rose-400 hover:shadow-md hover:-translate-y-0.5 active:scale-95 transition cursor-pointer group text-left sm:text-center w-full touch-manipulation"
        >
          <div className="w-8 h-8 mx-auto rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mb-1.5 group-hover:scale-110 transition-transform">
            <Clock className="w-4 h-4" />
          </div>
          <div className="text-2xl font-black text-rose-600 leading-none">{totalTerlewat}</div>
          <div className="text-[11px] font-medium text-slate-500 mt-1">Jadwal Terlewat</div>
          <span className="text-[10px] font-bold text-rose-600 opacity-80 group-hover:opacity-100 transition mt-1.5 block">
            Lihat Data &rarr;
          </span>
        </button>

        <button
          onClick={() => onNavigateTab('jadwal', 'Deviasi')}
          className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200 text-center shadow-2xs hover:border-amber-400 hover:shadow-md hover:-translate-y-0.5 active:scale-95 transition cursor-pointer group text-left sm:text-center w-full touch-manipulation"
        >
          <div className="w-8 h-8 mx-auto rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mb-1.5 group-hover:scale-110 transition-transform">
            <AlertOctagon className="w-4 h-4" />
          </div>
          <div className="text-2xl font-black text-amber-600 leading-none">{totalDeviasi}</div>
          <div className="text-[11px] font-medium text-slate-500 mt-1">Deviasi Izin</div>
          <span className="text-[10px] font-bold text-amber-600 opacity-80 group-hover:opacity-100 transition mt-1.5 block">
            Lihat Data &rarr;
          </span>
        </button>

        {/* REKAP IZIN KADALUARSA KPI CARD */}
        <button
          onClick={() => onNavigateTab('temuan')}
          className="bg-gradient-to-br from-purple-50 to-indigo-50/80 p-3.5 sm:p-4 rounded-2xl border border-purple-200 text-center shadow-2xs hover:border-purple-400 hover:shadow-md hover:-translate-y-0.5 active:scale-95 transition cursor-pointer group text-left sm:text-center w-full touch-manipulation relative overflow-hidden"
        >
          <div className="w-8 h-8 mx-auto rounded-full bg-purple-100 text-purple-700 flex items-center justify-center mb-1.5 group-hover:scale-110 transition-transform shadow-xs">
            <CalendarX className="w-4 h-4" />
          </div>
          <div className="text-2xl font-black text-purple-900 leading-none">{totalIzinKadaluarsa}</div>
          <div className="text-[11px] font-bold text-purple-900 mt-1">Izin Kadaluarsa</div>
          <span className="text-[10px] font-bold text-purple-700 opacity-90 group-hover:opacity-100 transition mt-1.5 block">
            Lihat Rekap &rarr;
          </span>
        </button>

        <button
          onClick={() => onNavigateTab('temuan')}
          className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200 text-center shadow-2xs hover:border-rose-400 hover:shadow-md hover:-translate-y-0.5 active:scale-95 transition cursor-pointer group text-left sm:text-center w-full touch-manipulation"
        >
          <div className="w-8 h-8 mx-auto rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mb-1.5 group-hover:scale-110 transition-transform">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div className="text-2xl font-black text-rose-700 leading-none">{totalTemuan}</div>
          <div className="text-[11px] font-medium text-slate-500 mt-1">Total Temuan</div>
          <span className="text-[10px] font-bold text-rose-700 opacity-80 group-hover:opacity-100 transition mt-1.5 block">
            Lihat Data &rarr;
          </span>
        </button>
      </div>

      {/* DEDICATED REKAP IZIN KADALUARSA WIDGET */}
      <div className="bg-white rounded-2xl border border-purple-200/90 shadow-sm overflow-hidden">
        <div className="p-4 sm:p-5 bg-gradient-to-r from-purple-900 to-indigo-900 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-400/30 flex items-center justify-center text-purple-300 shrink-0">
              <CalendarX className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base text-white tracking-tight">
                  Rekap &amp; Monitoring Izin Kadaluarsa
                </h3>
                <span className="px-2 py-0.5 bg-purple-500/30 text-purple-200 text-[10px] font-extrabold rounded-full border border-purple-400/30">
                  {totalIzinKadaluarsa} Kasus
                </span>
              </div>
              <p className="text-xs text-purple-200/80 font-medium">
                Daftar proyek renovasi yang telah melewati batas waktu izin operasional
              </p>
            </div>
          </div>

          <button
            onClick={() => onNavigateTab('temuan')}
            className="px-3.5 py-1.5 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl transition flex items-center gap-1.5 cursor-pointer touch-manipulation shrink-0 self-end sm:self-center"
          >
            <span>Buka Temuan Lapangan</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="p-4 sm:p-5">
          {/* Summary Chips */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
            <div className="p-3 bg-purple-50/80 border border-purple-100 rounded-xl flex items-center justify-between">
              <div>
                <div className="text-[11px] font-bold text-purple-900">Total Kasus Kadaluarsa</div>
                <div className="text-xs text-purple-700">Gabungan Temuan &amp; Inspeksi</div>
              </div>
              <div className="text-xl font-black text-purple-950">{totalIzinKadaluarsa}</div>
            </div>

            <div className="p-3 bg-amber-50/80 border border-amber-100 rounded-xl flex items-center justify-between">
              <div>
                <div className="text-[11px] font-bold text-amber-900">Temuan Langsung Lapangan</div>
                <div className="text-xs text-amber-700">Laporan Petugas Patroli</div>
              </div>
              <div className="text-xl font-black text-amber-950">{temuanKadaluarsa.length}</div>
            </div>

            <div className="p-3 bg-blue-50/80 border border-blue-100 rounded-xl flex items-center justify-between">
              <div>
                <div className="text-[11px] font-bold text-blue-900">Hasil Inspeksi Berkala</div>
                <div className="text-xs text-blue-700">Pemeriksaan Jadwal Rutin</div>
              </div>
              <div className="text-xl font-black text-blue-950">{monitoringKadaluarsa.length}</div>
            </div>
          </div>

          {/* Table / List */}
          {allKadaluarsaEntries.length > 0 ? (
            <>
              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto border border-slate-200 rounded-xl">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                      <th className="p-3">ID / Tanggal</th>
                      <th className="p-3">Tatar &amp; Blok</th>
                      <th className="p-3">PIC Inspektor</th>
                      <th className="p-3">Sumber Data</th>
                      <th className="p-3">Keterangan Catatan</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs">
                    {allKadaluarsaEntries.map((item) => (
                      <tr key={item.id} className="hover:bg-purple-50/30 transition">
                        <td className="p-3 font-mono font-bold text-slate-900">
                          <div>{item.id}</div>
                          <div className="text-[10px] text-slate-400 font-sans font-normal">
                            {formatDateIndo(item.tanggal)}
                          </div>
                        </td>
                        <td className="p-3 font-bold text-slate-800">
                          <div className="flex items-center gap-1 text-slate-900">
                            <MapPin className="w-3.5 h-3.5 text-purple-600" />
                            <span>{item.tatar}</span>
                          </div>
                          <div className="text-[11px] text-slate-500 font-mono">Blok {item.blok}</div>
                        </td>
                        <td className="p-3 font-semibold text-slate-700">
                          <div className="flex items-center gap-1">
                            <User className="w-3.5 h-3.5 text-slate-400" />
                            <span>{item.pic}</span>
                          </div>
                        </td>
                        <td className="p-3">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                              item.sumber === 'Temuan Lapangan'
                                ? 'bg-amber-100 text-amber-900 border border-amber-200'
                                : 'bg-blue-100 text-blue-900 border border-blue-200'
                            }`}
                          >
                            <FileClock className="w-3 h-3" />
                            {item.sumber}
                          </span>
                        </td>
                        <td className="p-3 text-slate-600 leading-relaxed max-w-xs">
                          {item.keterangan}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards for Kadaluarsa */}
              <div className="md:hidden space-y-3">
                {allKadaluarsaEntries.map((item) => (
                  <div
                    key={item.id}
                    className="p-3.5 bg-purple-50/40 rounded-xl border border-purple-100 space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-black text-slate-900 text-sm">{item.id}</span>
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                          item.sumber === 'Temuan Lapangan'
                            ? 'bg-amber-100 text-amber-900 border border-amber-200'
                            : 'bg-blue-100 text-blue-900 border border-blue-200'
                        }`}
                      >
                        <FileClock className="w-3 h-3" />
                        {item.sumber}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-slate-800">
                      <div className="font-bold">
                        {item.tatar} &middot; <span className="font-mono text-slate-600">Blok {item.blok}</span>
                      </div>
                      <div className="font-semibold text-blue-700">PIC: {item.pic}</div>
                    </div>

                    <p className="text-slate-600 italic bg-white p-2 rounded-lg border border-purple-100">
                      "{item.keterangan}"
                    </p>

                    <div className="text-[10px] text-slate-400 font-medium">
                      Tanggal: {formatDateIndo(item.tanggal)}
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="p-6 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200 text-slate-500 text-xs">
              <CheckCircle2 className="w-6 h-6 text-emerald-500 mx-auto mb-1" />
              <span>Tidak ada catatan izin kadaluarsa yang aktif saat ini.</span>
            </div>
          )}
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">
            Status Jadwal Inspeksi
          </h3>
          <div className="h-56 relative flex items-center justify-center">
            <Doughnut data={statusChartData} options={chartOptions} />
          </div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">
            Pengajuan per Kategori Utama
          </h3>
          <div className="h-56 relative">
            <Bar data={kategoriChartData} options={chartOptions} />
          </div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">
            Distribusi Wilayah (Cluster / Tatar)
          </h3>
          <div className="h-56 relative">
            <Bar
              data={tatarChartData}
              options={{ ...chartOptions, indexAxis: 'y' as const }}
            />
          </div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">
            Beban Kerja Inspeksi per PIC
          </h3>
          <div className="h-56 relative flex items-center justify-center">
            <Doughnut data={picChartData} options={chartOptions} />
          </div>
        </div>
      </div>
    </div>
  );
};

