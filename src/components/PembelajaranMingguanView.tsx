import React, { useState } from 'react';
import {
  Subject,
  ClassRoom,
  Teacher,
  ScheduleItem,
  PromesItem,
  WeeklyLearningSession,
  MadrasahProfile
} from '../types';
import { KaldikCalculationResult } from '../services/kaldikEngine';
import {
  CheckSquare,
  CheckCircle2,
  Clock,
  AlertCircle,
  Calendar,
  Layers,
  BookOpen,
  RefreshCw,
  ArrowRight,
  Info
} from 'lucide-react';

interface PembelajaranMingguanViewProps {
  subjects: Subject[];
  classes: ClassRoom[];
  teachers: Teacher[];
  schedules: ScheduleItem[];
  promesList: PromesItem[];
  kaldikMetrics: KaldikCalculationResult;
  profile: MadrasahProfile;
  weeklySessions: WeeklyLearningSession[];
  onUpdateSessionStatus: (id: string, status: 'TERLAKSANA' | 'BELUM' | 'DIJADWALKAN_ULANG', note?: string) => void;
  onRescheduleSession: (id: string, newDate: string, newHour: number) => void;
}

export const PembelajaranMingguanView: React.FC<PembelajaranMingguanViewProps> = ({
  subjects,
  classes,
  teachers,
  schedules,
  promesList,
  kaldikMetrics,
  profile,
  weeklySessions,
  onUpdateSessionStatus,
  onRescheduleSession
}) => {
  const [selectedClassId, setSelectedClassId] = useState<string>('c6');
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('sb_mat');
  const [selectedWeekNumber, setSelectedWeekNumber] = useState<number>(1);

  // Modal Reschedule
  const [rescheduleModalOpen, setRescheduleModalOpen] = useState(false);
  const [targetSessionId, setTargetSessionId] = useState<string | null>(null);
  const [newDate, setNewDate] = useState('2026-07-25');
  const [newHour, setNewHour] = useState(5);

  const currentClass = classes.find(c => c.id === selectedClassId);
  const currentSubject = subjects.find(s => s.id === selectedSubjectId);

  // Find info about selected week in Kaldik
  const effectiveWeekInfo = kaldikMetrics.effectiveWeeksList[selectedWeekNumber - 1] || kaldikMetrics.effectiveWeeksList[0];

  // Find matching promes topic for this week
  const matchedPromes = promesList.find(
    p => p.tingkat === currentClass?.tingkat && p.subjectId === selectedSubjectId
  );

  // Filter weekly sessions
  const filteredSessions = weeklySessions.filter(
    s =>
      s.classId === selectedClassId &&
      s.subjectId === selectedSubjectId &&
      s.mingguKe === selectedWeekNumber
  );

  const handleOpenReschedule = (sessionId: string) => {
    setTargetSessionId(sessionId);
    setNewDate('2026-07-25');
    setNewHour(5);
    setRescheduleModalOpen(true);
  };

  const handleConfirmReschedule = (e: React.FormEvent) => {
    e.preventDefault();
    if (targetSessionId) {
      onRescheduleSession(targetSessionId, newDate, newHour);
      setRescheduleModalOpen(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Top Banner */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <CheckSquare className="w-5 h-5 text-emerald-700" />
            <h2 className="text-lg font-bold text-slate-900">
              Monitoring Pembelajaran Mingguan Terpadu
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Menghubungkan Jadwal Riil • Tanggal Kaldik • Materi Promes • Keterlaksanaan Tatap Muka
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
            {profile.tahunPelajaranAktif} • Semester {profile.semesterAktif}
          </span>
        </div>
      </div>

      {/* Selector Filters (Kelas, Mapel, Minggu Ke-) */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl text-xs">
          <Layers className="w-3.5 h-3.5 text-slate-500" />
          <span className="text-slate-500 font-semibold">Rombel:</span>
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

        <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl text-xs">
          <BookOpen className="w-3.5 h-3.5 text-slate-500" />
          <span className="text-slate-500 font-semibold">Mata Pelajaran:</span>
          <select
            value={selectedSubjectId}
            onChange={e => setSelectedSubjectId(e.target.value)}
            className="bg-transparent font-bold text-slate-800 focus:outline-none"
          >
            {subjects.map(s => (
              <option key={s.id} value={s.id}>
                {s.nama}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl text-xs">
          <Calendar className="w-3.5 h-3.5 text-slate-500" />
          <span className="text-slate-500 font-semibold">Pekan / Minggu Ke:</span>
          <select
            value={selectedWeekNumber}
            onChange={e => setSelectedWeekNumber(Number(e.target.value))}
            className="bg-transparent font-bold text-slate-800 focus:outline-none"
          >
            {kaldikMetrics.effectiveWeeksList.map((w, idx) => (
              <option key={idx} value={idx + 1}>
                Pekan {idx + 1} ({w.bulanNama}: {w.rentangTanggal}) - {w.status}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Week Context Information Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Informasi Kalender Pendidikan (KALDIK)
          </div>
          <div className="text-base font-bold text-slate-900 mt-1">
            {effectiveWeekInfo?.bulanNama} 2026 • Pekan {effectiveWeekInfo?.mingguKe}
          </div>
          <div className="text-xs text-slate-600 mt-0.5">
            Rentang: {effectiveWeekInfo?.rentangTanggal} ({effectiveWeekInfo?.hariEfektif} Hari Efektif)
          </div>
          <div className="mt-2">
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                effectiveWeekInfo?.status === 'EFEKTIF'
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-amber-100 text-amber-800'
              }`}
            >
              Status Pekan: {effectiveWeekInfo?.status}
            </span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs md:col-span-2">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Target Capaian & Materi dari PROMES
          </div>
          <div className="text-sm font-bold text-emerald-900 mt-1">
            {matchedPromes?.materiTP || 'Materi Pembelajaran Sesuai Alur Promes'}
          </div>
          <div className="text-xs text-slate-600 mt-0.5">
            Alokasi Capaian: {matchedPromes?.alokasiJP || currentSubject?.jpDefault || 5} JP • Kurikulum Merdeka Madrasah (KMA 1503)
          </div>
          <div className="text-xs text-slate-500 mt-2 italic">
            *Guru mengajar mengacu pada materi pokok ini. Catat keterlaksanaan atau jadwalkan ulang jika terbentur libur.
          </div>
        </div>
      </div>

      {/* Sesi KBM Mingguan Riil */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-sm text-slate-900">
            Daftar Sesi Jam Tatap Muka Pekan Ini ({filteredSessions.length} Sesi Terjadwal)
          </h3>
          <span className="text-xs text-slate-500">Update status pembelajaran secara berkala</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
              <tr>
                <th className="p-3">Hari & Tanggal</th>
                <th className="p-3">Jam & Waktu</th>
                <th className="p-3">Materi Pokok (Promes)</th>
                <th className="p-3">Guru & Ruang</th>
                <th className="p-3 text-center">Status Kaldik</th>
                <th className="p-3 text-center">Keterlaksanaan</th>
                <th className="p-3 text-right">Tindakan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredSessions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-6 text-center text-slate-400">
                    Tidak ada sesi jam pelajaran untuk mata pelajaran ini pada pekan yang dipilih.
                  </td>
                </tr>
              ) : (
                filteredSessions.map(session => (
                  <tr key={session.id} className="hover:bg-slate-50/70">
                    <td className="p-3">
                      <div className="font-bold text-slate-900">{session.hari}</div>
                      <div className="text-[11px] text-slate-500">{session.tanggal}</div>
                    </td>
                    <td className="p-3">
                      <div className="font-semibold text-slate-800">Jam Ke-{session.jamKe}</div>
                      <div className="text-[11px] text-slate-400">{session.alokasiJP} JP Tatap Muka</div>
                    </td>
                    <td className="p-3">
                      <div className="font-bold text-slate-800 line-clamp-2">{session.materiTP}</div>
                    </td>
                    <td className="p-3">
                      <div className="font-medium text-slate-800">
                        {teachers.find(t => t.id === session.teacherId)?.nama}
                      </div>
                      <div className="text-[11px] text-slate-400">{session.ruang}</div>
                    </td>
                    <td className="p-3 text-center">
                      {session.isKaldikLibur ? (
                        <span className="inline-flex items-center gap-1 bg-red-100 text-red-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                          <AlertCircle className="w-3 h-3" />
                          <span>Libur Kaldik ({session.liburNote})</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Hari Efektif KBM</span>
                        </span>
                      )}
                    </td>
                    <td className="p-3 text-center">
                      <div className="inline-flex items-center gap-1">
                        <button
                          onClick={() => onUpdateSessionStatus(session.id, 'TERLAKSANA')}
                          className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all ${
                            session.status === 'TERLAKSANA'
                              ? 'bg-emerald-600 text-white shadow-xs'
                              : 'bg-slate-100 text-slate-600 hover:bg-emerald-50'
                          }`}
                        >
                          ✓ Terlaksana
                        </button>
                        <button
                          onClick={() => onUpdateSessionStatus(session.id, 'BELUM')}
                          className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all ${
                            session.status === 'BELUM'
                              ? 'bg-amber-500 text-white shadow-xs'
                              : 'bg-slate-100 text-slate-600 hover:bg-amber-50'
                          }`}
                        >
                          ○ Belum
                        </button>
                        <button
                          onClick={() => onUpdateSessionStatus(session.id, 'DIJADWALKAN_ULANG')}
                          className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all ${
                            session.status === 'DIJADWALKAN_ULANG'
                              ? 'bg-purple-600 text-white shadow-xs'
                              : 'bg-slate-100 text-slate-600 hover:bg-purple-50'
                          }`}
                        >
                          ↻ Reschedule
                        </button>
                      </div>
                    </td>
                    <td className="p-3 text-right">
                      {session.isKaldikLibur || session.status === 'DIJADWALKAN_ULANG' ? (
                        <button
                          onClick={() => handleOpenReschedule(session.id)}
                          className="px-2.5 py-1 bg-purple-100 hover:bg-purple-200 text-purple-900 rounded-lg text-[11px] font-bold transition-colors"
                        >
                          Jadwalkan Ulang
                        </button>
                      ) : (
                        <span className="text-slate-400 text-[11px]">-</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Jadwalkan Ulang */}
      {rescheduleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-5 border border-slate-200">
            <h3 className="font-bold text-base text-slate-900 mb-2">
              Jadwalkan Ulang Jam Tatap Muka
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Pindahkan materi pembelajaran ke tanggal efektif lain agar capaian pembelajaran (TP) tetap tuntas terpenuhi.
            </p>

            <form onSubmit={handleConfirmReschedule} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Tanggal Pengganti Efektif</label>
                <input
                  type="date"
                  required
                  value={newDate}
                  onChange={e => setNewDate(e.target.value)}
                  className="w-full border border-slate-300 rounded-xl p-2.5 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Jam Ke- Pengganti</label>
                <select
                  value={newHour}
                  onChange={e => setNewHour(Number(e.target.value))}
                  className="w-full border border-slate-300 rounded-xl p-2.5 focus:ring-2 focus:ring-emerald-500 focus:outline-none font-bold"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map(h => (
                    <option key={h} value={h}>
                      Jam Ke-{h}
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setRescheduleModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold shadow-xs"
                >
                  Simpan Jadwal Ulang
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
