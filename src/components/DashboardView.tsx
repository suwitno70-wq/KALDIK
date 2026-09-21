import React from 'react';
import {
  MadrasahProfile,
  Teacher,
  Subject,
  ClassRoom,
  ProtaItem,
  PromesItem,
  ScheduleItem,
  ValidationConflict
} from '../types';
import { KaldikCalculationResult } from '../services/kaldikEngine';
import {
  Users,
  GraduationCap,
  BookOpen,
  CalendarCheck,
  Clock,
  FileCheck,
  CheckCircle2,
  AlertTriangle,
  ArrowUpRight,
  Sparkles,
  TrendingUp,
  BarChart3,
  RefreshCw
} from 'lucide-react';

interface DashboardViewProps {
  profile: MadrasahProfile;
  teachers: Teacher[];
  subjects: Subject[];
  classes: ClassRoom[];
  protaList: ProtaItem[];
  promesList: PromesItem[];
  schedules: ScheduleItem[];
  kaldikMetrics: KaldikCalculationResult;
  conflicts: ValidationConflict[];
  onTriggerSync: () => void;
  onNavigate: (tab: any) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  profile,
  teachers,
  subjects,
  classes,
  protaList,
  promesList,
  schedules,
  kaldikMetrics,
  conflicts,
  onTriggerSync,
  onNavigate
}) => {
  const totalJPEfektif = kaldikMetrics.totalMingguEfektif * 5; // standard reference
  const protaTargetCount = classes.length * subjects.length; // rough target
  const protaPercent = Math.min(100, Math.round((protaList.length / Math.max(1, protaTargetCount)) * 100));
  const promesPercent = Math.min(100, Math.round((promesList.length / Math.max(1, protaList.length)) * 100));

  // Teacher teaching load
  const teacherLoadMap: Record<string, number> = {};
  schedules.forEach(s => {
    teacherLoadMap[s.teacherId] = (teacherLoadMap[s.teacherId] || 0) + 1;
  });

  // Subject JP sum
  const subjectJpMap: Record<string, number> = {};
  schedules.forEach(s => {
    subjectJpMap[s.subjectId] = (subjectJpMap[s.subjectId] || 0) + 1;
  });

  const errorCount = conflicts.filter(c => c.severity === 'conflict').length;

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-emerald-900 rounded-2xl p-5 sm:p-6 text-white shadow-md relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-white/10 to-transparent pointer-events-none" />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 bg-emerald-700/60 border border-emerald-500/30 px-3 py-1 rounded-full text-xs font-semibold text-emerald-200 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Satu Data, Satu Sistem, Administrasi Terintegrasi</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight">
              SIMADU • {profile.nama}
            </h1>
            <p className="text-xs sm:text-sm text-emerald-200 mt-1 max-w-2xl">
              Sistem Administrasi Pembelajaran Terpadu: Perubahan pada Kalender Pendidikan secara otomatis merevisi perhitungan Minggu Efektif, distribusi Prota, pembagian Promes, dan validasi jadwal pelajaran.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={onTriggerSync}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-400 to-amber-300 text-amber-950 font-bold rounded-xl text-xs sm:text-sm shadow-sm hover:brightness-105 active:scale-95 transition-all"
            >
              <RefreshCw className="w-4 h-4 text-amber-950" />
              <span>Sinkronisasi Semua</span>
            </button>
          </div>
        </div>
      </div>

      {/* Alert Banner if conflicts or Kaldik changes */}
      {errorCount > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-3.5 flex items-center justify-between gap-3 text-red-900">
          <div className="flex items-center gap-2.5 text-xs sm:text-sm">
            <AlertTriangle className="w-5 h-5 text-red-600 shrink-0" />
            <span>
              <strong>Perhatian!</strong> Ditemukan <strong>{errorCount} konflik jadwal</strong> (guru/kelas/ruang bentrok).
            </span>
          </div>
          <button
            onClick={() => onNavigate('konflik')}
            className="text-xs bg-red-600 hover:bg-red-700 text-white font-bold px-3 py-1.5 rounded-lg transition-colors shrink-0"
          >
            Periksa Konflik
          </button>
        </div>
      )}

      {/* 10 Core Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-slate-200 shadow-xs hover:border-emerald-300 transition-colors">
          <div className="flex items-center justify-between text-slate-400 mb-1.5">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Tahun & Sem.</span>
            <CalendarCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-base font-bold text-slate-900 leading-tight">
            {profile.tahunPelajaranAktif}
          </div>
          <div className="text-[11px] text-emerald-700 font-semibold mt-0.5">
            Semester {profile.semesterAktif}
          </div>
        </div>

        <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-slate-200 shadow-xs hover:border-emerald-300 transition-colors">
          <div className="flex items-center justify-between text-slate-400 mb-1.5">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Dewan Guru</span>
            <Users className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-xl font-black text-slate-900">{teachers.length}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Guru Pengampu & Kamad</div>
        </div>

        <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-slate-200 shadow-xs hover:border-emerald-300 transition-colors">
          <div className="flex items-center justify-between text-slate-400 mb-1.5">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Rombel / Kelas</span>
            <GraduationCap className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-xl font-black text-slate-900">{classes.length}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Kelas I s/d VI</div>
        </div>

        <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-slate-200 shadow-xs hover:border-emerald-300 transition-colors">
          <div className="flex items-center justify-between text-slate-400 mb-1.5">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Mata Pelajaran</span>
            <BookOpen className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-xl font-black text-slate-900">{subjects.length}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">KMA 450 Madrasah</div>
        </div>

        <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-slate-200 shadow-xs hover:border-emerald-300 transition-colors">
          <div className="flex items-center justify-between text-slate-400 mb-1.5">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Minggu Efektif</span>
            <TrendingUp className="w-4 h-4 text-teal-600" />
          </div>
          <div className="text-xl font-black text-emerald-700">{kaldikMetrics.totalMingguEfektif}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">dari {kaldikMetrics.totalMingguKalender} Minggu Kalender</div>
        </div>

        <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-slate-200 shadow-xs hover:border-emerald-300 transition-colors">
          <div className="flex items-center justify-between text-slate-400 mb-1.5">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Total JP Efektif</span>
            <Clock className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-xl font-black text-indigo-700">{totalJPEfektif} JP</div>
          <div className="text-[11px] text-slate-500 mt-0.5">{kaldikMetrics.totalHariEfektif} Hari Efektif KBM</div>
        </div>

        <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-slate-200 shadow-xs hover:border-emerald-300 transition-colors">
          <div className="flex items-center justify-between text-slate-400 mb-1.5">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Jadwal Terisi</span>
            <Clock className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-xl font-black text-slate-900">{schedules.length}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Sesi Jam Pelajaran</div>
        </div>

        <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-slate-200 shadow-xs hover:border-emerald-300 transition-colors">
          <div className="flex items-center justify-between text-slate-400 mb-1.5">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Prota Siap</span>
            <FileCheck className="w-4 h-4 text-teal-600" />
          </div>
          <div className="text-xl font-black text-slate-900">{protaList.length}</div>
          <div className="text-[11px] text-emerald-700 font-semibold mt-0.5">Tersinkronisasi</div>
        </div>

        <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-slate-200 shadow-xs hover:border-emerald-300 transition-colors">
          <div className="flex items-center justify-between text-slate-400 mb-1.5">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Promes Siap</span>
            <CalendarCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-xl font-black text-slate-900">{promesList.length}</div>
          <div className="text-[11px] text-emerald-700 font-semibold mt-0.5">Tersinkronisasi</div>
        </div>

        <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-slate-200 shadow-xs hover:border-emerald-300 transition-colors">
          <div className="flex items-center justify-between text-slate-400 mb-1.5">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Status Validasi</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-base font-bold text-emerald-700">
            {errorCount === 0 ? '✓ Tuntas Aman' : `✕ ${errorCount} Konflik`}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">Cek Silang Terpadu</div>
        </div>
      </div>

      {/* 5 Graphs & Visual Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* 1. Minggu Efektif per Bulan */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-emerald-700" />
              <h3 className="font-bold text-sm text-slate-800">Distribusi Minggu Efektif per Bulan (Kaldik)</h3>
            </div>
            <button
              onClick={() => onNavigate('minggu_efektif')}
              className="text-xs text-emerald-700 hover:text-emerald-900 font-semibold flex items-center gap-0.5"
            >
              <span>Rincian</span>
              <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-2.5">
            {kaldikMetrics.monthlySummaries.map((m, idx) => {
              const maxW = 5;
              const percent = Math.min(100, Math.round((m.mingguEfektif / maxW) * 100));
              return (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-slate-700">{m.bulanNama} 2026</span>
                    <span className="text-emerald-800 font-bold">
                      {m.mingguEfektif} Minggu Efektif ({m.hariEfektif} Hari)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden flex">
                    <div
                      className="bg-gradient-to-r from-teal-500 to-emerald-600 h-full rounded-full transition-all duration-500"
                      style={{ width: `${percent}%` }}
                      title={`${m.mingguEfektif} minggu efektif`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 2. Beban Mengajar Guru (JP Terisi vs Kapasitas Max) */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-700" />
              <h3 className="font-bold text-sm text-slate-800">Beban Mengajar Guru (JP per Minggu)</h3>
            </div>
            <button
              onClick={() => onNavigate('jadwal')}
              className="text-xs text-blue-700 hover:text-blue-900 font-semibold flex items-center gap-0.5"
            >
              <span>Jadwal Guru</span>
              <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-3">
            {teachers.map(t => {
              const currentLoad = teacherLoadMap[t.id] || 0;
              const percent = Math.min(100, Math.round((currentLoad / t.maxJp) * 100));
              const isOverload = currentLoad > t.maxJp;

              return (
                <div key={t.id} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <div className="font-semibold text-slate-800 flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: t.warna }} />
                      <span>{t.nama}, {t.gelar}</span>
                    </div>
                    <span className={`font-bold ${isOverload ? 'text-red-600' : 'text-slate-700'}`}>
                      {currentLoad} / {t.maxJp} JP
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isOverload ? 'bg-red-500' : 'bg-emerald-600'
                      }`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 3. JP per Mata Pelajaran */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-amber-700" />
              <h3 className="font-bold text-sm text-slate-800">Total Alokasi JP per Mata Pelajaran</h3>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            {subjects.map(s => {
              const jpCount = subjectJpMap[s.id] || 0;
              return (
                <div
                  key={s.id}
                  className="p-2.5 rounded-xl border border-slate-100 bg-slate-50/70 flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: s.warna }} />
                    <span className="font-semibold text-slate-700">{s.kode}</span>
                  </div>
                  <div className="font-bold text-slate-900">{jpCount} JP</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 4 & 5. Progress Prota & Promes */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-teal-700" />
                <h3 className="font-bold text-sm text-slate-800">Kelengkapan Dokumen Pembelajaran</h3>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-semibold text-slate-700">Program Tahunan (PROTA)</span>
                  <span className="font-bold text-teal-800">{protaList.length} Capaian / TP</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-teal-600 h-full rounded-full transition-all"
                    style={{ width: `${Math.min(100, protaList.length * 10)}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-semibold text-slate-700">Program Semester (PROMES) Terdistribusi</span>
                  <span className="font-bold text-emerald-800">{promesList.length} Modul Terintegrasi</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-emerald-600 h-full rounded-full transition-all"
                    style={{ width: `${Math.min(100, promesList.length * 10)}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-500">Status Pembagian Rapor Ganjil:</span>
            <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
              19 Desember 2026
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
