import React from 'react';
import {
  User,
  UserRole,
  MadrasahProfile,
  ValidationConflict,
  SyncReport
} from '../types';
import {
  RefreshCw,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Database,
  UserCheck,
  Building2,
  ChevronDown,
  Menu,
  ShieldCheck,
  Award
} from 'lucide-react';

interface HeaderNavbarProps {
  user: User;
  onSwitchUser?: (newUser: User) => void;
  users?: User[];
  profile: MadrasahProfile;
  onTriggerSync: () => void;
  isSyncing: boolean;
  conflicts: ValidationConflict[];
  onOpenConflicts: () => void;
  onOpenDatabase: () => void;
  onToggleSidebar: () => void;
}

export const HeaderNavbar: React.FC<HeaderNavbarProps> = ({
  user,
  onSwitchUser,
  users,
  profile,
  onTriggerSync,
  isSyncing,
  conflicts,
  onOpenConflicts,
  onOpenDatabase,
  onToggleSidebar
}) => {
  const [roleDropdownOpen, setRoleDropdownOpen] = React.useState(false);

  const errorCount = conflicts.filter(c => c.severity === 'conflict').length;
  const warningCount = conflicts.filter(c => c.severity === 'warning').length;

  return (
    <header className="sticky top-0 z-30 bg-emerald-900 text-white shadow-md border-b border-emerald-800">
      <div className="px-3 sm:px-6 py-2.5 flex items-center justify-between gap-2">
        {/* Left branding */}
        <div className="flex items-center gap-3">
          <button
            id="btn-toggle-sidebar"
            onClick={onToggleSidebar}
            className="p-1.5 rounded-lg text-emerald-100 hover:bg-emerald-800 focus:outline-none md:hidden"
            title="Menu Navigasi"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-300 text-emerald-950 flex items-center justify-center font-extrabold shadow-sm">
              <Building2 className="w-6 h-6 text-emerald-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base sm:text-lg tracking-wider text-emerald-100">SIMADU</span>
                <span className="hidden sm:inline-block text-[10px] uppercase font-bold tracking-widest bg-emerald-700/80 text-emerald-200 px-1.5 py-0.5 rounded">
                  Terpadu
                </span>
              </div>
              <div className="text-[11px] text-emerald-200/90 font-medium line-clamp-1">
                {profile.nama}
              </div>
            </div>
          </div>
        </div>

        {/* Center: Active Year & Semester badge */}
        <div className="hidden lg:flex items-center gap-2 bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-700/50 text-xs">
          <Calendar className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-emerald-300 font-semibold">TP {profile.tahunPelajaranAktif}</span>
          <span className="text-emerald-400 font-bold">•</span>
          <span className="text-emerald-100">Semester {profile.semesterAktif}</span>
          <span className="bg-emerald-600/60 text-[10px] text-emerald-200 px-1.5 py-0.5 rounded-full font-bold">KMA 1503</span>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Main Sync Button */}
          <button
            id="btn-sync-all-main"
            onClick={onTriggerSync}
            disabled={isSyncing}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold shadow-sm transition-all ${
              isSyncing
                ? 'bg-amber-500 text-white cursor-wait animate-pulse'
                : 'bg-gradient-to-r from-teal-400 to-emerald-400 text-emerald-950 hover:brightness-105 active:scale-95'
            }`}
            title="Sinkronisasi Seluruh Modul: Kaldik -> Minggu Efektif -> Prota -> Promes -> Jadwal"
          >
            <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">SINKRONISASI SEMUA</span>
            <span className="sm:hidden">SINKRON</span>
          </button>

          {/* Validation Status Indicator */}
          <button
            id="btn-conflict-status"
            onClick={onOpenConflicts}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              errorCount > 0
                ? 'bg-red-500/20 text-red-200 border border-red-400/30 hover:bg-red-500/30'
                : warningCount > 0
                ? 'bg-amber-500/20 text-amber-200 border border-amber-400/30 hover:bg-amber-500/30'
                : 'bg-emerald-800 text-emerald-200 border border-emerald-700/50 hover:bg-emerald-700'
            }`}
            title="Status Validasi Sistem"
          >
            {errorCount > 0 ? (
              <>
                <XCircle className="w-3.5 h-3.5 text-red-400" />
                <span>{errorCount} Konflik</span>
              </>
            ) : warningCount > 0 ? (
              <>
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                <span>{warningCount} Info</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden md:inline">Validasi Aman</span>
              </>
            )}
          </button>

          {/* User Profile Card & Information */}
          <div className="relative">
            <button
              id="btn-user-profile-menu"
              onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
              className="flex items-center gap-2 pl-2 pr-2.5 py-1.5 bg-emerald-800/90 hover:bg-emerald-800 rounded-xl border border-emerald-700/80 text-xs transition-colors shadow-xs"
            >
              <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shadow-inner">
                {user.name.charAt(0)}
              </div>
              <div className="text-left hidden md:block">
                <div className="font-semibold text-white leading-tight line-clamp-1">{user.name}</div>
                <div className="text-[10px] text-emerald-300 font-medium flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  <span>Administrator Aktif</span>
                </div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-emerald-300" />
            </button>

            {roleDropdownOpen && (
              <div
                className="absolute right-0 mt-2 w-72 bg-white text-slate-800 rounded-2xl shadow-xl border border-slate-200 py-3 px-3 z-50 animate-in fade-in slide-in-from-top-1 space-y-3"
                onClick={() => setRoleDropdownOpen(false)}
              >
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] uppercase font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                      Akun Resmi SIMADU
                    </span>
                    <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      Aktif & Terverifikasi
                    </span>
                  </div>
                  <div className="font-bold text-slate-900 text-xs mt-1.5">{user.name}</div>
                  {user.nip && (
                    <div className="text-[11px] text-slate-500 font-mono mt-0.5">NIP. {user.nip}</div>
                  )}
                  <div className="text-[11px] text-emerald-700 font-medium mt-1">
                    MIN 1 Kotawaringin Timur
                  </div>
                </div>

                <div className="space-y-1">
                  <button
                    onClick={onOpenDatabase}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-emerald-50 hover:text-emerald-900 transition-colors"
                  >
                    <Database className="w-4 h-4 text-emerald-700" />
                    <span>Kelola Database & Backup SQL</span>
                  </button>
                  <div className="px-3 py-1.5 text-[11px] text-slate-500 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Hak Akses Penuh (Super Admin)</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400 px-1">
                  <span>SIMADU Produksi v1.0.0</span>
                  <span className="font-semibold text-emerald-800">Kreatif by Witno</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
