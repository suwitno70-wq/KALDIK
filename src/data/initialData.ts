import {
  MadrasahProfile,
  User,
  AcademicYear,
  Semester,
  Teacher,
  Subject,
  ClassRoom,
  Room,
  SchoolDay,
  Period,
  CurriculumStructure,
  CalendarEvent,
  ProtaItem,
  PromesItem,
  ScheduleItem,
  WeeklyLessonExecution,
  BackupHistoryItem
} from '../types';

export const initialMadrasahProfile: MadrasahProfile = {
  nama: 'MIN 1 KOTAWARINGIN TIMUR',
  nsm: '111162020001',
  npsn: '60703819',
  alamat: 'Jl. Jenderal Sudirman Km. 2,5 Sampit',
  kelurahan: 'Mentawa Baru Hulu',
  kecamatan: 'Mentawa Baru Ketapang',
  kabupaten: 'Kotawaringin Timur',
  provinsi: 'Kalimantan Tengah',
  kodePos: '74322',
  telepon: '(0531) 21458',
  email: 'min1kotim@kemenag.go.id',
  website: 'https://min1kotim.sch.id',
  kepalaMadrasah: 'H. Witno, S.Pd.I., M.Pd.',
  nipKepala: '19790415 200501 1 008',
  akreditasi: 'A (Unggul)',
  tahunPelajaranAktif: '2026/2027',
  semesterAktif: 'Ganjil',
  kurikulum: 'Kurikulum Merdeka Madrasah (KMA 450)'
};

export const initialUsers: User[] = [
  {
    id: 'usr_kamad',
    username: 'witno',
    name: 'H. Witno, S.Pd.I., M.Pd.',
    role: 'super_admin',
    email: 'witno70@gmail.com',
    nip: '19790415 200501 1 008',
    teacherId: 't_witno'
  },
  {
    id: 'usr_operator',
    username: 'admin_min1kotim',
    name: 'Ahmad Muzaki, S.Kom',
    role: 'admin_madrasah',
    email: 'admin.simadu@min1kotim.sch.id',
    nip: '19910515 201801 1 004'
  }
];

export const initialAcademicYears: AcademicYear[] = [
  {
    id: 'ay_2026_2027',
    tahun: '2026/2027',
    isAktif: true,
    tanggalMulai: '2026-07-13',
    tanggalSelesai: '2027-06-25'
  },
  {
    id: 'ay_2025_2026',
    tahun: '2025/2026',
    isAktif: false,
    tanggalMulai: '2025-07-14',
    tanggalSelesai: '2026-06-20'
  }
];

export const initialSemesters: Semester[] = [
  {
    id: 1,
    nama: 'Ganjil',
    academicYearId: 'ay_2026_2027',
    isAktif: true,
    tanggalMulai: '2026-07-13',
    tanggalSelesai: '2026-12-19'
  },
  {
    id: 2,
    nama: 'Genap',
    academicYearId: 'ay_2026_2027',
    isAktif: false,
    tanggalMulai: '2027-01-04',
    tanggalSelesai: '2027-06-25'
  }
];

export const initialTeachers: Teacher[] = [
  {
    id: 't_witno',
    nip: '19790415 200501 1 008',
    nama: 'H. Witno',
    gelar: 'S.Pd.I., M.Pd.',
    jenisKelamin: 'L',
    jabatan: 'Kepala Madrasah & Guru PAI',
    mapelUtama: 'Pendidikan Agama Islam',
    telepon: '0812-5000-8899',
    email: 'witno70@gmail.com',
    maxJp: 24,
    warna: '#059669' // emerald
  },
  {
    id: 't_siti',
    nip: '19850212 201001 2 015',
    nama: 'Siti Rahmah',
    gelar: 'S.Pd.',
    jenisKelamin: 'P',
    jabatan: 'Wali Kelas VI-A & Guru Matematika',
    mapelUtama: 'Matematika',
    telepon: '0852-4911-2233',
    email: 'siti.rahmah@min1kotim.sch.id',
    maxJp: 30,
    warna: '#0284c7' // sky
  },
  {
    id: 't_fauzi',
    nip: '19881104 201403 1 002',
    nama: 'Ahmad Fauzi',
    gelar: 'S.Pd.I.',
    jenisKelamin: 'L',
    jabatan: 'Guru Bahasa Arab & SKI',
    mapelUtama: 'Bahasa Arab',
    telepon: '0813-8822-7711',
    email: 'ahmad.fauzi@min1kotim.sch.id',
    maxJp: 28,
    warna: '#d97706' // amber
  },
  {
    id: 't_nurul',
    nip: '19920318 201902 2 007',
    nama: 'Nurul Hidayah',
    gelar: 'S.Pd.',
    jenisKelamin: 'P',
    jabatan: 'Wali Kelas V & Guru IPAS',
    mapelUtama: 'IPAS & Bhs. Indonesia',
    telepon: '0877-3344-9988',
    email: 'nurul.hidayah@min1kotim.sch.id',
    maxJp: 28,
    warna: '#7c3aed' // violet
  },
  {
    id: 't_budi',
    nip: '19900825 201502 1 003',
    nama: 'Budi Prasetyo',
    gelar: 'S.Pd.',
    jenisKelamin: 'L',
    jabatan: 'Guru PJOK & Seni Budaya',
    mapelUtama: 'PJOK',
    telepon: '0812-4455-6677',
    email: 'budi.prasetyo@min1kotim.sch.id',
    maxJp: 26,
    warna: '#dc2626' // red
  }
];

export const initialSubjects: Subject[] = [
  {
    id: 'sb_mat',
    kode: 'MAT',
    nama: 'Matematika',
    kategori: 'Umum',
    kelompok: 'A',
    jpDefault: 5,
    warna: '#0284c7'
  },
  {
    id: 'sb_ipas',
    kode: 'IPAS',
    nama: 'Ilmu Pengetahuan Alam dan Sosial (IPAS)',
    kategori: 'Umum',
    kelompok: 'A',
    jpDefault: 5,
    warna: '#059669'
  },
  {
    id: 'sb_ind',
    kode: 'BIND',
    nama: 'Bahasa Indonesia',
    kategori: 'Umum',
    kelompok: 'A',
    jpDefault: 6,
    warna: '#2563eb'
  },
  {
    id: 'sb_pai',
    kode: 'PAI',
    nama: 'Pendidikan Agama Islam (PAI)',
    kategori: 'Agama',
    kelompok: 'A',
    jpDefault: 4,
    warna: '#10b981'
  },
  {
    id: 'sb_arb',
    kode: 'BARB',
    nama: 'Bahasa Arab',
    kategori: 'Agama',
    kelompok: 'A',
    jpDefault: 2,
    warna: '#d97706'
  },
  {
    id: 'sb_ppkn',
    kode: 'PPKN',
    nama: 'Pendidikan Pancasila',
    kategori: 'Umum',
    kelompok: 'A',
    jpDefault: 4,
    warna: '#ea580c'
  },
  {
    id: 'sb_pjok',
    kode: 'PJOK',
    nama: 'Pendidikan Jasmani, Olahraga, & Kesehatan',
    kategori: 'Umum',
    kelompok: 'B',
    jpDefault: 3,
    warna: '#e11d48'
  },
  {
    id: 'sb_seni',
    kode: 'SB',
    nama: 'Seni Budaya dan Prakarya',
    kategori: 'Umum',
    kelompok: 'B',
    jpDefault: 3,
    warna: '#8b5cf6'
  },
  {
    id: 'sb_mulok_daerah',
    kode: 'ML-BD',
    nama: 'Muatan Lokal: Bahasa Daerah & Budaya Dayak Kotim',
    kategori: 'Muatan Lokal',
    kelompok: 'B',
    jpDefault: 2,
    warna: '#0d9488',
    isMulok: true,
    deskripsi: 'Bahasa Daerah dan Kearifan Lokal Budaya Kalimantan Tengah / Kotawaringin Timur'
  },
  {
    id: 'sb_mulok_tahfidz',
    kode: 'ML-TFZ',
    nama: 'Muatan Lokal: Tahfidz & Tilawah Al-Qur’an',
    kategori: 'Muatan Lokal',
    kelompok: 'B',
    jpDefault: 2,
    warna: '#059669',
    isMulok: true,
    deskripsi: 'Penguatan Hafalan Juz 30 dan Tartil Tilawah Al-Qur’an Khusus Madrasah'
  }
];

export const initialRooms: Room[] = [
  { id: 'r_01', kode: 'R.01', nama: 'Ruang Kelas I', kapasitas: 28, tipe: 'Teori' },
  { id: 'r_02', kode: 'R.02', nama: 'Ruang Kelas II', kapasitas: 28, tipe: 'Teori' },
  { id: 'r_03', kode: 'R.03', nama: 'Ruang Kelas III', kapasitas: 30, tipe: 'Teori' },
  { id: 'r_04', kode: 'R.04', nama: 'Ruang Kelas IV', kapasitas: 30, tipe: 'Teori' },
  { id: 'r_05', kode: 'R.05', nama: 'Ruang Kelas V', kapasitas: 32, tipe: 'Teori' },
  { id: 'r_06', kode: 'R.06', nama: 'Ruang Kelas VI', kapasitas: 32, tipe: 'Teori' },
  { id: 'r_lab', kode: 'LAB.01', nama: 'Laboratorium Komputer', kapasitas: 35, tipe: 'Laboratorium' },
  { id: 'r_mus', kode: 'MUSH', nama: 'Musholla Al-Ikhlas', kapasitas: 80, tipe: 'Musholla' }
];

export const initialClasses: ClassRoom[] = [
  { id: 'cls_1', tingkat: 1, nama: 'Kelas I', rombel: 'A', ruangId: 'r_01', waliKelasId: 't_budi', jumlahSiswa: 26 },
  { id: 'cls_2', tingkat: 2, nama: 'Kelas II', rombel: 'A', ruangId: 'r_02', waliKelasId: 't_fauzi', jumlahSiswa: 27 },
  { id: 'cls_3', tingkat: 3, nama: 'Kelas III', rombel: 'A', ruangId: 'r_03', waliKelasId: 't_nurul', jumlahSiswa: 28 },
  { id: 'cls_4', tingkat: 4, nama: 'Kelas IV', rombel: 'A', ruangId: 'r_04', waliKelasId: 't_fauzi', jumlahSiswa: 29 },
  { id: 'cls_5', tingkat: 5, nama: 'Kelas V', rombel: 'A', ruangId: 'r_05', waliKelasId: 't_nurul', jumlahSiswa: 30 },
  { id: 'cls_6', tingkat: 6, nama: 'Kelas VI', rombel: 'A', ruangId: 'r_06', waliKelasId: 't_siti', jumlahSiswa: 30 }
];

export const initialSchoolDays: SchoolDay[] = [
  { id: 1, hari: 'Senin', isBelajar: true, urutan: 1 },
  { id: 2, hari: 'Selasa', isBelajar: true, urutan: 2 },
  { id: 3, hari: 'Rabu', isBelajar: true, urutan: 3 },
  { id: 4, hari: 'Kamis', isBelajar: true, urutan: 4 },
  { id: 5, hari: 'Jumat', isBelajar: true, urutan: 5 },
  { id: 6, hari: 'Sabtu', isBelajar: true, urutan: 6 },
  { id: 7, hari: 'Minggu', isBelajar: false, urutan: 7 }
];

export const initialPeriods: Period[] = [
  { id: 1, jamKe: 1, jamMulai: '07:00', jamSelesai: '07:40', isIstirahat: false },
  { id: 2, jamKe: 2, jamMulai: '07:40', jamSelesai: '08:20', isIstirahat: false },
  { id: 3, jamKe: 3, jamMulai: '08:20', jamSelesai: '09:00', isIstirahat: false },
  { id: 4, jamKe: 4, jamMulai: '09:00', jamSelesai: '09:30', isIstirahat: true, keterangan: 'Istirahat I & Sholat Dhuha' },
  { id: 5, jamKe: 5, jamMulai: '09:30', jamSelesai: '10:10', isIstirahat: false },
  { id: 6, jamKe: 6, jamMulai: '10:10', jamSelesai: '10:50', isIstirahat: false },
  { id: 7, jamKe: 7, jamMulai: '10:50', jamSelesai: '11:30', isIstirahat: false },
  { id: 8, jamKe: 8, jamMulai: '11:30', jamSelesai: '12:10', isIstirahat: false }
];

export const initialCurriculumStructures: CurriculumStructure[] = [
  { id: 'cs_6_mat', tingkat: 6, subjectId: 'sb_mat', jpPerMinggu: 5 },
  { id: 'cs_6_ipas', tingkat: 6, subjectId: 'sb_ipas', jpPerMinggu: 5 },
  { id: 'cs_6_ind', tingkat: 6, subjectId: 'sb_ind', jpPerMinggu: 6 },
  { id: 'cs_6_pai', tingkat: 6, subjectId: 'sb_pai', jpPerMinggu: 4 },
  { id: 'cs_6_arb', tingkat: 6, subjectId: 'sb_arb', jpPerMinggu: 2 },
  { id: 'cs_6_ppkn', tingkat: 6, subjectId: 'sb_ppkn', jpPerMinggu: 4 },
  { id: 'cs_6_pjok', tingkat: 6, subjectId: 'sb_pjok', jpPerMinggu: 3 },
  { id: 'cs_6_seni', tingkat: 6, subjectId: 'sb_seni', jpPerMinggu: 3 },
  { id: 'cs_6_mulok_daerah', tingkat: 6, subjectId: 'sb_mulok_daerah', jpPerMinggu: 2 },
  { id: 'cs_6_mulok_tahfidz', tingkat: 6, subjectId: 'sb_mulok_tahfidz', jpPerMinggu: 2 },
  // Kelas V
  { id: 'cs_5_mat', tingkat: 5, subjectId: 'sb_mat', jpPerMinggu: 5 },
  { id: 'cs_5_ipas', tingkat: 5, subjectId: 'sb_ipas', jpPerMinggu: 5 },
  { id: 'cs_5_ind', tingkat: 5, subjectId: 'sb_ind', jpPerMinggu: 6 },
  { id: 'cs_5_pai', tingkat: 5, subjectId: 'sb_pai', jpPerMinggu: 4 },
  { id: 'cs_5_arb', tingkat: 5, subjectId: 'sb_arb', jpPerMinggu: 2 },
  { id: 'cs_5_ppkn', tingkat: 5, subjectId: 'sb_ppkn', jpPerMinggu: 4 },
  { id: 'cs_5_pjok', tingkat: 5, subjectId: 'sb_pjok', jpPerMinggu: 3 },
  { id: 'cs_5_seni', tingkat: 5, subjectId: 'sb_seni', jpPerMinggu: 3 },
  { id: 'cs_5_mulok_daerah', tingkat: 5, subjectId: 'sb_mulok_daerah', jpPerMinggu: 2 },
  { id: 'cs_5_mulok_tahfidz', tingkat: 5, subjectId: 'sb_mulok_tahfidz', jpPerMinggu: 2 }
];

export const initialCalendarEvents: CalendarEvent[] = [
  { id: 'cal_1', tanggal: '2026-07-13', judul: 'Hari Pertama Masuk TP 2026/2027', tipe: 'KEGIATAN', keterangan: 'Masa Ta’aruf Siswa Madrasah (Matsama)', warna: '#0284c7' },
  { id: 'cal_2', tanggal: '2026-07-14', judul: 'Matsama Hari Ke-2', tipe: 'KEGIATAN', keterangan: 'Orientasi Lingkungan Madrasah' },
  { id: 'cal_3', tanggal: '2026-07-15', judul: 'Matsama Hari Ke-3 & Pembukaan KBM', tipe: 'KEGIATAN', keterangan: 'Sosialisasi Tata Tertib' },
  { id: 'cal_4', tanggal: '2026-08-17', judul: 'HUT Kemerdekaan RI Ke-81', tipe: 'LIBUR', keterangan: 'Upacara Bendera & Hari Libur Nasional', warna: '#dc2626' },
  { id: 'cal_5', tanggal: '2026-08-25', judul: 'Maulid Nabi Muhammad SAW 1448 H', tipe: 'LIBUR', keterangan: 'Libur Nasional Keagamaan', warna: '#dc2626' },
  { id: 'cal_6', tanggal: '2026-09-21', judul: 'Asesmen Tengah Semester (ATS) Hari 1', tipe: 'ASESMEN', keterangan: 'Pelaksanaan ATS Ganjil', warna: '#d97706' },
  { id: 'cal_7', tanggal: '2026-09-22', judul: 'Asesmen Tengah Semester (ATS) Hari 2', tipe: 'ASESMEN', keterangan: 'Pelaksanaan ATS Ganjil' },
  { id: 'cal_8', tanggal: '2026-09-23', judul: 'Asesmen Tengah Semester (ATS) Hari 3', tipe: 'ASESMEN', keterangan: 'Pelaksanaan ATS Ganjil' },
  { id: 'cal_9', tanggal: '2026-09-24', judul: 'Asesmen Tengah Semester (ATS) Hari 4', tipe: 'ASESMEN', keterangan: 'Pelaksanaan ATS Ganjil' },
  { id: 'cal_10', tanggal: '2026-09-25', judul: 'Asesmen Tengah Semester (ATS) Hari 5', tipe: 'ASESMEN', keterangan: 'Pelaksanaan ATS Ganjil' },
  { id: 'cal_11', tanggal: '2026-09-26', judul: 'Asesmen Tengah Semester (ATS) Hari 6', tipe: 'ASESMEN', keterangan: 'Pelaksanaan ATS Ganjil' },
  { id: 'cal_12', tanggal: '2026-10-28', judul: 'Peringatan Hari Sumpah Pemuda', tipe: 'KEGIATAN', keterangan: 'Lomba Kreasi & Pidato Kebangsaan' },
  { id: 'cal_13', tanggal: '2026-11-25', judul: 'Hari Guru Nasional & HUT PGRI', tipe: 'KEGIATAN', keterangan: 'Apresiasi Guru Madrasah Teladan' },
  { id: 'cal_14', tanggal: '2026-11-30', judul: 'Asesmen Akhir Semester (AAS) Hari 1', tipe: 'ASESMEN', keterangan: 'Pelaksanaan Ujian AAS', warna: '#d97706' },
  { id: 'cal_15', tanggal: '2026-12-01', judul: 'Asesmen Akhir Semester (AAS) Hari 2', tipe: 'ASESMEN', keterangan: 'Pelaksanaan Ujian AAS' },
  { id: 'cal_16', tanggal: '2026-12-02', judul: 'Asesmen Akhir Semester (AAS) Hari 3', tipe: 'ASESMEN', keterangan: 'Pelaksanaan Ujian AAS' },
  { id: 'cal_17', tanggal: '2026-12-03', judul: 'Asesmen Akhir Semester (AAS) Hari 4', tipe: 'ASESMEN', keterangan: 'Pelaksanaan Ujian AAS' },
  { id: 'cal_18', tanggal: '2026-12-04', judul: 'Asesmen Akhir Semester (AAS) Hari 5', tipe: 'ASESMEN', keterangan: 'Pelaksanaan Ujian AAS' },
  { id: 'cal_19', tanggal: '2026-12-05', judul: 'Asesmen Akhir Semester (AAS) Hari 6', tipe: 'ASESMEN', keterangan: 'Pelaksanaan Ujian AAS' },
  { id: 'cal_20', tanggal: '2026-12-14', judul: 'Pekan Olahraga & Seni Madrasah (Classmeeting)', tipe: 'KEGIATAN', keterangan: 'Classmeeting Antar Kelas' },
  { id: 'cal_21', tanggal: '2026-12-19', judul: 'Pembagian Buku Laporan Hasil Belajar (Rapor)', tipe: 'RAPOR', keterangan: 'Penyerahan Rapor Semester Ganjil kepada Orang Tua', warna: '#059669' },
  { id: 'cal_22', tanggal: '2026-12-21', judul: 'Libur Akhir Semester Ganjil Hari 1', tipe: 'LIBUR', keterangan: 'Libur Pembelajaran', warna: '#dc2626' },
  { id: 'cal_23', tanggal: '2026-12-25', judul: 'Hari Raya Natal (Libur Nasional)', tipe: 'LIBUR', keterangan: 'Libur Nasional', warna: '#dc2626' }
];

export const initialProtaItems: ProtaItem[] = [
  {
    id: 'prota_6_mat_1',
    tingkat: 6,
    subjectId: 'sb_mat',
    teacherId: 't_siti',
    semester: 'Ganjil',
    noUrut: 1,
    lingkupMateri: 'Bilangan Bulat & Pecahan',
    atp: '6.1.1 Mengidentifikasi dan menghitung operasi hitung bilangan bulat positif dan negatif',
    materiTP: 'Operasi Hitung Penjumlahan dan Pengurangan Bilangan Bulat',
    alokasiJP: 10,
    perkiraanBulan: 'Juli',
    perkiraanMingguKe: 1,
    keterangan: 'Tersinkron dengan Minggu Efektif'
  },
  {
    id: 'prota_6_mat_2',
    tingkat: 6,
    subjectId: 'sb_mat',
    teacherId: 't_siti',
    semester: 'Ganjil',
    noUrut: 2,
    lingkupMateri: 'Operasi Campuran Pecahan & Desimal',
    atp: '6.1.2 Menyelesaikan masalah kontekstual operasi hitung campuran pecahan dan desimal',
    materiTP: 'Perkalian dan Pembagian Pecahan Biasa, Campuran, serta Desimal',
    alokasiJP: 15,
    perkiraanBulan: 'Agustus',
    perkiraanMingguKe: 2,
    keterangan: 'Tersinkron dengan Minggu Efektif'
  },
  {
    id: 'prota_6_mat_3',
    tingkat: 6,
    subjectId: 'sb_mat',
    teacherId: 't_siti',
    semester: 'Ganjil',
    noUrut: 3,
    lingkupMateri: 'Lingkaran & Geometri Datar',
    atp: '6.2.1 Menjelaskan titik pusat, jari-jari, diameter, busur, tali busur, tembereng, dan juring',
    materiTP: 'Unsur-unsur Lingkaran, Keliling, dan Luas Lingkaran',
    alokasiJP: 15,
    perkiraanBulan: 'September',
    perkiraanMingguKe: 1,
    keterangan: 'Tersinkron dengan Minggu Efektif'
  },
  {
    id: 'prota_6_mat_4',
    tingkat: 6,
    subjectId: 'sb_mat',
    teacherId: 't_siti',
    semester: 'Ganjil',
    noUrut: 4,
    lingkupMateri: 'Bangun Ruang Prisma & Tabung',
    atp: '6.2.2 Menemukan rumus luas permukaan dan volume bangun ruang prisma segitiga dan tabung',
    materiTP: 'Luas Permukaan dan Volume Prisma serta Tabung',
    alokasiJP: 15,
    perkiraanBulan: 'Oktober',
    perkiraanMingguKe: 2,
    keterangan: 'Tersinkron dengan Minggu Efektif'
  },
  {
    id: 'prota_6_mat_5',
    tingkat: 6,
    subjectId: 'sb_mat',
    teacherId: 't_siti',
    semester: 'Ganjil',
    noUrut: 5,
    lingkupMateri: 'Pengolahan Data & Statistik Dasar',
    atp: '6.3.1 Menyajikan dan membaca data dalam bentuk diagram batang, garis, dan lingkaran',
    materiTP: 'Penyajian Data & Menentukan Mean, Median, Modus',
    alokasiJP: 15,
    perkiraanBulan: 'November',
    perkiraanMingguKe: 1,
    keterangan: 'Tersinkron dengan Minggu Efektif'
  },
  {
    id: 'prota_6_mat_6',
    tingkat: 6,
    subjectId: 'sb_mat',
    teacherId: 't_siti',
    semester: 'Ganjil',
    noUrut: 6,
    lingkupMateri: 'Proyek Penguatan & Asesmen Sumatif Akhir',
    atp: '6.4.1 Evaluasi capaian pembelajaran semester ganjil dan penguatan materi esensial',
    materiTP: 'Remedial, Pengayaan, dan Pemantapan Soal Literasi Numerasi',
    alokasiJP: 10,
    perkiraanBulan: 'Desember',
    perkiraanMingguKe: 1,
    keterangan: 'Menjelang Rapor'
  },
  // IPAS Kelas VI
  {
    id: 'prota_6_ipas_1',
    tingkat: 6,
    subjectId: 'sb_ipas',
    teacherId: 't_nurul',
    semester: 'Ganjil',
    noUrut: 1,
    lingkupMateri: 'Tubuh Manusia & Sistem Gerak',
    atp: '6.1.1 Mengidentifikasi organ gerak pada manusia (rangka, sendi, dan otot) serta fungsinya',
    materiTP: 'Bagaimana Tubuh Kita Bergerak (Rangka, Sendi, Otot)',
    alokasiJP: 15,
    perkiraanBulan: 'Juli',
    perkiraanMingguKe: 1,
    keterangan: 'KMA 450'
  },
  {
    id: 'prota_6_ipas_2',
    tingkat: 6,
    subjectId: 'sb_ipas',
    teacherId: 't_nurul',
    semester: 'Ganjil',
    noUrut: 2,
    lingkupMateri: 'Sistem Saraf & Penginderaan',
    atp: '6.1.2 Menjelaskan sistem saraf dan peran pancaindera dalam merespons rangsang',
    materiTP: 'Sistem Saraf dan Cara Menjaga Kesehatan Organ Penginderaan',
    alokasiJP: 15,
    perkiraanBulan: 'Agustus',
    perkiraanMingguKe: 2,
    keterangan: 'KMA 450'
  },
  {
    id: 'prota_6_ipas_3',
    tingkat: 6,
    subjectId: 'sb_ipas',
    teacherId: 't_nurul',
    semester: 'Ganjil',
    noUrut: 3,
    lingkupMateri: 'Sejarah Perjuangan Bangsa & Proklamasi',
    atp: '6.2.1 Menceritakan peristiwa proklamasi kemerdekaan dan tokoh-tokoh penting di baliknya',
    materiTP: 'Perjuangan Menuju Kemerdekaan Indonesia & Makna Proklamasi',
    alokasiJP: 15,
    perkiraanBulan: 'September',
    perkiraanMingguKe: 2,
    keterangan: 'KMA 450'
  },
  {
    id: 'prota_6_ipas_4',
    tingkat: 6,
    subjectId: 'sb_ipas',
    teacherId: 't_nurul',
    semester: 'Ganjil',
    noUrut: 4,
    lingkupMateri: 'Bentang Alam & Karakteristik Wilayah Indonesia',
    atp: '6.2.2 Menjelaskan letak geografis dan kekayaan alam kepulauan Nusantara',
    materiTP: 'Kondisi Geografis dan Potensi Sumber Daya Alam Indonesia',
    alokasiJP: 20,
    perkiraanBulan: 'Oktober',
    perkiraanMingguKe: 1,
    keterangan: 'KMA 450'
  },
  // PAI Kelas VI
  {
    id: 'prota_6_pai_1',
    tingkat: 6,
    subjectId: 'sb_pai',
    teacherId: 't_witno',
    semester: 'Ganjil',
    noUrut: 1,
    lingkupMateri: 'Al-Qur’an Hadis: Surah Ad-Duha & As-Syams',
    atp: '6.1.1 Membaca dan menghafal Surah Ad-Duha dengan makhraj yang fasih',
    materiTP: 'Kandungan Nilai Keimanan Surah Ad-Duha',
    alokasiJP: 16,
    perkiraanBulan: 'Juli',
    perkiraanMingguKe: 1,
    keterangan: 'Kurikulum Kemenag'
  },
  {
    id: 'prota_6_pai_2',
    tingkat: 6,
    subjectId: 'sb_pai',
    teacherId: 't_witno',
    semester: 'Ganjil',
    noUrut: 2,
    lingkupMateri: 'Akidah: Beriman Kepada Hari Akhir (Kiamat)',
    atp: '6.2.1 Meyakini tanda-tanda hari akhir dan meneladani hikmahnya dalam perilaku sehari-hari',
    materiTP: 'Tanda-tanda Hari Akhir dan Tanggung Jawab Amal Saleh',
    alokasiJP: 16,
    perkiraanBulan: 'September',
    perkiraanMingguKe: 1,
    keterangan: 'Kurikulum Kemenag'
  }
];

export const initialPromesItems: PromesItem[] = [
  {
    id: 'promes_6_mat_1',
    protaId: 'prota_6_mat_1',
    tingkat: 6,
    subjectId: 'sb_mat',
    teacherId: 't_siti',
    semester: 'Ganjil',
    materiTP: 'Operasi Hitung Penjumlahan dan Pengurangan Bilangan Bulat',
    totalJP: 10,
    distribusiMingguan: {
      'Juli-1': 5,
      'Juli-2': 5
    },
    tanggalPelaksanaan: '13 - 25 Juli 2026',
    keterangan: 'Selesai tepat waktu'
  },
  {
    id: 'promes_6_mat_2',
    protaId: 'prota_6_mat_2',
    tingkat: 6,
    subjectId: 'sb_mat',
    teacherId: 't_siti',
    semester: 'Ganjil',
    materiTP: 'Perkalian dan Pembagian Pecahan Biasa, Campuran, serta Desimal',
    totalJP: 15,
    distribusiMingguan: {
      'Agustus-1': 5,
      'Agustus-2': 5,
      'Agustus-3': 5
    },
    tanggalPelaksanaan: '03 - 22 Agustus 2026',
    keterangan: 'Dipadukan dengan evaluasi'
  },
  {
    id: 'promes_6_mat_3',
    protaId: 'prota_6_mat_3',
    tingkat: 6,
    subjectId: 'sb_mat',
    teacherId: 't_siti',
    semester: 'Ganjil',
    materiTP: 'Unsur-unsur Lingkaran, Keliling, dan Luas Lingkaran',
    totalJP: 15,
    distribusiMingguan: {
      'September-1': 5,
      'September-2': 5,
      'September-3': 5
    },
    tanggalPelaksanaan: '31 Agu - 19 September 2026',
    keterangan: 'Tersinkronisasi'
  },
  {
    id: 'promes_6_mat_4',
    protaId: 'prota_6_mat_4',
    tingkat: 6,
    subjectId: 'sb_mat',
    teacherId: 't_siti',
    semester: 'Ganjil',
    materiTP: 'Luas Permukaan dan Volume Prisma serta Tabung',
    totalJP: 15,
    distribusiMingguan: {
      'Oktober-1': 5,
      'Oktober-2': 5,
      'Oktober-3': 5
    },
    tanggalPelaksanaan: '05 - 24 Oktober 2026',
    keterangan: 'Tersinkronisasi'
  },
  {
    id: 'promes_6_mat_5',
    protaId: 'prota_6_mat_5',
    tingkat: 6,
    subjectId: 'sb_mat',
    teacherId: 't_siti',
    semester: 'Ganjil',
    materiTP: 'Penyajian Data & Menentukan Mean, Median, Modus',
    totalJP: 15,
    distribusiMingguan: {
      'November-1': 5,
      'November-2': 5,
      'November-3': 5
    },
    tanggalPelaksanaan: '02 - 21 November 2026',
    keterangan: 'Tersinkronisasi'
  },
  {
    id: 'promes_6_mat_6',
    protaId: 'prota_6_mat_6',
    tingkat: 6,
    subjectId: 'sb_mat',
    teacherId: 't_siti',
    semester: 'Ganjil',
    materiTP: 'Remedial, Pengayaan, dan Pemantapan Soal Literasi Numerasi',
    totalJP: 10,
    distribusiMingguan: {
      'November-4': 5,
      'Desember-1': 5
    },
    tanggalPelaksanaan: '23 Nov - 05 Desember 2026',
    keterangan: 'Persiapan Rapor'
  },
  // Promes IPAS
  {
    id: 'promes_6_ipas_1',
    protaId: 'prota_6_ipas_1',
    tingkat: 6,
    subjectId: 'sb_ipas',
    teacherId: 't_nurul',
    semester: 'Ganjil',
    materiTP: 'Bagaimana Tubuh Kita Bergerak (Rangka, Sendi, Otot)',
    totalJP: 15,
    distribusiMingguan: {
      'Juli-1': 5,
      'Juli-2': 5,
      'Agustus-1': 5
    },
    tanggalPelaksanaan: '13 Juli - 08 Agustus 2026',
    keterangan: 'Praktik anatomi sederhana'
  },
  // Promes PAI
  {
    id: 'promes_6_pai_1',
    protaId: 'prota_6_pai_1',
    tingkat: 6,
    subjectId: 'sb_pai',
    teacherId: 't_witno',
    semester: 'Ganjil',
    materiTP: 'Kandungan Nilai Keimanan Surah Ad-Duha',
    totalJP: 16,
    distribusiMingguan: {
      'Juli-1': 4,
      'Juli-2': 4,
      'Agustus-1': 4,
      'Agustus-2': 4
    },
    tanggalPelaksanaan: '13 Juli - 15 Agustus 2026',
    keterangan: 'Hafalan & Tadabbur'
  }
];

export const initialSchedules: ScheduleItem[] = [
  // SENIN
  { id: 'sch_1', academicYearId: 'ay_2026_2027', semester: 'Ganjil', hari: 'Senin', jamKe: 1, classId: 'cls_6', subjectId: 'sb_mat', teacherId: 't_siti', roomId: 'r_06' },
  { id: 'sch_2', academicYearId: 'ay_2026_2027', semester: 'Ganjil', hari: 'Senin', jamKe: 2, classId: 'cls_6', subjectId: 'sb_mat', teacherId: 't_siti', roomId: 'r_06' },
  { id: 'sch_3', academicYearId: 'ay_2026_2027', semester: 'Ganjil', hari: 'Senin', jamKe: 3, classId: 'cls_6', subjectId: 'sb_mat', teacherId: 't_siti', roomId: 'r_06' },
  { id: 'sch_4', academicYearId: 'ay_2026_2027', semester: 'Ganjil', hari: 'Senin', jamKe: 5, classId: 'cls_6', subjectId: 'sb_ipas', teacherId: 't_nurul', roomId: 'r_06' },
  { id: 'sch_5', academicYearId: 'ay_2026_2027', semester: 'Ganjil', hari: 'Senin', jamKe: 6, classId: 'cls_6', subjectId: 'sb_ipas', teacherId: 't_nurul', roomId: 'r_06' },

  // Kelas V di Senin
  { id: 'sch_6', academicYearId: 'ay_2026_2027', semester: 'Ganjil', hari: 'Senin', jamKe: 1, classId: 'cls_5', subjectId: 'sb_pai', teacherId: 't_witno', roomId: 'r_05' },
  { id: 'sch_7', academicYearId: 'ay_2026_2027', semester: 'Ganjil', hari: 'Senin', jamKe: 2, classId: 'cls_5', subjectId: 'sb_pai', teacherId: 't_witno', roomId: 'r_05' },
  { id: 'sch_8', academicYearId: 'ay_2026_2027', semester: 'Ganjil', hari: 'Senin', jamKe: 3, classId: 'cls_5', subjectId: 'sb_arb', teacherId: 't_fauzi', roomId: 'r_05' },
  { id: 'sch_9', academicYearId: 'ay_2026_2027', semester: 'Ganjil', hari: 'Senin', jamKe: 5, classId: 'cls_5', subjectId: 'sb_mat', teacherId: 't_siti', roomId: 'r_05' },
  { id: 'sch_10', academicYearId: 'ay_2026_2027', semester: 'Ganjil', hari: 'Senin', jamKe: 6, classId: 'cls_5', subjectId: 'sb_mat', teacherId: 't_siti', roomId: 'r_05' },

  // SELASA
  { id: 'sch_11', academicYearId: 'ay_2026_2027', semester: 'Ganjil', hari: 'Selasa', jamKe: 1, classId: 'cls_6', subjectId: 'sb_pai', teacherId: 't_witno', roomId: 'r_06' },
  { id: 'sch_12', academicYearId: 'ay_2026_2027', semester: 'Ganjil', hari: 'Selasa', jamKe: 2, classId: 'cls_6', subjectId: 'sb_pai', teacherId: 't_witno', roomId: 'r_06' },
  { id: 'sch_13', academicYearId: 'ay_2026_2027', semester: 'Ganjil', hari: 'Selasa', jamKe: 3, classId: 'cls_6', subjectId: 'sb_arb', teacherId: 't_fauzi', roomId: 'r_06' },
  { id: 'sch_14', academicYearId: 'ay_2026_2027', semester: 'Ganjil', hari: 'Selasa', jamKe: 5, classId: 'cls_6', subjectId: 'sb_ind', teacherId: 't_nurul', roomId: 'r_06' },
  { id: 'sch_15', academicYearId: 'ay_2026_2027', semester: 'Ganjil', hari: 'Selasa', jamKe: 6, classId: 'cls_6', subjectId: 'sb_ind', teacherId: 't_nurul', roomId: 'r_06' },

  // RABU
  { id: 'sch_16', academicYearId: 'ay_2026_2027', semester: 'Ganjil', hari: 'Rabu', jamKe: 1, classId: 'cls_6', subjectId: 'sb_pjok', teacherId: 't_budi', roomId: 'r_06' },
  { id: 'sch_17', academicYearId: 'ay_2026_2027', semester: 'Ganjil', hari: 'Rabu', jamKe: 2, classId: 'cls_6', subjectId: 'sb_pjok', teacherId: 't_budi', roomId: 'r_06' },
  { id: 'sch_18', academicYearId: 'ay_2026_2027', semester: 'Ganjil', hari: 'Rabu', jamKe: 3, classId: 'cls_6', subjectId: 'sb_pjok', teacherId: 't_budi', roomId: 'r_06' },
  { id: 'sch_19', academicYearId: 'ay_2026_2027', semester: 'Ganjil', hari: 'Rabu', jamKe: 5, classId: 'cls_6', subjectId: 'sb_ppkn', teacherId: 't_nurul', roomId: 'r_06' },
  { id: 'sch_20', academicYearId: 'ay_2026_2027', semester: 'Ganjil', hari: 'Rabu', jamKe: 6, classId: 'cls_6', subjectId: 'sb_ppkn', teacherId: 't_nurul', roomId: 'r_06' },

  // KAMIS
  { id: 'sch_21', academicYearId: 'ay_2026_2027', semester: 'Ganjil', hari: 'Kamis', jamKe: 1, classId: 'cls_6', subjectId: 'sb_mat', teacherId: 't_siti', roomId: 'r_06' },
  { id: 'sch_22', academicYearId: 'ay_2026_2027', semester: 'Ganjil', hari: 'Kamis', jamKe: 2, classId: 'cls_6', subjectId: 'sb_mat', teacherId: 't_siti', roomId: 'r_06' },
  { id: 'sch_23', academicYearId: 'ay_2026_2027', semester: 'Ganjil', hari: 'Kamis', jamKe: 3, classId: 'cls_6', subjectId: 'sb_ipas', teacherId: 't_nurul', roomId: 'r_06' },
  { id: 'sch_24', academicYearId: 'ay_2026_2027', semester: 'Ganjil', hari: 'Kamis', jamKe: 5, classId: 'cls_6', subjectId: 'sb_seni', teacherId: 't_budi', roomId: 'r_06' },
  { id: 'sch_25', academicYearId: 'ay_2026_2027', semester: 'Ganjil', hari: 'Kamis', jamKe: 6, classId: 'cls_6', subjectId: 'sb_seni', teacherId: 't_budi', roomId: 'r_06' },

  // JUMAT
  { id: 'sch_26', academicYearId: 'ay_2026_2027', semester: 'Ganjil', hari: 'Jumat', jamKe: 1, classId: 'cls_6', subjectId: 'sb_pai', teacherId: 't_witno', roomId: 'r_06' },
  { id: 'sch_27', academicYearId: 'ay_2026_2027', semester: 'Ganjil', hari: 'Jumat', jamKe: 2, classId: 'cls_6', subjectId: 'sb_pai', teacherId: 't_witno', roomId: 'r_06' },
  { id: 'sch_28', academicYearId: 'ay_2026_2027', semester: 'Ganjil', hari: 'Jumat', jamKe: 3, classId: 'cls_6', subjectId: 'sb_arb', teacherId: 't_fauzi', roomId: 'r_06' },

  // SABTU
  { id: 'sch_29', academicYearId: 'ay_2026_2027', semester: 'Ganjil', hari: 'Sabtu', jamKe: 1, classId: 'cls_6', subjectId: 'sb_ind', teacherId: 't_nurul', roomId: 'r_06' },
  { id: 'sch_30', academicYearId: 'ay_2026_2027', semester: 'Ganjil', hari: 'Sabtu', jamKe: 2, classId: 'cls_6', subjectId: 'sb_ind', teacherId: 't_nurul', roomId: 'r_06' },
  { id: 'sch_31', academicYearId: 'ay_2026_2027', semester: 'Ganjil', hari: 'Sabtu', jamKe: 3, classId: 'cls_6', subjectId: 'sb_seni', teacherId: 't_budi', roomId: 'r_06' }
];

export const initialWeeklyExecutions: WeeklyLessonExecution[] = [
  {
    id: 'wex_1',
    tanggal: '2026-07-20',
    hari: 'Senin',
    jamMulai: '07:00',
    jamSelesai: '09:00',
    classId: 'cls_6',
    subjectId: 'sb_mat',
    teacherId: 't_siti',
    mingguKe: 2,
    bulan: 'Juli',
    materiTP: 'Operasi Hitung Penjumlahan dan Pengurangan Bilangan Bulat',
    alokasiJP: 3,
    statusKaldik: 'EFEKTIF',
    statusKeterlaksanaan: 'terlaksana',
    catatan: 'Siswa aktif berdiskusi garis bilangan bulat'
  },
  {
    id: 'wex_2',
    tanggal: '2026-07-20',
    hari: 'Senin',
    jamMulai: '09:30',
    jamSelesai: '10:50',
    classId: 'cls_6',
    subjectId: 'sb_ipas',
    teacherId: 't_nurul',
    mingguKe: 2,
    bulan: 'Juli',
    materiTP: 'Bagaimana Tubuh Kita Bergerak (Rangka, Sendi, Otot)',
    alokasiJP: 2,
    statusKaldik: 'EFEKTIF',
    statusKeterlaksanaan: 'terlaksana',
    catatan: 'Praktik peraga model rangka sendi'
  },
  {
    id: 'wex_3',
    tanggal: '2026-08-17',
    hari: 'Senin',
    jamMulai: '07:00',
    jamSelesai: '09:00',
    classId: 'cls_6',
    subjectId: 'sb_mat',
    teacherId: 't_siti',
    mingguKe: 6,
    bulan: 'Agustus',
    materiTP: 'Perkalian dan Pembagian Pecahan Biasa, Campuran, serta Desimal',
    alokasiJP: 3,
    statusKaldik: 'LIBUR',
    statusKeterlaksanaan: 'dijadwalkan_ulang',
    catatan: 'Libur HUT Kemerdekaan RI ke-81, dipindahkan ke sesi tambahan Kamis',
    dijadwalkanUlangKeTanggal: '2026-08-20'
  },
  {
    id: 'wex_4',
    tanggal: '2026-09-14',
    hari: 'Senin',
    jamMulai: '07:00',
    jamSelesai: '09:00',
    classId: 'cls_6',
    subjectId: 'sb_mat',
    teacherId: 't_siti',
    mingguKe: 8,
    bulan: 'September',
    materiTP: 'Unsur-unsur Lingkaran, Keliling, dan Luas Lingkaran',
    alokasiJP: 3,
    statusKaldik: 'EFEKTIF',
    statusKeterlaksanaan: 'terlaksana',
    catatan: 'Praktek mengukur benda lingkaran menggunakan benang dan mistar'
  }
];

export const initialBackupHistory: BackupHistoryItem[] = [
  {
    id: 'bk_1',
    filename: 'simadu_backup_2026-09-15_08-00.sql',
    timestamp: '2026-09-15 08:00 WIB',
    size: '1.42 MB',
    type: 'otomatis',
    description: 'Backup Terjadwal Mingguan'
  },
  {
    id: 'bk_2',
    filename: 'simadu_backup_2026-09-10_14-30.sql',
    timestamp: '2026-09-10 14:30 WIB',
    size: '1.38 MB',
    type: 'manual',
    description: 'Backup Sebelum Sinkronisasi Kaldik'
  }
];

export const initialProfile = initialMadrasahProfile;
export const initialProta = initialProtaItems;
export const initialPromes = initialPromesItems;
export const initialCurriculumStructure = initialCurriculumStructures;

export const initialLessonHours = initialPeriods.map(p => ({
  id: p.id,
  jamKe: p.jamKe,
  mulai: p.jamMulai,
  selesai: p.jamSelesai,
  isBreak: p.isIstirahat,
  keterangan: p.keterangan
}));
