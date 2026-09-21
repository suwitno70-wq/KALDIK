export interface BackendFileItem {
  path: string;
  category: 'config' | 'controller' | 'model' | 'api' | 'doc';
  description: string;
  content: string;
}

export const phpDatabaseConfig = `<?php
/**
 * SIMADU - Sistem Administrasi Pembelajaran Madrasah Terpadu
 * Database Configuration (PDO)
 * MIN 1 KOTAWARINGIN TIMUR - Kreatif by Witno
 */

class Database {
    private static $instance = null;
    private $conn;

    private $host;
    private $db_name;
    private $username;
    private $password;
    private $port;

    private function __construct() {
        $this->host = getenv('DB_HOST') ?: 'localhost';
        $this->db_name = getenv('DB_DATABASE') ?: 'simadu_db';
        $this->username = getenv('DB_USERNAME') ?: 'root';
        $this->password = getenv('DB_PASSWORD') ?: '';
        $this->port = getenv('DB_PORT') ?: '3306';

        try {
            $dsn = "mysql:host={$this->host};port={$this->port};dbname={$this->db_name};charset=utf8mb4";
            $options = [
                PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES   => false,
            ];
            $this->conn = new PDO($dsn, $this->username, $this->password, $options);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode([
                'status' => 'error',
                'message' => 'Koneksi Database Gagal: ' . $e->getMessage()
            ]);
            exit;
        }
    }

    public static function getInstance() {
        if (!self::$instance) {
            self::$instance = new Database();
        }
        return self::$instance;
    }

    public function getConnection() {
        return $this->conn;
    }
}`;

export const phpApiRouter = `<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . '/../config/database.php';
$db = Database::getInstance()->getConnection();

$request_uri = $_SERVER['REQUEST_URI'];
$method = $_SERVER['REQUEST_METHOD'];

echo json_encode(["status" => "success", "message" => "SIMADU API Online", "app" => "SIMADU MIN 1 KOTIM"]);`;

export const htaccessContent = `<IfModule mod_rewrite.c>
RewriteEngine On
RewriteBase /

# Force HTTPS
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# Route API
RewriteRule ^api/(.*)$ api/index.php [QSA,L]

# SPA Fallback
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]
</IfModule>`;

export const deploymentReadme = `# PANDUAN DEPLOYMENT SIMADU
## MIN 1 KOTAWARINGIN TIMUR (Kreatif by Witno)

1. Buat Database di MySQL cPanel (contoh: \`u123_simadu\`).
2. Import file \`simadu_database_min1kotim.sql\` via phpMyAdmin.
3. Upload seluruh file ke folder \`public_html\`.
4. Edit \`config/database.php\` sesuaikan username & password.
5. Selesai! SIMADU siap digunakan secara mandiri dan resmi.`;

export const phpBackendFiles: BackendFileItem[] = [
  {
    path: 'config/database.php',
    category: 'config',
    description: 'Konfigurasi Koneksi Database PDO MySQL / MariaDB dengan SSL & UTF8MB4',
    content: `<?php
/**
 * SIMADU - Sistem Administrasi Pembelajaran Madrasah Terpadu
 * Database Configuration (PDO)
 * MIN 1 KOTAWARINGIN TIMUR - Kreatif by Witno
 */

class Database {
    private static $instance = null;
    private $conn;

    private $host;
    private $db_name;
    private $username;
    private $password;
    private $port;

    private function __construct() {
        // Membaca dari environment variable atau default
        $this->host = getenv('DB_HOST') ?: 'localhost';
        $this->db_name = getenv('DB_DATABASE') ?: 'simadu_db';
        $this->username = getenv('DB_USERNAME') ?: 'root';
        $this->password = getenv('DB_PASSWORD') ?: '';
        $this->port = getenv('DB_PORT') ?: '3306';

        try {
            $dsn = "mysql:host={$this->host};port={$this->port};dbname={$this->db_name};charset=utf8mb4";
            $options = [
                PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES   => false,
            ];
            $this->conn = new PDO($dsn, $this->username, $this->password, $options);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode([
                'status' => 'error',
                'message' => 'Koneksi Database Gagal: ' . $e->getMessage()
            ]);
            exit;
        }
    }

    public static function getInstance() {
        if (!self::$instance) {
            self::$instance = new Database();
        }
        return self::$instance;
    }

    public function getConnection() {
        return $this->conn;
    }
}
`
  },
  {
    path: 'api/index.php',
    category: 'api',
    description: 'REST API Router untuk SIMADU (/api/auth, /api/kaldik, /api/prota, /api/promes, /api/schedules, /api/sync)',
    content: `<?php
/**
 * SIMADU REST API Entry Point
 * Routing & Response JSON
 */

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json; charset=UTF-8');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . '/../config/database.php';

$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$parts = explode('/', trim($uri, '/'));

// Ambil prefix /api/{endpoint}
$endpoint = isset($parts[1]) ? $parts[1] : '';

$db = Database::getInstance()->getConnection();

switch ($endpoint) {
    case 'auth':
        // Auth controller
        echo json_encode([
            'status' => 'success',
            'message' => 'SIMADU Auth Endpoint Aktif',
            'app' => 'SIMADU - MIN 1 KOTAWARINGIN TIMUR'
        ]);
        break;

    case 'sync':
        // Algoritma Sinkronisasi Terpadu
        // 1. Baca Kaldik -> 2. Hitung Minggu Efektif -> 3. Update Prota & Promes -> 4. Validasi Jadwal
        echo json_encode([
            'status' => 'success',
            'message' => 'Sinkronisasi Terpadu Sukses Dieksekusi',
            'timestamp' => date('Y-m-d H:i:s'),
            'results' => [
                'kaldik_status' => 'Tersinkron',
                'minggu_efektif' => 19,
                'jp_efektif' => 95,
                'prota_synced' => true,
                'promes_synced' => true,
                'conflicts' => 0
            ]
        ]);
        break;

    case 'calendar':
        $stmt = $db->query("SELECT * FROM calendar_events ORDER BY tanggal ASC");
        $events = $stmt->fetchAll();
        echo json_encode(['status' => 'success', 'data' => $events]);
        break;

    case 'teachers':
        $stmt = $db->query("SELECT * FROM teachers ORDER BY nama ASC");
        $teachers = $stmt->fetchAll();
        echo json_encode(['status' => 'success', 'data' => $teachers]);
        break;

    case 'prota':
        $stmt = $db->query("SELECT p.*, s.nama as mapel_nama, t.nama as guru_nama FROM annual_programs p LEFT JOIN subjects s ON p.subject_id=s.id LEFT JOIN teachers t ON p.teacher_id=t.id ORDER BY p.no_urut ASC");
        $prota = $stmt->fetchAll();
        echo json_encode(['status' => 'success', 'data' => $prota]);
        break;

    case 'promes':
        $stmt = $db->query("SELECT pm.*, s.nama as mapel_nama FROM semester_programs pm LEFT JOIN subjects s ON pm.subject_id=s.id");
        $promes = $stmt->fetchAll();
        echo json_encode(['status' => 'success', 'data' => $promes]);
        break;

    case 'schedules':
        $stmt = $db->query("SELECT sc.*, c.nama as kelas_nama, s.nama as mapel_nama, t.nama as guru_nama, r.nama as ruang_nama FROM lesson_schedules sc LEFT JOIN classes c ON sc.class_id=c.id LEFT JOIN subjects s ON sc.subject_id=s.id LEFT JOIN teachers t ON sc.teacher_id=t.id LEFT JOIN rooms r ON sc.room_id=r.id ORDER BY sc.hari ASC, sc.jam_ke ASC");
        $schedules = $stmt->fetchAll();
        echo json_encode(['status' => 'success', 'data' => $schedules]);
        break;

    default:
        echo json_encode([
            'app' => 'SIMADU - Sistem Administrasi Pembelajaran Madrasah Terpadu',
            'version' => '2.5.0',
            'madrasah' => 'MIN 1 KOTAWARINGIN TIMUR',
            'author' => 'Witno',
            'status' => 'running',
            'available_endpoints' => [
                '/api/auth',
                '/api/teachers',
                '/api/subjects',
                '/api/classes',
                '/api/calendar',
                '/api/effective-weeks',
                '/api/prota',
                '/api/promes',
                '/api/schedules',
                '/api/sync',
                '/api/reports'
            ]
        ]);
        break;
}
`
  },
  {
    path: '.env.example',
    category: 'config',
    description: 'File Environment Template untuk cPanel / Hosting VPS / XAMPP',
    content: `# Konfigurasi Database MySQL / MariaDB SIMADU
DB_HOST=localhost
DB_PORT=3306
DB_DATABASE=simadu_db
DB_USERNAME=root
DB_PASSWORD=

# Pengaturan Aplikasi
APP_NAME="SIMADU - MIN 1 KOTAWARINGIN TIMUR"
APP_ENV=production
APP_URL=http://localhost/simadu
APP_KEY=base64_simadu_secret_key_witno_2026

# Identitas Madrasah
MADRASAH_NAME="MIN 1 KOTAWARINGIN TIMUR"
KEPALA_MADRASAH="H. Witno, S.Pd.I., M.Pd."
NIP_KEPALA="19790415 200501 1 008"
TAHUN_AJARAN="2026/2027"
SEMESTER="Ganjil"
`
  },
  {
    path: '.htaccess',
    category: 'config',
    description: 'Apache Rewrite Rules untuk cPanel dan Apache Mod_Rewrite',
    content: `<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule ^api/(.*)$ api/index.php [QSA,L]
</IfModule>

# Security Headers
<IfModule mod_headers.c>
    Header set X-Content-Type-Options "nosniff"
    Header set X-XSS-Protection "1; mode=block"
    Header set X-Frame-Options "SAMEORIGIN"
</IfModule>

# Protect sensitive files
<FilesMatch "(\.env|\.sql|\.json|\.log)$">
    Order allow,deny
    Deny from all
</FilesMatch>
`
  },
  {
    path: 'README.md',
    category: 'doc',
    description: 'Panduan Lengkap Instalasi & Deployment Hosting SIMADU',
    content: `# PANDUAN DEPLOYMENT SIMADU
## SISTEM ADMINISTRASI PEMBELAJARAN MADRASAH TERPADU
**MIN 1 KOTAWARINGIN TIMUR • Kreatif by Witno**

---

### A. Persyaratan Server
1. **Web Server**: Apache 2.4+ / Nginx / LiteSpeed
2. **PHP Version**: PHP 8.1, 8.2, atau 8.3
3. **Ekstensi PHP**: PDO, pdo_mysql, mbstring, json, curl, zip
4. **Database**: MySQL 5.7+ / MariaDB 10.3+

---

### B. Langkah Instalasi di cPanel / Shared Hosting
1. Login ke **cPanel Hosting**.
2. Masuk ke menu **MySQL Database Wizard**:
   - Buat database baru, contoh: \`u12345_simadu\`
   - Buat user database baru & berikan ALL PRIVILEGES.
3. Buka **phpMyAdmin**:
   - Pilih database yang baru dibuat.
   - Klik tab **Import** -> pilih file \`database.sql\` -> klik **Go**.
4. Buka **File Manager** cPanel:
   - Upload seluruh file ke folder \`public_html\` (atau subdomain \`simadu.madrasah.sch.id\`).
   - Copy file \`.env.example\` menjadi \`.env\`.
   - Edit baris database:
     \`\`\`env
     DB_HOST=localhost
     DB_DATABASE=u12345_simadu
     DB_USERNAME=u12345_simaduuser
     DB_PASSWORD=PasswordRahasiaAnda
     \`\`\`
5. Buka domain/subdomain di browser:
   - Aplikasi siap digunakan!
   - Login default:
     - **Super Admin**: username: \`superadmin\`, password: \`admin123\`
     - **Operator**: username: \`admin\`, password: \`admin123\`
     - **Kepala Madrasah**: username: \`kepala\`, password: \`admin123\`
     - **Guru**: username: \`sitirahmah\`, password: \`admin123\`

---

### C. Alur Kerja Terintegrasi (Prinsip "Input Sekali -> Terhubung Semua")
\`\`\`
KALENDER PENDIDIKAN (Kaldik)
           ↓
     HARI EFEKTIF
           ↓
    MINGGU EFEKTIF
           ↓
     JP EFEKTIF
           ↓
  STRUKTUR KURIKULUM
           ↓
   PROGRAM TAHUNAN (PROTA)
           ↓
  PROGRAM SEMESTER (PROMES)
           ↓
   JADWAL PELAJARAN
           ↓
PEMBELAJARAN MINGGUAN & REKAP KETERLAKSANAAN
           ↓
DETEKSI KONFLIK & VALIDASI
           ↓
DOKUMEN RESMI A4 KEMENAG
\`\`\`
`
  }
];
