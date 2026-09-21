-- ==========================================================
-- SIMADU - SISTEM ADMINISTRASI PEMBELAJARAN MADRASAH TERPADU
-- Kreatif by Witno (witno70@gmail.com)
-- Madrasah: MIN 1 KOTAWARINGIN TIMUR
-- Dibuat otomatis pada: 2026-09-18 02:00:49 WIB
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
-- Database: `simadu_db`
--

-- --------------------------------------------------------
-- Table structure for table `settings`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `settings`;
CREATE TABLE `settings` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `setting_key` varchar(100) NOT NULL,
  `setting_value` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_key` (`setting_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `settings` (`setting_key`, `setting_value`) VALUES
('madrasah_name', 'MIN 1 KOTAWARINGIN TIMUR'),
('nsm', '111162020001'),
('npsn', '60703819'),
('alamat', 'Jl. Jenderal Sudirman Km. 2,5 Sampit'),
('kepala_madrasah', 'H. Witno, S.Pd.I., M.Pd.'),
('nip_kepala', '19790415 200501 1 008'),
('tahun_ajaran_aktif', '2026/2027'),
('semester_aktif', 'Ganjil'),
('tagline', 'SATU DATA, SATU SISTEM, ADMINISTRASI PEMBELAJARAN TERINTEGRASI');

-- --------------------------------------------------------
-- Table structure for table `roles`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `roles`;
CREATE TABLE `roles` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `role_name` varchar(50) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `role_name` (`role_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `roles` (`id`, `role_name`, `description`) VALUES
(1, 'super_admin', 'Seluruh akses sistem, pengaturan database, backup & restore'),
(2, 'admin_madrasah', 'Akses operasional Kaldik, Guru, Mapel, Rombel, Jadwal, Prota, Promes'),
(3, 'kepala_madrasah', 'Monitoring, validasi ketercapaian, supervisi, laporan pengesahan'),
(4, 'guru', 'Input Prota, Promes, Pembelajaran Mingguan, Cetak Dokumen Administrasi');

-- --------------------------------------------------------
-- Table structure for table `users`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `name` varchar(150) NOT NULL,
  `email` varchar(100) NOT NULL,
  `role_id` int(11) NOT NULL,
  `teacher_id` varchar(50) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  KEY `fk_users_role` (`role_id`),
  CONSTRAINT `fk_users_role` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `users` (`id`, `username`, `password`, `name`, `email`, `role_id`, `teacher_id`) VALUES
(1, 'witno', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'H. Witno, S.Pd.I., M.Pd.', 'witno70@gmail.com', 1, 't_witno'),
(2, 'admin_min1kotim', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Ahmad Muzaki, S.Kom (Operator SIMADU)', 'admin.simadu@min1kotim.sch.id', 2, NULL);

-- --------------------------------------------------------
-- Table structure for table `academic_years`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `academic_years`;
CREATE TABLE `academic_years` (
  `id` varchar(50) NOT NULL,
  `tahun` varchar(20) NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 0,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `academic_years` (`id`, `tahun`, `is_active`, `start_date`, `end_date`) VALUES
('ay_2026_2027', '2026/2027', 1, '2026-07-13', '2027-06-25');

-- --------------------------------------------------------
-- Table structure for table `semesters`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `semesters`;
CREATE TABLE `semesters` (
  `id` int(11) NOT NULL,
  `academic_year_id` varchar(50) NOT NULL,
  `semester_name` enum('Ganjil','Genap') NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 0,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_sem_ay` (`academic_year_id`),
  CONSTRAINT `fk_sem_ay` FOREIGN KEY (`academic_year_id`) REFERENCES `academic_years` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `semesters` (`id`, `academic_year_id`, `semester_name`, `is_active`, `start_date`, `end_date`) VALUES
(1, 'ay_2026_2027', 'Ganjil', 1, '2026-07-13', '2026-12-19'),
(2, 'ay_2026_2027', 'Genap', 0, '2027-01-04', '2027-06-25');

-- --------------------------------------------------------
-- Table structure for table `teachers`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `teachers`;
CREATE TABLE `teachers` (
  `id` varchar(50) NOT NULL,
  `nip` varchar(30) NOT NULL,
  `nama` varchar(120) NOT NULL,
  `gelar` varchar(30) DEFAULT NULL,
  `jenis_kelamin` enum('L','P') NOT NULL,
  `jabatan` varchar(100) DEFAULT NULL,
  `mapel_utama` varchar(100) DEFAULT NULL,
  `telepon` varchar(30) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `max_jp` int(11) NOT NULL DEFAULT 24,
  `warna` varchar(20) DEFAULT '#059669',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `nip` (`nip`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `teachers` (`id`, `nip`, `nama`, `gelar`, `jenis_kelamin`, `jabatan`, `mapel_utama`, `telepon`, `email`, `max_jp`, `warna`) VALUES
('t_witno', '19790415 200501 1 008', 'H. Witno', 'S.Pd.I., M.Pd.', 'L', 'Kepala Madrasah & Guru PAI', 'Pendidikan Agama Islam', '0812-5000-8899', 'witno70@gmail.com', 24, '#059669');
INSERT INTO `teachers` (`id`, `nip`, `nama`, `gelar`, `jenis_kelamin`, `jabatan`, `mapel_utama`, `telepon`, `email`, `max_jp`, `warna`) VALUES
('t_siti', '19850212 201001 2 015', 'Siti Rahmah', 'S.Pd.', 'P', 'Wali Kelas VI-A & Guru Matematika', 'Matematika', '0852-4911-2233', 'siti.rahmah@min1kotim.sch.id', 30, '#0284c7');
INSERT INTO `teachers` (`id`, `nip`, `nama`, `gelar`, `jenis_kelamin`, `jabatan`, `mapel_utama`, `telepon`, `email`, `max_jp`, `warna`) VALUES
('t_fauzi', '19881104 201403 1 002', 'Ahmad Fauzi', 'S.Pd.I.', 'L', 'Guru Bahasa Arab & SKI', 'Bahasa Arab', '0813-8822-7711', 'ahmad.fauzi@min1kotim.sch.id', 28, '#d97706');
INSERT INTO `teachers` (`id`, `nip`, `nama`, `gelar`, `jenis_kelamin`, `jabatan`, `mapel_utama`, `telepon`, `email`, `max_jp`, `warna`) VALUES
('t_nurul', '19920318 201902 2 007', 'Nurul Hidayah', 'S.Pd.', 'P', 'Wali Kelas V & Guru IPAS', 'IPAS & Bhs. Indonesia', '0877-3344-9988', 'nurul.hidayah@min1kotim.sch.id', 28, '#7c3aed');
INSERT INTO `teachers` (`id`, `nip`, `nama`, `gelar`, `jenis_kelamin`, `jabatan`, `mapel_utama`, `telepon`, `email`, `max_jp`, `warna`) VALUES
('t_budi', '19900825 201502 1 003', 'Budi Prasetyo', 'S.Pd.', 'L', 'Guru PJOK & Seni Budaya', 'PJOK', '0812-4455-6677', 'budi.prasetyo@min1kotim.sch.id', 26, '#dc2626');

-- --------------------------------------------------------
-- Table structure for table `subjects`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `subjects`;
CREATE TABLE `subjects` (
  `id` varchar(50) NOT NULL,
  `kode` varchar(20) NOT NULL,
  `nama` varchar(120) NOT NULL,
  `kategori` enum('Agama','Umum','Muatan Lokal','Pilihan') NOT NULL,
  `kelompok` varchar(10) NOT NULL DEFAULT 'A',
  `jp_default` int(11) NOT NULL DEFAULT 4,
  `warna` varchar(20) DEFAULT '#0284c7',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `kode` (`kode`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `subjects` (`id`, `kode`, `nama`, `kategori`, `kelompok`, `jp_default`, `warna`) VALUES
('sb_mat', 'MAT', 'Matematika', 'Umum', 'A', 5, '#0284c7');
INSERT INTO `subjects` (`id`, `kode`, `nama`, `kategori`, `kelompok`, `jp_default`, `warna`) VALUES
('sb_ipas', 'IPAS', 'Ilmu Pengetahuan Alam dan Sosial (IPAS)', 'Umum', 'A', 5, '#059669');
INSERT INTO `subjects` (`id`, `kode`, `nama`, `kategori`, `kelompok`, `jp_default`, `warna`) VALUES
('sb_ind', 'BIND', 'Bahasa Indonesia', 'Umum', 'A', 6, '#2563eb');
INSERT INTO `subjects` (`id`, `kode`, `nama`, `kategori`, `kelompok`, `jp_default`, `warna`) VALUES
('sb_pai', 'PAI', 'Pendidikan Agama Islam (PAI)', 'Agama', 'A', 4, '#10b981');
INSERT INTO `subjects` (`id`, `kode`, `nama`, `kategori`, `kelompok`, `jp_default`, `warna`) VALUES
('sb_arb', 'BARB', 'Bahasa Arab', 'Agama', 'A', 2, '#d97706');
INSERT INTO `subjects` (`id`, `kode`, `nama`, `kategori`, `kelompok`, `jp_default`, `warna`) VALUES
('sb_ppkn', 'PPKN', 'Pendidikan Pancasila', 'Umum', 'A', 4, '#ea580c');
INSERT INTO `subjects` (`id`, `kode`, `nama`, `kategori`, `kelompok`, `jp_default`, `warna`) VALUES
('sb_pjok', 'PJOK', 'Pendidikan Jasmani, Olahraga, & Kesehatan', 'Umum', 'B', 3, '#e11d48');
INSERT INTO `subjects` (`id`, `kode`, `nama`, `kategori`, `kelompok`, `jp_default`, `warna`) VALUES
('sb_seni', 'SB', 'Seni Budaya dan Prakarya', 'Umum', 'B', 3, '#8b5cf6');

-- --------------------------------------------------------
-- Table structure for table `rooms`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `rooms`;
CREATE TABLE `rooms` (
  `id` varchar(50) NOT NULL,
  `kode` varchar(20) NOT NULL,
  `nama` varchar(100) NOT NULL,
  `kapasitas` int(11) NOT NULL DEFAULT 30,
  `tipe` varchar(50) NOT NULL DEFAULT 'Teori',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `rooms` (`id`, `kode`, `nama`, `kapasitas`, `tipe`) VALUES
('r_01', 'R.01', 'Ruang Kelas I', 28, 'Teori');
INSERT INTO `rooms` (`id`, `kode`, `nama`, `kapasitas`, `tipe`) VALUES
('r_02', 'R.02', 'Ruang Kelas II', 28, 'Teori');
INSERT INTO `rooms` (`id`, `kode`, `nama`, `kapasitas`, `tipe`) VALUES
('r_03', 'R.03', 'Ruang Kelas III', 30, 'Teori');
INSERT INTO `rooms` (`id`, `kode`, `nama`, `kapasitas`, `tipe`) VALUES
('r_04', 'R.04', 'Ruang Kelas IV', 30, 'Teori');
INSERT INTO `rooms` (`id`, `kode`, `nama`, `kapasitas`, `tipe`) VALUES
('r_05', 'R.05', 'Ruang Kelas V', 32, 'Teori');
INSERT INTO `rooms` (`id`, `kode`, `nama`, `kapasitas`, `tipe`) VALUES
('r_06', 'R.06', 'Ruang Kelas VI', 32, 'Teori');

-- --------------------------------------------------------
-- Table structure for table `classes`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `classes`;
CREATE TABLE `classes` (
  `id` varchar(50) NOT NULL,
  `tingkat` int(11) NOT NULL,
  `nama` varchar(50) NOT NULL,
  `rombel` varchar(10) NOT NULL DEFAULT 'A',
  `ruang_id` varchar(50) DEFAULT NULL,
  `wali_kelas_id` varchar(50) DEFAULT NULL,
  `jumlah_siswa` int(11) NOT NULL DEFAULT 28,
  PRIMARY KEY (`id`),
  KEY `fk_cls_room` (`ruang_id`),
  KEY `fk_cls_teacher` (`wali_kelas_id`),
  CONSTRAINT `fk_cls_room` FOREIGN KEY (`ruang_id`) REFERENCES `rooms` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_cls_teacher` FOREIGN KEY (`wali_kelas_id`) REFERENCES `teachers` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `classes` (`id`, `tingkat`, `nama`, `rombel`, `ruang_id`, `wali_kelas_id`, `jumlah_siswa`) VALUES
('cls_1', 1, 'Kelas I', 'A', 'r_01', 't_budi', 26);
INSERT INTO `classes` (`id`, `tingkat`, `nama`, `rombel`, `ruang_id`, `wali_kelas_id`, `jumlah_siswa`) VALUES
('cls_2', 2, 'Kelas II', 'A', 'r_02', 't_fauzi', 27);
INSERT INTO `classes` (`id`, `tingkat`, `nama`, `rombel`, `ruang_id`, `wali_kelas_id`, `jumlah_siswa`) VALUES
('cls_3', 3, 'Kelas III', 'A', 'r_03', 't_nurul', 28);
INSERT INTO `classes` (`id`, `tingkat`, `nama`, `rombel`, `ruang_id`, `wali_kelas_id`, `jumlah_siswa`) VALUES
('cls_4', 4, 'Kelas IV', 'A', 'r_04', 't_fauzi', 29);
INSERT INTO `classes` (`id`, `tingkat`, `nama`, `rombel`, `ruang_id`, `wali_kelas_id`, `jumlah_siswa`) VALUES
('cls_5', 5, 'Kelas V', 'A', 'r_05', 't_nurul', 30);
INSERT INTO `classes` (`id`, `tingkat`, `nama`, `rombel`, `ruang_id`, `wali_kelas_id`, `jumlah_siswa`) VALUES
('cls_6', 6, 'Kelas VI', 'A', 'r_06', 't_siti', 30);

-- --------------------------------------------------------
-- Table structure for table `calendar_events`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `calendar_events`;
CREATE TABLE `calendar_events` (
  `id` varchar(50) NOT NULL,
  `tanggal` date NOT NULL,
  `judul` varchar(150) NOT NULL,
  `tipe` enum('EFEKTIF','LIBUR','KEGIATAN','ASESMEN','RAPOR','LAINNYA') NOT NULL DEFAULT 'EFEKTIF',
  `keterangan` text DEFAULT NULL,
  `warna` varchar(20) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_tanggal` (`tanggal`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `calendar_events` (`id`, `tanggal`, `judul`, `tipe`, `keterangan`, `warna`) VALUES
('cal_1', '2026-07-13', 'Hari Pertama Masuk TP 2026/2027', 'KEGIATAN', 'Masa Ta’aruf Siswa Madrasah (Matsama)', '#0284c7');
INSERT INTO `calendar_events` (`id`, `tanggal`, `judul`, `tipe`, `keterangan`, `warna`) VALUES
('cal_2', '2026-07-14', 'Matsama Hari Ke-2', 'KEGIATAN', 'Orientasi Lingkungan Madrasah', '');
INSERT INTO `calendar_events` (`id`, `tanggal`, `judul`, `tipe`, `keterangan`, `warna`) VALUES
('cal_3', '2026-07-15', 'Matsama Hari Ke-3 & Pembukaan KBM', 'KEGIATAN', 'Sosialisasi Tata Tertib', '');
INSERT INTO `calendar_events` (`id`, `tanggal`, `judul`, `tipe`, `keterangan`, `warna`) VALUES
('cal_4', '2026-08-17', 'HUT Kemerdekaan RI Ke-81', 'LIBUR', 'Upacara Bendera & Hari Libur Nasional', '#dc2626');
INSERT INTO `calendar_events` (`id`, `tanggal`, `judul`, `tipe`, `keterangan`, `warna`) VALUES
('cal_5', '2026-08-25', 'Maulid Nabi Muhammad SAW 1448 H', 'LIBUR', 'Libur Nasional Keagamaan', '#dc2626');
INSERT INTO `calendar_events` (`id`, `tanggal`, `judul`, `tipe`, `keterangan`, `warna`) VALUES
('cal_6', '2026-09-21', 'Asesmen Tengah Semester (ATS) Hari 1', 'ASESMEN', 'Pelaksanaan ATS Ganjil', '#d97706');
INSERT INTO `calendar_events` (`id`, `tanggal`, `judul`, `tipe`, `keterangan`, `warna`) VALUES
('cal_7', '2026-09-22', 'Asesmen Tengah Semester (ATS) Hari 2', 'ASESMEN', 'Pelaksanaan ATS Ganjil', '');
INSERT INTO `calendar_events` (`id`, `tanggal`, `judul`, `tipe`, `keterangan`, `warna`) VALUES
('cal_8', '2026-09-23', 'Asesmen Tengah Semester (ATS) Hari 3', 'ASESMEN', 'Pelaksanaan ATS Ganjil', '');
INSERT INTO `calendar_events` (`id`, `tanggal`, `judul`, `tipe`, `keterangan`, `warna`) VALUES
('cal_9', '2026-09-24', 'Asesmen Tengah Semester (ATS) Hari 4', 'ASESMEN', 'Pelaksanaan ATS Ganjil', '');
INSERT INTO `calendar_events` (`id`, `tanggal`, `judul`, `tipe`, `keterangan`, `warna`) VALUES
('cal_10', '2026-09-25', 'Asesmen Tengah Semester (ATS) Hari 5', 'ASESMEN', 'Pelaksanaan ATS Ganjil', '');
INSERT INTO `calendar_events` (`id`, `tanggal`, `judul`, `tipe`, `keterangan`, `warna`) VALUES
('cal_11', '2026-09-26', 'Asesmen Tengah Semester (ATS) Hari 6', 'ASESMEN', 'Pelaksanaan ATS Ganjil', '');
INSERT INTO `calendar_events` (`id`, `tanggal`, `judul`, `tipe`, `keterangan`, `warna`) VALUES
('cal_12', '2026-10-28', 'Peringatan Hari Sumpah Pemuda', 'KEGIATAN', 'Lomba Kreasi & Pidato Kebangsaan', '');
INSERT INTO `calendar_events` (`id`, `tanggal`, `judul`, `tipe`, `keterangan`, `warna`) VALUES
('cal_13', '2026-11-25', 'Hari Guru Nasional & HUT PGRI', 'KEGIATAN', 'Apresiasi Guru Madrasah Teladan', '');
INSERT INTO `calendar_events` (`id`, `tanggal`, `judul`, `tipe`, `keterangan`, `warna`) VALUES
('cal_14', '2026-11-30', 'Asesmen Akhir Semester (AAS) Hari 1', 'ASESMEN', 'Pelaksanaan Ujian AAS', '#d97706');
INSERT INTO `calendar_events` (`id`, `tanggal`, `judul`, `tipe`, `keterangan`, `warna`) VALUES
('cal_15', '2026-12-01', 'Asesmen Akhir Semester (AAS) Hari 2', 'ASESMEN', 'Pelaksanaan Ujian AAS', '');
INSERT INTO `calendar_events` (`id`, `tanggal`, `judul`, `tipe`, `keterangan`, `warna`) VALUES
('cal_16', '2026-12-02', 'Asesmen Akhir Semester (AAS) Hari 3', 'ASESMEN', 'Pelaksanaan Ujian AAS', '');
INSERT INTO `calendar_events` (`id`, `tanggal`, `judul`, `tipe`, `keterangan`, `warna`) VALUES
('cal_17', '2026-12-03', 'Asesmen Akhir Semester (AAS) Hari 4', 'ASESMEN', 'Pelaksanaan Ujian AAS', '');
INSERT INTO `calendar_events` (`id`, `tanggal`, `judul`, `tipe`, `keterangan`, `warna`) VALUES
('cal_18', '2026-12-04', 'Asesmen Akhir Semester (AAS) Hari 5', 'ASESMEN', 'Pelaksanaan Ujian AAS', '');
INSERT INTO `calendar_events` (`id`, `tanggal`, `judul`, `tipe`, `keterangan`, `warna`) VALUES
('cal_19', '2026-12-05', 'Asesmen Akhir Semester (AAS) Hari 6', 'ASESMEN', 'Pelaksanaan Ujian AAS', '');
INSERT INTO `calendar_events` (`id`, `tanggal`, `judul`, `tipe`, `keterangan`, `warna`) VALUES
('cal_20', '2026-12-14', 'Pekan Olahraga & Seni Madrasah (Classmeeting)', 'KEGIATAN', 'Classmeeting Antar Kelas', '');
INSERT INTO `calendar_events` (`id`, `tanggal`, `judul`, `tipe`, `keterangan`, `warna`) VALUES
('cal_21', '2026-12-19', 'Pembagian Buku Laporan Hasil Belajar (Rapor)', 'RAPOR', 'Penyerahan Rapor Semester Ganjil kepada Orang Tua', '#059669');
INSERT INTO `calendar_events` (`id`, `tanggal`, `judul`, `tipe`, `keterangan`, `warna`) VALUES
('cal_22', '2026-12-21', 'Libur Akhir Semester Ganjil Hari 1', 'LIBUR', 'Libur Pembelajaran', '#dc2626');
INSERT INTO `calendar_events` (`id`, `tanggal`, `judul`, `tipe`, `keterangan`, `warna`) VALUES
('cal_23', '2026-12-25', 'Hari Raya Natal (Libur Nasional)', 'LIBUR', 'Libur Nasional', '#dc2626');

-- --------------------------------------------------------
-- Table structure for table `annual_programs` (PROTA)
-- --------------------------------------------------------
DROP TABLE IF EXISTS `annual_programs`;
CREATE TABLE `annual_programs` (
  `id` varchar(50) NOT NULL,
  `tingkat` int(11) NOT NULL,
  `subject_id` varchar(50) NOT NULL,
  `teacher_id` varchar(50) NOT NULL,
  `semester` enum('Ganjil','Genap') NOT NULL DEFAULT 'Ganjil',
  `no_urut` int(11) NOT NULL DEFAULT 1,
  `lingkup_materi` varchar(255) NOT NULL,
  `atp` text NOT NULL,
  `materi_tp` text NOT NULL,
  `alokasi_jp` int(11) NOT NULL,
  `perkiraan_bulan` varchar(50) DEFAULT NULL,
  `perkiraan_minggu_ke` int(11) DEFAULT 1,
  `keterangan` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_prota_sub` (`subject_id`),
  KEY `fk_prota_tea` (`teacher_id`),
  CONSTRAINT `fk_prota_sub` FOREIGN KEY (`subject_id`) REFERENCES `subjects` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_prota_tea` FOREIGN KEY (`teacher_id`) REFERENCES `teachers` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `annual_programs` (`id`, `tingkat`, `subject_id`, `teacher_id`, `semester`, `no_urut`, `lingkup_materi`, `atp`, `materi_tp`, `alokasi_jp`, `perkiraan_bulan`, `perkiraan_minggu_ke`, `keterangan`) VALUES
('prota_6_mat_1', 6, 'sb_mat', 't_siti', 'Ganjil', 1, 'Bilangan Bulat & Pecahan', '6.1.1 Mengidentifikasi dan menghitung operasi hitung bilangan bulat positif dan negatif', 'Operasi Hitung Penjumlahan dan Pengurangan Bilangan Bulat', 10, 'Juli', 1, 'Tersinkron dengan Minggu Efektif');
INSERT INTO `annual_programs` (`id`, `tingkat`, `subject_id`, `teacher_id`, `semester`, `no_urut`, `lingkup_materi`, `atp`, `materi_tp`, `alokasi_jp`, `perkiraan_bulan`, `perkiraan_minggu_ke`, `keterangan`) VALUES
('prota_6_mat_2', 6, 'sb_mat', 't_siti', 'Ganjil', 2, 'Operasi Campuran Pecahan & Desimal', '6.1.2 Menyelesaikan masalah kontekstual operasi hitung campuran pecahan dan desimal', 'Perkalian dan Pembagian Pecahan Biasa, Campuran, serta Desimal', 15, 'Agustus', 2, 'Tersinkron dengan Minggu Efektif');
INSERT INTO `annual_programs` (`id`, `tingkat`, `subject_id`, `teacher_id`, `semester`, `no_urut`, `lingkup_materi`, `atp`, `materi_tp`, `alokasi_jp`, `perkiraan_bulan`, `perkiraan_minggu_ke`, `keterangan`) VALUES
('prota_6_mat_3', 6, 'sb_mat', 't_siti', 'Ganjil', 3, 'Lingkaran & Geometri Datar', '6.2.1 Menjelaskan titik pusat, jari-jari, diameter, busur, tali busur, tembereng, dan juring', 'Unsur-unsur Lingkaran, Keliling, dan Luas Lingkaran', 15, 'September', 1, 'Tersinkron dengan Minggu Efektif');
INSERT INTO `annual_programs` (`id`, `tingkat`, `subject_id`, `teacher_id`, `semester`, `no_urut`, `lingkup_materi`, `atp`, `materi_tp`, `alokasi_jp`, `perkiraan_bulan`, `perkiraan_minggu_ke`, `keterangan`) VALUES
('prota_6_mat_4', 6, 'sb_mat', 't_siti', 'Ganjil', 4, 'Bangun Ruang Prisma & Tabung', '6.2.2 Menemukan rumus luas permukaan dan volume bangun ruang prisma segitiga dan tabung', 'Luas Permukaan dan Volume Prisma serta Tabung', 15, 'Oktober', 2, 'Tersinkron dengan Minggu Efektif');
INSERT INTO `annual_programs` (`id`, `tingkat`, `subject_id`, `teacher_id`, `semester`, `no_urut`, `lingkup_materi`, `atp`, `materi_tp`, `alokasi_jp`, `perkiraan_bulan`, `perkiraan_minggu_ke`, `keterangan`) VALUES
('prota_6_mat_5', 6, 'sb_mat', 't_siti', 'Ganjil', 5, 'Pengolahan Data & Statistik Dasar', '6.3.1 Menyajikan dan membaca data dalam bentuk diagram batang, garis, dan lingkaran', 'Penyajian Data & Menentukan Mean, Median, Modus', 15, 'November', 1, 'Tersinkron dengan Minggu Efektif');
INSERT INTO `annual_programs` (`id`, `tingkat`, `subject_id`, `teacher_id`, `semester`, `no_urut`, `lingkup_materi`, `atp`, `materi_tp`, `alokasi_jp`, `perkiraan_bulan`, `perkiraan_minggu_ke`, `keterangan`) VALUES
('prota_6_mat_6', 6, 'sb_mat', 't_siti', 'Ganjil', 6, 'Proyek Penguatan & Asesmen Sumatif Akhir', '6.4.1 Evaluasi capaian pembelajaran semester ganjil dan penguatan materi esensial', 'Remedial, Pengayaan, dan Pemantapan Soal Literasi Numerasi', 10, 'Desember', 1, 'Menjelang Rapor');
INSERT INTO `annual_programs` (`id`, `tingkat`, `subject_id`, `teacher_id`, `semester`, `no_urut`, `lingkup_materi`, `atp`, `materi_tp`, `alokasi_jp`, `perkiraan_bulan`, `perkiraan_minggu_ke`, `keterangan`) VALUES
('prota_6_ipas_1', 6, 'sb_ipas', 't_nurul', 'Ganjil', 1, 'Tubuh Manusia & Sistem Gerak', '6.1.1 Mengidentifikasi organ gerak pada manusia (rangka, sendi, dan otot) serta fungsinya', 'Bagaimana Tubuh Kita Bergerak (Rangka, Sendi, Otot)', 15, 'Juli', 1, 'KMA 450');
INSERT INTO `annual_programs` (`id`, `tingkat`, `subject_id`, `teacher_id`, `semester`, `no_urut`, `lingkup_materi`, `atp`, `materi_tp`, `alokasi_jp`, `perkiraan_bulan`, `perkiraan_minggu_ke`, `keterangan`) VALUES
('prota_6_ipas_2', 6, 'sb_ipas', 't_nurul', 'Ganjil', 2, 'Sistem Saraf & Penginderaan', '6.1.2 Menjelaskan sistem saraf dan peran pancaindera dalam merespons rangsang', 'Sistem Saraf dan Cara Menjaga Kesehatan Organ Penginderaan', 15, 'Agustus', 2, 'KMA 450');
INSERT INTO `annual_programs` (`id`, `tingkat`, `subject_id`, `teacher_id`, `semester`, `no_urut`, `lingkup_materi`, `atp`, `materi_tp`, `alokasi_jp`, `perkiraan_bulan`, `perkiraan_minggu_ke`, `keterangan`) VALUES
('prota_6_ipas_3', 6, 'sb_ipas', 't_nurul', 'Ganjil', 3, 'Sejarah Perjuangan Bangsa & Proklamasi', '6.2.1 Menceritakan peristiwa proklamasi kemerdekaan dan tokoh-tokoh penting di baliknya', 'Perjuangan Menuju Kemerdekaan Indonesia & Makna Proklamasi', 15, 'September', 2, 'KMA 450');
INSERT INTO `annual_programs` (`id`, `tingkat`, `subject_id`, `teacher_id`, `semester`, `no_urut`, `lingkup_materi`, `atp`, `materi_tp`, `alokasi_jp`, `perkiraan_bulan`, `perkiraan_minggu_ke`, `keterangan`) VALUES
('prota_6_ipas_4', 6, 'sb_ipas', 't_nurul', 'Ganjil', 4, 'Bentang Alam & Karakteristik Wilayah Indonesia', '6.2.2 Menjelaskan letak geografis dan kekayaan alam kepulauan Nusantara', 'Kondisi Geografis dan Potensi Sumber Daya Alam Indonesia', 20, 'Oktober', 1, 'KMA 450');
INSERT INTO `annual_programs` (`id`, `tingkat`, `subject_id`, `teacher_id`, `semester`, `no_urut`, `lingkup_materi`, `atp`, `materi_tp`, `alokasi_jp`, `perkiraan_bulan`, `perkiraan_minggu_ke`, `keterangan`) VALUES
('prota_6_pai_1', 6, 'sb_pai', 't_witno', 'Ganjil', 1, 'Al-Qur’an Hadis: Surah Ad-Duha & As-Syams', '6.1.1 Membaca dan menghafal Surah Ad-Duha dengan makhraj yang fasih', 'Kandungan Nilai Keimanan Surah Ad-Duha', 16, 'Juli', 1, 'Kurikulum Kemenag');
INSERT INTO `annual_programs` (`id`, `tingkat`, `subject_id`, `teacher_id`, `semester`, `no_urut`, `lingkup_materi`, `atp`, `materi_tp`, `alokasi_jp`, `perkiraan_bulan`, `perkiraan_minggu_ke`, `keterangan`) VALUES
('prota_6_pai_2', 6, 'sb_pai', 't_witno', 'Ganjil', 2, 'Akidah: Beriman Kepada Hari Akhir (Kiamat)', '6.2.1 Meyakini tanda-tanda hari akhir dan meneladani hikmahnya dalam perilaku sehari-hari', 'Tanda-tanda Hari Akhir dan Tanggung Jawab Amal Saleh', 16, 'September', 1, 'Kurikulum Kemenag');

-- --------------------------------------------------------
-- Table structure for table `semester_programs` (PROMES)
-- --------------------------------------------------------
DROP TABLE IF EXISTS `semester_programs`;
CREATE TABLE `semester_programs` (
  `id` varchar(50) NOT NULL,
  `prota_id` varchar(50) NOT NULL,
  `tingkat` int(11) NOT NULL,
  `subject_id` varchar(50) NOT NULL,
  `teacher_id` varchar(50) NOT NULL,
  `semester` enum('Ganjil','Genap') NOT NULL DEFAULT 'Ganjil',
  `materi_tp` text NOT NULL,
  `total_jp` int(11) NOT NULL,
  `weekly_distribution` json NOT NULL,
  `tanggal_pelaksanaan` varchar(100) DEFAULT NULL,
  `keterangan` text DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_promes_prota` (`prota_id`),
  CONSTRAINT `fk_promes_prota` FOREIGN KEY (`prota_id`) REFERENCES `annual_programs` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `semester_programs` (`id`, `prota_id`, `tingkat`, `subject_id`, `teacher_id`, `semester`, `materi_tp`, `total_jp`, `weekly_distribution`, `tanggal_pelaksanaan`, `keterangan`) VALUES
('promes_6_mat_1', 'prota_6_mat_1', 6, 'sb_mat', 't_siti', 'Ganjil', 'Operasi Hitung Penjumlahan dan Pengurangan Bilangan Bulat', 10, '{"Juli-1":5,"Juli-2":5}', '13 - 25 Juli 2026', 'Selesai tepat waktu');
INSERT INTO `semester_programs` (`id`, `prota_id`, `tingkat`, `subject_id`, `teacher_id`, `semester`, `materi_tp`, `total_jp`, `weekly_distribution`, `tanggal_pelaksanaan`, `keterangan`) VALUES
('promes_6_mat_2', 'prota_6_mat_2', 6, 'sb_mat', 't_siti', 'Ganjil', 'Perkalian dan Pembagian Pecahan Biasa, Campuran, serta Desimal', 15, '{"Agustus-1":5,"Agustus-2":5,"Agustus-3":5}', '03 - 22 Agustus 2026', 'Dipadukan dengan evaluasi');
INSERT INTO `semester_programs` (`id`, `prota_id`, `tingkat`, `subject_id`, `teacher_id`, `semester`, `materi_tp`, `total_jp`, `weekly_distribution`, `tanggal_pelaksanaan`, `keterangan`) VALUES
('promes_6_mat_3', 'prota_6_mat_3', 6, 'sb_mat', 't_siti', 'Ganjil', 'Unsur-unsur Lingkaran, Keliling, dan Luas Lingkaran', 15, '{"September-1":5,"September-2":5,"September-3":5}', '31 Agu - 19 September 2026', 'Tersinkronisasi');
INSERT INTO `semester_programs` (`id`, `prota_id`, `tingkat`, `subject_id`, `teacher_id`, `semester`, `materi_tp`, `total_jp`, `weekly_distribution`, `tanggal_pelaksanaan`, `keterangan`) VALUES
('promes_6_mat_4', 'prota_6_mat_4', 6, 'sb_mat', 't_siti', 'Ganjil', 'Luas Permukaan dan Volume Prisma serta Tabung', 15, '{"Oktober-1":5,"Oktober-2":5,"Oktober-3":5}', '05 - 24 Oktober 2026', 'Tersinkronisasi');
INSERT INTO `semester_programs` (`id`, `prota_id`, `tingkat`, `subject_id`, `teacher_id`, `semester`, `materi_tp`, `total_jp`, `weekly_distribution`, `tanggal_pelaksanaan`, `keterangan`) VALUES
('promes_6_mat_5', 'prota_6_mat_5', 6, 'sb_mat', 't_siti', 'Ganjil', 'Penyajian Data & Menentukan Mean, Median, Modus', 15, '{"November-1":5,"November-2":5,"November-3":5}', '02 - 21 November 2026', 'Tersinkronisasi');
INSERT INTO `semester_programs` (`id`, `prota_id`, `tingkat`, `subject_id`, `teacher_id`, `semester`, `materi_tp`, `total_jp`, `weekly_distribution`, `tanggal_pelaksanaan`, `keterangan`) VALUES
('promes_6_mat_6', 'prota_6_mat_6', 6, 'sb_mat', 't_siti', 'Ganjil', 'Remedial, Pengayaan, dan Pemantapan Soal Literasi Numerasi', 10, '{"November-4":5,"Desember-1":5}', '23 Nov - 05 Desember 2026', 'Persiapan Rapor');
INSERT INTO `semester_programs` (`id`, `prota_id`, `tingkat`, `subject_id`, `teacher_id`, `semester`, `materi_tp`, `total_jp`, `weekly_distribution`, `tanggal_pelaksanaan`, `keterangan`) VALUES
('promes_6_ipas_1', 'prota_6_ipas_1', 6, 'sb_ipas', 't_nurul', 'Ganjil', 'Bagaimana Tubuh Kita Bergerak (Rangka, Sendi, Otot)', 15, '{"Juli-1":5,"Juli-2":5,"Agustus-1":5}', '13 Juli - 08 Agustus 2026', 'Praktik anatomi sederhana');
INSERT INTO `semester_programs` (`id`, `prota_id`, `tingkat`, `subject_id`, `teacher_id`, `semester`, `materi_tp`, `total_jp`, `weekly_distribution`, `tanggal_pelaksanaan`, `keterangan`) VALUES
('promes_6_pai_1', 'prota_6_pai_1', 6, 'sb_pai', 't_witno', 'Ganjil', 'Kandungan Nilai Keimanan Surah Ad-Duha', 16, '{"Juli-1":4,"Juli-2":4,"Agustus-1":4,"Agustus-2":4}', '13 Juli - 15 Agustus 2026', 'Hafalan & Tadabbur');

-- --------------------------------------------------------
-- Table structure for table `lesson_schedules` (JADWAL PELAJARAN)
-- --------------------------------------------------------
DROP TABLE IF EXISTS `lesson_schedules`;
CREATE TABLE `lesson_schedules` (
  `id` varchar(50) NOT NULL,
  `academic_year_id` varchar(50) NOT NULL,
  `semester` enum('Ganjil','Genap') NOT NULL DEFAULT 'Ganjil',
  `hari` varchar(20) NOT NULL,
  `jam_ke` int(11) NOT NULL,
  `class_id` varchar(50) NOT NULL,
  `subject_id` varchar(50) NOT NULL,
  `teacher_id` varchar(50) NOT NULL,
  `room_id` varchar(50) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_sch_class` (`class_id`),
  KEY `fk_sch_sub` (`subject_id`),
  KEY `fk_sch_tea` (`teacher_id`),
  KEY `fk_sch_room` (`room_id`),
  CONSTRAINT `fk_sch_class` FOREIGN KEY (`class_id`) REFERENCES `classes` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_sch_sub` FOREIGN KEY (`subject_id`) REFERENCES `subjects` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_sch_tea` FOREIGN KEY (`teacher_id`) REFERENCES `teachers` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_sch_room` FOREIGN KEY (`room_id`) REFERENCES `rooms` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `lesson_schedules` (`id`, `academic_year_id`, `semester`, `hari`, `jam_ke`, `class_id`, `subject_id`, `teacher_id`, `room_id`) VALUES
('sch_1', 'ay_2026_2027', 'Ganjil', 'Senin', 1, 'cls_6', 'sb_mat', 't_siti', 'r_06');
INSERT INTO `lesson_schedules` (`id`, `academic_year_id`, `semester`, `hari`, `jam_ke`, `class_id`, `subject_id`, `teacher_id`, `room_id`) VALUES
('sch_2', 'ay_2026_2027', 'Ganjil', 'Senin', 2, 'cls_6', 'sb_mat', 't_siti', 'r_06');
INSERT INTO `lesson_schedules` (`id`, `academic_year_id`, `semester`, `hari`, `jam_ke`, `class_id`, `subject_id`, `teacher_id`, `room_id`) VALUES
('sch_3', 'ay_2026_2027', 'Ganjil', 'Senin', 3, 'cls_6', 'sb_mat', 't_siti', 'r_06');
INSERT INTO `lesson_schedules` (`id`, `academic_year_id`, `semester`, `hari`, `jam_ke`, `class_id`, `subject_id`, `teacher_id`, `room_id`) VALUES
('sch_4', 'ay_2026_2027', 'Ganjil', 'Senin', 5, 'cls_6', 'sb_ipas', 't_nurul', 'r_06');
INSERT INTO `lesson_schedules` (`id`, `academic_year_id`, `semester`, `hari`, `jam_ke`, `class_id`, `subject_id`, `teacher_id`, `room_id`) VALUES
('sch_5', 'ay_2026_2027', 'Ganjil', 'Senin', 6, 'cls_6', 'sb_ipas', 't_nurul', 'r_06');
INSERT INTO `lesson_schedules` (`id`, `academic_year_id`, `semester`, `hari`, `jam_ke`, `class_id`, `subject_id`, `teacher_id`, `room_id`) VALUES
('sch_6', 'ay_2026_2027', 'Ganjil', 'Senin', 1, 'cls_5', 'sb_pai', 't_witno', 'r_05');
INSERT INTO `lesson_schedules` (`id`, `academic_year_id`, `semester`, `hari`, `jam_ke`, `class_id`, `subject_id`, `teacher_id`, `room_id`) VALUES
('sch_7', 'ay_2026_2027', 'Ganjil', 'Senin', 2, 'cls_5', 'sb_pai', 't_witno', 'r_05');
INSERT INTO `lesson_schedules` (`id`, `academic_year_id`, `semester`, `hari`, `jam_ke`, `class_id`, `subject_id`, `teacher_id`, `room_id`) VALUES
('sch_8', 'ay_2026_2027', 'Ganjil', 'Senin', 3, 'cls_5', 'sb_arb', 't_fauzi', 'r_05');
INSERT INTO `lesson_schedules` (`id`, `academic_year_id`, `semester`, `hari`, `jam_ke`, `class_id`, `subject_id`, `teacher_id`, `room_id`) VALUES
('sch_9', 'ay_2026_2027', 'Ganjil', 'Senin', 5, 'cls_5', 'sb_mat', 't_siti', 'r_05');
INSERT INTO `lesson_schedules` (`id`, `academic_year_id`, `semester`, `hari`, `jam_ke`, `class_id`, `subject_id`, `teacher_id`, `room_id`) VALUES
('sch_10', 'ay_2026_2027', 'Ganjil', 'Senin', 6, 'cls_5', 'sb_mat', 't_siti', 'r_05');
INSERT INTO `lesson_schedules` (`id`, `academic_year_id`, `semester`, `hari`, `jam_ke`, `class_id`, `subject_id`, `teacher_id`, `room_id`) VALUES
('sch_11', 'ay_2026_2027', 'Ganjil', 'Selasa', 1, 'cls_6', 'sb_pai', 't_witno', 'r_06');
INSERT INTO `lesson_schedules` (`id`, `academic_year_id`, `semester`, `hari`, `jam_ke`, `class_id`, `subject_id`, `teacher_id`, `room_id`) VALUES
('sch_12', 'ay_2026_2027', 'Ganjil', 'Selasa', 2, 'cls_6', 'sb_pai', 't_witno', 'r_06');
INSERT INTO `lesson_schedules` (`id`, `academic_year_id`, `semester`, `hari`, `jam_ke`, `class_id`, `subject_id`, `teacher_id`, `room_id`) VALUES
('sch_13', 'ay_2026_2027', 'Ganjil', 'Selasa', 3, 'cls_6', 'sb_arb', 't_fauzi', 'r_06');
INSERT INTO `lesson_schedules` (`id`, `academic_year_id`, `semester`, `hari`, `jam_ke`, `class_id`, `subject_id`, `teacher_id`, `room_id`) VALUES
('sch_14', 'ay_2026_2027', 'Ganjil', 'Selasa', 5, 'cls_6', 'sb_ind', 't_nurul', 'r_06');
INSERT INTO `lesson_schedules` (`id`, `academic_year_id`, `semester`, `hari`, `jam_ke`, `class_id`, `subject_id`, `teacher_id`, `room_id`) VALUES
('sch_15', 'ay_2026_2027', 'Ganjil', 'Selasa', 6, 'cls_6', 'sb_ind', 't_nurul', 'r_06');
INSERT INTO `lesson_schedules` (`id`, `academic_year_id`, `semester`, `hari`, `jam_ke`, `class_id`, `subject_id`, `teacher_id`, `room_id`) VALUES
('sch_16', 'ay_2026_2027', 'Ganjil', 'Rabu', 1, 'cls_6', 'sb_pjok', 't_budi', 'r_06');
INSERT INTO `lesson_schedules` (`id`, `academic_year_id`, `semester`, `hari`, `jam_ke`, `class_id`, `subject_id`, `teacher_id`, `room_id`) VALUES
('sch_17', 'ay_2026_2027', 'Ganjil', 'Rabu', 2, 'cls_6', 'sb_pjok', 't_budi', 'r_06');
INSERT INTO `lesson_schedules` (`id`, `academic_year_id`, `semester`, `hari`, `jam_ke`, `class_id`, `subject_id`, `teacher_id`, `room_id`) VALUES
('sch_18', 'ay_2026_2027', 'Ganjil', 'Rabu', 3, 'cls_6', 'sb_pjok', 't_budi', 'r_06');
INSERT INTO `lesson_schedules` (`id`, `academic_year_id`, `semester`, `hari`, `jam_ke`, `class_id`, `subject_id`, `teacher_id`, `room_id`) VALUES
('sch_19', 'ay_2026_2027', 'Ganjil', 'Rabu', 5, 'cls_6', 'sb_ppkn', 't_nurul', 'r_06');
INSERT INTO `lesson_schedules` (`id`, `academic_year_id`, `semester`, `hari`, `jam_ke`, `class_id`, `subject_id`, `teacher_id`, `room_id`) VALUES
('sch_20', 'ay_2026_2027', 'Ganjil', 'Rabu', 6, 'cls_6', 'sb_ppkn', 't_nurul', 'r_06');
INSERT INTO `lesson_schedules` (`id`, `academic_year_id`, `semester`, `hari`, `jam_ke`, `class_id`, `subject_id`, `teacher_id`, `room_id`) VALUES
('sch_21', 'ay_2026_2027', 'Ganjil', 'Kamis', 1, 'cls_6', 'sb_mat', 't_siti', 'r_06');
INSERT INTO `lesson_schedules` (`id`, `academic_year_id`, `semester`, `hari`, `jam_ke`, `class_id`, `subject_id`, `teacher_id`, `room_id`) VALUES
('sch_22', 'ay_2026_2027', 'Ganjil', 'Kamis', 2, 'cls_6', 'sb_mat', 't_siti', 'r_06');
INSERT INTO `lesson_schedules` (`id`, `academic_year_id`, `semester`, `hari`, `jam_ke`, `class_id`, `subject_id`, `teacher_id`, `room_id`) VALUES
('sch_23', 'ay_2026_2027', 'Ganjil', 'Kamis', 3, 'cls_6', 'sb_ipas', 't_nurul', 'r_06');
INSERT INTO `lesson_schedules` (`id`, `academic_year_id`, `semester`, `hari`, `jam_ke`, `class_id`, `subject_id`, `teacher_id`, `room_id`) VALUES
('sch_24', 'ay_2026_2027', 'Ganjil', 'Kamis', 5, 'cls_6', 'sb_seni', 't_budi', 'r_06');
INSERT INTO `lesson_schedules` (`id`, `academic_year_id`, `semester`, `hari`, `jam_ke`, `class_id`, `subject_id`, `teacher_id`, `room_id`) VALUES
('sch_25', 'ay_2026_2027', 'Ganjil', 'Kamis', 6, 'cls_6', 'sb_seni', 't_budi', 'r_06');
INSERT INTO `lesson_schedules` (`id`, `academic_year_id`, `semester`, `hari`, `jam_ke`, `class_id`, `subject_id`, `teacher_id`, `room_id`) VALUES
('sch_26', 'ay_2026_2027', 'Ganjil', 'Jumat', 1, 'cls_6', 'sb_pai', 't_witno', 'r_06');
INSERT INTO `lesson_schedules` (`id`, `academic_year_id`, `semester`, `hari`, `jam_ke`, `class_id`, `subject_id`, `teacher_id`, `room_id`) VALUES
('sch_27', 'ay_2026_2027', 'Ganjil', 'Jumat', 2, 'cls_6', 'sb_pai', 't_witno', 'r_06');
INSERT INTO `lesson_schedules` (`id`, `academic_year_id`, `semester`, `hari`, `jam_ke`, `class_id`, `subject_id`, `teacher_id`, `room_id`) VALUES
('sch_28', 'ay_2026_2027', 'Ganjil', 'Jumat', 3, 'cls_6', 'sb_arb', 't_fauzi', 'r_06');
INSERT INTO `lesson_schedules` (`id`, `academic_year_id`, `semester`, `hari`, `jam_ke`, `class_id`, `subject_id`, `teacher_id`, `room_id`) VALUES
('sch_29', 'ay_2026_2027', 'Ganjil', 'Sabtu', 1, 'cls_6', 'sb_ind', 't_nurul', 'r_06');
INSERT INTO `lesson_schedules` (`id`, `academic_year_id`, `semester`, `hari`, `jam_ke`, `class_id`, `subject_id`, `teacher_id`, `room_id`) VALUES
('sch_30', 'ay_2026_2027', 'Ganjil', 'Sabtu', 2, 'cls_6', 'sb_ind', 't_nurul', 'r_06');
INSERT INTO `lesson_schedules` (`id`, `academic_year_id`, `semester`, `hari`, `jam_ke`, `class_id`, `subject_id`, `teacher_id`, `room_id`) VALUES
('sch_31', 'ay_2026_2027', 'Ganjil', 'Sabtu', 3, 'cls_6', 'sb_seni', 't_budi', 'r_06');

-- --------------------------------------------------------
-- Table structure for table `audit_logs`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `audit_logs`;
CREATE TABLE `audit_logs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL,
  `action` varchar(100) NOT NULL,
  `module` varchar(100) NOT NULL,
  `details` text DEFAULT NULL,
  `ip_address` varchar(50) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_audit_user` (`user_id`),
  CONSTRAINT `fk_audit_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `audit_logs` (`action`, `module`, `details`) VALUES
('INITIALIZE_DATABASE', 'SYSTEM', 'Sistem Administrasi SIMADU MIN 1 Kotim berhasil di-deploy.');

SET FOREIGN_KEY_CHECKS=1;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
