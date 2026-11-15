import React from 'react';
import { X, Eye, FileText, Download, AlertTriangle, Image as ImageIcon } from 'lucide-react';
import { Pengajuan, Jadwal } from '../types';

interface ModalReviewProps {
  pengajuan: Pengajuan | null;
  jadwal: Jadwal | null;
  onClose: () => void;
  onOpenImage: (url: string) => void;
}

export const ModalReview: React.FC<ModalReviewProps> = ({
  pengajuan,
  jadwal,
  onClose,
  onOpenImage,
}) => {
  if (!pengajuan) return null;

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
          <Eye className="w-4 h-4" /> Tinjau Referensi & Rekam Jejak
        </div>
        <h3 className="text-lg font-bold text-slate-900 pr-8">
          {pengajuan.izin} &middot; {pengajuan.nama}
        </h3>
        <p className="text-xs text-slate-500 font-medium">
          Tatar <strong className="text-slate-800">{pengajuan.tatar}</strong>, Blok{' '}
          <strong className="text-slate-800">{pengajuan.blok}</strong> | Pekerjaan: {pengajuan.jenis}
        </p>

        <div className="mt-4 space-y-4">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <ImageIcon className="w-4 h-4 text-blue-600" /> Gambar Desain Disetujui
            </h4>
            {pengajuan.gambar && pengajuan.gambar.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {pengajuan.gambar.map((g, idx) => (
                  <div key={idx}>
                    {g.type.includes('image') ? (
                      <img
                        src={g.dataUrl}
                        alt={g.name}
                        onClick={() => onOpenImage(g.dataUrl)}
                        className="w-16 h-16 object-cover rounded-lg border border-slate-200 cursor-pointer hover:opacity-90 transition"
                      />
                    ) : (
                      <a
                        href={g.dataUrl}
                        download={g.name}
                        className="flex items-center gap-1 px-3 py-2 text-xs bg-white text-slate-700 rounded-lg border border-slate-200 font-medium"
                      >
                        <Download className="w-3.5 h-3.5 text-blue-600" />
                        <span className="truncate max-w-[120px]">{g.name}</span>
                      </a>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic">Belum ada lampiran gambar awal.</p>
            )}
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-emerald-600" /> Bukti Foto Monitoring Terakhir
            </h4>
            {jadwal && jadwal.hasil && jadwal.hasil.foto && jadwal.hasil.foto.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {jadwal.hasil.foto.map((f, idx) => (
                  <img
                    key={idx}
                    src={f.dataUrl}
                    alt="Foto Monitoring"
                    onClick={() => onOpenImage(f.dataUrl)}
                    className="w-16 h-16 object-cover rounded-lg border border-slate-200 cursor-pointer hover:opacity-90 transition"
                  />
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic">Belum ada bukti foto monitoring tersimpan.</p>
            )}
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-500" /> Komplain Tetangga Terakhir
            </h4>
            {jadwal && jadwal.hasil && jadwal.hasil.komplainTetangga !== 'Tidak Ada' ? (
              <div className="text-xs text-slate-700 bg-amber-50/80 p-2.5 rounded-lg border border-amber-200 mt-2">
                <div className="font-bold text-amber-900">{jadwal.hasil.komplainTetangga}</div>
                {jadwal.hasil.komplainDetail && (
                  <p className="mt-1 text-slate-600">{jadwal.hasil.komplainDetail}</p>
                )}
              </div>
            ) : (
              <p className="text-xs text-slate-500 italic mt-1">Tidak ada catatan komplain tetangga.</p>
            )}
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-200">
          <button
            onClick={onClose}
            className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition"
          >
            Tutup Refensi
          </button>
        </div>
      </div>
    </div>
  );
};
