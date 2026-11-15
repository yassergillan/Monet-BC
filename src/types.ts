export type KategoriPekerjaan = 'Kecil' | 'Besar' | 'Kavling';

export interface PekerjaanItem {
  jenis: string;
  luas: string;
  group: KategoriPategoriGroup;
}

export type KategoriPategoriGroup = 'Kecil' | 'Besar' | 'Kavling';

export interface FileItem {
  name: string;
  type: string;
  dataUrl: string;
}

export interface Pengajuan {
  izin: string;
  nama: string;
  tatar: string;
  blok: string;
  pic: string;
  items: PekerjaanItem[];
  jenis: string;
  kategoriTerberat: KategoriPategoriGroup;
  tglMulai: string;
  tglSelesai: string;
  gambar: FileItem[];
  createdAt: string;
}

export type JadwalStatus = 'Terjadwal' | 'Selesai' | 'Terlewat';

export type KepatuhanStatus = 'Sesuai' | 'Deviasi Ringan' | 'Deviasi Berat';

export interface HasilMonitoring {
  progress: string;
  status: KepatuhanStatus;
  kategoriPelanggaran: string[];
  catatan: string;
  komplainTetangga: 'Tidak Ada' | 'Ya - Biasa' | 'Ya - Perlu Penanganan Segera';
  komplainDetail?: string;
  foto: FileItem[];
  waktuInput: string;
}

export interface Jadwal {
  id: string;
  izin: string;
  tatar: string;
  blok: string;
  pic: string;
  jenis: string;
  tahapLabel: string;
  tanggal: string; // ISO date string
  status: JadwalStatus;
  hasil?: HasilMonitoring | null;
}

export interface Temuan {
  id: string;
  tanggal: string; // ISO date string
  tatar: string;
  blok: string;
  pic: string;
  kategori:
    | 'Renovasi Tanpa Izin'
    | 'Izin Kadaluarsa'
    | 'Material Menutup RoW'
    | 'Pelanggaran Batas GSB/KDB'
    | 'Kerusakan Fasum / Lingkungan'
    | 'Lainnya';
  keterangan: string;
  foto: FileItem[];
}

export type UserRole = 'HEAD_MANAGER' | 'STAFF_BC';

export interface UserAccount {
  id: string;
  username: string;
  password?: string;
  name: string;
  role: UserRole;
  roleTitle: string;
  picName?: string;
  email?: string;
  avatarColor?: string;
}

