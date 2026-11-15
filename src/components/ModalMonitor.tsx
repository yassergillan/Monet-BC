import React, { useState, useEffect } from 'react';
import { X, Camera, AlertOctagon, MessageSquare, Check, Layers } from 'lucide-react';
import { Jadwal, Pengajuan, KepatuhanStatus } from '../types';
import { STAGE_OPTIONS, KategoriPategoriGroup } from '../constants';
import { convertFilesToDataUrls } from '../utils/storage';

interface ModalMonitorProps {
  jadwal: Jadwal | null;
  pengajuan: Pengajuan | null;
  onClose: () => void;
  onSave: (
    jadwalId: string,
    hasil: {
      progress: string;
      status: KepatuhanStatus;
      kategoriPelanggaran: string[];
      catatan: string;
      komplainTetangga: 'Tidak Ada' | 'Ya - Biasa' | 'Ya - Perlu Penanganan Segera';
      komplainDetail?: string;
      foto: Array<{ name: string; type: string; dataUrl: string }>;
      waktuInput: string;
    }
  ) => Promise<void>;
  onShowToast: (msg: string) => void;
}

export const ModalMonitor: React.FC<ModalMonitorProps> = ({
  jadwal,
  pengajuan,
  onClose,
  onSave,
  onShowToast,
}) => {
  const [selectedStage, setSelectedStage] = useState('');
  const [freetextStage, setFreetextStage] = useState('');
  const [status, setStatus] = useState<KepatuhanStatus>('Sesuai');
  const [kategoriPelanggaran, setKategoriPelanggaran] = useState<string[]>([]);
  const [catatan, setCatatan] = useState('');
  const [komplainTetangga, setKomplainTetangga] = useState<'Tidak Ada' | 'Ya - Biasa' | 'Ya - Perlu Penanganan Segera'>('Tidak Ada');
  const [komplainDetail, setKomplainDetail] = useState('');
  const [fotoFiles, setFotoFiles] = useState<FileList | null>(null);
  const [fotoPreviews, setFotoPreviews] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const kategori: KategoriPategoriGroup = pengajuan?.kategoriTerberat || 'Kecil';
  const stageList = STAGE_OPTIONS[kategori] || STAGE_OPTIONS['Kecil'];

  useEffect(() => {
    if (jadwal) {
      setSelectedStage(stageList[0] || '');
      setFreetextStage('');
      setStatus('Sesuai');
      setKategoriPelanggaran([]);
      setCatatan('');
      setKomplainTetangga('Tidak Ada');
      setKomplainDetail('');
      setFotoFiles(null);
      setFotoPreviews([]);
    }
  }, [jadwal]);

  if (!jadwal) return null;

  const handlePelanggaranToggle = (val: string) => {
    setKategoriPelanggaran((prev) =>
      prev.includes(val) ? prev.filter((x) => x !== val) : [...prev, val]
    );
  };

  const handleFotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFotoFiles(e.target.files);
      const converted = await convertFilesToDataUrls(e.target.files);
      setFotoPreviews(converted.map((c) => c.dataUrl));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let progressText = selectedStage || 'Tahap Pengerjaan Berlangsung';
      if (freetextStage.trim()) {
        progressText += ` (${freetextStage.trim()})`;
      }

      let convertedPhotos: Array<{ name: string; type: string; dataUrl: string }> = [];
      if (fotoFiles) {
        convertedPhotos = await convertFilesToDataUrls(fotoFiles);
      }

      const finalPelanggaran = status !== 'Sesuai' && kategoriPelanggaran.length > 0
        ? kategoriPelanggaran
        : ['Tidak Ada'];

      await onSave(jadwal.id, {
        progress: progressText,
        status,
        kategoriPelanggaran: finalPelanggaran,
        catatan: catatan.trim(),
        komplainTetangga,
        komplainDetail: komplainTetangga !== 'Tidak Ada' ? komplainDetail.trim() : '',
        foto: convertedPhotos,
        waktuInput: new Date().toISOString(),
      });

      onShowToast(`Hasil monitoring ${jadwal.id} berhasil disimpan!`);
      onClose();
    } catch (err) {
      console.error(err);
      onShowToast('Gagal menyimpan hasil monitoring.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const pelanggaranOptions = [
    'Izin Kadaluarsa',
    'Melebihi GSB',
    'Melebihi KDB',
    'Tinggi Melebihi Ketentuan',
    'Menutup RoW',
    'Beda dari Gambar Disetujui',
    'Lainnya',
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-5 sm:p-6 shadow-2xl border border-slate-200 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 text-blue-600 text-xs font-bold uppercase tracking-wider mb-1">
          <Layers className="w-4 h-4" /> Input Hasil Monitoring Inspeksi
        </div>
        <h3 className="text-lg font-bold text-slate-900">
          {jadwal.id} &middot; {jadwal.tatar} {jadwal.blok}
        </h3>
        <p className="text-xs text-slate-500 font-medium mt-0.5">
          No. Izin: <strong className="text-slate-700">{jadwal.izin}</strong> | Fase &amp; Rutinan: {jadwal.tahapLabel}
        </p>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
              Fase Konstruksi &amp; Rutinan Saat Ini
            </label>
            <select
              value={selectedStage}
              onChange={(e) => setSelectedStage(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            >
              {stageList.map((stg) => (
                <option key={stg} value={stg}>
                  {stg}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
              Keterangan Progress Detail (Opsional)
            </label>
            <input
              type="text"
              value={freetextStage}
              onChange={(e) => setFreetextStage(e.target.value)}
              placeholder="Contoh: Sedang pasang keramik lantai 2..."
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
              Status Kepatuhan Ketentuan KBP
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as KepatuhanStatus)}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            >
              <option value="Sesuai">Sesuai (Kategori Aman)</option>
              <option value="Deviasi Ringan">Deviasi Ringan (Peringatan)</option>
              <option value="Deviasi Berat">Deviasi Berat (Stop Kerja)</option>
            </select>
          </div>

          {status !== 'Sesuai' && (
            <div className="p-3 bg-amber-50/80 border border-amber-200 rounded-xl space-y-2">
              <label className="flex items-center gap-1.5 text-xs font-bold text-amber-900 uppercase tracking-wider">
                <AlertOctagon className="w-4 h-4 text-amber-600" />
                Pilih Kategori Pelanggaran:
              </label>
              <div className="grid grid-cols-2 gap-2 pt-1">
                {pelanggaranOptions.map((opt) => {
                  const isChecked = kategoriPelanggaran.includes(opt);
                  return (
                    <label
                      key={opt}
                      onClick={() => handlePelanggaranToggle(opt)}
                      className={`flex items-center gap-2 p-2 rounded-lg text-xs font-medium cursor-pointer transition select-none ${
                        isChecked
                          ? 'bg-amber-200/70 text-amber-950 font-bold border border-amber-300'
                          : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {}}
                        className="rounded text-amber-600 focus:ring-amber-500 w-4 h-4"
                      />
                      <span>{opt}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
              Catatan Inspeksi Lapangan
            </label>
            <textarea
              rows={3}
              value={catatan}
              onChange={(e) => setCatatan(e.target.value)}
              placeholder="Catat kondisi material, pekerja, kebersihan RoW, atau instruksi petugas..."
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
            <label className="flex items-center gap-1.5 text-xs font-bold text-slate-800 uppercase tracking-wider">
              <MessageSquare className="w-4 h-4 text-blue-600" />
              Komplain / Keluhan Tetangga
            </label>
            <select
              value={komplainTetangga}
              onChange={(e) =>
                setKomplainTetangga(
                  e.target.value as 'Tidak Ada' | 'Ya - Biasa' | 'Ya - Perlu Penanganan Segera'
                )
              }
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="Tidak Ada">Tidak Ada Komplain</option>
              <option value="Ya - Biasa">Ya - Komplain Biasa (Debu/Bising)</option>
              <option value="Ya - Perlu Penanganan Segera">Ya - Perlu Penanganan Segera</option>
            </select>

            {komplainTetangga !== 'Tidak Ada' && (
              <div className="pt-2">
                <input
                  type="text"
                  value={komplainDetail}
                  onChange={(e) => setKomplainDetail(e.target.value)}
                  placeholder="Nama pelapor & detail keluhan..."
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
              Lampirkan Bukti Foto Lapangan
            </label>
            <div className="grid grid-cols-2 gap-2">
              <label className="flex items-center justify-center gap-1.5 p-3 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-xl text-xs font-bold text-blue-700 cursor-pointer transition touch-manipulation active:scale-95">
                <Camera className="w-4 h-4 text-blue-600" />
                <span>Ambil Foto (Kamera)</span>
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  multiple
                  onChange={handleFotoChange}
                  className="hidden"
                />
              </label>
              <label className="flex items-center justify-center gap-1.5 p-3 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 cursor-pointer transition touch-manipulation active:scale-95">
                <Camera className="w-4 h-4 text-slate-600" />
                <span>Pilih dari Galeri</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFotoChange}
                  className="hidden"
                />
              </label>
            </div>

            {fotoPreviews.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2.5 p-2 bg-slate-50 border border-slate-200 rounded-xl">
                {fotoPreviews.map((src, idx) => (
                  <img
                    key={idx}
                    src={src}
                    alt="Preview"
                    className="w-14 h-14 object-cover rounded-lg border border-slate-200 shadow-xs"
                  />
                ))}
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-slate-200 flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>{isSubmitting ? 'Memproses...' : 'Simpan Hasil'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
