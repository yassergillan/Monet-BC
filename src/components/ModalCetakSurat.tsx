import React from 'react';
import { X, Printer, Download, FileText, AlertTriangle, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { Pengajuan, Temuan } from '../types';
import { formatDateIndo } from '../constants';

interface ModalCetakSuratProps {
  pengajuan?: Pengajuan | null;
  temuan?: Temuan | null;
  onClose: () => void;
}

// Logo SVG Kota Baru Parahyangan & Lyman Property
export const KbpLogoHeader: React.FC = () => (
  <div className="flex items-start justify-between pb-4 border-b-2 border-slate-900 mb-6">
    {/* Lyman Property & Company Info */}
    <div className="flex items-start gap-3">
      <div className="flex flex-col items-start">
        <div className="flex items-center gap-1.5">
          <div className="w-5 h-5 bg-emerald-600 rounded-xs flex items-center justify-center text-white font-black text-xs">
            L
          </div>
          <span className="font-black tracking-tight text-slate-900 text-sm font-sans">
            LYMAN <span className="text-emerald-700 font-normal">Property</span>
          </span>
        </div>
        <div className="mt-1 text-left">
          <div className="font-extrabold text-[12px] text-slate-900 uppercase tracking-tight">
            PT BELA PARAHYANGAN INVESTINDO
          </div>
          <div className="text-[10px] text-slate-600 font-medium">
            Town Management &amp; Estate Regulation
          </div>
        </div>
      </div>
    </div>

    {/* Kota Baru Parahyangan Badge Logo */}
    <div className="text-right flex flex-col items-end">
      <div className="flex items-center gap-2 bg-gradient-to-r from-emerald-800 to-teal-900 text-white px-3 py-1.5 rounded-lg shadow-xs">
        <div className="w-6 h-6 rounded bg-amber-400 text-emerald-950 font-black text-[10px] flex items-center justify-center border border-amber-300">
          KBP
        </div>
        <div className="text-left">
          <div className="text-[11px] font-black uppercase tracking-wider text-amber-300 leading-none">
            KOTA BARU
          </div>
          <div className="text-[9px] font-bold tracking-widest text-emerald-100 leading-tight">
            PARAHYANGAN
          </div>
        </div>
      </div>
      <span className="text-[9px] text-slate-400 font-mono mt-1 uppercase tracking-wider">
        Mandiri &bull; Utama &bull; Widyadaha
      </span>
    </div>
  </div>
);

export const KbpFooter: React.FC = () => (
  <div className="mt-8 pt-3 border-t border-slate-300 text-[9.5px] text-slate-500 font-sans flex flex-col sm:flex-row justify-between items-start sm:items-end gap-2">
    <div>
      <div className="font-bold text-slate-800 text-[10px] uppercase">PT BELA PARAHYANGAN INVESTINDO</div>
      <div>Bumi Indraprasta - Home &amp; Living Center</div>
      <div>Jl. Panyawangan Kav. 6-B No. 6, Kota Baru Parahyangan, Padalarang, Bandung 40553, Indonesia</div>
    </div>
    <div className="sm:text-right">
      <div>Telp. (62-22) 680 3777, 680 3888, 680 3333 Ext. 219</div>
      <div className="font-semibold text-emerald-700">www.kotabaruparahyangan.com</div>
    </div>
  </div>
);

export const ModalCetakSurat: React.FC<ModalCetakSuratProps> = ({
  pengajuan,
  temuan,
  onClose,
}) => {
  if (!pengajuan && !temuan) return null;

  const todayDate = new Date();
  const todayStr = formatDateIndo(todayDate.toISOString().split('T')[0]);
  const monthRoman = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'][todayDate.getMonth()];
  const refNo = pengajuan
    ? `${(pengajuan.izin || '001').replace(/[^0-9]/g, '')}/BP/TOM-BC/${monthRoman}/${todayDate.getFullYear()}`
    : `${(temuan?.id || '001').replace(/[^0-9]/g, '')}/BP/TOM-SP/${monthRoman}/${todayDate.getFullYear()}`;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadHTML = () => {
    const printEl = document.getElementById('printable-surat');
    if (!printEl) return;

    const fullHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Surat Resmi KBP - ${refNo}</title>
        <style>
          body { font-family: sans-serif; padding: 30px; color: #1e293b; max-width: 800px; margin: 0 auto; }
          .border-b-2 { border-bottom: 2px solid #0f172a; }
          .font-bold { font-weight: bold; }
          .text-center { text-align: center; }
          .table-bordered { width: 100%; border-collapse: collapse; margin-top: 10px; }
          .table-bordered th, .table-bordered td { border: 1px solid #cbd5e1; padding: 6px 10px; font-size: 12px; }
        </style>
      </head>
      <body>
        ${printEl.innerHTML}
      </body>
      </html>
    `;

    const blob = new Blob([fullHtml], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = pengajuan ? `Surat_Izin_SIPR_${pengajuan.izin}.html` : `Surat_Teguran_SP_${temuan?.id}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[96vh] overflow-y-auto p-4 sm:p-8 shadow-2xl border border-slate-200 relative flex flex-col justify-between">
        {/* Header Control Buttons (Screen Only) */}
        <div className="flex flex-wrap items-center justify-between pb-4 border-b border-slate-200 print:hidden mb-4 gap-2">
          <div className="flex items-center gap-2 font-bold text-slate-800 text-sm">
            {pengajuan ? (
              <>
                <FileText className="w-5 h-5 text-emerald-600" />
                <span>Pratinjau Surat Resmi Izin Renovasi (SIPR)</span>
              </>
            ) : (
              <>
                <AlertTriangle className="w-5 h-5 text-rose-600" />
                <span>Pratinjau Surat Teguran Pelanggaran (SP)</span>
              </>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadHTML}
              className="px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-xs rounded-xl border border-emerald-200 transition flex items-center gap-1.5 active:scale-95 cursor-pointer touch-manipulation"
              title="Download File HTML Surat"
            >
              <Download className="w-4 h-4 text-emerald-600" />
              <span>Download File</span>
            </button>
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center gap-2 active:scale-95 cursor-pointer touch-manipulation"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak / Download PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Official Letter (Styled after KBP Scan Document) */}
        <div id="printable-surat" className="bg-white text-slate-900 font-sans p-2 sm:p-6 print:p-0">
          {/* Header Kop Surat KBP */}
          <KbpLogoHeader />

          {/* Document Reference Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 text-xs text-slate-800 mb-6 gap-2">
            <div className="space-y-1">
              <div className="flex gap-2">
                <span className="w-20 font-bold text-slate-600">Ref No.</span>
                <span className="font-mono font-bold">: {refNo}</span>
              </div>
              <div className="flex gap-2">
                <span className="w-20 font-bold text-slate-600">Lamp.</span>
                <span>: 2 (Dua) Lembar</span>
              </div>
              <div className="flex gap-2">
                <span className="w-20 font-bold text-slate-600">Perihal</span>
                <span className="font-bold text-slate-900">
                  : {pengajuan ? `Izin Pelaksanaan Renovasi Hunian` : `Renovasi Penambahan Tanpa Izin`}
                </span>
              </div>
            </div>

            <div className="sm:text-right space-y-0.5 font-sans">
              <div className="font-medium text-slate-600">Padalarang, {todayStr}</div>
              <div className="font-bold text-slate-800 mt-2">Kepada Yth.</div>
              <div className="font-extrabold text-slate-900">
                Bapak/Ibu {pengajuan ? pengajuan.nama : 'Pemilik Unit / Penanggung Jawab'}
              </div>
              <div className="text-slate-700">
                Tatar {pengajuan ? pengajuan.tatar : temuan?.tatar}, No. {pengajuan ? pengajuan.blok : temuan?.blok}
              </div>
              <div className="text-slate-700 font-semibold">Kota Baru Parahyangan</div>
              <div className="text-slate-500 text-[11px]">Padalarang, Kab. Bandung Barat</div>
            </div>
          </div>

          {/* Letter Body - Pengajuan (SIPR) */}
          {pengajuan && (
            <div className="space-y-4 text-xs text-slate-800 leading-relaxed">
              <p className="font-medium">Dengan hormat,</p>
              <p>
                Sehubungan dengan permohonan dan berkas pengajuan renovasi/penambahan ruang yang diajukan untuk hunian Bapak/Ibu di <strong>Tatar {pengajuan.tatar} No. {pengajuan.blok}</strong>, Kota Baru Parahyangan, bersama ini Town Management menyampaikan <strong>Persetujuan Surat Izin Pelaksanaan Renovasi (SIPR)</strong> dengan rincian berikut:
              </p>

              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs space-y-1.5 print:bg-white print:border-slate-300">
                <div className="grid grid-cols-3">
                  <span className="text-slate-500 font-medium">Nomor Perizinan</span>
                  <span className="col-span-2 font-mono font-bold text-slate-900">: {pengajuan.izin}</span>
                </div>
                <div className="grid grid-cols-3">
                  <span className="text-slate-500 font-medium">PIC Pengawas KBP</span>
                  <span className="col-span-2 font-bold text-slate-900">: {pengajuan.pic}</span>
                </div>
                <div className="grid grid-cols-3">
                  <span className="text-slate-500 font-medium">Masa Berlaku Izin</span>
                  <span className="col-span-2 font-bold text-emerald-700">
                    : {formatDateIndo(pengajuan.tglMulai)} s.d. {formatDateIndo(pengajuan.tglSelesai)}
                  </span>
                </div>
                <div className="grid grid-cols-3">
                  <span className="text-slate-500 font-medium">Kategori Terberat</span>
                  <span className="col-span-2 font-bold text-blue-700">: Golongan {pengajuan.kategoriTerberat}</span>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 mb-1.5 uppercase tracking-wider text-[11px]">
                  Rincian Pekerjaan Disetujui:
                </h4>
                <table className="w-full text-xs border-collapse border border-slate-300">
                  <thead>
                    <tr className="bg-slate-100 text-slate-800 font-bold print:bg-slate-200">
                      <th className="border border-slate-300 p-2 text-center w-10">No</th>
                      <th className="border border-slate-300 p-2 text-left">Jenis Pekerjaan</th>
                      <th className="border border-slate-300 p-2 text-center">Volume / Luas</th>
                      <th className="border border-slate-300 p-2 text-center">Golongan Risk</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pengajuan.items.map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="border border-slate-300 p-2 text-center">{idx + 1}</td>
                        <td className="border border-slate-300 p-2 font-medium">{item.jenis}</td>
                        <td className="border border-slate-300 p-2 text-center">{item.luas ? `${item.luas} m²` : '-'}</td>
                        <td className="border border-slate-300 p-2 text-center font-bold text-slate-700">Gol. {item.group}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="bg-emerald-50/70 p-3 rounded-xl border border-emerald-200 text-[11px] text-emerald-950 space-y-1 print:bg-white print:border-slate-300">
                <span className="font-bold block text-emerald-900">Ketentuan &amp; Tata Tertib Estate Regulation:</span>
                <ol className="list-decimal pl-4 space-y-0.5">
                  <li>Jam kerja operasional kontraktor: Senin–Sabtu pkl 08.00–17.00 WIB (Minggu &amp; Libur Nasional dilarang ada aktivitas bising).</li>
                  <li>Material dan puing bekas bangunan dilarang keras menutupi fasilitas umum/RoW jalan warga.</li>
                  <li>Pengawasan berkala akan dilaksanakan oleh Inspector PIC KBP secara periodik.</li>
                </ol>
              </div>

              <p>
                Untuk informasi dan koordinasi lebih lanjut, mohon dapat menghubungi kantor Building Control Town Management KBP di <strong>Building Control Center, Jl. Panyawangan Kav. 6-B No. 6, Telp. 022-6803333 Ext. 219 (Panji)</strong>.
              </p>
              <p>Demikian kami sampaikan, atas perhatian dan kerjasamanya kami ucapkan terima kasih.</p>
            </div>
          )}

          {/* Letter Body - Temuan (SP) */}
          {temuan && (
            <div className="space-y-4 text-xs text-slate-800 leading-relaxed">
              <p className="font-medium">Dengan hormat,</p>
              <p>
                Sehubungan dengan kegiatan inspeksi pengawasan lingkungan yang dilakukan oleh tim Town Management Kota Baru Parahyangan (TOM KBP) di area <strong>Tatar {temuan.tatar} No. {temuan.blok}</strong> pada tanggal <strong>{formatDateIndo(temuan.tanggal.split('T')[0])}</strong>, bersama ini kami sampaikan hal-hal sebagai berikut:
              </p>

              <div className="bg-rose-50 p-3.5 rounded-xl border border-rose-200 text-xs space-y-1.5 print:bg-white print:border-slate-300">
                <div className="grid grid-cols-3">
                  <span className="text-slate-500 font-medium">Kategori Pelanggaran</span>
                  <span className="col-span-2 font-bold text-rose-700">: {temuan.kategori}</span>
                </div>
                <div className="grid grid-cols-3">
                  <span className="text-slate-500 font-medium">Petugas Inspector KBP</span>
                  <span className="col-span-2 font-bold text-slate-900">: {temuan.pic}</span>
                </div>
                <div className="grid grid-cols-3">
                  <span className="text-slate-500 font-medium">Catatan / Detail Temuan</span>
                  <span className="col-span-2 font-medium italic text-slate-800">"{temuan.keterangan}"</span>
                </div>
              </div>

              <div className="bg-amber-50 p-3 rounded-xl border border-amber-200 text-[11px] text-amber-950 space-y-1 print:bg-white">
                <span className="font-bold block text-amber-900">Peringatan &amp; Tindak Lanjut Resmi:</span>
                <p>
                  Oleh karena itu, kami mohon untuk <strong>menghentikan sementara kegiatan renovasi</strong> / merapikan material / mengurus perizinan resmi Persetujuan Bangunan Gedung (PBG) dan Surat Izin Pelaksanaan Renovasi (SIPR) ke Kantor Town Management KBP paling lambat <strong>3 (tiga) hari kerja</strong> sejak diterbitkannya surat ini.
                </p>
              </div>

              <p>
                Untuk keterangan dan penjelasan teknis lebih lanjut, Bapak/Ibu dapat menghubungi Building Control Town Management di <strong>Jl. Panyawangan Kav. 6-B No. 6, Telp 022-6803333 Ext. 219 (Panji)</strong>.
              </p>
              <p>Demikian kami sampaikan, atas perhatian dan kerjasamanya kami ucapkan terima kasih.</p>
            </div>
          )}

          {/* Signatures & Stamps Block (Matching Image Scan) */}
          <div className="mt-8 pt-4 border-t border-slate-300 grid grid-cols-2 text-xs text-slate-800 gap-4 relative">
            {/* Stamp Overlay */}
            <div className="absolute right-12 top-6 opacity-80 pointer-events-none print:opacity-100">
              <div className="w-24 h-24 rounded-full border-4 border-blue-700/70 p-1 flex items-center justify-center text-center rotate-[-12deg]">
                <div className="w-full h-full rounded-full border border-dashed border-blue-700/70 flex flex-col items-center justify-center text-[7.5px] font-black text-blue-800 leading-tight uppercase px-1">
                  <span>PT BELA PARAHYANGAN</span>
                  <span className="text-[6px] text-blue-600 font-normal">INVESTINDO</span>
                  <CheckCircle2 className="w-4 h-4 text-blue-700 my-0.5" />
                  <span>TOWN MANAGEMENT</span>
                </div>
              </div>
            </div>

            {/* Left Signature Block */}
            <div className="space-y-1">
              <div className="font-bold text-slate-700">Hormat kami,</div>
              <div className="font-extrabold text-slate-900">PT Bela Parahyangan Investindo</div>
              <div className="h-16 flex items-end">
                <span className="font-serif italic text-slate-400 text-sm border-b border-slate-400 pb-0.5">
                  Enda Fitri
                </span>
              </div>
              <div className="font-bold text-slate-900 underline">Enda Fitri</div>
              <div className="text-[10px] text-slate-600">Estate Manager Town Management</div>

              <div className="mt-4 pt-2 text-[9px] text-slate-500 space-y-0.5 font-mono">
                <div className="font-bold text-slate-700">CC / Tembusan:</div>
                <div>1. TOM / File Archive</div>
                <div>2. Security Kota Baru Parahyangan</div>
                <div>3. Kontraktor / Pelaksana Renovasi</div>
              </div>
            </div>

            {/* Right Signature / Stamp info */}
            <div className="text-right space-y-1 flex flex-col justify-between">
              <div>
                <div className="text-[10px] text-slate-500">Document Security Code</div>
                <div className="font-mono font-bold text-[10px] text-slate-700">
                  VERIFIED-KBP-{refNo.replace(/[^A-Z0-9]/g, '')}
                </div>
              </div>

              <div className="pt-8">
                <div className="inline-block px-3 py-1 bg-emerald-50 border border-emerald-300 text-emerald-800 text-[10px] font-bold rounded-lg uppercase tracking-wider">
                  ✓ Official Digital Stamp
                </div>
              </div>
            </div>
          </div>

          {/* Kop Footer */}
          <KbpFooter />
        </div>

        {/* Modal Footer Actions (Screen only) */}
        <div className="mt-6 pt-4 border-t border-slate-200 flex items-center justify-between gap-2 print:hidden">
          <button
            onClick={handleDownloadHTML}
            className="px-4 py-2.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-700 font-bold text-xs rounded-xl transition flex items-center gap-1.5 active:scale-95 cursor-pointer touch-manipulation"
          >
            <Download className="w-4 h-4 text-emerald-600" />
            <span>Download Surat (.html)</span>
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition"
            >
              Tutup
            </button>
            <button
              onClick={handlePrint}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center gap-2"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak / Download PDF</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
