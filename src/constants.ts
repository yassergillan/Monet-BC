import { KategoriPategoriGroup, UserAccount } from './types';
export type { KategoriPategoriGroup };

export const TATAR = [
  'Tarubhawana',
  'Nilapadmi',
  'Paramawati',
  'Banyaksumba',
  'Mayangsunda',
  'BTD 3',
  'Sasakirana',
  'Jingganagara',
  'Ratnasasih',
  'Lokacitra',
];

export const PIC = [
  'Benny',
  'Agus',
  'Arif',
  'Trina',
  'Yasser',
  'Fanzi',
  'Rifa',
  'Rynaldi',
];

export const DEFAULT_USER_ACCOUNTS: UserAccount[] = [
  // Head of / Manager / Supervisor (Akses Penuh + Dashboard - Jabatan Saja)
  {
    id: 'usr_head',
    username: 'head',
    password: '123',
    name: 'Head of Building Control',
    role: 'HEAD_MANAGER',
    roleTitle: 'Head of Building Control & Town Management',
    email: 'head.bc@kotabaruparahyangan.com',
    avatarColor: 'bg-indigo-700',
  },
  {
    id: 'usr_manager',
    username: 'manager',
    password: '123',
    name: 'Estate Manager',
    role: 'HEAD_MANAGER',
    roleTitle: 'Estate Manager Town Management',
    email: 'manager.bc@kotabaruparahyangan.com',
    avatarColor: 'bg-amber-600',
  },
  {
    id: 'usr_supervisor',
    username: 'supervisor',
    password: '123',
    name: 'Supervisor Building Control',
    role: 'HEAD_MANAGER',
    roleTitle: 'Supervisor Building Control',
    email: 'supervisor.bc@kotabaruparahyangan.com',
    avatarColor: 'bg-blue-700',
  },
  // Staff BC (Akses Terbatas: Jadwal Khusus PIC Ybs & Tidak Bisa Lihat Dashboard)
  {
    id: 'usr_benny',
    username: 'benny',
    password: '123',
    name: 'Benny',
    role: 'STAFF_BC',
    roleTitle: 'Staff BC (Tarubhawana, Nilapadmi, Paramawati)',
    picName: 'Benny',
    email: 'benny.bc@kotabaruparahyangan.com',
    avatarColor: 'bg-emerald-600',
  },
  {
    id: 'usr_agus',
    username: 'agus',
    password: '123',
    name: 'Agus',
    role: 'STAFF_BC',
    roleTitle: 'Staff BC (Mayangsunda, BTD 3, Sasakirana)',
    picName: 'Agus',
    email: 'agus.bc@kotabaruparahyangan.com',
    avatarColor: 'bg-blue-600',
  },
  {
    id: 'usr_arif',
    username: 'arif',
    password: '123',
    name: 'Arif',
    role: 'STAFF_BC',
    roleTitle: 'Staff BC (Ratnasasih, Lokacitra)',
    picName: 'Arif',
    email: 'arif.bc@kotabaruparahyangan.com',
    avatarColor: 'bg-cyan-600',
  },
  {
    id: 'usr_trina',
    username: 'trina',
    password: '123',
    name: 'Trina',
    role: 'STAFF_BC',
    roleTitle: 'Staff BC Inspektor',
    picName: 'Trina',
    email: 'trina.bc@kotabaruparahyangan.com',
    avatarColor: 'bg-purple-600',
  },
  {
    id: 'usr_yasser',
    username: 'yasser',
    password: '123',
    name: 'Yasser',
    role: 'STAFF_BC',
    roleTitle: 'Staff BC Inspektor',
    picName: 'Yasser',
    email: 'yasser.bc@kotabaruparahyangan.com',
    avatarColor: 'bg-rose-600',
  },
  {
    id: 'usr_fanzi',
    username: 'fanzi',
    password: '123',
    name: 'Fanzi',
    role: 'STAFF_BC',
    roleTitle: 'Staff BC Inspektor',
    picName: 'Fanzi',
    email: 'fanzi.bc@kotabaruparahyangan.com',
    avatarColor: 'bg-teal-600',
  },
  {
    id: 'usr_rifa',
    username: 'rifa',
    password: '123',
    name: 'Rifa',
    role: 'STAFF_BC',
    roleTitle: 'Staff BC Inspektor',
    picName: 'Rifa',
    email: 'rifa.bc@kotabaruparahyangan.com',
    avatarColor: 'bg-violet-600',
  },
  {
    id: 'usr_rynaldi',
    username: 'rynaldi',
    password: '123',
    name: 'Rynaldi',
    role: 'STAFF_BC',
    roleTitle: 'Staff BC Inspektor',
    picName: 'Rynaldi',
    email: 'rynaldi.bc@kotabaruparahyangan.com',
    avatarColor: 'bg-amber-700',
  },
];


export const TATAR_PIC_MAP: Record<string, string> = {
  Tarubhawana: 'Benny',
  Nilapadmi: 'Benny',
  Paramawati: 'Benny',
  Banyaksumba: 'Benny',
  Mayangsunda: 'Agus',
  'BTD 3': 'Agus',
  Sasakirana: 'Agus',
  Jingganagara: 'Agus',
  Ratnasasih: 'Arif',
  Lokacitra: 'Arif',
};

export const PEKERJAAN_OPTIONS = [
  {
    group: 'Renovasi Kecil',
    groupKey: 'Kecil' as KategoriPategoriGroup,
    items: ['Cat Dinding/Atap', 'Skylight', 'Railing', 'Teras Kecil', 'Pagar'],
  },
  {
    group: 'Renovasi Besar',
    groupKey: 'Besar' as KategoriPategoriGroup,
    items: ['Penambahan Ruang', 'Renovasi Fasad', 'Kolam Renang', 'Garasi/Carport'],
  },
  {
    group: 'Pembangunan Kavling',
    groupKey: 'Kavling' as KategoriPategoriGroup,
    items: ['Pembangunan Kavling Baru'],
  },
];

export const RENOVASI_KECIL = PEKERJAAN_OPTIONS[0].items;
export const RENOVASI_BESAR = PEKERJAAN_OPTIONS[1].items;
export const KAVLING = PEKERJAAN_OPTIONS[2].items;

export function getKategoriGroup(jenis: string): KategoriPategoriGroup {
  if (KAVLING.includes(jenis)) return 'Kavling';
  if (RENOVASI_BESAR.includes(jenis)) return 'Besar';
  return 'Kecil';
}

export const GROUP_RANK: Record<KategoriPategoriGroup, number> = {
  Kecil: 1,
  Besar: 2,
  Kavling: 3,
};

export const STAGE_OPTIONS: Record<KategoriPategoriGroup, string[]> = {
  Kecil: [
    'Fase Konstruksi: Persiapan / Pengukuran Awal',
    'Fase Konstruksi: Rutinan Inspeksi Berlangsung',
    'Fase Konstruksi: Finishing / Perapihan',
    'Selesai / Serah Terima',
  ],
  Besar: [
    'Fase Konstruksi: Persiapan & Pembongkaran',
    'Fase Konstruksi: Pekerjaan Struktur (Kolom/Balok)',
    'Fase Konstruksi: Pekerjaan Dinding & Atap',
    'Fase Konstruksi: Pekerjaan MEP (Listrik/Pipa)',
    'Fase Konstruksi: Pekerjaan Finishing',
    'Selesai / Serah Terima',
  ],
  Kavling: [
    'Fase Konstruksi: Persiapan Lahan & Galian',
    'Fase Konstruksi: Pekerjaan Pondasi',
    'Fase Konstruksi: Pekerjaan Struktur',
    'Fase Konstruksi: Pekerjaan Dinding & Atap',
    'Fase Konstruksi: Pekerjaan MEP',
    'Fase Konstruksi: Finishing & Fasad',
    'Selesai / Serah Terima',
  ],
};

export function generateJadwalPattern(kategori: KategoriPategoriGroup): Array<[number, string]> {
  const pattern: Array<[number, string]> = [];
  if (kategori === 'Kecil') {
    const maxHari = 40;
    let hari = 0;
    let step = 1;
    while (hari < maxHari) {
      hari += 2;
      if (hari <= maxHari) pattern.push([hari, `Rutinan ke-${step++}`]);
      hari += 2;
      if (hari <= maxHari) pattern.push([hari, `Rutinan ke-${step++}`]);
      hari += 3;
      if (hari <= maxHari) pattern.push([hari, `Rutinan ke-${step++}`]);
    }
  } else if (kategori === 'Besar') {
    const maxHari = 90;
    let step = 1;
    for (let hari = 7; hari <= maxHari; hari += 7) {
      pattern.push([hari, `Rutinan Mingguan ke-${step++}`]);
    }
  } else if (kategori === 'Kavling') {
    const maxHari = 365;
    let step = 1;
    for (let hari = 14; hari <= maxHari; hari += 14) {
      pattern.push([hari, `Rutinan Dwi-Mingguan ke-${step++}`]);
    }
  }
  return pattern;
}

export function formatDateIndo(dateStr: string): string {
  if (!dateStr) return '-';
  const d = new Date(dateStr);
  return d.toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export function addDays(dateBase: string | Date, days: number): Date {
  const d = new Date(dateBase);
  d.setDate(d.getDate() + days);
  return d;
}
