import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, Save } from 'lucide-react';
import { Jadwal } from '../types';
import { formatDateIndo } from '../constants';

interface ModalRescheduleProps {
  jadwal: Jadwal | null;
  onClose: () => void;
  onSave: (jadwalId: string, newDate: string, newCatatan: string) => void;
}

export const ModalReschedule: React.FC<ModalRescheduleProps> = ({
  jadwal,
  onClose,
  onSave,
}) => {
  const [newDate, setNewDate] = useState('');
  const [newCatatan, setNewCatatan] = useState('');

  useEffect(() => {
    if (jadwal) {
      setNewDate(jadwal.tglRencana);
      setNewCatatan(jadwal.catatan);
    }
  }, [jadwal]);

  if (!jadwal) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDate) return;
    onSave(jadwal.id, newDate, newCatatan.trim());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-5 sm:p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2 text-amber-600 font-bold text-sm">
            <Calendar className="w-5 h-5 text-amber-500" />
            <span>Reschedule Jadwal Monitoring</span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div className="bg-amber-50/70 border border-amber-200/70 p-3 rounded-xl text-xs text-amber-900 space-y-1">
            <div className="font-bold flex items-center justify-between">
              <span>{jadwal.id} &bull; {jadwal.tatar} ({jadwal.blok})</span>
              <span className="text-[10px] bg-amber-200/60 text-amber-800 px-2 py-0.5 rounded-full font-bold">
                PIC: {jadwal.pic}
              </span>
            </div>
            <div className="text-amber-700">Tahap: {jadwal.catatan}</div>
            <div className="text-slate-600">Tgl Semula: {formatDateIndo(jadwal.tglRencana)}</div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
              Tanggal Monitoring Baru
            </label>
            <div className="relative">
              <input
                type="date"
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                required
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500/20"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
              Catatan / Alasan Penjadwalan Ulang
            </label>
            <textarea
              rows={3}
              value={newCatatan}
              onChange={(e) => setNewCatatan(e.target.value)}
              placeholder="Contoh: Permintaan pemilik unit untuk diundur 3 hari karena kendala cuaca..."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
            ></textarea>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-xs flex items-center gap-1.5 transition active:scale-95 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              Simpan Jadwal Baru
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
