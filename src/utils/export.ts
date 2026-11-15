import { Pengajuan, Jadwal, Temuan } from '../types';

export function exportPengajuanCSV(data: Pengajuan[]) {
  const headers = ['No. Izin', 'Nama Pemohon', 'Tatar/Cluster', 'Blok/Unit', 'PIC', 'Tgl Mulai', 'Tgl Selesai', 'Kategori Terberat', 'Daftar Pekerjaan'];
  const rows = data.map((item) => [
    `"${item.izin}"`,
    `"${item.nama}"`,
    `"${item.tatar}"`,
    `"${item.blok}"`,
    `"${item.pic}"`,
    `"${item.tglMulai}"`,
    `"${item.tglSelesai}"`,
    `"${item.kategoriTerberat}"`,
    `"${(item.items || []).map((p) => `${p.jenis} (${p.luas})`).join('; ')}"`,
  ]);

  const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `Rekap_Pengajuan_Renovasi_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function exportJadwalCSV(data: Jadwal[]) {
  const headers = ['ID Jadwal', 'No. Izin', 'Tatar/Cluster', 'Blok/Unit', 'PIC', 'Fase Konstruksi', 'Rutinan Inspeksi', 'Tanggal Inspeksi', 'Status Monitoring', 'Hasil Monitoring'];
  const rows = data.map((item) => [
    `"${item.id}"`,
    `"${item.izin}"`,
    `"${item.tatar}"`,
    `"${item.blok}"`,
    `"${item.pic}"`,
    `"${item.hasil?.progress || 'Belum Monitoring'}"`,
    `"${item.tahapLabel}"`,
    `"${item.tanggal.split('T')[0]}"`,
    `"${item.status}"`,
    `"${item.hasil ? `${item.hasil.status} - ${item.hasil.catatan}` : 'Belum Diperiksa'}"`,
  ]);

  const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `Rekap_Jadwal_Monitoring_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function exportTemuanCSV(data: Temuan[]) {
  const headers = ['ID Temuan', 'Tanggal', 'Tatar/Cluster', 'Blok/Unit', 'PIC Pelapor', 'Kategori Pelanggaran', 'Keterangan'];
  const rows = data.map((item) => [
    `"${item.id}"`,
    `"${item.tanggal.split('T')[0]}"`,
    `"${item.tatar}"`,
    `"${item.blok}"`,
    `"${item.pic}"`,
    `"${item.kategori}"`,
    `"${item.keterangan.replace(/"/g, '""')}"`,
  ]);

  const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `Rekap_Temuan_Renovasi_Tanpa_Izin_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
