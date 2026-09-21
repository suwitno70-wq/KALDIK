import React from 'react';
import { User, UserRole, ValidationConflict } from '../types';
import {
  LayoutDashboard,
  CalendarDays,
  Calculator,
  FileText,
  CalendarRange,
  Clock,
  CheckSquare,
  ShieldAlert,
  Database,
  Printer,
  Sparkles,
  Award,
  Layers,
  FileCode2,
  X
} from 'lucide-react';

export type ActiveTab =
  | 'dashboard'
  | 'kamad_dashboard'
  | 'kaldik'
  | 'minggu_efektif'
  | 'prota'
  | 'promes'
  | 'jadwal'
  | 'mingguan'
  | 'konflik'
  | 'master_data'
  | 'database_hosting'
  | 'dokumen';

interface SidebarNavProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  user: User;
  conflicts: ValidationConflict[];
  isOpen: boolean;
  onClose: () => void;
}

export const SidebarNav: React.FC<SidebarNavProps> = ({
  activeTab,
  setActiveTab,
  user,
  conflicts,
  isOpen,
  onClose
}) => {
  const errorCount = conflicts.filter(c => c.severity === 'conflict').length;

  const navItem = (
    id: ActiveTab,
    label: string,
    icon: React.ReactNode,
    badge?: React.ReactNode,
    allowedRoles?: UserRole[]
  ) => {
    if (allowedRoles && !allowedRoles.includes(user.role)) {
      return null;
    }

    const isActive = activeTab === id;

    return (
      <button
        key={id}
        id={`nav-item-${id}`}
        onClick={() => {
          setActiveTab(id);
          onClose();
        }}
        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${
          isActive
            ? 'bg-emerald-700 text-white font-semibold shadow-sm'
            : 'text-slate-600 hover:text-emerald-900 hover:bg-emerald-50/70'
        }`}
      >
        <div className="flex items-center gap-2.5">
          <span className={isActive ? 'text-emerald-200' : 'text-slate-400'}>{icon}</span>
          <span>{label}</span>
        </div>
        {badge}
      </button>
    );
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-40 w-64 bg-white border-r border-slate-200 flex flex-col justify-between transition-transform duration-200 ease-in-out md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top Header inside sidebar (Mobile close button) */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between md:hidden">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-emerald-800 text-base">SIMADU</span>
            <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-bold">KEMENAG</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Nav Items */}
        <div className="flex-1 overflow-y-auto p-3 space-y-5">
          {/* Group 1: Utama */}
          <div className="space-y-1">
            <div className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Monitoring & Dashboard
            </div>
            {navItem('dashboard', 'Dashboard Terpadu', <LayoutDashboard className="w-4 h-4" />)}
            {navItem(
              'kamad_dashboard',
              'Supervisi Kepala Madrasah',
              <Award className="w-4 h-4 text-emerald-600" />,
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded-full">Kamad</span>
            )}
          </div>

          {/* Group 2: Perencanaan Pembelajaran Terintegrasi */}
          <div className="space-y-1">
            <div className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Perencanaan Terpadu
            </div>
            {navItem('kaldik', 'Kalender Pendidikan', <CalendarDays className="w-4 h-4" />)}
            {navItem('minggu_efektif', 'Rekap Minggu Efektif', <Calculator className="w-4 h-4" />)}
            {navItem('prota', 'Program Tahunan (PROTA)', <FileText className="w-4 h-4" />)}
            {navItem('promes', 'Program Semester (PROMES)', <CalendarRange className="w-4 h-4" />)}
            {navItem('jadwal', 'Jadwal Pelajaran', <Clock className="w-4 h-4" />)}
          </div>

          {/* Group 3: Pelaksanaan & Validasi */}
          <div className="space-y-1">
            <div className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Pelaksanaan & Ketercapaian
            </div>
            {navItem('mingguan', 'Pembelajaran Mingguan', <CheckSquare className="w-4 h-4" />)}
            {navItem(
              'konflik',
              'Deteksi Konflik & Validasi',
              <ShieldAlert className="w-4 h-4" />,
              errorCount > 0 ? (
                <span className="text-[10px] bg-red-500 text-white font-bold px-1.5 py-0.2 rounded-full animate-pulse">
                  {errorCount}
                </span>
              ) : null
            )}
            {navItem('dokumen', 'Cetak Dokumen Resmi A4', <Printer className="w-4 h-4" />)}
          </div>

          {/* Group 4: Master Data & Administrasi */}
          <div className="space-y-1">
            <div className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Master Data & Sistem
            </div>
            {navItem(
              'master_data',
              'Master Data Madrasah',
              <Layers className="w-4 h-4" />,
              undefined,
              ['super_admin', 'admin_madrasah', 'kepala_madrasah']
            )}
            {navItem(
              'database_hosting',
              'Database, Backup & Hosting',
              <Database className="w-4 h-4" />
            )}
          </div>
        </div>

        {/* Sidebar Footer Branding */}
        <div className="p-3 border-t border-slate-100 bg-slate-50/70 text-xs">
          <div className="flex items-center gap-2 text-emerald-800 font-bold">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Kreatif by Witno</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5 leading-tight">
            MIN 1 Kotawaringin Timur © 2026
          </div>
        </div>
      </aside>
    </>
  );
};
