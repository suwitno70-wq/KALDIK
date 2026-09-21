export type UserRole = 'super_admin' | 'admin_madrasah' | 'kepala_madrasah' | 'guru';

export interface User {
  id: string;
  username: string;
  name: string;
  role: UserRole;
  email: string;
  nip?: string;
  teacherId?: string;
  avatar?: string;
}

export interface MadrasahProfile {
  nama: string;
  nsm: string;
  npsn: string;
  alamat: string;
  kelurahan: string;
  kecamatan: string;
  kabupaten: string;
  provinsi: string;
  kodePos: string;
  telepon: string;
  email: string;
  website: string;
  kepalaMadrasah: string;
  nipKepala: string;
  akreditasi: string;
  tahunPelajaranAktif: string;
  semesterAktif: 'Ganjil' | 'Genap';
  kurikulum: string;
}

export interface AcademicYear {
  id: string;
  tahun: string; // e.g. "2026/2027"
  isAktif: boolean;
  tanggalMulai: string;
  tanggalSelesai: string;
}

export interface Semester {
  id: number;
  nama: 'Ganjil' | 'Genap';
  academicYearId: string;
  isAktif: boolean;
  tanggalMulai: string;
  tanggalSelesai: string;
}

export interface Teacher {
  id: string;
  nip: string;
  nama: string;
  gelar: string;
  jenisKelamin: 'L' | 'P';
  jabatan: string;
  mapelUtama: string;
  telepon: string;
  email: string;
  maxJp: number;
  warna: string;
}

export interface Subject {
  id: string;
  kode: string;
  nama: string;
  kategori: 'Agama' | 'Umum' | 'Muatan Lokal' | 'Pilihan';
  kelompok: 'A' | 'B';
  jpDefault: number;
  warna: string;
  tingkat?: number[];
  isMulok?: boolean;
  deskripsi?: string;
}

export interface ClassRoom {
  id: string;
  tingkat: number; // 1 to 6
  nama: string; // e.g. "Kelas VI-A"
  rombel: string; // "A"
  ruangId: string;
  waliKelasId: string;
  jumlahSiswa: number;
  ruangDefault?: string;
  kapasitas?: number;
}

export interface Room {
  id: string;
  kode: string;
  nama: string;
  kapasitas: number;
  tipe: 'Teori' | 'Laboratorium' | 'Perpustakaan' | 'Musholla';
}

export interface SchoolDay {
  id: number;
  hari: string; // "Senin", "Selasa", dll
  nama?: string;
  isBelajar: boolean;
  urutan: number;
}

export interface Period {
  id: number;
  jamKe: number;
  jamMulai: string;
  jamSelesai: string;
  isIstirahat: boolean;
  keterangan?: string;
}

export interface CurriculumStructure {
  id: string;
  tingkat: number; // 1 to 6
  subjectId: string;
  jpPerMinggu: number;
  jpMingguan?: number;
  jpTahunan?: number;
}

export type CalendarEventType = 'EFEKTIF' | 'LIBUR' | 'KEGIATAN' | 'ASESMEN' | 'RAPOR' | 'LAINNYA';

export interface CalendarEvent {
  id: string;
  tanggal: string; // YYYY-MM-DD
  judul: string;
  tipe: CalendarEventType;
  keterangan?: string;
  warna?: string;
}

export interface EffectiveWeekItem {
  bulanKey: string; // e.g. "2026-07"
  bulanNama: string; // "Juli"
  mingguKe: number; // 1, 2, 3...
  rentangTanggal: string; // "13 - 18 Juli 2026"
  tanggalMulai: string;
  tanggalSelesai: string;
  hariSekolah: number;
  hariLibur: number;
  hariEfektif: number;
  status: 'EFEKTIF' | 'TIDAK_EFEKTIF';
  keterangan: string;
}

export interface MonthlyEffectiveSummary {
  bulanNama: string;
  bulanKey: string;
  mingguKalender: number;
  hariEfektif: number;
  mingguEfektif: number;
  mingguTidakEfektif: number;
  jpEfektifMapelStandard: number; // based on avg or multiplier
}

export interface ProtaItem {
  id: string;
  tingkat: number;
  subjectId: string;
  teacherId: string;
  semester: 'Ganjil' | 'Genap';
  noUrut: number;
  lingkupMateri: string;
  atp: string;
  materiTP: string;
  alokasiJP: number;
  perkiraanBulan: string;
  perkiraanMingguKe: number;
  keterangan: string;
}

export interface PromesItem {
  id: string;
  protaId: string;
  tingkat: number;
  subjectId: string;
  teacherId: string;
  semester: 'Ganjil' | 'Genap';
  materiTP: string;
  totalJP: number;
  alokasiJP?: number;
  // key: "Juli-1", "Juli-2", etc. => number of JP in that effective week
  distribusiMingguan: Record<string, number>;
  distribusiMingguanSesi2?: Record<string, number>;
  distribusiMinggu?: any;
  distribusiMingguSesi2?: any;
  tanggalPelaksanaan?: string;
  tanggalPembelajaran?: string;
  keterangan: string;
  terdampakKaldik?: boolean;
}

export interface ScheduleItem {
  id: string;
  academicYearId: string;
  semester: 'Ganjil' | 'Genap';
  hari: string; // "Senin", "Selasa", ...
  jamKe: number;
  classId: string;
  subjectId: string;
  teacherId: string;
  roomId: string;
  ruang?: string;
}

export type KeterlaksanaanStatus = 'terlaksana' | 'belum_terlaksana' | 'dijadwalkan_ulang';

export interface WeeklyLessonExecution {
  id: string;
  tanggal: string; // YYYY-MM-DD
  hari: string;
  jamMulai: string;
  jamSelesai: string;
  classId: string;
  subjectId: string;
  teacherId: string;
  mingguKe: number;
  bulan: string;
  materiTP: string;
  alokasiJP: number;
  statusKaldik: CalendarEventType;
  statusKeterlaksanaan: KeterlaksanaanStatus;
  catatan: string;
  dijadwalkanUlangKeTanggal?: string;
}

export interface ValidationConflict {
  id: string;
  severity: 'conflict' | 'warning' | 'safe';
  category?: 'guru' | 'kelas' | 'ruang' | 'kurikulum' | 'kaldik' | 'promes' | 'prota' | string;
  type?: string;
  title?: string;
  message?: string;
  description?: string;
  detail?: string;
  itemRef?: string;
}

export interface SyncReport {
  timestamp: string;
  kaldikUpdated: boolean;
  totalHariEfektif: number;
  totalMingguEfektif: number;
  totalJPEfektif: number;
  protaSyncedCount: number;
  promesSyncedCount: number;
  schedulesCheckedCount: number;
  conflictsCount: number;
  warningsCount: number;
  details: string[];
}

export interface BackupHistoryItem {
  id: string;
  filename: string;
  timestamp: string;
  size: string;
  type: 'manual' | 'otomatis';
  description: string;
}

export type DayOfWeek = 'Senin' | 'Selasa' | 'Rabu' | 'Kamis' | 'Jumat' | 'Sabtu' | 'Minggu';

export interface LessonHour {
  id: number;
  jamKe: number;
  mulai: string;
  selesai: string;
  isBreak: boolean;
  keterangan?: string;
}

export interface WeeklyLearningSession {
  id: string;
  mingguKe: number;
  hari: string;
  tanggal: string;
  jamKe: number;
  classId: string;
  subjectId: string;
  teacherId: string;
  ruang?: string;
  materiTP: string;
  alokasiJP: number;
  status: 'TERLAKSANA' | 'BELUM' | 'DIJADWALKAN_ULANG';
  isKaldikLibur?: boolean;
  liburNote?: string;
}
