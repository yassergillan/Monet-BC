import React from 'react';
import { X, Calendar, User, MapPin, Tag, FileText, Download, AlertCircle, CheckCircle, Printer } from 'lucide-react';
import { Pengajuan } from '../types';
import { formatDateIndo } from '../constants';

interface ModalDetailPengajuanProps {
  pengajuan: Pengajuan | null;
  onClose: () => void;
  onOpenImage: (url: string) => void;
  onPrintSurat?: (p: Pengajuan) => void;
}

export const ModalDetailPengajuan: React.FC<ModalDetailPengajuanProps> = ({
  pengajuan,
  onClose,
  onOpenImage,
  onPrintSurat,
}) => {
  if (!pengajuan) return null;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tglSelesai = new Date(pengajuan.tglSelesai);
  const selisihMs = tglSelesai.getTime() - today.getTime();
  const selisihHari = Math.ceil(selisihMs / (1000 * 60 * 60 * 24));
  const isExpired = selisihHari < 0;

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
          <FileText className="w-4 h-4" /> Detail Perizinan Renovasi
        </div>
        <h3 className="text-lg font-bold text-slate-900 pr-8">{pengajuan.izin}</h3>

        <div className="mt-3 p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-1.5">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-slate-400 shrink-0" />
            <span className="font-semibold text-slate-800">{pengajuan.nama}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
            <span>
              Tatar <strong className="text-slate-800">{pengajuan.tatar}</strong>, Blok{' '}
              <strong className="text-slate-800">{pengajuan.blok}</strong> (PIC: {pengajuan.pic})
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Tag className="w-4 h-4 text-slate-400 shrink-0" />
            <span>Kategori Utama: <strong className="text-slate-800">{pengajuan.kategoriTerberat}</strong></span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 my-4">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <div className="text-[11px] font-semibold text-slate-500 uppercase">Tgl Mulai</div>
            <div className="text-xs sm:text-sm font-bold text-slate-800 mt-0.5">
              {formatDateIndo(pengajuan.tglMulai)}
            </div>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <div className="text-[11px] font-semibold text-slate-500 uppercase">Tgl Selesai</div>
            <div className="text-xs sm:text-sm font-bold text-slate-800 mt-0.5">
              {formatDateIndo(pengajuan.tglSelesai)}
            </div>
          </div>
        </div>

        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between gap-2 mb-4">
          <div>
            <div className="text-xs text-slate-500 font-medium">Status Masa Berlaku Izin</div>
            <div className="text-xs font-bold mt-0.5 flex items-center gap-1.5">
              {isExpired ? (
                <>
                  <AlertCircle className="w-4 h-4 text-rose-500" />
                  <span className="text-rose-600">Kedaluwarsa (Lewat {Math.abs(selisihHari)} hari)</span>
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                  <span className="text-emerald-700">Aktif (Tersisa {selisihHari} hari lagi)</span>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="mb-4">
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Item Pekerjaan Terdaftar ({pengajuan.items.length})
          </h4>
          <div className="space-y-1.5">
            {pengajuan.items.map((it, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between text-xs p-2.5 bg-slate-50 rounded-lg border border-slate-200"
              >
                <span className="font-medium text-slate-800">{it.jenis}</span>
                <span className="text-slate-500 font-semibold bg-white px-2 py-0.5 rounded border border-slate-200">
                  {it.luas ? `${it.luas} m²` : 'Kategori ' + it.group}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Lampiran Desain / Berkas
          </h4>
          {pengajuan.gambar && pengajuan.gambar.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {pengajuan.gambar.map((g, idx) => (
                <div key={idx} className="relative group">
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
                      className="flex items-center gap-1 px-3 py-2 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg border border-slate-200 font-medium"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span className="truncate max-w-[120px]">{g.name}</span>
                    </a>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-xs text-slate-400 italic p-3 bg-slate-50 rounded-lg text-center border border-dashed border-slate-200">
              Tidak ada gambar / berkas dilampirkan.
            </div>
          )}
        </div>

        <div className="mt-6 pt-4 border-t border-slate-200 flex items-center justify-between gap-2">
          {onPrintSurat && (
            <button
              onClick={() => {
                onPrintSurat(pengajuan);
              }}
              className="px-4 py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs rounded-xl border border-blue-200 transition flex items-center gap-2 active:scale-95 cursor-pointer touch-manipulation"
            >
              <Printer className="w-4 h-4 text-blue-600" />
              <span>Cetak Surat Izin Resmi (SIPR)</span>
            </button>
          )}
          <button
            onClick={onClose}
            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition ml-auto"
          >
            Tutup Detail
          </button>
        </div>
      </div>
    </div>
  );
};
