import {
  MadrasahProfile,
  Teacher,
  Subject,
  ClassRoom,
  Room,
  CalendarEvent,
  ProtaItem,
  PromesItem,
  ScheduleItem
} from '../types';

export function generateFullDatabaseSQL(data: any): string {
  return generateMySQLDump({
    profile: data.profile,
    teachers: data.teachers || [],
    subjects: data.subjects || [],
    classes: data.classes || [],
    rooms: data.rooms || [
      { id: 'r_01', kode: 'R.01', nama: 'Ruang Kelas I', kapasitas: 28, tipe: 'Teori' },
      { id: 'r_02', kode: 'R.02', nama: 'Ruang Kelas II', kapasitas: 28, tipe: 'Teori' },
      { id: 'r_03', kode: 'R.03', nama: 'Ruang Kelas III', kapasitas: 30, tipe: 'Teori' },
      { id: 'r_04', kode: 'R.04', nama: 'Ruang Kelas IV', kapasitas: 30, tipe: 'Teori' },
      { id: 'r_05', kode: 'R.05', nama: 'Ruang Kelas V', kapasitas: 32, tipe: 'Teori' },
      { id: 'r_06', kode: 'R.06', nama: 'Ruang Kelas VI', kapasitas: 32, tipe: 'Teori' }
    ],
    events: data.calendarEvents || data.events || [],
    protaList: data.protaList || [],
    promesList: data.promesList || [],
    schedules: data.schedules || []
  });
}

export function generateMySQLDump(data: {
  profile: MadrasahProfile;
  teachers: Teacher[];
  subjects: Subject[];
  classes: ClassRoom[];
  rooms: Room[];
  events: CalendarEvent[];
  protaList: ProtaItem[];
  promesList: PromesItem[];
  schedules: ScheduleItem[];
}): string {
  const now = new Date().toISOString().slice(0, 19).replace('T', ' ');

  let sql = `-- ==========================================================
-- SIMADU - SISTEM ADMINISTRASI PEMBELAJARAN MADRASAH TERPADU
-- Kreatif by Witno (witno70@gmail.com)
-- Madrasah: ${data.profile.nama}
-- Dibuat otomatis pada: ${now} WIB
-- Kompatibel: MySQL 5.7+, MySQL 8.0+, MariaDB 10.3+
-- Dapat langsung di-import di phpMyAdmin / CLI
-- ==========================================================

SET FOREIGN_KEY_CHECKS=0;
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+07:00";

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: \`simadu_db\`
--

-- --------------------------------------------------------
-- Table structure for table \`settings\`
-- --------------------------------------------------------
DROP TABLE IF EXISTS \`settings\`;
CREATE TABLE \`settings\` (
  \`id\` int(11) NOT NULL AUTO_INCREMENT,
  \`setting_key\` varchar(100) NOT NULL,
  \`setting_value\` text DEFAULT NULL,
  \`created_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  \`updated_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  UNIQUE KEY \`unique_key\` (\`setting_key\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO \`settings\` (\`setting_key\`, \`setting_value\`) VALUES
('madrasah_name', '${data.profile.nama.replace(/'/g, "''")}'),
('nsm', '${data.profile.nsm}'),
('npsn', '${data.profile.npsn}'),
('alamat', '${data.profile.alamat.replace(/'/g, "''")}'),
('kepala_madrasah', '${data.profile.kepalaMadrasah.replace(/'/g, "''")}'),
('nip_kepala', '${data.profile.nipKepala}'),
('tahun_ajaran_aktif', '${data.profile.tahunPelajaranAktif}'),
('semester_aktif', '${data.profile.semesterAktif}'),
('tagline', 'SATU DATA, SATU SISTEM, ADMINISTRASI PEMBELAJARAN TERINTEGRASI');

-- --------------------------------------------------------
-- Table structure for table \`roles\`
-- --------------------------------------------------------
DROP TABLE IF EXISTS \`roles\`;
CREATE TABLE \`roles\` (
  \`id\` int(11) NOT NULL AUTO_INCREMENT,
  \`role_name\` varchar(50) NOT NULL,
  \`description\` varchar(255) DEFAULT NULL,
  PRIMARY KEY (\`id\`),
  UNIQUE KEY \`role_name\` (\`role_name\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO \`roles\` (\`id\`, \`role_name\`, \`description\`) VALUES
(1, 'super_admin', 'Seluruh akses sistem, pengaturan database, backup & restore'),
(2, 'admin_madrasah', 'Akses operasional Kaldik, Guru, Mapel, Rombel, Jadwal, Prota, Promes'),
(3, 'kepala_madrasah', 'Monitoring, validasi ketercapaian, supervisi, laporan pengesahan'),
(4, 'guru', 'Input Prota, Promes, Pembelajaran Mingguan, Cetak Dokumen Administrasi');

-- --------------------------------------------------------
-- Table structure for table \`users\`
-- --------------------------------------------------------
DROP TABLE IF EXISTS \`users\`;
CREATE TABLE \`users\` (
  \`id\` int(11) NOT NULL AUTO_INCREMENT,
  \`username\` varchar(50) NOT NULL,
  \`password\` varchar(255) NOT NULL,
  \`name\` varchar(150) NOT NULL,
  \`email\` varchar(100) NOT NULL,
  \`role_id\` int(11) NOT NULL,
  \`teacher_id\` varchar(50) DEFAULT NULL,
  \`created_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  \`updated_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  UNIQUE KEY \`username\` (\`username\`),
  KEY \`fk_users_role\` (\`role_id\`),
  CONSTRAINT \`fk_users_role\` FOREIGN KEY (\`role_id\`) REFERENCES \`roles\` (\`id\`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO \`users\` (\`id\`, \`username\`, \`password\`, \`name\`, \`email\`, \`role_id\`, \`teacher_id\`) VALUES
(1, 'witno', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '${data.profile.kepalaMadrasah.replace(/'/g, "''")}', 'witno70@gmail.com', 1, 't_witno'),
(2, 'admin_min1kotim', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Ahmad Muzaki, S.Kom (Operator SIMADU)', 'admin.simadu@min1kotim.sch.id', 2, NULL);

-- --------------------------------------------------------
-- Table structure for table \`academic_years\`
-- --------------------------------------------------------
DROP TABLE IF EXISTS \`academic_years\`;
CREATE TABLE \`academic_years\` (
  \`id\` varchar(50) NOT NULL,
  \`tahun\` varchar(20) NOT NULL,
  \`is_active\` tinyint(1) NOT NULL DEFAULT 0,
  \`start_date\` date NOT NULL,
  \`end_date\` date NOT NULL,
  \`created_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO \`academic_years\` (\`id\`, \`tahun\`, \`is_active\`, \`start_date\`, \`end_date\`) VALUES
('ay_2026_2027', '2026/2027', 1, '2026-07-13', '2027-06-25');

-- --------------------------------------------------------
-- Table structure for table \`semesters\`
-- --------------------------------------------------------
DROP TABLE IF EXISTS \`semesters\`;
CREATE TABLE \`semesters\` (
  \`id\` int(11) NOT NULL,
  \`academic_year_id\` varchar(50) NOT NULL,
  \`semester_name\` enum('Ganjil','Genap') NOT NULL,
  \`is_active\` tinyint(1) NOT NULL DEFAULT 0,
  \`start_date\` date NOT NULL,
  \`end_date\` date NOT NULL,
  PRIMARY KEY (\`id\`),
  KEY \`fk_sem_ay\` (\`academic_year_id\`),
  CONSTRAINT \`fk_sem_ay\` FOREIGN KEY (\`academic_year_id\`) REFERENCES \`academic_years\` (\`id\`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO \`semesters\` (\`id\`, \`academic_year_id\`, \`semester_name\`, \`is_active\`, \`start_date\`, \`end_date\`) VALUES
(1, 'ay_2026_2027', 'Ganjil', 1, '2026-07-13', '2026-12-19'),
(2, 'ay_2026_2027', 'Genap', 0, '2027-01-04', '2027-06-25');

-- --------------------------------------------------------
-- Table structure for table \`teachers\`
-- --------------------------------------------------------
DROP TABLE IF EXISTS \`teachers\`;
CREATE TABLE \`teachers\` (
  \`id\` varchar(50) NOT NULL,
  \`nip\` varchar(30) NOT NULL,
  \`nama\` varchar(120) NOT NULL,
  \`gelar\` varchar(30) DEFAULT NULL,
  \`jenis_kelamin\` enum('L','P') NOT NULL,
  \`jabatan\` varchar(100) DEFAULT NULL,
  \`mapel_utama\` varchar(100) DEFAULT NULL,
  \`telepon\` varchar(30) DEFAULT NULL,
  \`email\` varchar(100) DEFAULT NULL,
  \`max_jp\` int(11) NOT NULL DEFAULT 24,
  \`warna\` varchar(20) DEFAULT '#059669',
  \`created_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  UNIQUE KEY \`nip\` (\`nip\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

`;

  // Teachers INSERT
  data.teachers.forEach(t => {
    sql += `INSERT INTO \`teachers\` (\`id\`, \`nip\`, \`nama\`, \`gelar\`, \`jenis_kelamin\`, \`jabatan\`, \`mapel_utama\`, \`telepon\`, \`email\`, \`max_jp\`, \`warna\`) VALUES
('${t.id}', '${t.nip}', '${t.nama.replace(/'/g, "''")}', '${t.gelar}', '${t.jenisKelamin}', '${t.jabatan.replace(/'/g, "''")}', '${t.mapelUtama.replace(/'/g, "''")}', '${t.telepon}', '${t.email}', ${t.maxJp}, '${t.warna}');\n`;
  });

  sql += `\n-- --------------------------------------------------------
-- Table structure for table \`subjects\`
-- --------------------------------------------------------
DROP TABLE IF EXISTS \`subjects\`;
CREATE TABLE \`subjects\` (
  \`id\` varchar(50) NOT NULL,
  \`kode\` varchar(20) NOT NULL,
  \`nama\` varchar(120) NOT NULL,
  \`kategori\` enum('Agama','Umum','Muatan Lokal','Pilihan') NOT NULL,
  \`kelompok\` varchar(10) NOT NULL DEFAULT 'A',
  \`jp_default\` int(11) NOT NULL DEFAULT 4,
  \`warna\` varchar(20) DEFAULT '#0284c7',
  \`created_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  UNIQUE KEY \`kode\` (\`kode\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;\n\n`;

  data.subjects.forEach(s => {
    sql += `INSERT INTO \`subjects\` (\`id\`, \`kode\`, \`nama\`, \`kategori\`, \`kelompok\`, \`jp_default\`, \`warna\`) VALUES
('${s.id}', '${s.kode}', '${s.nama.replace(/'/g, "''")}', '${s.kategori}', '${s.kelompok}', ${s.jpDefault}, '${s.warna}');\n`;
  });

  sql += `\n-- --------------------------------------------------------
-- Table structure for table \`rooms\`
-- --------------------------------------------------------
DROP TABLE IF EXISTS \`rooms\`;
CREATE TABLE \`rooms\` (
  \`id\` varchar(50) NOT NULL,
  \`kode\` varchar(20) NOT NULL,
  \`nama\` varchar(100) NOT NULL,
  \`kapasitas\` int(11) NOT NULL DEFAULT 30,
  \`tipe\` varchar(50) NOT NULL DEFAULT 'Teori',
  PRIMARY KEY (\`id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;\n\n`;

  data.rooms.forEach(r => {
    sql += `INSERT INTO \`rooms\` (\`id\`, \`kode\`, \`nama\`, \`kapasitas\`, \`tipe\`) VALUES
('${r.id}', '${r.kode}', '${r.nama.replace(/'/g, "''")}', ${r.kapasitas}, '${r.tipe}');\n`;
  });

  sql += `\n-- --------------------------------------------------------
-- Table structure for table \`classes\`
-- --------------------------------------------------------
DROP TABLE IF EXISTS \`classes\`;
CREATE TABLE \`classes\` (
  \`id\` varchar(50) NOT NULL,
  \`tingkat\` int(11) NOT NULL,
  \`nama\` varchar(50) NOT NULL,
  \`rombel\` varchar(10) NOT NULL DEFAULT 'A',
  \`ruang_id\` varchar(50) DEFAULT NULL,
  \`wali_kelas_id\` varchar(50) DEFAULT NULL,
  \`jumlah_siswa\` int(11) NOT NULL DEFAULT 28,
  PRIMARY KEY (\`id\`),
  KEY \`fk_cls_room\` (\`ruang_id\`),
  KEY \`fk_cls_teacher\` (\`wali_kelas_id\`),
  CONSTRAINT \`fk_cls_room\` FOREIGN KEY (\`ruang_id\`) REFERENCES \`rooms\` (\`id\`) ON DELETE SET NULL,
  CONSTRAINT \`fk_cls_teacher\` FOREIGN KEY (\`wali_kelas_id\`) REFERENCES \`teachers\` (\`id\`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;\n\n`;

  data.classes.forEach(c => {
    sql += `INSERT INTO \`classes\` (\`id\`, \`tingkat\`, \`nama\`, \`rombel\`, \`ruang_id\`, \`wali_kelas_id\`, \`jumlah_siswa\`) VALUES
('${c.id}', ${c.tingkat}, '${c.nama}', '${c.rombel}', '${c.ruangId}', '${c.waliKelasId}', ${c.jumlahSiswa});\n`;
  });

  sql += `\n-- --------------------------------------------------------
-- Table structure for table \`calendar_events\`
-- --------------------------------------------------------
DROP TABLE IF EXISTS \`calendar_events\`;
CREATE TABLE \`calendar_events\` (
  \`id\` varchar(50) NOT NULL,
  \`tanggal\` date NOT NULL,
  \`judul\` varchar(150) NOT NULL,
  \`tipe\` enum('EFEKTIF','LIBUR','KEGIATAN','ASESMEN','RAPOR','LAINNYA') NOT NULL DEFAULT 'EFEKTIF',
  \`keterangan\` text DEFAULT NULL,
  \`warna\` varchar(20) DEFAULT NULL,
  \`created_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  KEY \`idx_tanggal\` (\`tanggal\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;\n\n`;

  data.events.forEach(e => {
    sql += `INSERT INTO \`calendar_events\` (\`id\`, \`tanggal\`, \`judul\`, \`tipe\`, \`keterangan\`, \`warna\`) VALUES
('${e.id}', '${e.tanggal}', '${e.judul.replace(/'/g, "''")}', '${e.tipe}', '${(e.keterangan || '').replace(/'/g, "''")}', '${e.warna || ''}');\n`;
  });

  sql += `\n-- --------------------------------------------------------
-- Table structure for table \`annual_programs\` (PROTA)
-- --------------------------------------------------------
DROP TABLE IF EXISTS \`annual_programs\`;
CREATE TABLE \`annual_programs\` (
  \`id\` varchar(50) NOT NULL,
  \`tingkat\` int(11) NOT NULL,
  \`subject_id\` varchar(50) NOT NULL,
  \`teacher_id\` varchar(50) NOT NULL,
  \`semester\` enum('Ganjil','Genap') NOT NULL DEFAULT 'Ganjil',
  \`no_urut\` int(11) NOT NULL DEFAULT 1,
  \`lingkup_materi\` varchar(255) NOT NULL,
  \`atp\` text NOT NULL,
  \`materi_tp\` text NOT NULL,
  \`alokasi_jp\` int(11) NOT NULL,
  \`perkiraan_bulan\` varchar(50) DEFAULT NULL,
  \`perkiraan_minggu_ke\` int(11) DEFAULT 1,
  \`keterangan\` varchar(255) DEFAULT NULL,
  PRIMARY KEY (\`id\`),
  KEY \`fk_prota_sub\` (\`subject_id\`),
  KEY \`fk_prota_tea\` (\`teacher_id\`),
  CONSTRAINT \`fk_prota_sub\` FOREIGN KEY (\`subject_id\`) REFERENCES \`subjects\` (\`id\`) ON DELETE CASCADE,
  CONSTRAINT \`fk_prota_tea\` FOREIGN KEY (\`teacher_id\`) REFERENCES \`teachers\` (\`id\`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;\n\n`;

  data.protaList.forEach(p => {
    sql += `INSERT INTO \`annual_programs\` (\`id\`, \`tingkat\`, \`subject_id\`, \`teacher_id\`, \`semester\`, \`no_urut\`, \`lingkup_materi\`, \`atp\`, \`materi_tp\`, \`alokasi_jp\`, \`perkiraan_bulan\`, \`perkiraan_minggu_ke\`, \`keterangan\`) VALUES
('${p.id}', ${p.tingkat}, '${p.subjectId}', '${p.teacherId}', '${p.semester}', ${p.noUrut}, '${p.lingkupMateri.replace(/'/g, "''")}', '${p.atp.replace(/'/g, "''")}', '${p.materiTP.replace(/'/g, "''")}', ${p.alokasiJP}, '${p.perkiraanBulan}', ${p.perkiraanMingguKe}, '${(p.keterangan || '').replace(/'/g, "''")}');\n`;
  });

  sql += `\n-- --------------------------------------------------------
-- Table structure for table \`semester_programs\` (PROMES)
-- --------------------------------------------------------
DROP TABLE IF EXISTS \`semester_programs\`;
CREATE TABLE \`semester_programs\` (
  \`id\` varchar(50) NOT NULL,
  \`prota_id\` varchar(50) NOT NULL,
  \`tingkat\` int(11) NOT NULL,
  \`subject_id\` varchar(50) NOT NULL,
  \`teacher_id\` varchar(50) NOT NULL,
  \`semester\` enum('Ganjil','Genap') NOT NULL DEFAULT 'Ganjil',
  \`materi_tp\` text NOT NULL,
  \`total_jp\` int(11) NOT NULL,
  \`weekly_distribution\` json NOT NULL,
  \`tanggal_pelaksanaan\` varchar(100) DEFAULT NULL,
  \`keterangan\` text DEFAULT NULL,
  PRIMARY KEY (\`id\`),
  KEY \`fk_promes_prota\` (\`prota_id\`),
  CONSTRAINT \`fk_promes_prota\` FOREIGN KEY (\`prota_id\`) REFERENCES \`annual_programs\` (\`id\`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;\n\n`;

  data.promesList.forEach(pm => {
    const distJson = JSON.stringify(pm.distribusiMingguan).replace(/'/g, "''");
    sql += `INSERT INTO \`semester_programs\` (\`id\`, \`prota_id\`, \`tingkat\`, \`subject_id\`, \`teacher_id\`, \`semester\`, \`materi_tp\`, \`total_jp\`, \`weekly_distribution\`, \`tanggal_pelaksanaan\`, \`keterangan\`) VALUES
('${pm.id}', '${pm.protaId}', ${pm.tingkat}, '${pm.subjectId}', '${pm.teacherId}', '${pm.semester}', '${pm.materiTP.replace(/'/g, "''")}', ${pm.totalJP}, '${distJson}', '${(pm.tanggalPelaksanaan || '').replace(/'/g, "''")}', '${(pm.keterangan || '').replace(/'/g, "''")}');\n`;
  });

  sql += `\n-- --------------------------------------------------------
-- Table structure for table \`lesson_schedules\` (JADWAL PELAJARAN)
-- --------------------------------------------------------
DROP TABLE IF EXISTS \`lesson_schedules\`;
CREATE TABLE \`lesson_schedules\` (
  \`id\` varchar(50) NOT NULL,
  \`academic_year_id\` varchar(50) NOT NULL,
  \`semester\` enum('Ganjil','Genap') NOT NULL DEFAULT 'Ganjil',
  \`hari\` varchar(20) NOT NULL,
  \`jam_ke\` int(11) NOT NULL,
  \`class_id\` varchar(50) NOT NULL,
  \`subject_id\` varchar(50) NOT NULL,
  \`teacher_id\` varchar(50) NOT NULL,
  \`room_id\` varchar(50) NOT NULL,
  PRIMARY KEY (\`id\`),
  KEY \`fk_sch_class\` (\`class_id\`),
  KEY \`fk_sch_sub\` (\`subject_id\`),
  KEY \`fk_sch_tea\` (\`teacher_id\`),
  KEY \`fk_sch_room\` (\`room_id\`),
  CONSTRAINT \`fk_sch_class\` FOREIGN KEY (\`class_id\`) REFERENCES \`classes\` (\`id\`) ON DELETE CASCADE,
  CONSTRAINT \`fk_sch_sub\` FOREIGN KEY (\`subject_id\`) REFERENCES \`subjects\` (\`id\`) ON DELETE CASCADE,
  CONSTRAINT \`fk_sch_tea\` FOREIGN KEY (\`teacher_id\`) REFERENCES \`teachers\` (\`id\`) ON DELETE CASCADE,
  CONSTRAINT \`fk_sch_room\` FOREIGN KEY (\`room_id\`) REFERENCES \`rooms\` (\`id\`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;\n\n`;

  data.schedules.forEach(sc => {
    sql += `INSERT INTO \`lesson_schedules\` (\`id\`, \`academic_year_id\`, \`semester\`, \`hari\`, \`jam_ke\`, \`class_id\`, \`subject_id\`, \`teacher_id\`, \`room_id\`) VALUES
('${sc.id}', '${sc.academicYearId}', '${sc.semester}', '${sc.hari}', ${sc.jamKe}, '${sc.classId}', '${sc.subjectId}', '${sc.teacherId}', '${sc.roomId}');\n`;
  });

  sql += `\n-- --------------------------------------------------------
-- Table structure for table \`audit_logs\`
-- --------------------------------------------------------
DROP TABLE IF EXISTS \`audit_logs\`;
CREATE TABLE \`audit_logs\` (
  \`id\` int(11) NOT NULL AUTO_INCREMENT,
  \`user_id\` int(11) DEFAULT NULL,
  \`action\` varchar(100) NOT NULL,
  \`module\` varchar(100) NOT NULL,
  \`details\` text DEFAULT NULL,
  \`ip_address\` varchar(50) DEFAULT NULL,
  \`created_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  KEY \`fk_audit_user\` (\`user_id\`),
  CONSTRAINT \`fk_audit_user\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\` (\`id\`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO \`audit_logs\` (\`action\`, \`module\`, \`details\`) VALUES
('INITIALIZE_DATABASE', 'SYSTEM', 'Sistem Administrasi SIMADU MIN 1 Kotim berhasil di-deploy.');

SET FOREIGN_KEY_CHECKS=1;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
`;

  return sql;
}
