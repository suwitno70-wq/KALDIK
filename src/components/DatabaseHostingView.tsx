import React, { useState } from 'react';
import { MadrasahProfile } from '../types';
import { generateFullDatabaseSQL } from '../services/sqlGenerator';
import { phpDatabaseConfig, phpApiRouter, htaccessContent, deploymentReadme } from '../services/hostingPackage';
import { downloadTextFile } from '../services/exportService';
import {
  Database,
  Download,
  Upload,
  Server,
  FileCode,
  CheckCircle2,
  Copy,
  Terminal,
  ShieldCheck,
  HardDrive,
  FolderArchive,
  RefreshCw
} from 'lucide-react';

interface DatabaseHostingViewProps {
  profile: MadrasahProfile;
  appStateJson: string;
  onRestoreAppState: (json: string) => void;
  fullData: any;
}

export const DatabaseHostingView: React.FC<DatabaseHostingViewProps> = ({
  profile,
  appStateJson,
  onRestoreAppState,
  fullData
}) => {
  type ActiveSubSection = 'zip' | 'backup' | 'sql' | 'php' | 'panduan';
  const [activeSub, setActiveSub] = useState<ActiveSubSection>('zip');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleDownloadZip = () => {
    const link = document.createElement('a');
    link.href = '/simadu_public_html.zip';
    link.download = 'simadu_public_html.zip';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadSQL = () => {
    const sql = generateFullDatabaseSQL(fullData);
    downloadTextFile('simadu_database_min1kotim.sql', sql, 'application/sql;charset=utf-8;');
  };

  const handleDownloadJSON = () => {
    downloadTextFile('simadu_backup_data.json', appStateJson, 'application/json;charset=utf-8;');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = event => {
      try {
        const content = event.target?.result as string;
        onRestoreAppState(content);
        alert('Data aplikasi berhasil dipulihkan!');
      } catch (err) {
        alert('Gagal memproses file backup. Pastikan format file valid.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Top Banner */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <FolderArchive className="w-5 h-5 text-emerald-700" />
            <h2 className="text-lg font-bold text-slate-900">
              Paket Siap Deploy & Database SIMADU (public_html)
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Arsitektur terintegrasi siap diunggah langsung via cPanel File Manager, phpMyAdmin, dan PHP 8.2 PDO.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleDownloadZip}
            className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-700 hover:to-teal-800 text-white font-bold rounded-xl text-xs shadow-sm transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Unduh Paket ZIP (public_html)</span>
          </button>
          <button
            onClick={handleDownloadSQL}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs transition-all border border-slate-200"
          >
            <Database className="w-4 h-4 text-emerald-700" />
            <span>Download SQL</span>
          </button>
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="bg-white p-2.5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-2 overflow-x-auto">
        <button
          onClick={() => setActiveSub('zip')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeSub === 'zip'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <FolderArchive className="w-4 h-4" />
          <span>Paket ZIP (public_html)</span>
        </button>

        <button
          onClick={() => setActiveSub('backup')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeSub === 'backup'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <HardDrive className="w-4 h-4" />
          <span>Backup & Restore Instan</span>
        </button>

        <button
          onClick={() => setActiveSub('sql')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeSub === 'sql'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Database className="w-4 h-4" />
          <span>Skema & Dump database.sql</span>
        </button>

        <button
          onClick={() => setActiveSub('php')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeSub === 'php'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <FileCode className="w-4 h-4" />
          <span>Backend PHP & .htaccess</span>
        </button>

        <button
          onClick={() => setActiveSub('panduan')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeSub === 'panduan'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Server className="w-4 h-4" />
          <span>Panduan Deploy cPanel</span>
        </button>
      </div>

      {/* SUB-SECTION 0: PAKET ZIP PUBLIC_HTML */}
      {activeSub === 'zip' && (
        <div className="space-y-6">
          {/* Main Download Card */}
          <div className="bg-gradient-to-br from-emerald-800 via-teal-900 to-slate-900 text-white rounded-3xl p-6 md:p-8 shadow-md relative overflow-hidden">
            <div className="relative z-10 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/20 text-emerald-300 rounded-full text-xs font-bold mb-4 border border-emerald-400/30">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Paket Produksi cPanel Siap Unggah (v1.0.0)</span>
              </div>
              <h3 className="text-xl md:text-2xl font-extrabold tracking-tight mb-2">
                simadu_public_html.zip
              </h3>
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-6">
                Paket arsip terkompresi lengkap untuk folder <code className="bg-black/40 text-amber-300 px-2 py-0.5 rounded font-mono">public_html</code>. Berisi frontend React/Tailwind terkompilasi ultra-ringan, file koneksi <code className="bg-black/40 text-emerald-300 px-2 py-0.5 rounded font-mono">config/database.php</code> PDO MySQL/MariaDB, API router, <code className="bg-black/40 text-cyan-300 px-2 py-0.5 rounded font-mono">.htaccess</code>, dan skema database lengkap <code className="bg-black/40 text-amber-300 px-2 py-0.5 rounded font-mono">simadu_database_min1kotim.sql</code>.
              </p>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={handleDownloadZip}
                  className="flex items-center gap-2.5 px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold rounded-2xl text-sm shadow-lg hover:shadow-emerald-500/25 transition-all transform hover:-translate-y-0.5"
                >
                  <Download className="w-5 h-5" />
                  <span>Download simadu_public_html.zip</span>
                </button>
                <div className="text-xs text-slate-400 flex items-center gap-3 py-1">
                  <span>Ukuran: <strong>~360 KB</strong></span>
                  <span>•</span>
                  <span>Format: <strong>ZIP Archive</strong></span>
                </div>
              </div>
            </div>
          </div>

          {/* Isi Paket File Zip */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
              <h4 className="font-bold text-sm text-slate-900 mb-3 flex items-center gap-2">
                <FolderArchive className="w-4 h-4 text-emerald-700" />
                <span>Struktur File di Dalam simadu_public_html.zip</span>
              </h4>
              <div className="space-y-2.5 font-mono text-xs text-slate-700">
                <div className="p-2.5 bg-slate-50 hover:bg-emerald-50/50 rounded-xl border border-slate-200 flex items-center justify-between transition-colors">
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-700 font-bold">📄 index.html</span>
                    <span className="text-[10px] text-slate-500 font-sans">(Aplikasi Web Single-Page SIMADU)</span>
                  </div>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-sans font-bold">Frontend</span>
                </div>

                <div className="p-2.5 bg-slate-50 hover:bg-emerald-50/50 rounded-xl border border-slate-200 flex items-center justify-between transition-colors">
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-700 font-bold">📁 assets/</span>
                    <span className="text-[10px] text-slate-500 font-sans">(Bundle JS + CSS terkompresi cepat)</span>
                  </div>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-sans font-bold">Bundle</span>
                </div>

                <div className="p-2.5 bg-slate-50 hover:bg-emerald-50/50 rounded-xl border border-slate-200 flex items-center justify-between transition-colors">
                  <div className="flex items-center gap-2">
                    <span className="text-amber-700 font-bold">⚙️ .htaccess</span>
                    <span className="text-[10px] text-slate-500 font-sans">(Apache mod_rewrite, HTTPS redirect, SPA routing)</span>
                  </div>
                  <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-sans font-bold">Server Config</span>
                </div>

                <div className="p-2.5 bg-slate-50 hover:bg-emerald-50/50 rounded-xl border border-slate-200 flex items-center justify-between transition-colors">
                  <div className="flex items-center gap-2">
                    <span className="text-blue-700 font-bold">📁 config/database.php</span>
                    <span className="text-[10px] text-slate-500 font-sans">(Koneksi PDO MySQL/MariaDB PHP 8.2+)</span>
                  </div>
                  <span className="text-[10px] bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-sans font-bold">PHP Backend</span>
                </div>

                <div className="p-2.5 bg-slate-50 hover:bg-emerald-50/50 rounded-xl border border-slate-200 flex items-center justify-between transition-colors">
                  <div className="flex items-center gap-2">
                    <span className="text-blue-700 font-bold">📁 api/index.php</span>
                    <span className="text-[10px] text-slate-500 font-sans">(RESTful JSON API Router endpoint)</span>
                  </div>
                  <span className="text-[10px] bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-sans font-bold">PHP API</span>
                </div>

                <div className="p-2.5 bg-slate-50 hover:bg-emerald-50/50 rounded-xl border border-slate-200 flex items-center justify-between transition-colors">
                  <div className="flex items-center gap-2">
                    <span className="text-purple-700 font-bold">🗄️ simadu_database_min1kotim.sql</span>
                    <span className="text-[10px] text-slate-500 font-sans">(Skema + Data Awal MIN 1 Kotim)</span>
                  </div>
                  <span className="text-[10px] bg-purple-100 text-purple-800 px-2 py-0.5 rounded font-sans font-bold">phpMyAdmin</span>
                </div>

                <div className="p-2.5 bg-slate-50 hover:bg-emerald-50/50 rounded-xl border border-slate-200 flex items-center justify-between transition-colors">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-700 font-bold">📝 PANDUAN_UPLOAD_CPANEL.txt</span>
                    <span className="text-[10px] text-slate-500 font-sans">(Petunjuk singkat cPanel File Manager)</span>
                  </div>
                  <span className="text-[10px] bg-slate-200 text-slate-800 px-2 py-0.5 rounded font-sans font-bold">Dokumentasi</span>
                </div>
              </div>
            </div>

            {/* Quick 5-Step Instructions */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
              <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                <span>Cara Unggah ke File Manager</span>
              </h4>
              <ol className="space-y-3 text-xs text-slate-600 list-decimal pl-4">
                <li>
                  <strong>Unduh file ZIP:</strong> Klik tombol hijau di atas untuk mengunduh <code>simadu_public_html.zip</code> ke komputer/HP Anda.
                </li>
                <li>
                  <strong>Buka cPanel File Manager:</strong> Masuk ke cPanel → pilih menu <strong>File Manager</strong> → masuk ke folder <strong>public_html</strong>.
                </li>
                <li>
                  <strong>Upload file ZIP:</strong> Klik tombol <strong>Upload</strong> di bilah atas File Manager, lalu pilih <code>simadu_public_html.zip</code>.
                </li>
                <li>
                  <strong>Ekstrak (Extract):</strong> Setelah selesai, klik kanan file <code>simadu_public_html.zip</code> di File Manager dan klik <strong>Extract</strong>.
                </li>
                <li>
                  <strong>Import Database:</strong> Buka <strong>phpMyAdmin</strong> di cPanel, buat database, lalu import <code>simadu_database_min1kotim.sql</code>.
                </li>
                <li>
                  <strong>Edit Koneksi:</strong> Buka <code>config/database.php</code> dan isi nama database, user, dan password MySQL Anda. Selesai!
                </li>
              </ol>
            </div>
          </div>
        </div>
      )}

      {/* SUB-SECTION 1: BACKUP & RESTORE */}
      {activeSub === 'backup' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Download Backup */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
            <div>
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-3">
                <Download className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-slate-900">Cadangkan Data Aplikasi (Backup)</h3>
              <p className="text-xs text-slate-500 mt-1">
                Unduh seluruh data Kalender Pendidikan, Minggu Efektif, Prota, Promes, Jadwal Pelajaran, dan Master Data ke dalam file <strong>.sql</strong> atau <strong>.json</strong>.
              </p>
            </div>

            <div className="space-y-2">
              <button
                onClick={handleDownloadSQL}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
              >
                <Database className="w-4 h-4" />
                <span>Download File database.sql (MySQL)</span>
              </button>

              <button
                onClick={handleDownloadJSON}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors"
              >
                <FolderArchive className="w-4 h-4" />
                <span>Download Snapshot JSON</span>
              </button>
            </div>
          </div>

          {/* Upload Restore */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
            <div>
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center mb-3">
                <Upload className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-slate-900">Pulihkan Data Aplikasi (Restore)</h3>
              <p className="text-xs text-slate-500 mt-1">
                Kembalikan data SIMADU dari file backup yang telah disimpan sebelumnya.
              </p>
            </div>

            <div>
              <label className="block p-4 border-2 border-dashed border-slate-300 hover:border-emerald-500 rounded-xl text-center cursor-pointer transition-colors">
                <Upload className="w-6 h-6 text-slate-400 mx-auto mb-1" />
                <span className="text-xs font-bold text-slate-700 block">Pilih File Backup JSON</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">Klik untuk browse file</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>
      )}

      {/* SUB-SECTION 2: SQL SCHEMA & DUMP */}
      {activeSub === 'sql' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-slate-900">Skema SQL Lengkap (10 Tabel Terpadu)</h3>
              <p className="text-xs text-slate-500">
                100% Sesuai Standar MySQL / MariaDB dengan Relasi Foreign Key & CASCADE
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleCopy(generateFullDatabaseSQL(fullData), 'sql')}
                className="flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{copiedKey === 'sql' ? 'Tersalin!' : 'Salin SQL'}</span>
              </button>
              <button
                onClick={handleDownloadSQL}
                className="flex items-center gap-1 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download .sql</span>
              </button>
            </div>
          </div>

          <div className="p-4 bg-slate-950 text-slate-200 font-mono text-xs overflow-x-auto max-h-96">
            <pre>{generateFullDatabaseSQL(fullData).slice(0, 3000)}... (klik download untuk file lengkap)</pre>
          </div>
        </div>
      )}

      {/* SUB-SECTION 3: BACKEND PHP & HTACCESS */}
      {activeSub === 'php' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <div className="font-bold text-sm text-slate-900">config/database.php (PHP 8.2 PDO Database Connector)</div>
              <button
                onClick={() => handleCopy(phpDatabaseConfig, 'db_php')}
                className="flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{copiedKey === 'db_php' ? 'Tersalin!' : 'Salin'}</span>
              </button>
            </div>
            <div className="p-4 bg-slate-950 text-emerald-300 font-mono text-xs overflow-x-auto">
              <pre>{phpDatabaseConfig}</pre>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <div className="font-bold text-sm text-slate-900">api/index.php (Restful API Router)</div>
              <button
                onClick={() => handleCopy(phpApiRouter, 'api_php')}
                className="flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{copiedKey === 'api_php' ? 'Tersalin!' : 'Salin'}</span>
              </button>
            </div>
            <div className="p-4 bg-slate-950 text-blue-300 font-mono text-xs overflow-x-auto max-h-72">
              <pre>{phpApiRouter}</pre>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <div className="font-bold text-sm text-slate-900">.htaccess (Apache URL Rewriting)</div>
              <button
                onClick={() => handleCopy(htaccessContent, 'htaccess')}
                className="flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{copiedKey === 'htaccess' ? 'Tersalin!' : 'Salin'}</span>
              </button>
            </div>
            <div className="p-4 bg-slate-950 text-amber-300 font-mono text-xs overflow-x-auto">
              <pre>{htaccessContent}</pre>
            </div>
          </div>
        </div>
      )}

      {/* SUB-SECTION 4: PANDUAN DEPLOY */}
      {activeSub === 'panduan' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-bold text-base text-slate-900">
                Panduan Deploy SIMADU ke cPanel / Shared Hosting
              </h3>
              <p className="text-xs text-slate-500">
                Langkah demi langkah instalasi dari nol tanpa hambatan
              </p>
            </div>
            <button
              onClick={() => handleCopy(deploymentReadme, 'readme')}
              className="flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>{copiedKey === 'readme' ? 'Tersalin!' : 'Salin Panduan'}</span>
            </button>
          </div>

          <div className="space-y-4 text-xs">
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <div className="font-bold text-slate-900 mb-1 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-emerald-700 text-white flex items-center justify-center text-[10px]">1</span>
                <span>Buat Database MySQL di cPanel</span>
              </div>
              <p className="text-slate-600 pl-7">
                Masuk ke cPanel → Buka menu <strong>MySQL® Databases</strong>. Buat database baru (misal: <code>u123_simadu</code>). Buat user database dan beri hak akses penuh (ALL PRIVILEGES).
              </p>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <div className="font-bold text-slate-900 mb-1 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-emerald-700 text-white flex items-center justify-center text-[10px]">2</span>
                <span>Import File database.sql Lewat phpMyAdmin</span>
              </div>
              <p className="text-slate-600 pl-7">
                Buka menu <strong>phpMyAdmin</strong> di cPanel → Pilih database yang baru dibuat → Klik tab <strong>Import</strong> → Upload file <code>database.sql</code> yang diunduh dari SIMADU → Klik <strong>Go</strong>.
              </p>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <div className="font-bold text-slate-900 mb-1 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-emerald-700 text-white flex items-center justify-center text-[10px]">3</span>
                <span>Upload File ke File Manager (public_html)</span>
              </div>
              <p className="text-slate-600 pl-7">
                Buka <strong>File Manager</strong> → masuk ke <code>public_html/</code> (atau subdomain madrasah) → Upload seluruh file aplikasi dan ekstrak. Pastikan file <code>.htaccess</code> ikut terunggah.
              </p>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <div className="font-bold text-slate-900 mb-1 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-emerald-700 text-white flex items-center justify-center text-[10px]">4</span>
                <span>Sesuaikan Koneksi di config/database.php</span>
              </div>
              <p className="text-slate-600 pl-7">
                Edit file <code>config/database.php</code> dan masukkan nama database, username, serta password MySQL yang telah Anda buat di Langkah 1.
              </p>
            </div>

            <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-950">
              <div className="font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Selesai! SIMADU Siap Digunakan Secara Mandiri & Resmi</span>
              </div>
              <p className="text-emerald-800 mt-1 pl-6">
                Buka domain madrasah di browser HP atau Komputer Anda. Seluruh modul administrasi, Kaldik, Prota, Promes, dan Jadwal langsung aktif dan siap digunakan secara penuh.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
