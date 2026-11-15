import React from 'react';
import { X } from 'lucide-react';

interface LightboxProps {
  src: string | null;
  onClose: () => void;
}

export const Lightbox: React.FC<LightboxProps> = ({ src, onClose }) => {
  if (!src) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200 cursor-zoom-out"
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-2.5 bg-slate-800/80 text-white rounded-full hover:bg-slate-700 transition"
      >
        <X className="w-6 h-6" />
      </button>
      <img
        src={src}
        alt="Foto Lapangan Full Preview"
        className="max-w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl border border-slate-700"
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  );
};
