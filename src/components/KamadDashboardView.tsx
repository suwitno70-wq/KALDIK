import React from 'react';
import {
  MadrasahProfile,
  Teacher,
  Subject,
  ProtaItem,
  PromesItem,
  ScheduleItem,
  ValidationConflict,
  CalendarEvent
} from '../types';
import { KaldikCalculationResult } from '../services/kaldikEngine';
import {
  Award,
  CheckCircle2,
  AlertTriangle,
  Clock,
  CalendarDays,
  FileCheck,
  FileText,
  UserCheck,
  Building,
  Printer,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';

interface KamadDashboardViewProps {
  profile: MadrasahProfile;
  teachers: Teacher[];
  subjects: Subject[];
  protaList: ProtaItem[];
  promesList: PromesItem[];
  schedules: ScheduleItem[];
  conflicts: ValidationConflict[];
  kaldikMetrics: KaldikCalculationResult;
  calendarEvents: CalendarEvent[];
  onOpenPrint: (type: any) => void;
  onNavigate: (tab: any) => void;
}

export const KamadDashboardView: React.FC<KamadDashboardViewProps> = ({
  profile,
  teachers,
  subjects,
  protaList,
  promesList,
  schedules,
  conflicts,
  kaldikMetrics,
  calendarEvents,
  onOpenPrint,
  onNavigate
}) => {
  // Check completion per teacher
  const teacherStatus = teachers.map(t => {
    const teacherProta = protaList.filter(p => p.teacherId === t.id);
    const teacherPromes = promesList.filter(p => p.teacherId === t.id);
    const teacherScheduleCount = schedules.filter(s => s.teacherId === t.id).length;
    const isProtaReady = teacherProta.length > 0;
    const isPromesReady = teacherPromes.length > 0;
    const isComplete = isProtaReady && isPromesReady && teacherScheduleCount > 0;

    return {
      teacher: t,
      protaCount: teacherProta.length,
      promesCount: teacherPromes.length,
      scheduleCount: teacherScheduleCount,
      isComplete
    };
  });

  const completedCount = teacherStatus.filter(ts => ts.isComplete).length;
  const pendingTeachers = teacherStatus.filter(ts => !ts.isComplete);
  const errorCount = conflicts.filter(c => c.severity === 'conflict').length;

  // Upcoming activities from Kaldik
  const upcomingEvents = calendarEvents
    .filter(e => e.tipe === 'KEGIATAN' || e.tipe === 'ASESMEN' || e.tipe === 'RAPOR')
    .slice(0, 6);

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Top Banner Kamad */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-emerald-950 text-white rounded-2xl p-5 sm:p-6 shadow-md border border-emerald-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-400 text-emerald-950 flex items-center justify-center font-black shadow-md shrink-0">
              <Award className="w-7 h-7 text-emerald-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs bg-amber-400/20 text-amber-300 font-bold px-2 py-0.5 rounded-full border border-amber-400/30">
                  Ruang Supervisi & Monitoring
                </span>
                <span className="text-xs text-emerald-300">Kepala Madrasah</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black mt-1">
                {profile.kepalaMadrasah}
              </h2>
              <div className="text-xs text-emerald-200 mt-0.5">
                NIP. {profile.nipKepala} • {profile.nama}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onOpenPrint('prota')}
              className="flex items-center gap-2 px-3 py-2 bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl border border-emerald-600 transition-colors"
            >
              <Printer className="w-4 h-4 text-emerald-300" />
              <span>Cetak Rekap Supervisi</span>
            </button>
          </div>
        </div>
      </div>

      {/* Summary KPI Cards for Kamad */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
            Tuntas Administrasi Guru
          </div>
          <div className="text-2xl font-black text-emerald-700 mt-1">
            {completedCount} / {teachers.length} Guru
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2 mt-2 overflow-hidden">
            <div
              className="bg-emerald-600 h-full rounded-full"
              style={{ width: `${(completedCount / Math.max(1, teachers.length)) * 100}%` }}
            />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
            Program Tahunan (PROTA)
          </div>
          <div className="text-2xl font-black text-teal-700 mt-1">
            {protaList.length} Capaian / TP
          </div>
          <div className="text-xs text-slate-500 mt-1">Siap disahkan Kepala Madrasah</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
            Program Semester (PROMES)
          </div>
          <div className="text-2xl font-black text-blue-700 mt-1">
            {promesList.length} Modul Distribusi
          </div>
          <div className="text-xs text-slate-500 mt-1">Tersinkron dengan {kaldikMetrics.totalMingguEfektif} Minggu Efektif</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
            Status Konflik Jadwal
          </div>
          <div className="flex items-center gap-2 mt-1">
            {errorCount === 0 ? (
              <div className="flex items-center gap-1.5 text-emerald-700 text-lg font-bold">
                <CheckCircle2 className="w-5 h-5" />
                <span>Nol Konflik (Aman)</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 text-red-600 text-lg font-bold">
                <AlertTriangle className="w-5 h-5" />
                <span>{errorCount} Konflik Jadwal</span>
              </div>
            )}
          </div>
          <div className="text-xs text-slate-500 mt-1">Validasi ruang & jam guru</div>
        </div>
      </div>

      {/* Teacher Completion Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="font-bold text-base text-slate-900">
              Monitoring Ketercapaian Administrasi Guru Madrasah
            </h3>
            <p className="text-xs text-slate-500">
              Pengawasan kesiapan Prota, Promes, dan Beban Jam Mengajar Semester Ganjil 2026/2027
            </p>
          </div>
          <div className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200">
            {completedCount} dari {teachers.length} Guru Lengkap
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
              <tr>
                <th className="p-3">Nama Guru & NIP</th>
                <th className="p-3">Tugas / Mapel Utama</th>
                <th className="p-3 text-center">Beban Jadwal</th>
                <th className="p-3 text-center">Status Prota</th>
                <th className="p-3 text-center">Status Promes</th>
                <th className="p-3 text-center">Status Pengesahan</th>
                <th className="p-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {teacherStatus.map((ts, idx) => (
                <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                  <td className="p-3">
                    <div className="font-bold text-slate-800">{ts.teacher.nama}, {ts.teacher.gelar}</div>
                    <div className="text-[11px] text-slate-400">NIP. {ts.teacher.nip}</div>
                  </td>
                  <td className="p-3">
                    <div className="text-slate-700 font-medium">{ts.teacher.mapelUtama}</div>
                    <div className="text-[10px] text-slate-400">{ts.teacher.jabatan}</div>
                  </td>
                  <td className="p-3 text-center">
                    <span className="font-bold text-slate-800">{ts.scheduleCount} JP</span>
                    <span className="text-[11px] text-slate-400"> / {ts.teacher.maxJp} JP</span>
                  </td>
                  <td className="p-3 text-center">
                    {ts.protaCount > 0 ? (
                      <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 text-[11px] font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>{ts.protaCount} TP Siap</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-800 text-[11px] font-medium px-2 py-0.5 rounded-full border border-amber-200">
                        Belum Input
                      </span>
                    )}
                  </td>
                  <td className="p-3 text-center">
                    {ts.promesCount > 0 ? (
                      <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 text-[11px] font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>{ts.promesCount} Modul</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-800 text-[11px] font-medium px-2 py-0.5 rounded-full border border-amber-200">
                        Belum Input
                      </span>
                    )}
                  </td>
                  <td className="p-3 text-center">
                    {ts.isComplete ? (
                      <span className="inline-flex items-center gap-1 bg-teal-100 text-teal-900 text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                        <ShieldCheck className="w-3.5 h-3.5 text-teal-700" />
                        <span>Disetujui Kamad</span>
                      </span>
                    ) : (
                      <span className="text-slate-400 text-[11px] italic">Perlu Dilengkapi</span>
                    )}
                  </td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => onNavigate('prota')}
                      className="text-xs text-emerald-700 hover:text-emerald-900 font-bold px-2.5 py-1 rounded-lg hover:bg-emerald-50"
                    >
                      Supervisi
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Agenda & Kaldik Terdekat */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-emerald-700" />
            <h3 className="font-bold text-base text-slate-900">Agenda Kalender Madrasah & Asesmen Terdekat</h3>
          </div>
          <button
            onClick={() => onNavigate('kaldik')}
            className="text-xs text-emerald-700 hover:text-emerald-900 font-bold flex items-center gap-1"
          >
            <span>Buka Kalender</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {upcomingEvents.map(e => (
            <div
              key={e.id}
              className="p-3 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-emerald-300 transition-all"
            >
              <div className="flex items-center justify-between text-[11px] mb-1">
                <span className="font-bold text-slate-700">{e.tanggal}</span>
                <span
                  className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                    e.tipe === 'ASESMEN'
                      ? 'bg-amber-100 text-amber-800'
                      : e.tipe === 'RAPOR'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}
                >
                  {e.tipe}
                </span>
              </div>
              <div className="font-bold text-slate-800 text-xs line-clamp-1">{e.judul}</div>
              <div className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">{e.keterangan || '-'}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
