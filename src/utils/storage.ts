import { Pengajuan, Jadwal, Temuan, FileItem } from '../types';
import { generateJadwalPattern, addDays, getKategoriGroup } from '../constants';

const KEY_PENGAJUAN = 'pengajuan_list';
const KEY_JADWAL = 'jadwal_list';
const KEY_TEMUAN = 'temuan_list';

export function loadList<T>(key: string): T[] {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error(`Failed to load ${key}:`, e);
    return [];
  }
}

export function saveList<T>(key: string, data: T[]): boolean {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (e) {
    console.error(`Failed to save ${key}:`, e);
    return false;
  }
}

export function getPengajuanList(): Pengajuan[] {
  return loadList<Pengajuan>(KEY_PENGAJUAN);
}

export function savePengajuanList(list: Pengajuan[]): boolean {
  return saveList(KEY_PENGAJUAN, list);
}

export function getJadwalList(): Jadwal[] {
  const list = loadList<Jadwal>(KEY_JADWAL);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  let changed = false;

  list.forEach((j) => {
    if (j.status === 'Terjadwal' && new Date(j.tanggal) < today) {
      j.status = 'Terlewat';
      changed = true;
    }
  });

  if (changed) {
    saveList(KEY_JADWAL, list);
  }

  return list;
}

export function saveJadwalList(list: Jadwal[]): boolean {
  return saveList(KEY_JADWAL, list);
}

export function getTemuanList(): Temuan[] {
  return loadList<Temuan>(KEY_TEMUAN);
}

export function saveTemuanList(list: Temuan[]): boolean {
  return saveList(KEY_TEMUAN, list);
}

export function convertFilesToDataUrls(files: FileList | File[]): Promise<FileItem[]> {
  const fileArray = Array.from(files);
  return Promise.all(
    fileArray.map(
      (f) =>
        new Promise<FileItem>((resolve, reject) => {
          if (!f.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = () =>
              resolve({
                name: f.name,
                type: f.type,
                dataUrl: reader.result as string,
              });
            reader.onerror = reject;
            reader.readAsDataURL(f);
            return;
          }

          const reader = new FileReader();
          reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
              const canvas = document.createElement('canvas');
              const maxDim = 800;
              let width = img.width;
              let height = img.height;

              if (width > maxDim || height > maxDim) {
                if (width > height) {
                  height = Math.round((height * maxDim) / width);
                  width = maxDim;
                } else {
                  width = Math.round((width * maxDim) / height);
                  height = maxDim;
                }
              }

              canvas.width = width;
              canvas.height = height;
              const ctx = canvas.getContext('2d');
              ctx?.drawImage(img, 0, 0, width, height);
              resolve({
                name: f.name,
                type: 'image/jpeg',
                dataUrl: canvas.toDataURL('image/jpeg', 0.65),
              });
            };
            img.onerror = () => {
              // fallback
              resolve({
                name: f.name,
                type: f.type,
                dataUrl: e.target?.result as string,
              });
            };
            img.src = e.target?.result as string;
          };
          reader.onerror = reject;
          reader.readAsDataURL(f);
        })
    )
  );
}

export function initSampleDataIfEmpty() {
  const pengajuan = getPengajuanList();
  if (pengajuan.length > 0) return; // Already initialized

  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];

  const samplePengajuan: Pengajuan[] = [
    {
      izin: 'BC-2026-0001',
      nama: 'Bpk. Hendra Wijaya',
      tatar: 'Tarubhawana',
      blok: 'TA-5/12',
      pic: 'Benny',
      items: [
        { jenis: 'Penambahan Ruang', luas: '45', group: 'Besar' },
        { jenis: 'Cat Dinding/Atap', luas: '120', group: 'Kecil' },
      ],
      jenis: 'Penambahan Ruang, Cat Dinding/Atap',
      kategoriTerberat: 'Besar',
      tglMulai: addDays(todayStr, -14).toISOString().split('T')[0],
      tglSelesai: addDays(todayStr, 45).toISOString().split('T')[0],
      gambar: [],
      createdAt: new Date().toISOString(),
    },
    {
      izin: 'BC-2026-0002',
      nama: 'Ibu Ratna Dewi',
      tatar: 'Mayangsunda',
      blok: 'MS-2/08',
      pic: 'Agus',
      items: [{ jenis: 'Renovasi Fasad', luas: '30', group: 'Besar' }],
      jenis: 'Renovasi Fasad',
      kategoriTerberat: 'Besar',
      tglMulai: addDays(todayStr, -7).toISOString().split('T')[0],
      tglSelesai: addDays(todayStr, 30).toISOString().split('T')[0],
      gambar: [],
      createdAt: new Date().toISOString(),
    },
    {
      izin: 'BC-2026-0003',
      nama: 'Bpk. Yudi Pratama',
      tatar: 'Ratnasasih',
      blok: 'RS-8/15',
      pic: 'Arif',
      items: [
        { jenis: 'Teras Kecil', luas: '15', group: 'Kecil' },
        { jenis: 'Pagar', luas: '10', group: 'Kecil' },
      ],
      jenis: 'Teras Kecil, Pagar',
      kategoriTerberat: 'Kecil',
      tglMulai: addDays(todayStr, -3).toISOString().split('T')[0],
      tglSelesai: addDays(todayStr, 20).toISOString().split('T')[0],
      gambar: [],
      createdAt: new Date().toISOString(),
    },
    {
      izin: 'BC-2026-0004',
      nama: 'Bpk. Ahmad Fauzi',
      tatar: 'Sasakirana',
      blok: 'SK-1/04',
      pic: 'Agus',
      items: [{ jenis: 'Pembangunan Kavling Baru', luas: '250', group: 'Kavling' }],
      jenis: 'Pembangunan Kavling Baru',
      kategoriTerberat: 'Kavling',
      tglMulai: addDays(todayStr, -30).toISOString().split('T')[0],
      tglSelesai: addDays(todayStr, 180).toISOString().split('T')[0],
      gambar: [],
      createdAt: new Date().toISOString(),
    },
  ];

  savePengajuanList(samplePengajuan);

  // Generate Jadwal for sample pengajuan
  const sampleJadwal: Jadwal[] = [];
  samplePengajuan.forEach((p) => {
    const pattern = generateJadwalPattern(p.kategoriTerberat);
    pattern.forEach((pt, idx) => {
      const targetDate = addDays(p.tglMulai, pt[0]);
      if (targetDate <= new Date(p.tglSelesai)) {
        const isPast = targetDate < today;
        let status: 'Terjadwal' | 'Selesai' | 'Terlewat' = 'Terjadwal';
        let hasil = null;

        if (isPast) {
          if (idx === 0) {
            status = 'Selesai';
            hasil = {
              progress: 'Persiapan / Pengukuran Awal',
              status: 'Sesuai' as const,
              kategoriPelanggaran: ['Tidak Ada'],
              catatan: 'Lokasi dan rambu keselamatan sudah terpasang sesuai standar KBP.',
              komplainTetangga: 'Tidak Ada' as const,
              foto: [],
              waktuInput: targetDate.toISOString(),
            };
          } else if (idx === 1 && p.kategoriTerberat === 'Besar') {
            status = 'Selesai';
            hasil = {
              progress: 'Pekerjaan Struktur (Kolom/Balok)',
              status: 'Deviasi Ringan' as const,
              kategoriPelanggaran: ['Menutup RoW'],
              catatan: 'Material pasir sedikit melimpah ke bahu jalan, sudah dihimbau dibersihkan.',
              komplainTetangga: 'Ya - Biasa' as const,
              komplainDetail: 'Komplain debu dan tumpukan material di pinggir jalan oleh tetangga depan.',
              foto: [],
              waktuInput: targetDate.toISOString(),
            };
          } else {
            status = 'Terlewat';
          }
        }

        sampleJadwal.push({
          id: 'JK-' + String(sampleJadwal.length + 1).padStart(4, '0'),
          izin: p.izin,
          tatar: p.tatar,
          blok: p.blok,
          pic: p.pic,
          jenis: p.jenis,
          tahapLabel: pt[1],
          tanggal: targetDate.toISOString(),
          status,
          hasil,
        });
      }
    });
  });

  saveJadwalList(sampleJadwal);

  // Sample Temuan
  const sampleTemuan: Temuan[] = [
    {
      id: 'TM-0001',
      tanggal: addDays(todayStr, -5).toISOString(),
      tatar: 'Nilapadmi',
      blok: 'NP-3/21',
      pic: 'Benny',
      kategori: 'Renovasi Tanpa Izin',
      keterangan: 'Ditemukan pembongkaran dinding teras depan tanpa papan izin BC KBP.',
      foto: [],
    },
    {
      id: 'TM-0002',
      tanggal: addDays(todayStr, -2).toISOString(),
      tatar: 'Mayangsunda',
      blok: 'MS-5/10',
      pic: 'Agus',
      kategori: 'Material Menutup RoW',
      keterangan: 'Tumpukan batu bata & koral menutup separuh badan jalan utama cluster.',
      foto: [],
    },
    {
      id: 'TM-0003',
      tanggal: addDays(todayStr, -1).toISOString(),
      tatar: 'Ratnasasih',
      blok: 'RS-2/08',
      pic: 'Arif',
      kategori: 'Izin Kadaluarsa',
      keterangan: 'Masa berlaku Surat Izin Renovasi telah lewat dari 60 hari namun kegiatan pengerjaan masih berlangsung.',
      foto: [],
    },
  ];

  saveTemuanList(sampleTemuan);
}

import { DEFAULT_USER_ACCOUNTS } from '../constants';
import { UserAccount } from '../types';

export function getLoggedInUser(): UserAccount | null {
  const savedId = localStorage.getItem('bc_kbp_active_user_id');
  if (savedId) {
    const found = DEFAULT_USER_ACCOUNTS.find((u) => u.id === savedId);
    if (found) return found;
  }
  return null; // Not logged in by default
}

export function loginUser(identifier: string, passwordInput: string): { success: boolean; user?: UserAccount; message?: string } {
  const cleanId = identifier.trim().toLowerCase();
  const user = DEFAULT_USER_ACCOUNTS.find((u) => {
    const un = u.username.toLowerCase();
    const nm = u.name.toLowerCase();
    const em = u.email?.toLowerCase() || '';
    const rt = u.roleTitle.toLowerCase();
    const pic = u.picName?.toLowerCase() || '';

    // Alias keywords for head/manager/supervisor
    let aliases: string[] = [];
    if (u.id === 'usr_head') aliases = ['billy', 'head', 'head of'];
    if (u.id === 'usr_manager') aliases = ['enda', 'manager', 'estate manager'];
    if (u.id === 'usr_supervisor') aliases = ['panji', 'supervisor', 'spv'];

    return (
      un === cleanId ||
      nm === cleanId ||
      em === cleanId ||
      pic === cleanId ||
      rt.includes(cleanId) ||
      aliases.some((a) => a === cleanId || cleanId.includes(a))
    );
  });

  if (!user) {
    return { success: false, message: 'Username, jabatan, atau email tidak ditemukan.' };
  }

  if (user.password && user.password !== passwordInput.trim()) {
    return { success: false, message: 'Kata sandi tidak sesuai.' };
  }

  localStorage.setItem('bc_kbp_active_user_id', user.id);
  return { success: true, user };
}

export function loginAsUserDirect(userId: string): UserAccount {
  localStorage.setItem('bc_kbp_active_user_id', userId);
  const found = DEFAULT_USER_ACCOUNTS.find((u) => u.id === userId);
  return found || DEFAULT_USER_ACCOUNTS[0];
}

export function logoutUser(): void {
  localStorage.removeItem('bc_kbp_active_user_id');
}

