import React, { useState } from 'react';
import {
  AlertTriangle,
  Upload,
  CheckCircle2,
  Search,
  Eye,
  Camera,
  Calendar,
  User,
  MapPin,
  Download,
  Printer,
} from 'lucide-react';
import { exportTemuanCSV } from '../utils/export';
import { TATAR, PIC, formatDateIndo } from '../constants';
import { Temuan } from '../types';
import { getTemuanList, saveTemuanList, convertFilesToDataUrls } from '../utils/storage';

interface TabTemuanProps {
  onRefreshAll: () => void;
  onShowToast: (msg: string) => void;
  onOpenDetailTemuan: (t: Temuan) => void;
  onPrintSurat?: (t: Temuan) => void;
}

export const TabTemuan: React.FC<TabTemuanProps> = ({
  onRefreshAll,
  onShowToast,
  onOpenDetailTemuan,
  onPrintSurat,
}) => {
  const [tatar, setTatar] = useState(TATAR[0]);
  const [blok, setBlok] = useState('');
  const [pic, setPic] = useState(PIC[0]);
  const [kategori, setKategori] = useState<
    | 'Renovasi Tanpa Izin'
    | 'Izin Kadaluarsa'
    | 'Material Menutup RoW'
    | 'Pelanggaran Batas GSB/KDB'
    | 'Kerusakan Fasum / Lingkungan'
    | 'Lainnya'
  >('Renovasi Tanpa Izin');
  const [keterangan, setKeterangan] = useState('');
  const [fotoFiles, setFotoFiles] = useState<FileList | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [filterKategori, setFilterKategori] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const cleanBlok = blok.trim();
    if (!cleanBlok) {
      onShowToast('No. Blok / Unit wajib diisi!');
      return;
    }

    setIsSubmitting(true);

    try {
      let convertedPhotos: Array<{ name: string; type: string; dataUrl: string }> = [];
      if (fotoFiles && fotoFiles.length > 0) {
        convertedPhotos = await convertFilesToDataUrls(fotoFiles);
      }

      const temuanList = getTemuanList();
      const newId = 'TM-' + String(temuanList.length + 1).padStart(4, '0');

      const newTemuan: Temuan = {
        id: newId,
        tanggal: new Date().toISOString(),
        tatar,
        blok: cleanBlok,
        pic,
        kategori,
        keterangan: keterangan.trim(),
        foto: convertedPhotos,
      };

      temuanList.push(newTemuan);
      saveTemuanList(temuanList);

      onShowToast(`Laporan temuan ${newId} berhasil disimpan!`);

      // Reset
      setBlok('');
      setKeterangan('');
      setFotoFiles(null);

      onRefreshAll();
    } catch (err) {
      console.error(err);
      onShowToast('Gagal menyimpan laporan temuan.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const temuanList = getTemuanList();
  const filteredList = temuanList.filter((t) => {
    const matchSearch =
      t.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.blok.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.tatar.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.pic.toLowerCase().includes(searchQuery.toLowerCase());
    const matchKategori = !filterKategori || t.kategori === filterKategori;
    return matchSearch && matchKategori;
  });

  filteredList.sort((a, b) => new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime());

  return (
    <div className="space-y-6">
      {/* FORM CARD */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 shadow-xs">
        <div className="flex items-center gap-2 text-rose-600 font-bold text-xs uppercase tracking-wider mb-1">
          <AlertTriangle className="w-4 h-4" /> Pelaporan Pelanggaran Non-Perizinan
        </div>
        <h2 className="text-lg font-bold text-slate-900">Input Temuan Lapangan / Renovasi Ilegal</h2>
        <p className="text-xs text-slate-500 mb-5">
          Pencatatan pelanggaran atau renovasi tanpa izin resmi yang ditemukan saat patroli lingkungan.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                Cluster / Tatar
              </label>
              <select
                value={tatar}
                onChange={(e) => setTatar(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20"
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
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                PIC Penemu / Pelapor
              </label>
              <select
                value={pic}
                onChange={(e) => setPic(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                {PIC.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                Kategori Temuan Pelanggaran
              </label>
              <select
                value={kategori}
                onChange={(e) =>
                  setKategori(
                    e.target.value as
                      | 'Renovasi Tanpa Izin'
                      | 'Izin Kadaluarsa'
                      | 'Material Menutup RoW'
                      | 'Pelanggaran Batas GSB/KDB'
                      | 'Kerusakan Fasum / Lingkungan'
                      | 'Lainnya'
                  )
                }
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="Renovasi Tanpa Izin">Renovasi Tanpa Izin</option>
                <option value="Izin Kadaluarsa">Izin Kadaluarsa</option>
                <option value="Material Menutup RoW">Material Menutup RoW</option>
                <option value="Pelanggaran Batas GSB/KDB">Pelanggaran Batas GSB/KDB</option>
                <option value="Kerusakan Fasum / Lingkungan">Kerusakan Fasum / Lingkungan</option>
                <option value="Lainnya">Lainnya</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                Bukti Foto Lapangan
              </label>
              <div className="grid grid-cols-2 gap-2">
                <label className="flex items-center justify-center gap-1.5 p-2.5 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl text-xs font-bold text-rose-700 cursor-pointer transition touch-manipulation active:scale-95">
                  <Camera className="w-4 h-4 text-rose-600" />
                  <span>Ambil Foto (Kamera)</span>
                  <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    multiple
                    onChange={(e) => setFotoFiles(e.target.files)}
                    className="hidden"
                  />
                </label>
                <label className="flex items-center justify-center gap-1.5 p-2.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 cursor-pointer transition touch-manipulation active:scale-95">
                  <Upload className="w-4 h-4 text-slate-600" />
                  <span>Pilih Galeri</span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => setFotoFiles(e.target.files)}
                    className="hidden"
                  />
                </label>
              </div>
              {fotoFiles && fotoFiles.length > 0 && (
                <p className="text-[11px] font-semibold text-rose-600 mt-1.5">
                  ✓ {fotoFiles.length} foto siap diupload
                </p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
              Keterangan Detail Temuan
            </label>
            <textarea
              rows={3}
              value={keterangan}
              onChange={(e) => setKeterangan(e.target.value)}
              placeholder="Jelaskan detail pelanggaran, barang bukti, atau tanggapan pekerja di lokasi..."
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          <div className="pt-3 border-t border-slate-200">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto px-6 py-3 bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition touch-manipulation flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isSubmitting ? 'Memproses...' : 'Simpan Data Temuan Lapangan'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* LIST CARD */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">Riwayat Temuan &amp; Pelanggaran Lapangan</h3>
            <p className="text-xs text-slate-500">Total {filteredList.length} laporan temuan recorded</p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => {
                if (filteredList.length === 0) {
                  onShowToast('Tidak ada data temuan untuk di-export');
                  return;
                }
                exportTemuanCSV(filteredList);
                onShowToast(`Export ${filteredList.length} data temuan berhasil!`);
              }}
              className="px-3.5 py-2 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 font-bold text-xs rounded-xl transition flex items-center gap-1.5 touch-manipulation cursor-pointer active:scale-95"
            >
              <Download className="w-4 h-4 text-rose-600" />
              <span>Export CSV</span>
            </button>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari ID, Blok, PIC..."
                  className="pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 w-full sm:w-48 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <select
                value={filterKategori}
                onChange={(e) => setFilterKategori(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="">Semua Kategori</option>
                <option value="Renovasi Tanpa Izin">Renovasi Tanpa Izin</option>
                <option value="Izin Kadaluarsa">Izin Kadaluarsa</option>
                <option value="Material Menutup RoW">Material Menutup RoW</option>
                <option value="Pelanggaran Batas GSB/KDB">Pelanggaran Batas GSB/KDB</option>
                <option value="Kerusakan Fasum / Lingkungan">Kerusakan Fasum / Lingkungan</option>
                <option value="Lainnya">Lainnya</option>
              </select>
            </div>
          </div>
        </div>

        {filteredList.length === 0 ? (
          <div className="text-center py-10 border border-dashed border-slate-200 rounded-xl text-xs text-slate-400">
            Belum ada catatan temuan lapangan.
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                    <th className="p-3">ID</th>
                    <th className="p-3">Tanggal</th>
                    <th className="p-3">Lokasi</th>
                    <th className="p-3">Kategori</th>
                    <th className="p-3">Pelapor</th>
                    <th className="p-3 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filteredList.map((t) => (
                    <tr key={t.id} className="hover:bg-slate-50/80 transition">
                      <td className="p-3 font-bold text-slate-900">{t.id}</td>
                      <td className="p-3 text-slate-600">{formatDateIndo(t.tanggal)}</td>
                      <td className="p-3 font-semibold text-slate-800">
                        {t.tatar}, Blok {t.blok}
                      </td>
                      <td className="p-3">
                        <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200">
                          {t.kategori}
                        </span>
                      </td>
                      <td className="p-3 font-medium text-slate-700">{t.pic}</td>
                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {onPrintSurat && (
                            <button
                              onClick={() => onPrintSurat(t)}
                              className="px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold text-xs rounded-lg transition inline-flex items-center gap-1 border border-rose-200"
                              title="Cetak Surat Teguran Pelanggaran"
                            >
                              <Printer className="w-3.5 h-3.5 text-rose-600" /> Cetak SP
                            </button>
                          )}
                          <button
                            onClick={() => onOpenDetailTemuan(t)}
                            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-lg transition inline-flex items-center gap-1"
                          >
                            <Eye className="w-3.5 h-3.5" /> Detail
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden space-y-3.5">
              {filteredList.map((t) => (
                <div
                  key={t.id}
                  className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-sm space-y-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-black text-slate-900 text-sm">{t.id}</span>
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-blue-50 text-blue-800 border border-blue-200/60">
                          PIC: {t.pic}
                        </span>
                      </div>
                      <div className="text-slate-500 text-[11px] font-semibold mt-0.5 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>{formatDateIndo(t.tanggal)}</span>
                      </div>
                    </div>

                    <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-rose-100 text-rose-800 border border-rose-200 text-right">
                      {t.kategori}
                    </span>
                  </div>

                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-xs">
                    <div className="font-bold text-slate-900 flex items-center gap-1.5">
                      <span className="text-blue-600 font-extrabold">{t.tatar}</span>
                      <span className="text-slate-400">&bull;</span>
                      <span className="font-mono bg-white px-1.5 py-0.5 rounded border border-slate-200 text-slate-800">
                        Blok {t.blok}
                      </span>
                    </div>
                  </div>

                  {t.keterangan && (
                    <div className="p-2.5 bg-rose-50/50 rounded-xl border border-rose-100 text-xs">
                      <p className="text-slate-700 italic">"{t.keterangan}"</p>
                    </div>
                  )}

                  {t.foto && t.foto.length > 0 && (
                    <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg w-fit">
                      <Camera className="w-3.5 h-3.5 text-slate-500" />
                      <span>{t.foto.length} Foto Terlampir</span>
                    </div>
                  )}

                  <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
                    {onPrintSurat && (
                      <button
                        onClick={() => onPrintSurat(t)}
                        className="flex-1 py-2 px-3 bg-rose-50 border border-rose-200 text-rose-800 font-extrabold rounded-xl hover:bg-rose-100 active:bg-rose-200 transition flex items-center justify-center gap-1.5 active:scale-95 touch-manipulation text-xs"
                      >
                        <Printer className="w-3.5 h-3.5 text-rose-600" />
                        <span>Cetak SP</span>
                      </button>
                    )}
                    <button
                      onClick={() => onOpenDetailTemuan(t)}
                      className="flex-1 py-2 px-3 bg-slate-900 text-white font-extrabold rounded-xl hover:bg-slate-800 active:bg-black transition flex items-center justify-center gap-1.5 active:scale-95 touch-manipulation text-xs shadow-xs"
                    >
                      <Eye className="w-3.5 h-3.5 text-blue-300" />
                      <span>Lihat Detail</span>
                    </button>
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
