import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { initialProfile, initialTeachers, initialSubjects, initialClasses, initialCalendarEvents, initialProta, initialPromes, initialSchedules } from '../src/data/initialData';
import { generateFullDatabaseSQL } from '../src/services/sqlGenerator';
import { phpDatabaseConfig, phpApiRouter, htaccessContent, deploymentReadme } from '../src/services/hostingPackage';

console.log('🚀 [SIMADU] Memulai proses pembuatan paket ZIP public_html untuk cPanel File Manager...');

// 1. Jalankan build produksi Vite
console.log('📦 Menjalankan build frontend (Vite)...');
execSync('npm run build', { stdio: 'inherit' });

const stagingDir = path.resolve('staging_public_html');
if (fs.existsSync(stagingDir)) {
  fs.rmSync(stagingDir, { recursive: true, force: true });
}
fs.mkdirSync(stagingDir, { recursive: true });

// 2. Salin seluruh isi dist/ ke staging_public_html
const distDir = path.resolve('dist');
function copyRecursive(src: string, dest: string) {
  const stats = fs.statSync(src);
  if (stats.isDirectory()) {
    if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
    fs.readdirSync(src).forEach(childItemName => {
      copyRecursive(path.join(src, childItemName), path.join(dest, childItemName));
    });
  } else {
    // Abaikan jika file bernama zip lama
    if (src.endsWith('.zip')) return;
    fs.copyFileSync(src, dest);
  }
}
console.log('📂 Menyalin aset frontend terkompilasi ke folder staging...');
copyRecursive(distDir, stagingDir);

// 3. Buat subfolder config dan api
const configDir = path.join(stagingDir, 'config');
const apiDir = path.join(stagingDir, 'api');
fs.mkdirSync(configDir, { recursive: true });
fs.mkdirSync(apiDir, { recursive: true });

// 4. Tulis file backend PHP & .htaccess
console.log('⚙️ Menulis file backend PHP PDO & .htaccess...');
fs.writeFileSync(path.join(configDir, 'database.php'), phpDatabaseConfig, 'utf-8');
fs.writeFileSync(path.join(apiDir, 'index.php'), phpApiRouter, 'utf-8');
fs.writeFileSync(path.join(stagingDir, '.htaccess'), htaccessContent, 'utf-8');

// 5. Buat dan simpan file SQL dump
console.log('🗄️ Menghasilkan database SQL dump (simadu_database_min1kotim.sql)...');
const sqlDump = generateFullDatabaseSQL({
  profile: initialProfile,
  teachers: initialTeachers,
  subjects: initialSubjects,
  classes: initialClasses,
  events: initialCalendarEvents,
  protaList: initialProta,
  promesList: initialPromes,
  schedules: initialSchedules
});
fs.writeFileSync(path.join(stagingDir, 'simadu_database_min1kotim.sql'), sqlDump, 'utf-8');

// 6. Tulis panduan upload cPanel teks dan markdown
console.log('📝 Menulis panduan instalasi cPanel...');
fs.writeFileSync(path.join(stagingDir, 'README_HOSTING.md'), deploymentReadme, 'utf-8');

const txtGuide = `========================================================================
   SIMADU - SISTEM ADMINISTRASI PEMBELAJARAN MADRASAH TERPADU
   Kreatif by Witno (witno70@gmail.com)
   MIN 1 KOTAWARINGIN TIMUR - KALIMANTAN TENGAH
========================================================================

PETUNJUK CEPAT UNGGAH KE CPANEL FILE MANAGER (public_html):

1. LOGIN CPANEL:
   - Masuk ke akun cPanel hosting Anda (misal: https://namadomain.sch.id:2083).

2. BUAT DATABASE MySQL:
   - Di cPanel, buka menu "MySQL Databases".
   - Buat nama database baru (misal: u12345_simadu).
   - Buat user database baru beserta password yang aman.
   - Hubungkan user ke database tersebut dan centang "ALL PRIVILEGES".

3. IMPORT DATABASE:
   - Buka menu "phpMyAdmin" di cPanel.
   - Klik database yang baru dibuat di panel kiri.
   - Klik tab "Import", pilih file "simadu_database_min1kotim.sql", lalu klik "Go / Kirim".
   - Seluruh tabel, profil MIN 1 Kotim, kaldik, guru, mapel, prota, promes, dan jadwal akan terimport otomatis.

4. UNGGAH FILE KE FILE MANAGER:
   - Buka menu "File Manager" di cPanel.
   - Masuk ke folder "public_html" (atau folder subdomain Anda).
   - Pastikan folder bersih dari file lama (jika baru).
   - Klik tombol "Upload" di menu atas cPanel File Manager.
   - Pilih file "simadu_public_html.zip".
   - Setelah upload selesai (indikator hijau 100%), kembali ke File Manager.
   - Klik kanan pada file "simadu_public_html.zip" -> Pilih "Extract" -> Ekstrak langsung ke "/public_html".

5. KONFIGURASI KONEKSI DATABASE:
   - Di File Manager, masuk ke folder "config".
   - Klik kanan pada file "database.php" -> Pilih "Edit".
   - Sesuaikan konfigurasi berikut:
       $this->db_name  = 'u12345_simadu';        // Ganti dengan nama database Anda
       $this->username = 'u12345_simaduuser';    // Ganti dengan user database Anda
       $this->password = 'PasswordRahasiaAnda';  // Ganti dengan password database Anda
   - Klik "Save Changes".

6. SELESAI & UJI COBA:
   - Buka domain madrasah Anda di browser (misal: https://simadu.min1kotim.sch.id).
   - SIMADU siap digunakan oleh Kepala Madrasah, Guru, dan Staf Administrasi!
========================================================================
`;
fs.writeFileSync(path.join(stagingDir, 'PANDUAN_UPLOAD_CPANEL.txt'), txtGuide, 'utf-8');

// 7. Buat file zip menggunakan Python shutil.make_archive
console.log('🗜️ Mengompres seluruh folder staging menjadi simadu_public_html.zip...');
execSync(`python3 -c "import shutil; shutil.make_archive('simadu_public_html', 'zip', 'staging_public_html')"`, { stdio: 'inherit' });

// 8. Salin zip ke /public/ dan /dist/
const zipFile = path.resolve('simadu_public_html.zip');
const publicZip = path.resolve('public', 'simadu_public_html.zip');
const distZip = path.resolve('dist', 'simadu_public_html.zip');

if (!fs.existsSync(path.resolve('public'))) {
  fs.mkdirSync(path.resolve('public'), { recursive: true });
}
fs.copyFileSync(zipFile, publicZip);

if (fs.existsSync(path.resolve('dist'))) {
  fs.copyFileSync(zipFile, distZip);
}

const zipStats = fs.statSync(zipFile);
const sizeMB = (zipStats.size / (1024 * 1024)).toFixed(2);
console.log(`✅ BERHASIL! File ZIP telah dibuat: simadu_public_html.zip (${sizeMB} MB)`);
console.log(`📍 Tersedia di:`);
console.log(`   - Root folder: ./simadu_public_html.zip`);
console.log(`   - Public URL:  /simadu_public_html.zip`);
console.log(`   - Dist folder: ./dist/simadu_public_html.zip`);
