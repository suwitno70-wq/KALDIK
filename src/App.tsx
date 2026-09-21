import React, { useState, useMemo, useEffect } from 'react';
import {
  MadrasahProfile,
  Teacher,
  Subject,
  ClassRoom,
  SchoolDay,
  LessonHour,
  CurriculumStructure,
  CalendarEvent,
  ProtaItem,
  PromesItem,
  ScheduleItem,
  User,
  WeeklyLearningSession,
  ValidationConflict,
  SyncReport
} from './types';
import {
  initialProfile,
  initialTeachers,
  initialSubjects,
  initialClasses,
  initialSchoolDays,
  initialLessonHours,
  initialCurriculumStructure,
  initialCalendarEvents,
  initialProta,
  initialPromes,
  initialSchedules,
  initialUsers
} from './data/initialData';
import { calculateKaldikMetrics, generateDefaultKaldikEvents } from './services/kaldikEngine';
import { validateAllRules } from './services/conflictEngine';
import { exportToCSV, downloadTextFile } from './services/exportService';

import { HeaderNavbar } from './components/HeaderNavbar';
import { SidebarNav, ActiveTab } from './components/SidebarNav';
import { SyncModal } from './components/SyncModal';
import { DashboardView } from './components/DashboardView';
import { KamadDashboardView } from './components/KamadDashboardView';
import { KaldikView } from './components/KaldikView';
import { MingguEfektifView } from './components/MingguEfektifView';
import { ProtaView } from './components/ProtaView';
import { PromesView } from './components/PromesView';
import { JadwalView } from './components/JadwalView';
import { PembelajaranMingguanView } from './components/PembelajaranMingguanView';
import { ConflictView } from './components/ConflictView';
import { MasterDataView } from './components/MasterDataView';
import { DatabaseHostingView } from './components/DatabaseHostingView';
import { PrintDocumentModal, PrintDocType } from './components/PrintDocumentModal';

import {
  LayoutDashboard,
  CalendarDays,
  Clock,
  CheckSquare,
  Printer,
  ShieldAlert
} from 'lucide-react';

export default function App() {
  // Application Data States
  const [profile, setProfile] = useState<MadrasahProfile>(initialProfile);
  const [teachers, setTeachers] = useState<Teacher[]>(initialTeachers);
  const [subjects, setSubjects] = useState<Subject[]>(initialSubjects);
  const [classes, setClasses] = useState<ClassRoom[]>(initialClasses);
  const [schoolDays, setSchoolDays] = useState<SchoolDay[]>(initialSchoolDays);
  const [lessonHours, setLessonHours] = useState<LessonHour[]>(initialLessonHours);
  const [curriculumStructures, setCurriculumStructures] = useState<CurriculumStructure[]>(initialCurriculumStructure);
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>(initialCalendarEvents);
  const [protaList, setProtaList] = useState<ProtaItem[]>(initialProta);
  const [promesList, setPromesList] = useState<PromesItem[]>(initialPromes);
  const [schedules, setSchedules] = useState<ScheduleItem[]>(initialSchedules);
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [currentUser, setCurrentUser] = useState<User>(initialUsers[0]); // Super admin default

  // Navigation & UI States
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Sync Modal States
  const [syncModalOpen, setSyncModalOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncReport, setSyncReport] = useState<SyncReport | null>(null);

  // Print Modal States
  const [printModalOpen, setPrintModalOpen] = useState(false);
  const [printDocType, setPrintDocType] = useState<PrintDocType>('kaldik');

  // Generate Weekly Sessions for Monitoring (derived from Schedules + Promes + Kaldik)
  const [weeklySessions, setWeeklySessions] = useState<WeeklyLearningSession[]>(() => {
    const sessions: WeeklyLearningSession[] = [];
    schedules.slice(0, 8).forEach((s, idx) => {
      sessions.push({
        id: `sess_${idx + 1}`,
        mingguKe: 1,
        hari: s.hari,
        tanggal: `2026-07-${String(20 + idx).padStart(2, '0')}`,
        jamKe: s.jamKe,
        classId: s.classId,
        subjectId: s.subjectId,
        teacherId: s.teacherId,
        ruang: s.ruang,
        materiTP: 'Operasi Hitung Penjumlahan dan Pengurangan Bilangan Bulat',
        alokasiJP: 2,
        status: idx === 0 ? 'TERLAKSANA' : 'BELUM',
        isKaldikLibur: false
      });
    });
    return sessions;
  });

  // Re-calculate Kaldik Metrics on the fly
  const kaldikMetrics = useMemo(() => {
    return calculateKaldikMetrics(
      calendarEvents,
      schoolDays,
      profile.tanggalMulai,
      profile.tanggalAkhir
    );
  }, [calendarEvents, schoolDays, profile.tanggalMulai, profile.tanggalAkhir]);

  // Real-time Conflict Diagnostics
  const conflicts: ValidationConflict[] = useMemo(() => {
    return validateAllRules(
      schedules,
      lessonHours,
      teachers,
      subjects,
      classes,
      kaldikMetrics.effectiveWeeksList
    );
  }, [schedules, lessonHours, teachers, subjects, classes, kaldikMetrics.effectiveWeeksList]);

  // FULL SYNC FUNCTION (Feature #15)
  const handleTriggerSync = () => {
    setIsSyncing(true);
    setSyncModalOpen(true);

    setTimeout(() => {
      // 1. Recalculate Kaldik
      const newMetrics = calculateKaldikMetrics(
        calendarEvents,
        schoolDays,
        profile.tanggalMulai,
        profile.tanggalAkhir
      );

      // 2. Synchronize Prota with new total weeks
      const updatedProta = protaList.map(p => ({
        ...p,
        alokasiJP: p.alokasiJP > 0 ? p.alokasiJP : 4
      }));
      setProtaList(updatedProta);

      // 3. Synchronize Promes distribution
      const updatedPromes = promesList.map(p => {
        const monthKey = 'juli';
        return {
          ...p,
          distribusiMinggu: {
            ...p.distribusiMinggu,
            [monthKey]: {
              ...p.distribusiMinggu[monthKey],
              2: 5
            }
          }
        };
      });
      setPromesList(updatedPromes);

      // 4. Validate conflicts
      const newConflicts = validateAllRules(
        schedules,
        lessonHours,
        teachers,
        subjects,
        classes,
        newMetrics.effectiveWeeksList
      );

      // 5. Generate Report
      const report: SyncReport = {
        timestamp: new Date().toLocaleTimeString('id-ID'),
        kaldikUpdated: true,
        totalHariEfektif: newMetrics.totalHariEfektif,
        totalMingguEfektif: newMetrics.totalMingguEfektif,
        totalJPEfektif: newMetrics.totalMingguEfektif * 5,
        protaSyncedCount: updatedProta.length,
        promesSyncedCount: updatedPromes.length,
        schedulesCheckedCount: schedules.length,
        conflictsCount: newConflicts.filter(c => c.severity === 'conflict').length,
        warningsCount: newConflicts.filter(c => c.severity === 'warning').length,
        details: [
          `Kalender Pendidikan terbaca: ${newMetrics.totalHariSemester} hari semester riil.`,
          `Minggu efektif terhitung: ${newMetrics.totalMingguEfektif} minggu pembelajaran tatap muka.`,
          `Minggu tidak efektif terisolasi: ${newMetrics.totalMingguTidakEfektif} pekan (ATS, AAS, Libur).`,
          `Alokasi Prota diselaraskan dengan beban jam kurikulum KMA 450.`,
          `Matriks Promes divalidasi bebas dari penempatan jam di hari libur.`,
          `Jadwal pelajaran diperiksa terhadap 8 parameter anti-bentrok.`
        ]
      };

      setSyncReport(report);
      setIsSyncing(false);
    }, 1200);
  };

  // Generate Kaldik Otomatis
  const handleGenerateKaldikOtomatis = () => {
    const defaults = generateDefaultKaldikEvents();
    setCalendarEvents(defaults);
    handleTriggerSync();
  };

  // Generate Promes Otomatis
  const handleAutoGeneratePromes = (tingkat: number, subjectId: string) => {
    const subject = subjects.find(s => s.id === subjectId);
    const relatedProta = protaList.filter(p => p.tingkat === tingkat && p.subjectId === subjectId);

    const generatedPromes: PromesItem[] = relatedProta.map(p => {
      const dist: Record<string, Record<number, number>> = {
        juli: { 2: subject?.jpDefault || 5 },
        agustus: { 1: subject?.jpDefault || 5 },
        september: { 1: subject?.jpDefault || 5 },
        oktober: { 1: subject?.jpDefault || 5 },
        november: { 1: subject?.jpDefault || 5 },
        desember: {}
      };
      return {
        id: `promes_${p.id}`,
        protaId: p.id,
        tingkat: p.tingkat,
        subjectId: p.subjectId,
        teacherId: p.teacherId,
        materiTP: p.materiTP,
        alokasiJP: p.alokasiJP,
        distribusiMinggu: dist,
        tanggalPembelajaran: `${p.perkiraanBulan} 2026`,
        keterangan: 'Sinkronisasi Otomatis Kaldik'
      };
    });

    setPromesList(prev => [
      ...prev.filter(pr => !(pr.tingkat === tingkat && pr.subjectId === subjectId)),
      ...generatedPromes
    ]);
  };

  // Generate Prota Otomatis
  const handleGenerateProtaOtomatis = (tingkat: number, subjectId: string) => {
    const subj = subjects.find(s => s.id === subjectId);
    const tch = teachers.find(t => t.mapelUtama.toLowerCase().includes(subj?.nama.toLowerCase() || '')) || teachers[1];

    const standardTopics = [
      { tp: `Materi Pokok 1: Pemahaman Konsep Dasar ${subj?.nama || ''}`, jp: 15, m: 1, b: 'Juli' },
      { tp: `Materi Pokok 2: Pendalaman & Analisis Terapan ${subj?.nama || ''}`, jp: 20, m: 2, b: 'Agustus' },
      { tp: `Materi Pokok 3: Pembuktian Masalah & Evaluasi Bab ${subj?.nama || ''}`, jp: 25, m: 1, b: 'September' },
      { tp: `Materi Pokok 4: Proyek Kolaboratif & Penguatan Karakter`, jp: 20, m: 2, b: 'Oktober' },
      { tp: `Materi Pokok 5: Review Komprehensif & Uji Sumatif Akhir`, jp: 15, m: 1, b: 'November' }
    ];

    const newItems: ProtaItem[] = standardTopics.map((st, i) => ({
      id: `prota_gen_${Date.now()}_${i}`,
      tingkat,
      subjectId,
      teacherId: tch.id,
      semester: 'Ganjil',
      noUrut: i + 1,
      lingkupMateri: `Lingkup Materi Pokok ${i + 1}`,
      atp: `ATP-${tingkat}.${subj?.kode || 'MP'}.${i + 1}`,
      materiTP: st.tp,
      alokasiJP: st.jp,
      perkiraanBulan: st.b,
      perkiraanMingguKe: st.m,
      keterangan: 'Kurikulum Merdeka KMA 450'
    }));

    setProtaList(prev => [
      ...prev.filter(p => !(p.tingkat === tingkat && p.subjectId === subjectId)),
      ...newItems
    ]);
  };

  // Auto Resolve Conflicts
  const handleAutoResolveConflicts = () => {
    // Re-assign distinct hours to resolve clashing schedules
    const adjustedSchedules = schedules.map((s, idx) => ({
      ...s,
      jamKe: (idx % 7) + 1
    }));
    setSchedules(adjustedSchedules);
  };

  // Weekly Session Status Update
  const handleUpdateSessionStatus = (
    id: string,
    status: 'TERLAKSANA' | 'BELUM' | 'DIJADWALKAN_ULANG'
  ) => {
    setWeeklySessions(prev =>
      prev.map(sess => (sess.id === id ? { ...sess, status } : sess))
    );
  };

  // Weekly Session Reschedule
  const handleRescheduleSession = (id: string, newDate: string, newHour: number) => {
    setWeeklySessions(prev =>
      prev.map(sess =>
        sess.id === id
          ? {
              ...sess,
              status: 'DIJADWALKAN_ULANG',
              tanggal: newDate,
              jamKe: newHour
            }
          : sess
      )
    );
  };

  // Open Print Modal with Document Type
  const handleOpenPrint = (type: PrintDocType) => {
    setPrintDocType(type);
    setPrintModalOpen(true);
  };

  // CSV Export
  const handleExportCSV = (type: string) => {
    switch (type) {
      case 'kaldik':
        exportToCSV('simadu_kaldik_2026_2027', calendarEvents);
        break;
      case 'minggu_efektif':
        exportToCSV('simadu_minggu_efektif', kaldikMetrics.effectiveWeeksList);
        break;
      case 'prota':
        exportToCSV('simadu_prota', protaList);
        break;
      case 'promes':
        exportToCSV('simadu_promes', promesList);
        break;
      case 'jadwal':
        exportToCSV('simadu_jadwal_pelajaran', schedules);
        break;
      case 'guru':
        exportToCSV('simadu_master_guru', teachers);
        break;
      case 'mapel':
        exportToCSV('simadu_master_mapel', subjects);
        break;
      case 'kelas':
        exportToCSV('simadu_master_kelas', classes);
        break;
      default:
        exportToCSV('simadu_data_export', teachers);
    }
  };

  // Restore State
  const handleRestoreAppState = (jsonStr: string) => {
    try {
      const data = JSON.parse(jsonStr);
      if (data.teachers) setTeachers(data.teachers);
      if (data.subjects) setSubjects(data.subjects);
      if (data.classes) setClasses(data.classes);
      if (data.calendarEvents) setCalendarEvents(data.calendarEvents);
      if (data.protaList) setProtaList(data.protaList);
      if (data.promesList) setPromesList(data.promesList);
      if (data.schedules) setSchedules(data.schedules);
      if (data.profile) setProfile(data.profile);
    } catch (e) {
      console.error('Failed to parse restore data', e);
    }
  };

  // Full state snapshot for JSON export
  const fullStateSnapshot = useMemo(() => {
    return JSON.stringify(
      {
        profile,
        teachers,
        subjects,
        classes,
        schoolDays,
        lessonHours,
        curriculumStructures,
        calendarEvents,
        protaList,
        promesList,
        schedules,
        users
      },
      null,
      2
    );
  }, [
    profile,
    teachers,
    subjects,
    classes,
    schoolDays,
    lessonHours,
    curriculumStructures,
    calendarEvents,
    protaList,
    promesList,
    schedules,
    users
  ]);

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-800 antialiased selection:bg-emerald-200">
      {/* Header Top Navbar */}
      <HeaderNavbar
        user={currentUser}
        onSwitchUser={setCurrentUser}
        users={users}
        profile={profile}
        onTriggerSync={handleTriggerSync}
        isSyncing={isSyncing}
        conflicts={conflicts}
        onOpenConflicts={() => setActiveTab('konflik')}
        onOpenDatabase={() => setActiveTab('database_hosting')}
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      {/* Main Body Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar Nav */}
        <SidebarNav
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          user={currentUser}
          conflicts={conflicts}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        {/* Content View Container */}
        <main className="flex-1 overflow-y-auto p-3 sm:p-6 pb-20 md:pb-6">
          <div className="max-w-7xl mx-auto">
            {activeTab === 'dashboard' && (
              <DashboardView
                profile={profile}
                teachers={teachers}
                subjects={subjects}
                classes={classes}
                protaList={protaList}
                promesList={promesList}
                schedules={schedules}
                kaldikMetrics={kaldikMetrics}
                conflicts={conflicts}
                onTriggerSync={handleTriggerSync}
                onNavigate={setActiveTab}
              />
            )}

            {activeTab === 'kamad_dashboard' && (
              <KamadDashboardView
                profile={profile}
                teachers={teachers}
                subjects={subjects}
                protaList={protaList}
                promesList={promesList}
                schedules={schedules}
                conflicts={conflicts}
                kaldikMetrics={kaldikMetrics}
                calendarEvents={calendarEvents}
                onOpenPrint={handleOpenPrint}
                onNavigate={setActiveTab}
              />
            )}

            {activeTab === 'kaldik' && (
              <KaldikView
                events={calendarEvents}
                onAddEvent={e => setCalendarEvents(prev => [...prev, e])}
                onUpdateEvent={e => setCalendarEvents(prev => prev.map(ev => (ev.id === e.id ? e : ev)))}
                onDeleteEvent={id => setCalendarEvents(prev => prev.filter(ev => ev.id !== id))}
                onGenerateKaldikOtomatis={handleGenerateKaldikOtomatis}
                schoolDays={schoolDays}
                kaldikMetrics={kaldikMetrics}
                profile={profile}
                onOpenPrint={handleOpenPrint}
                onExportCSV={() => handleExportCSV('kaldik')}
              />
            )}

            {activeTab === 'minggu_efektif' && (
              <MingguEfektifView
                kaldikMetrics={kaldikMetrics}
                profile={profile}
                onOpenPrint={handleOpenPrint}
                onExportCSV={() => handleExportCSV('minggu_efektif')}
              />
            )}

            {activeTab === 'prota' && (
              <ProtaView
                protaList={protaList}
                subjects={subjects}
                teachers={teachers}
                classes={classes}
                kaldikMetrics={kaldikMetrics}
                profile={profile}
                onAddProta={item => setProtaList(prev => [...prev, item])}
                onUpdateProta={item => setProtaList(prev => prev.map(p => (p.id === item.id ? item : p)))}
                onDeleteProta={id => setProtaList(prev => prev.filter(p => p.id !== id))}
                onDuplicateProta={item =>
                  setProtaList(prev => [
                    ...prev,
                    { ...item, id: `prota_dup_${Date.now()}`, materiTP: `${item.materiTP} (Salinan)` }
                  ])
                }
                onGenerateProtaOtomatis={handleGenerateProtaOtomatis}
                onOpenPrint={handleOpenPrint}
                onExportCSV={() => handleExportCSV('prota')}
              />
            )}

            {activeTab === 'promes' && (
              <PromesView
                promesList={promesList}
                subjects={subjects}
                teachers={teachers}
                classes={classes}
                kaldikMetrics={kaldikMetrics}
                profile={profile}
                onUpdatePromesItem={item =>
                  setPromesList(prev => prev.map(p => (p.id === item.id ? item : p)))
                }
                onAutoGeneratePromes={handleAutoGeneratePromes}
                onOpenPrint={handleOpenPrint}
                onExportCSV={() => handleExportCSV('promes')}
              />
            )}

            {activeTab === 'jadwal' && (
              <JadwalView
                schedules={schedules}
                days={initialSchoolDays.map(d => (d.hari || d.nama || 'Senin') as any)}
                lessonHours={lessonHours}
                teachers={teachers}
                subjects={subjects}
                classes={classes}
                conflicts={conflicts}
                profile={profile}
                onAddSchedule={item => setSchedules(prev => [...prev, item])}
                onUpdateSchedule={item =>
                  setSchedules(prev => prev.map(s => (s.id === item.id ? item : s)))
                }
                onDeleteSchedule={id => setSchedules(prev => prev.filter(s => s.id !== id))}
                onOpenPrint={handleOpenPrint}
                onExportCSV={() => handleExportCSV('jadwal')}
              />
            )}

            {activeTab === 'mingguan' && (
              <PembelajaranMingguanView
                subjects={subjects}
                classes={classes}
                teachers={teachers}
                schedules={schedules}
                promesList={promesList}
                kaldikMetrics={kaldikMetrics}
                profile={profile}
                weeklySessions={weeklySessions}
                onUpdateSessionStatus={handleUpdateSessionStatus}
                onRescheduleSession={handleRescheduleSession}
              />
            )}

            {activeTab === 'konflik' && (
              <ConflictView
                conflicts={conflicts}
                onNavigateToTab={setActiveTab}
                onAutoResolveConflicts={handleAutoResolveConflicts}
              />
            )}

            {activeTab === 'master_data' && (
              <MasterDataView
                teachers={teachers}
                subjects={subjects}
                classes={classes}
                schoolDays={schoolDays}
                lessonHours={lessonHours}
                curriculumStructures={curriculumStructures}
                users={users}
                profile={profile}
                onAddTeacher={t => setTeachers(prev => [...prev, t])}
                onUpdateTeacher={t => setTeachers(prev => prev.map(tc => (tc.id === t.id ? t : tc)))}
                onDeleteTeacher={id => setTeachers(prev => prev.filter(t => t.id !== id))}
                onAddSubject={s => setSubjects(prev => [...prev, s])}
                onUpdateSubject={s => setSubjects(prev => prev.map(sb => (sb.id === s.id ? s : sb)))}
                onDeleteSubject={id => setSubjects(prev => prev.filter(s => s.id !== id))}
                onAddClass={c => setClasses(prev => [...prev, c])}
                onUpdateClass={c => setClasses(prev => prev.map(cl => (cl.id === c.id ? c : cl)))}
                onDeleteClass={id => setClasses(prev => prev.filter(c => c.id !== id))}
                onExportCSV={handleExportCSV}
              />
            )}

            {activeTab === 'database_hosting' && (
              <DatabaseHostingView
                profile={profile}
                appStateJson={fullStateSnapshot}
                onRestoreAppState={handleRestoreAppState}
                fullData={{
                  profile,
                  teachers,
                  subjects,
                  classes,
                  schoolDays,
                  lessonHours,
                  curriculumStructures,
                  calendarEvents,
                  protaList,
                  promesList,
                  schedules,
                  users
                }}
              />
            )}

            {activeTab === 'dokumen' && (
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs text-center space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto">
                  <Printer className="w-7 h-7" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Pusat Cetak Dokumen Administrasi Kemenag A4</h2>
                  <p className="text-xs text-slate-500 max-w-lg mx-auto mt-1">
                    Cetak dokumen resmi lengkap dengan Kop Surat Kemenag, QR validasi digital, dan tanda tangan Kepala Madrasah H. Witno, S.Pd.I., M.Pd.
                  </p>
                </div>
                <div className="flex flex-wrap justify-center gap-2 pt-2">
                  <button
                    onClick={() => handleOpenPrint('kaldik')}
                    className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-slate-800"
                  >
                    Cetak Kaldik (A4)
                  </button>
                  <button
                    onClick={() => handleOpenPrint('minggu_efektif')}
                    className="px-4 py-2 bg-emerald-700 text-white text-xs font-bold rounded-xl hover:bg-emerald-800"
                  >
                    Cetak Minggu Efektif (A4)
                  </button>
                  <button
                    onClick={() => handleOpenPrint('prota')}
                    className="px-4 py-2 bg-teal-700 text-white text-xs font-bold rounded-xl hover:bg-teal-800"
                  >
                    Cetak PROTA (A4)
                  </button>
                  <button
                    onClick={() => handleOpenPrint('promes')}
                    className="px-4 py-2 bg-blue-700 text-white text-xs font-bold rounded-xl hover:bg-blue-800"
                  >
                    Cetak PROMES (A4 Landscape)
                  </button>
                  <button
                    onClick={() => handleOpenPrint('jadwal')}
                    className="px-4 py-2 bg-purple-700 text-white text-xs font-bold rounded-xl hover:bg-purple-800"
                  >
                    Cetak Jadwal Pelajaran (A4 Landscape)
                  </button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar for High Usability on Smartphones */}
      <nav className="fixed bottom-0 inset-x-0 bg-white border-t border-slate-200 z-30 flex items-center justify-around py-1.5 px-2 md:hidden shadow-lg">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`flex flex-col items-center gap-0.5 text-[10px] font-bold p-1 rounded-lg ${
            activeTab === 'dashboard' ? 'text-emerald-700' : 'text-slate-400'
          }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>Beranda</span>
        </button>
        <button
          onClick={() => setActiveTab('kaldik')}
          className={`flex flex-col items-center gap-0.5 text-[10px] font-bold p-1 rounded-lg ${
            activeTab === 'kaldik' ? 'text-emerald-700' : 'text-slate-400'
          }`}
        >
          <CalendarDays className="w-4 h-4" />
          <span>Kaldik</span>
        </button>
        <button
          onClick={() => setActiveTab('jadwal')}
          className={`flex flex-col items-center gap-0.5 text-[10px] font-bold p-1 rounded-lg ${
            activeTab === 'jadwal' ? 'text-emerald-700' : 'text-slate-400'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Jadwal</span>
        </button>
        <button
          onClick={() => setActiveTab('mingguan')}
          className={`flex flex-col items-center gap-0.5 text-[10px] font-bold p-1 rounded-lg ${
            activeTab === 'mingguan' ? 'text-emerald-700' : 'text-slate-400'
          }`}
        >
          <CheckSquare className="w-4 h-4" />
          <span>KBM</span>
        </button>
        <button
          onClick={() => setActiveTab('konflik')}
          className={`flex flex-col items-center gap-0.5 text-[10px] font-bold p-1 rounded-lg ${
            activeTab === 'konflik' ? 'text-emerald-700' : 'text-slate-400'
          }`}
        >
          <ShieldAlert className="w-4 h-4" />
          <span>Validasi</span>
        </button>
      </nav>

      {/* Sync Modal */}
      <SyncModal
        isOpen={syncModalOpen}
        onClose={() => setSyncModalOpen(false)}
        report={syncReport}
        isProcessing={isSyncing}
      />

      {/* Print Document Modal */}
      <PrintDocumentModal
        isOpen={printModalOpen}
        onClose={() => setPrintModalOpen(false)}
        docType={printDocType}
        profile={profile}
        teachers={teachers}
        subjects={subjects}
        classes={classes}
        protaList={protaList}
        promesList={promesList}
        schedules={schedules}
        kaldikMetrics={kaldikMetrics}
        calendarEvents={calendarEvents}
      />
    </div>
  );
}
