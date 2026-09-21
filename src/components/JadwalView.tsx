import React, { useState } from 'react';
import {
  ScheduleItem,
  DayOfWeek,
  LessonHour,
  Teacher,
  Subject,
  ClassRoom,
  MadrasahProfile,
  ValidationConflict
} from '../types';
import {
  Clock,
  Plus,
  Trash2,
  Edit2,
  Printer,
  Download,
  Filter,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Layers,
  Users
} from 'lucide-react';

interface JadwalViewProps {
  schedules: ScheduleItem[];
  days: DayOfWeek[];
  lessonHours: LessonHour[];
  teachers: Teacher[];
  subjects: Subject[];
  classes: ClassRoom[];
  conflicts: ValidationConflict[];
  profile: MadrasahProfile;
  onAddSchedule: (item: ScheduleItem) => void;
  onUpdateSchedule: (item: ScheduleItem) => void;
  onDeleteSchedule: (id: string) => void;
  onOpenPrint: (type: any) => void;
  onExportCSV: () => void;
}

export const JadwalView: React.FC<JadwalViewProps> = ({
  schedules,
  days,
  lessonHours,
  teachers,
  subjects,
  classes,
  conflicts,
  profile,
  onAddSchedule,
  onUpdateSchedule,
  onDeleteSchedule,
  onOpenPrint,
  onExportCSV
}) => {
  type ViewMode = 'per_hari' | 'per_kelas' | 'per_guru';
  const [viewMode, setViewMode] = useState<ViewMode>('per_hari');
  const [selectedDay, setSelectedDay] = useState<DayOfWeek>('Senin');
  const [selectedClassId, setSelectedClassId] = useState<string>('c6');
  const [selectedTeacherId, setSelectedTeacherId] = useState<string>('t_rahmah');

  // Modal Add / Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formDay, setFormDay] = useState<DayOfWeek>('Senin');
  const [formHour, setFormHour] = useState<number>(1);
  const [formClassId, setFormClassId] = useState<string>('c6');
  const [formSubjectId, setFormSubjectId] = useState<string>('sb_mat');
  const [formTeacherId, setFormTeacherId] = useState<string>('t_rahmah');
  const [formRoom, setFormRoom] = useState<string>('Ruang Kelas VI');

  const errorCount = conflicts.filter(c => c.severity === 'conflict').length;

  const handleOpenAdd = (defaultDay?: DayOfWeek, defaultHour?: number, defaultClass?: string) => {
    setEditingId(null);
    setFormDay(defaultDay || selectedDay);
    setFormHour(defaultHour || 1);
    setFormClassId(defaultClass || selectedClassId);
    setFormSubjectId(subjects[0]?.id || 'sb_mat');
    setFormTeacherId(teachers[0]?.id || 't_rahmah');
    setFormRoom('Ruang Kelas');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: ScheduleItem) => {
    setEditingId(item.id);
    setFormDay(item.hari);
    setFormHour(item.jamKe);
    setFormClassId(item.classId);
    setFormSubjectId(item.subjectId);
    setFormTeacherId(item.teacherId);
    setFormRoom(item.ruang);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingId) {
      onUpdateSchedule({
        id: editingId,
        hari: formDay,
        jamKe: formHour,
        classId: formClassId,
        subjectId: formSubjectId,
        teacherId: formTeacherId,
        ruang: formRoom
      });
    } else {
      onAddSchedule({
        id: `sch_${Date.now()}`,
        hari: formDay,
        jamKe: formHour,
        classId: formClassId,
        subjectId: formSubjectId,
        teacherId: formTeacherId,
        ruang: formRoom
      });
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-emerald-700" />
            <h2 className="text-lg font-bold text-slate-900">Jadwal Pelajaran Anti-Bentrok</h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Sistem memvalidasi real-time guru, kelas, ruang, dan jam istirahat agar tidak terjadi tabrakan jadwal.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => handleOpenAdd()}
            className="flex items-center gap-1 px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl text-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Sesi Jadwal</span>
          </button>

          <button
            onClick={() => onOpenPrint('jadwal')}
            className="flex items-center gap-1 px-3 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-xs shadow-xs transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak Jadwal A4</span>
          </button>

          <button
            onClick={onExportCSV}
            className="p-2 border border-slate-200 hover:bg-slate-50 rounded-xl text-slate-700"
            title="Export CSV Jadwal"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Conflict Bar if conflicts detected */}
      {errorCount > 0 ? (
        <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-center justify-between gap-2 text-red-900 text-xs">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
            <span>
              <strong>Perhatian:</strong> Ditemukan <strong>{errorCount} jadwal bentrok</strong>. Guru atau ruangan tidak dapat digunakan bersamaan pada jam yang sama.
            </span>
          </div>
        </div>
      ) : (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-2.5 flex items-center gap-2 text-emerald-900 text-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Validasi Jadwal Sempurna: Seluruh penempatan guru, ruang, dan rombel bebas dari bentrok.</span>
        </div>
      )}

      {/* Mode Switcher Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setViewMode('per_hari')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              viewMode === 'per_hari'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Grid Per Hari
          </button>
          <button
            onClick={() => setViewMode('per_kelas')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              viewMode === 'per_kelas'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Matriks Per Kelas
          </button>
          <button
            onClick={() => setViewMode('per_guru')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              viewMode === 'per_guru'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Matriks Per Guru
          </button>
        </div>

        {/* Sub-selectors depending on mode */}
        <div className="flex items-center gap-2 text-xs">
          {viewMode === 'per_hari' && (
            <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-xl">
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              <span className="text-slate-500">Pilih Hari:</span>
              <select
                value={selectedDay}
                onChange={e => setSelectedDay(e.target.value as DayOfWeek)}
                className="bg-transparent font-bold text-slate-800 focus:outline-none"
              >
                {days.map(d => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
          )}

          {viewMode === 'per_kelas' && (
            <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-xl">
              <Layers className="w-3.5 h-3.5 text-slate-500" />
              <span className="text-slate-500">Pilih Rombel:</span>
              <select
                value={selectedClassId}
                onChange={e => setSelectedClassId(e.target.value)}
                className="bg-transparent font-bold text-slate-800 focus:outline-none"
              >
                {classes.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.nama}
                  </option>
                ))}
              </select>
            </div>
          )}

          {viewMode === 'per_guru' && (
            <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-xl">
              <Users className="w-3.5 h-3.5 text-slate-500" />
              <span className="text-slate-500">Pilih Guru:</span>
              <select
                value={selectedTeacherId}
                onChange={e => setSelectedTeacherId(e.target.value)}
                className="bg-transparent font-bold text-slate-800 focus:outline-none max-w-[200px]"
              >
                {teachers.map(t => (
                  <option key={t.id} value={t.id}>
                    {t.nama}, {t.gelar}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* MODE 1: GRID PER HARI (Jam Pelajaran vs Seluruh Rombel Kelas) */}
      {viewMode === 'per_hari' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900">
              Jadwal Pelajaran Hari {selectedDay} (Semua Rombel)
            </h3>
            <span className="text-xs text-slate-500">Klik slot jadwal untuk mengedit / hapus</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-300 text-center">
                <tr>
                  <th className="p-2.5 border-r border-slate-200 w-16">Jam Ke</th>
                  <th className="p-2.5 border-r border-slate-200 w-28">Waktu</th>
                  {classes.map(c => (
                    <th key={c.id} className="p-2.5 border-r border-slate-200 min-w-[130px]">
                      {c.nama}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {lessonHours.map(hour => {
                  if (hour.isBreak) {
                    return (
                      <tr key={hour.jamKe} className="bg-amber-50/50 text-center">
                        <td className="p-2 font-bold text-amber-900 border-r border-slate-200">Istirahat</td>
                        <td className="p-2 font-medium text-amber-800 border-r border-slate-200 whitespace-nowrap">
                          {hour.mulai} - {hour.selesai}
                        </td>
                        <td colSpan={classes.length} className="p-2 font-semibold text-amber-800 tracking-wider">
                          ISTIRAHAT / SHALAT DHUHA BERSAMA
                        </td>
                      </tr>
                    );
                  }

                  return (
                    <tr key={hour.jamKe} className="hover:bg-slate-50/50">
                      <td className="p-2.5 text-center font-bold text-slate-800 border-r border-slate-200 bg-slate-50/40">
                        {hour.jamKe}
                      </td>
                      <td className="p-2.5 text-center font-medium text-slate-500 border-r border-slate-200 whitespace-nowrap">
                        {hour.mulai} - {hour.selesai}
                      </td>

                      {classes.map(cls => {
                        const cellItem = schedules.find(
                          s => s.hari === selectedDay && s.jamKe === hour.jamKe && s.classId === cls.id
                        );
                        const subj = subjects.find(s => s.id === cellItem?.subjectId);
                        const tchr = teachers.find(t => t.id === cellItem?.teacherId);

                        return (
                          <td
                            key={cls.id}
                            onClick={() => {
                              if (cellItem) handleOpenEdit(cellItem);
                              else handleOpenAdd(selectedDay, hour.jamKe, cls.id);
                            }}
                            className="p-2 border-r border-slate-200 hover:bg-emerald-50/40 cursor-pointer transition-colors"
                          >
                            {cellItem ? (
                              <div
                                className="p-2 rounded-xl text-white shadow-xs"
                                style={{ backgroundColor: subj?.warna || '#059669' }}
                              >
                                <div className="font-bold text-[11px] leading-tight line-clamp-1">
                                  {subj?.nama || 'Mapel'}
                                </div>
                                <div className="text-[10px] text-white/90 line-clamp-1 mt-0.5">
                                  {tchr?.nama || 'Guru'}
                                </div>
                                <div className="text-[9px] text-white/80 line-clamp-1">
                                  {cellItem.ruang}
                                </div>
                              </div>
                            ) : (
                              <div className="h-10 flex items-center justify-center text-[10px] text-slate-300 hover:text-emerald-600">
                                + Kosong
                              </div>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODE 2: GRID PER KELAS (Senin - Sabtu vs Jam Ke-1..8) */}
      {viewMode === 'per_kelas' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900">
              Jadwal Mingguan: {classes.find(c => c.id === selectedClassId)?.nama}
            </h3>
            <span className="text-xs text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full font-semibold border border-emerald-200">
              Wali Kelas: {teachers.find(t => t.id === classes.find(c => c.id === selectedClassId)?.waliKelasId)?.nama}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-300 text-center">
                <tr>
                  <th className="p-2.5 border-r border-slate-200 w-16">Jam</th>
                  <th className="p-2.5 border-r border-slate-200 w-24">Waktu</th>
                  {days.map(d => (
                    <th key={d} className="p-2.5 border-r border-slate-200 min-w-[130px]">
                      {d}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {lessonHours.map(hour => {
                  if (hour.isBreak) {
                    return (
                      <tr key={hour.jamKe} className="bg-amber-50/50 text-center">
                        <td className="p-2 font-bold text-amber-900 border-r border-slate-200">Istirahat</td>
                        <td className="p-2 font-medium text-amber-800 border-r border-slate-200 whitespace-nowrap">
                          {hour.mulai} - {hour.selesai}
                        </td>
                        <td colSpan={days.length} className="p-2 font-semibold text-amber-800">
                          ISTIRAHAT
                        </td>
                      </tr>
                    );
                  }

                  return (
                    <tr key={hour.jamKe} className="hover:bg-slate-50/50">
                      <td className="p-2.5 text-center font-bold text-slate-800 border-r border-slate-200 bg-slate-50/40">
                        {hour.jamKe}
                      </td>
                      <td className="p-2.5 text-center font-medium text-slate-500 border-r border-slate-200 whitespace-nowrap">
                        {hour.mulai} - {hour.selesai}
                      </td>

                      {days.map(d => {
                        const cellItem = schedules.find(
                          s => s.hari === d && s.jamKe === hour.jamKe && s.classId === selectedClassId
                        );
                        const subj = subjects.find(s => s.id === cellItem?.subjectId);
                        const tchr = teachers.find(t => t.id === cellItem?.teacherId);

                        return (
                          <td
                            key={d}
                            onClick={() => {
                              if (cellItem) handleOpenEdit(cellItem);
                              else handleOpenAdd(d, hour.jamKe, selectedClassId);
                            }}
                            className="p-2 border-r border-slate-200 hover:bg-emerald-50/40 cursor-pointer transition-colors"
                          >
                            {cellItem ? (
                              <div
                                className="p-2 rounded-xl text-white shadow-xs"
                                style={{ backgroundColor: subj?.warna || '#059669' }}
                              >
                                <div className="font-bold text-[11px] leading-tight line-clamp-1">
                                  {subj?.nama || 'Mapel'}
                                </div>
                                <div className="text-[10px] text-white/90 line-clamp-1 mt-0.5">
                                  {tchr?.nama || 'Guru'}
                                </div>
                              </div>
                            ) : (
                              <div className="h-10 flex items-center justify-center text-[10px] text-slate-300">
                                -
                              </div>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODE 3: GRID PER GURU (Jadwal Mengajar Pribadi Guru) */}
      {viewMode === 'per_guru' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-slate-900">
                Jadwal Mengajar: {teachers.find(t => t.id === selectedTeacherId)?.nama},{' '}
                {teachers.find(t => t.id === selectedTeacherId)?.gelar}
              </h3>
              <div className="text-xs text-slate-500">
                NIP. {teachers.find(t => t.id === selectedTeacherId)?.nip} • Total Mengajar:{' '}
                {schedules.filter(s => s.teacherId === selectedTeacherId).length} JP
              </div>
            </div>
            <button
              onClick={() => onOpenPrint('jadwal_guru')}
              className="flex items-center gap-1 px-3 py-1.5 bg-emerald-800 text-white rounded-xl text-xs font-bold"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak Jadwal Guru</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-300 text-center">
                <tr>
                  <th className="p-2.5 border-r border-slate-200 w-16">Jam</th>
                  <th className="p-2.5 border-r border-slate-200 w-24">Waktu</th>
                  {days.map(d => (
                    <th key={d} className="p-2.5 border-r border-slate-200 min-w-[130px]">
                      {d}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {lessonHours.map(hour => {
                  if (hour.isBreak) {
                    return (
                      <tr key={hour.jamKe} className="bg-amber-50/50 text-center">
                        <td className="p-2 font-bold text-amber-900 border-r border-slate-200">Istirahat</td>
                        <td className="p-2 font-medium text-amber-800 border-r border-slate-200">
                          {hour.mulai} - {hour.selesai}
                        </td>
                        <td colSpan={days.length} className="p-2 font-semibold text-amber-800">
                          ISTIRAHAT
                        </td>
                      </tr>
                    );
                  }

                  return (
                    <tr key={hour.jamKe} className="hover:bg-slate-50/50">
                      <td className="p-2.5 text-center font-bold text-slate-800 border-r border-slate-200 bg-slate-50/40">
                        {hour.jamKe}
                      </td>
                      <td className="p-2.5 text-center font-medium text-slate-500 border-r border-slate-200">
                        {hour.mulai} - {hour.selesai}
                      </td>

                      {days.map(d => {
                        const cellItem = schedules.find(
                          s => s.hari === d && s.jamKe === hour.jamKe && s.teacherId === selectedTeacherId
                        );
                        const subj = subjects.find(s => s.id === cellItem?.subjectId);
                        const cls = classes.find(c => c.id === cellItem?.classId);

                        return (
                          <td
                            key={d}
                            className="p-2 border-r border-slate-200 hover:bg-emerald-50/40 cursor-pointer"
                          >
                            {cellItem ? (
                              <div className="p-2 rounded-xl bg-emerald-800 text-white shadow-xs">
                                <div className="font-bold text-[11px] leading-tight">
                                  {cls?.nama}
                                </div>
                                <div className="text-[10px] text-emerald-200 mt-0.5 line-clamp-1">
                                  {subj?.nama}
                                </div>
                                <div className="text-[9px] text-emerald-300">
                                  {cellItem.ruang}
                                </div>
                              </div>
                            ) : (
                              <div className="h-10 flex items-center justify-center text-[10px] text-slate-300">
                                -
                              </div>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal Add / Edit Schedule */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-5 border border-slate-200">
            <h3 className="font-bold text-base text-slate-900 mb-3">
              {editingId ? 'Edit Sesi Jadwal' : 'Tambah Sesi Jadwal'}
            </h3>

            <form onSubmit={handleSave} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Hari</label>
                  <select
                    value={formDay}
                    onChange={e => setFormDay(e.target.value as DayOfWeek)}
                    className="w-full border border-slate-300 rounded-xl p-2.5 focus:ring-2 focus:ring-emerald-500 focus:outline-none font-bold"
                  >
                    {days.map(d => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Jam Ke-</label>
                  <select
                    value={formHour}
                    onChange={e => setFormHour(Number(e.target.value))}
                    className="w-full border border-slate-300 rounded-xl p-2.5 focus:ring-2 focus:ring-emerald-500 focus:outline-none font-bold"
                  >
                    {lessonHours.filter(h => !h.isBreak).map(h => (
                      <option key={h.jamKe} value={h.jamKe}>
                        Jam {h.jamKe} ({h.mulai} - {h.selesai})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Rombel / Kelas</label>
                <select
                  value={formClassId}
                  onChange={e => setFormClassId(e.target.value)}
                  className="w-full border border-slate-300 rounded-xl p-2.5 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                >
                  {classes.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.nama} ({c.ruangDefault})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Mata Pelajaran</label>
                <select
                  value={formSubjectId}
                  onChange={e => setFormSubjectId(e.target.value)}
                  className="w-full border border-slate-300 rounded-xl p-2.5 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                >
                  <optgroup label="Muatan Lokal Khas (Custom Madrasah)">
                    {subjects.filter(s => s.kategori === 'Muatan Lokal' || s.isMulok).map(s => (
                      <option key={s.id} value={s.id}>
                        ⭐ {s.nama} ({s.kode})
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="Mata Pelajaran Inti KMA 1503">
                    {subjects.filter(s => s.kategori !== 'Muatan Lokal' && !s.isMulok).map(s => (
                      <option key={s.id} value={s.id}>
                        {s.nama} ({s.kode})
                      </option>
                    ))}
                  </optgroup>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Guru Pengampu</label>
                <select
                  value={formTeacherId}
                  onChange={e => setFormTeacherId(e.target.value)}
                  className="w-full border border-slate-300 rounded-xl p-2.5 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                >
                  {teachers.map(t => (
                    <option key={t.id} value={t.id}>
                      {t.nama}, {t.gelar} ({t.mapelUtama})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Ruang Pembelajaran</label>
                <input
                  type="text"
                  value={formRoom}
                  onChange={e => setFormRoom(e.target.value)}
                  required
                  className="w-full border border-slate-300 rounded-xl p-2.5 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="pt-2 flex justify-between gap-2">
                {editingId ? (
                  <button
                    type="button"
                    onClick={() => {
                      onDeleteSchedule(editingId);
                      setIsModalOpen(false);
                    }}
                    className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-xl font-bold"
                  >
                    Hapus Sesi
                  </button>
                ) : <div />}

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 font-semibold"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold shadow-xs"
                  >
                    Simpan Sesi
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
