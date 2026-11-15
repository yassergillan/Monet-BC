import React from 'react';
import { X, AlertTriangle, MapPin, User, Calendar, Printer } from 'lucide-react';
import { Temuan } from '../types';
import { formatDateIndo } from '../constants';

interface ModalDetailTemuanProps {
  temuan: Temuan | null;
  onClose: () => void;
  onOpenImage: (url: string) => void;
  onPrintSurat?: (t: Temuan) => void;
}

export const ModalDetailTemuan: React.FC<ModalDetailTemuanProps> = ({
  temuan,
  onClose,
  onOpenImage,
  onPrintSurat,
}) => {
  if (!temuan) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-5 sm:p-6 shadow-2xl border border-slate-200 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 text-rose-600 text-xs font-bold uppercase tracking-wider mb-1">
          <AlertTriangle className="w-4 h-4" /> Detail Temuan Lapangan
        </div>
        <h3 className="text-lg font-bold text-slate-900 pr-8">{temuan.id}</h3>

        <div className="mt-3 p-3 bg-rose-50/50 rounded-xl border border-rose-200/60 text-xs text-slate-700 space-y-2">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-rose-500 shrink-0" />
            <span>
              Tanggal Pelaporan: <strong>{formatDateIndo(temuan.tanggal)}</strong>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
            <span>
              Lokasi: Tatar <strong>{temuan.tatar}</strong>, Blok <strong>{temuan.blok}</strong>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-rose-500 shrink-0" />
            <span>
              PIC Penemu: <strong>{temuan.pic}</strong>
            </span>
          </div>
        </div>

        <div className="my-4">
          <span className="inline-block px-3 py-1 bg-rose-100 text-rose-800 font-bold text-xs rounded-full border border-rose-200">
            Kategori: {temuan.kategori}
          </span>
          <div className="mt-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Catatan Detail Pelanggaran
            </div>
            <p className="text-xs sm:text-sm text-slate-800 leading-relaxed">
              {temuan.keterangan || 'Tidak ada catatan keterangan tambahan.'}
            </p>
          </div>
        </div>

        <div>
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Bukti Foto Lapangan
          </h4>
          {temuan.foto && temuan.foto.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {temuan.foto.map((f, idx) => (
                <img
                  key={idx}
                  src={f.dataUrl}
                  alt="Foto Temuan"
                  onClick={() => onOpenImage(f.dataUrl)}
                  className="w-20 h-20 object-cover rounded-xl border border-slate-200 cursor-pointer hover:opacity-90 transition shadow-xs"
                />
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-400 italic p-3 bg-slate-50 rounded-lg text-center border border-dashed border-slate-200">
              Tidak ada bukti foto dilampirkan.
            </p>
          )}
        </div>

        <div className="mt-6 pt-4 border-t border-slate-200 flex items-center justify-between gap-2">
          {onPrintSurat && (
            <button
              onClick={() => onPrintSurat(temuan)}
              className="px-4 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs rounded-xl border border-rose-200 transition flex items-center gap-2 active:scale-95 cursor-pointer touch-manipulation"
            >
              <Printer className="w-4 h-4 text-rose-600" />
              <span>Cetak Surat Teguran (SP)</span>
            </button>
          )}
          <button
            onClick={onClose}
            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition ml-auto"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
