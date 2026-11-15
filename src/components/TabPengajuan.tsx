import React, { useState } from 'react';
import {
  ClipboardList,
  Plus,
  Trash2,
  Calendar,
  Sparkles,
  Search,
  Building,
  User,
  Upload,
  Eye,
  CheckCircle2,
  AlertCircle,
  FileCheck2,
  Download,
  Printer,
} from 'lucide-react';
import { exportPengajuanCSV } from '../utils/export';
import {
  TATAR,
  PIC,
  TATAR_PIC_MAP,
  PEKERJAAN_OPTIONS,
  getKategoriGroup,
  GROUP_RANK,
  generateJadwalPattern,
  formatDateIndo,
  addDays,
} from '../constants';
import { Pengajuan, PekerjaanItem, Jadwal, KategoriPategoriGroup } from '../types';
import {
  getPengajuanList,
  savePengajuanList,
  getJadwalList,
  saveJadwalList,
  convertFilesToDataUrls,
} from '../utils/storage';

interface TabPengajuanProps {
  onRefreshAll: () => void;
  onShowToast: (msg: string) => void;
  onOpenDetail: (p: Pengajuan) => void;
  onPrintSurat?: (p: Pengajuan) => void;
}

export const TabPengajuan: React.FC<TabPengajuanProps> = ({
  onRefreshAll,
  onShowToast,
  onOpenDetail,
  onPrintSurat,
}) => {
  const todayStr = new Date().toISOString().split('T')[0];

  const [izin, setIzin] = useState('');
  const [nama, setNama] = useState('');
  const [tatar, setTatar] = useState(TATAR[0]);
  const [blok, setBlok] = useState('');
  const [pic, setPic] = useState(TATAR_PIC_MAP[TATAR[0]] || PIC[0]);
  const [tglMulai, setTglMulai] = useState(todayStr);
  const [tglSelesai, setTglSelesai] = useState(addDays(todayStr, 30).toISOString().split('T')[0]);
  const [gambarFiles, setGambarFiles] = useState<FileList | null>(null);

  const [pekerjaanRows, setPekerjaanRows] = useState<Array<{ id: number; jenis: string; luas: string }>>([
    { id: 1, jenis: PEKERJAAN_OPTIONS[0].items[0], luas: '' },
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [filterTatar, setFilterTatar] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleTatarChange = (newTatar: string) => {
    setTatar(newTatar);
    if (TATAR_PIC_MAP[newTatar]) {
      setPic(TATAR_PIC_MAP[newTatar]);
    }
  };

  const handleAutoGenerateIzin = () => {
    const list = getPengajuanList();
    const count = list.length + 1;
    const year = new Date().getFullYear();
    const generated = `BC-${year}-${String(count).padStart(4, '0')}`;
    setIzin(generated);
    onShowToast(`No. Izin di-generate: ${generated}`);
  };

  const handleAddRow = () => {
    if (pekerjaanRows.length >= 5) {
      onShowToast('Maksimal 5 item pekerjaan per pengajuan!');
      return;
    }
    setPekerjaanRows((prev) => [
      ...prev,
      { id: Date.now(), jenis: PEKERJAAN_OPTIONS[0].items[0], luas: '' },
    ]);
  };

  const handleRemoveRow = (id: number) => {
    if (pekerjaanRows.length <= 1) {
      onShowToast('Minimal 1 item pekerjaan!');
      return;
    }
    setPekerjaanRows((prev) => prev.filter((r) => r.id !== id));
  };

  const handleRowChange = (id: number, field: 'jenis' | 'luas', val: string) => {
    setPekerjaanRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, [field]: val } : r))
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const cleanIzin = izin.trim();
    const cleanNama = nama.trim();
    const cleanBlok = blok.trim();

    if (!cleanIzin) {
      onShowToast('No. Izin Pengajuan wajib diisi!');
      return;
    }
    if (!cleanNama) {
      onShowToast('Nama Pemilik wajib diisi!');
      return;
    }
    if (!cleanBlok) {
      onShowToast('No. Blok / Unit wajib diisi!');
      return;
    }
    if (!tglMulai || !tglSelesai) {
      onShowToast('Tanggal Mulai & Selesai wajib diisi!');
      return;
    }
    if (new Date(tglMulai) > new Date(tglSelesai)) {
      onShowToast('Tanggal Selesai harus setelah Tanggal Mulai!');
      return;
    }

    const pengajuanList = getPengajuanList();
    if (pengajuanList.some((p) => p.izin.toLowerCase() === cleanIzin.toLowerCase())) {
      onShowToast(`No. Izin ${cleanIzin} sudah terdaftar! Gunakan nomor lain.`);
      return;
    }

    setIsSubmitting(true);

    try {
      let convertedFiles: Array<{ name: string; type: string; dataUrl: string }> = [];
      if (gambarFiles && gambarFiles.length > 0) {
        convertedFiles = await convertFilesToDataUrls(gambarFiles);
      }

      const itemsProcessed: PekerjaanItem[] = pekerjaanRows.map((r) => ({
        jenis: r.jenis,
        luas: r.luas || '-',
        group: getKategoriGroup(r.jenis),
      }));

      const kategoriTerberat: KategoriPategoriGroup = itemsProcessed.reduce(
        (acc, it) => (GROUP_RANK[it.group] > GROUP_RANK[acc] ? it.group : acc),
        'Kecil' as KategoriPategoriGroup
      );

      const jenisGabungan = itemsProcessed.map((it) => it.jenis).join(', ');

      const newPengajuan: Pengajuan = {
        izin: cleanIzin,
        nama: cleanNama,
        tatar,
        blok: cleanBlok,
        pic,
        items: itemsProcessed,
        jenis: jenisGabungan,
        kategoriTerberat,
        tglMulai,
        tglSelesai,
        gambar: convertedFiles,
        createdAt: new Date().toISOString(),
      };

      pengajuanList.push(newPengajuan);

      // Generate Monitoring Schedule based on date range
      const jadwalList = getJadwalList();
      const pattern = generateJadwalPattern(kategoriTerberat);
      let scheduleCount = 0;

      pattern.forEach((p) => {
        const targetDate = addDays(tglMulai, p[0]);
        if (targetDate <= new Date(tglSelesai)) {
          jadwalList.push({
            id: 'JK-' + String(jadwalList.length + 1).padStart(4, '0'),
            izin: cleanIzin,
            tatar,
            blok: cleanBlok,
            pic,
            jenis: jenisGabungan,
            tahapLabel: p[1],
            tanggal: targetDate.toISOString(),
            status: 'Terjadwal',
            hasil: null,
          });
          scheduleCount++;
        }
      });

      savePengajuanList(pengajuanList);
      saveJadwalList(jadwalList);

      onShowToast(
        `Pengajuan ${cleanIzin} tersimpan! ${scheduleCount} jadwal monitoring berhasil digenerate.`
      );

      // Reset Form
      setIzin('');
      setNama('');
      setBlok('');
      setGambarFiles(null);
      setPekerjaanRows([{ id: Date.now(), jenis: PEKERJAAN_OPTIONS[0].items[0], luas: '' }]);

      onRefreshAll();
    } catch (err) {
      console.error(err);
      onShowToast('Gagal memproses pengajuan.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filtered List
  const allPengajuan = getPengajuanList();
  const filteredList = allPengajuan.filter((p) => {
    const matchSearch =
      p.izin.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.blok.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.jenis.toLowerCase().includes(searchQuery.toLowerCase());
    const matchTatar = !filterTatar || p.tatar === filterTatar;
    return matchSearch && matchTatar;
  });

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <div className="space-y-6">
      {/* FORM CARD */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 shadow-xs">
        <div className="flex items-center gap-2 text-blue-600 font-bold text-xs uppercase tracking-wider mb-1">
          <FileCheck2 className="w-4 h-4" /> Formulir Pendaftaran Perizinan
        </div>
        <h2 className="text-lg font-bold text-slate-900">Input Pengajuan Renovasi Unit</h2>
        <p className="text-xs text-slate-500 mb-5">
          Durasi dan jadwal inspeksi akan dihitung &amp; digenerate otomatis menyesuaikan rentang tanggal pengerjaan.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                No. Izin Pengajuan
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={izin}
                  onChange={(e) => setIzin(e.target.value)}
                  placeholder="Contoh: BC-2026-0001"
                  className="flex-1 px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
                <button
                  type="button"
                  onClick={handleAutoGenerateIzin}
                  className="px-3 py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs rounded-xl border border-blue-200 transition flex items-center gap-1 shrink-0 active:scale-95 touch-manipulation"
                >
                  <Sparkles className="w-3.5 h-3.5 text-blue-600" /> Auto
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                Nama Pemilik / Pemohon
              </label>
              <input
                type="text"
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                placeholder="Nama lengkap pemilik unit"
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                Cluster / Tatar
              </label>
              <select
                value={tatar}
                onChange={(e) => handleTatarChange(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              >
                {TATAR.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                No. Blok / Unit
              </label>
              <input
                type="text"
                value={blok}
                onChange={(e) => setBlok(e.target.value)}
                placeholder="Contoh: TA-5/12"
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                Tanggal Mulai Pengerjaan
              </label>
              <input
                type="date"
                value={tglMulai}
                onChange={(e) => setTglMulai(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                Tanggal Selesai Target
              </label>
              <input
                type="date"
                value={tglSelesai}
                onChange={(e) => setTglSelesai(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                PIC Penanggung Jawab Building Control
              </label>
              <select
                value={pic}
                onChange={(e) => setPic(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              >
                {PIC.map((p) => (
                  <option key={p} value={p}>
                    {p} {p === TATAR_PIC_MAP[tatar] ? '(PIC Utama ' + tatar + ')' : ''}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                Gambar Desain &amp; Berkas Tambahan
              </label>
              <label className="flex items-center justify-center gap-2 p-2.5 bg-slate-50 hover:bg-slate-100 border border-dashed border-slate-300 rounded-xl text-xs font-semibold text-slate-600 cursor-pointer transition">
                <Upload className="w-4 h-4 text-blue-600" />
                <span>
                  {gambarFiles && gambarFiles.length > 0
                    ? `${gambarFiles.length} file dipilih`
                    : 'Upload Gambar / PDF'}
                </span>
                <input
                  type="file"
                  accept="image/*,.pdf"
                  multiple
                  onChange={(e) => setGambarFiles(e.target.files)}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* ITEM PEKERJAAN ROWS */}
          <div className="pt-2">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Item Pekerjaan Renovasi (Maks. 5 Item)
              </label>
              <span className="text-[11px] font-semibold text-slate-500">
                {pekerjaanRows.length}/5 Item
              </span>
            </div>

            <div className="space-y-2">
              {pekerjaanRows.map((row) => (
                <div
                  key={row.id}
                  className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 p-2.5 bg-slate-50 rounded-xl border border-slate-200"
                >
                  <select
                    value={row.jenis}
                    onChange={(e) => handleRowChange(row.id, 'jenis', e.target.value)}
                    className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  >
                    {PEKERJAAN_OPTIONS.map((g) => (
                      <optgroup key={g.group} label={g.group}>
                        {g.items.map((it) => (
                          <option key={it} value={it}>
                            {it}
                          </option>
                        ))}
                      </optgroup>
                    ))}
                  </select>

                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={row.luas}
                      onChange={(e) => handleRowChange(row.id, 'luas', e.target.value)}
                      placeholder="Luas (m²)"
                      className="w-28 px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />

                    <button
                      type="button"
                      onClick={() => handleRemoveRow(row.id)}
                      className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                      title="Hapus Baris"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {pekerjaanRows.length < 5 && (
              <button
                type="button"
                onClick={handleAddRow}
                className="mt-2.5 px-3 py-2 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition flex items-center gap-1.5 touch-manipulation"
              >
                <Plus className="w-3.5 h-3.5" /> Tambah Item Pekerjaan
              </button>
            )}
          </div>

          <div className="pt-4 border-t border-slate-200">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto px-6 py-3 bg-slate-900 hover:bg-slate-800 active:bg-slate-950 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition touch-manipulation flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{isSubmitting ? 'Memproses...' : 'Simpan Data & Generate Jadwal Inspeksi'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* LIST CARD */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">Riwayat Pengajuan &amp; Status Perizinan</h3>
            <p className="text-xs text-slate-500">Total {filteredList.length} berkas terdaftar</p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => {
                if (filteredList.length === 0) {
                  onShowToast('Tidak ada data pengajuan untuk di-export');
                  return;
                }
                exportPengajuanCSV(filteredList);
                onShowToast(`Export ${filteredList.length} data pengajuan berhasil!`);
              }}
              className="px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-700 font-bold text-xs rounded-xl transition flex items-center gap-1.5 touch-manipulation cursor-pointer active:scale-95"
            >
              <Download className="w-4 h-4 text-emerald-600" />
              <span>Export CSV</span>
            </button>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari No. Izin, Nama, Blok..."
                  className="pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 w-full sm:w-48 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <select
                value={filterTatar}
                onChange={(e) => setFilterTatar(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="">Semua Tatar</option>
                {TATAR.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {filteredList.length === 0 ? (
          <div className="text-center py-10 border border-dashed border-slate-200 rounded-xl text-xs text-slate-400">
            Belum ada data pengajuan perizinan.
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                    <th className="p-3">No. Izin</th>
                    <th className="p-3">Pemilik</th>
                    <th className="p-3">Lokasi</th>
                    <th className="p-3">Pekerjaan</th>
                    <th className="p-3">Target Selesai</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filteredList.map((p) => {
                    const isExpired = new Date(p.tglSelesai) < today;
                    return (
                      <tr key={p.izin} className="hover:bg-slate-50/80 transition">
                        <td className="p-3 font-bold text-slate-900">{p.izin}</td>
                        <td className="p-3 font-medium text-slate-800">{p.nama}</td>
                        <td className="p-3 text-slate-600">
                          {p.tatar}, Blok {p.blok}
                        </td>
                        <td className="p-3 text-slate-600 max-w-xs truncate" title={p.jenis}>
                          {p.jenis}
                        </td>
                        <td className="p-3 text-slate-600">{formatDateIndo(p.tglSelesai)}</td>
                        <td className="p-3">
                          {isExpired ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-700">
                              <AlertCircle className="w-3 h-3" /> Kedaluwarsa
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                              <CheckCircle2 className="w-3 h-3" /> Aktif
                            </span>
                          )}
                        </td>
                        <td className="p-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {onPrintSurat && (
                              <button
                                onClick={() => onPrintSurat(p)}
                                className="px-2.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold text-xs rounded-lg transition inline-flex items-center gap-1 border border-blue-200"
                                title="Cetak Surat Izin Resmi"
                              >
                                <Printer className="w-3.5 h-3.5 text-blue-600" /> Cetak
                              </button>
                            )}
                            <button
                              onClick={() => onOpenDetail(p)}
                              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-lg transition inline-flex items-center gap-1"
                            >
                              <Eye className="w-3.5 h-3.5" /> Detail
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Touch-Optimized Cards */}
            <div className="md:hidden space-y-3.5">
              {filteredList.map((p) => {
                const isExpired = new Date(p.tglSelesai) < today;
                return (
                  <div
                    key={p.izin}
                    className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-sm space-y-3"
                  >
                    <div className="flex items-start justify-between gap-2 pb-2.5 border-b border-slate-100">
                      <div>
                        <div className="font-mono font-black text-slate-900 text-sm">{p.izin}</div>
                        <div className="text-slate-800 font-bold text-xs mt-0.5">{p.nama}</div>
                      </div>
                      {isExpired ? (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-rose-100 text-rose-800 border border-rose-200 flex items-center gap-1 shrink-0 animate-pulse">
                          <AlertCircle className="w-3.5 h-3.5 text-rose-600" /> Kedaluwarsa
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1 shrink-0">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Izin Aktif
                        </span>
                      )}
                    </div>

                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 flex items-center justify-between text-xs">
                      <div className="font-bold text-slate-900 flex items-center gap-1.5">
                        <span className="text-blue-600 font-extrabold">{p.tatar}</span>
                        <span className="text-slate-400">&bull;</span>
                        <span className="font-mono bg-white px-1.5 py-0.5 rounded border border-slate-200 text-slate-800">
                          Blok {p.blok}
                        </span>
                      </div>
                      <span className="text-[11px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200/60">
                        PIC: {p.pic}
                      </span>
                    </div>

                    <div className="text-xs space-y-1">
                      <div className="text-slate-500 font-medium text-[11px]">Jenis Pekerjaan:</div>
                      <div className="font-semibold text-slate-800 bg-slate-50/80 p-2 rounded-lg border border-slate-100">
                        {p.jenis}
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                      <div className="text-[11px] text-slate-500 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>Batas: <strong>{formatDateIndo(p.tglSelesai)}</strong></span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        {onPrintSurat && (
                          <button
                            onClick={() => onPrintSurat(p)}
                            className="px-2.5 py-1.5 bg-blue-50 border border-blue-200 text-blue-700 font-extrabold rounded-xl hover:bg-blue-100 active:bg-blue-200 transition flex items-center gap-1 active:scale-95 touch-manipulation text-xs"
                          >
                            <Printer className="w-3.5 h-3.5 text-blue-600" /> Cetak
                          </button>
                        )}
                        <button
                          onClick={() => onOpenDetail(p)}
                          className="px-3 py-1.5 bg-slate-900 text-white font-extrabold rounded-xl hover:bg-slate-800 active:bg-black transition flex items-center gap-1 active:scale-95 touch-manipulation text-xs shadow-xs"
                        >
                          <Eye className="w-3.5 h-3.5 text-blue-300" /> Detail
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
