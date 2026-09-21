import React, { useState } from 'react';
import {
  PromesItem,
  Subject,
  Teacher,
  ClassRoom,
  MadrasahProfile
} from '../types';
import { KaldikCalculationResult } from '../services/kaldikEngine';
import {
  CalendarRange,
  RefreshCw,
  Printer,
  Download,
  CheckCircle2,
  AlertCircle,
  CalendarCheck,
  Search,
  Sparkles,
  Info
} from 'lucide-react';

interface PromesViewProps {
  promesList: PromesItem[];
  subjects: Subject[];
  teachers: Teacher[];
  classes: ClassRoom[];
  kaldikMetrics: KaldikCalculationResult;
  profile: MadrasahProfile;
  onUpdatePromesItem: (item: PromesItem) => void;
  onAutoGeneratePromes: (tingkat: number, subjectId: string) => void;
  onOpenPrint: (type: any) => void;
  onExportCSV: () => void;
}

export const PromesView: React.FC<PromesViewProps> = ({
  promesList,
  subjects,
  teachers,
  classes,
  kaldikMetrics,
  profile,
  onUpdatePromesItem,
  onAutoGeneratePromes,
  onOpenPrint,
  onExportCSV
}) => {
  const [selectedTingkat, setSelectedTingkat] = useState<number>(6);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('sb_mat');
  const [searchQuery, setSearchQuery] = useState('');

  const currentSubject = subjects.find(s => s.id === selectedSubjectId);
  const filteredList = promesList.filter(
    p =>
      p.tingkat === selectedTingkat &&
      p.subjectId === selectedSubjectId &&
      p.materiTP.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const monthsHeader = [
    { name: 'Juli', weeks: [1, 2, 3, 4, 5] },
    { name: 'Agustus', weeks: [1, 2, 3, 4, 5] },
    { name: 'September', weeks: [1, 2, 3, 4, 5] },
    { name: 'Oktober', weeks: [1, 2, 3, 4, 5] },
    { name: 'November', weeks: [1, 2, 3, 4, 5] },
    { name: 'Desember', weeks: [1, 2, 3, 4, 5] }
  ];

  // Helper to check if a specific month and week is marked as non-effective in Kaldik
  const isWeekIneffective = (bulanNama: string, mingguKe: number) => {
    const ew = kaldikMetrics.effectiveWeeksList.find(
      w => w.bulanNama.toLowerCase() === bulanNama.toLowerCase() && w.mingguKe === mingguKe
    );
    return ew ? ew.status === 'TIDAK_EFEKTIF' : false;
  };

  const getCellVal = (item: PromesItem, monthName: string, week: number, slot: 1 | 2 = 1): number | '' => {
    const monthKey = monthName.toLowerCase();
    if (slot === 1) {
      if (item.distribusiMinggu && item.distribusiMinggu[monthKey] && item.distribusiMinggu[monthKey][week] !== undefined) {
        const v = item.distribusiMinggu[monthKey][week];
        return v === 0 ? '' : v;
      }
      const flatKey = `${monthName}-${week}`;
      if (item.distribusiMingguan && item.distribusiMingguan[flatKey] !== undefined) {
        const v = item.distribusiMingguan[flatKey];
        return v === 0 ? '' : v;
      }
    } else {
      if (item.distribusiMingguSesi2 && item.distribusiMingguSesi2[monthKey] && item.distribusiMingguSesi2[monthKey][week] !== undefined) {
        const v = item.distribusiMingguSesi2[monthKey][week];
        return v === 0 ? '' : v;
      }
      const flatKey = `${monthName}-${week}`;
      if (item.distribusiMingguanSesi2 && item.distribusiMingguanSesi2[flatKey] !== undefined) {
        const v = item.distribusiMingguanSesi2[flatKey];
        return v === 0 ? '' : v;
      }
    }
    return '';
  };

  const handleCellChange = (item: PromesItem, month: string, week: number, val: number, slot: 1 | 2 = 1) => {
    const monthKey = month.toLowerCase();
    const flatKey = `${month}-${week}`;
    if (slot === 1) {
      const prevNested = item.distribusiMinggu || {};
      const currentDist = prevNested[monthKey] || {};
      const updatedDist = {
        ...prevNested,
        [monthKey]: {
          ...currentDist,
          [week]: val
        }
      };
      const updatedFlat = {
        ...(item.distribusiMingguan || {}),
        [flatKey]: val
      };
      onUpdatePromesItem({
        ...item,
        distribusiMinggu: updatedDist,
        distribusiMingguan: updatedFlat
      });
    } else {
      const prevNested = item.distribusiMingguSesi2 || {};
      const currentDist = prevNested[monthKey] || {};
      const updatedDist = {
        ...prevNested,
        [monthKey]: {
          ...currentDist,
          [week]: val
        }
      };
      const updatedFlat = {
        ...(item.distribusiMingguanSesi2 || {}),
        [flatKey]: val
      };
      onUpdatePromesItem({
        ...item,
        distribusiMingguSesi2: updatedDist,
        distribusiMingguanSesi2: updatedFlat
      });
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <CalendarRange className="w-5 h-5 text-emerald-700" />
            <h2 className="text-lg font-bold text-slate-900">Program Semester (PROMES) Terpadu</h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Menghubungkan PROTA + KALDIK + MINGGU EFEKTIF secara otomatis ke dalam matriks pekan belajar.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => onAutoGeneratePromes(selectedTingkat, selectedSubjectId)}
            className="flex items-center gap-1.5 px-3 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold rounded-xl text-xs shadow-xs transition-all"
            title="Generate Distribusi JP Promes Otomatis Sesuai Kaldik"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>PERBARUI PROMES</span>
          </button>

          <button
            onClick={() => onOpenPrint('promes')}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition-colors"
            title="Cetak Format Resmi A4 Landscape"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak A4 Landscape</span>
          </button>

          <button
            onClick={onExportCSV}
            className="p-2 border border-slate-200 hover:bg-slate-50 rounded-xl text-slate-700"
            title="Export CSV PROMES"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Kaldik Notification Banner (User Requirement: Notifikasi keterhubungan Kaldik) */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-emerald-950 text-xs">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-emerald-700 shrink-0" />
          <span>
            <strong>Jadwal Promes terhubung langsung dengan Kalender Pendidikan ({kaldikMetrics.totalMingguEfektif} Minggu Efektif).</strong> Kolom berwarna abu-abu/merah menandakan minggu tidak efektif (ATS/AAS/Libur Khusus).
          </span>
        </div>
        <button
          onClick={() => onAutoGeneratePromes(selectedTingkat, selectedSubjectId)}
          className="text-xs bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-3 py-1.5 rounded-lg shrink-0 transition-colors"
        >
          Sinkronkan ke Kaldik
        </button>
      </div>

      {/* Selectors */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl text-xs">
            <span className="text-slate-500 font-semibold">Tingkat Kelas:</span>
            <select
              value={selectedTingkat}
              onChange={e => setSelectedTingkat(Number(e.target.value))}
              className="bg-white border border-slate-300 font-bold text-slate-800 rounded px-2 py-0.5"
            >
              {[1, 2, 3, 4, 5, 6].map(t => (
                <option key={t} value={t}>
                  Kelas {t}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl text-xs">
            <span className="text-slate-500 font-semibold">Mata Pelajaran:</span>
            <select
              value={selectedSubjectId}
              onChange={e => setSelectedSubjectId(e.target.value)}
              className="bg-white border border-slate-300 font-bold text-slate-800 rounded px-2 py-0.5"
            >
              <optgroup label="Muatan Lokal Khas (Custom Madrasah)">
                {subjects.filter(s => s.kategori === 'Muatan Lokal' || s.isMulok).map(s => (
                  <option key={s.id} value={s.id}>
                    ⭐ {s.nama} ({s.jpDefault} JP/Mgg)
                  </option>
                ))}
              </optgroup>
              <optgroup label="Mata Pelajaran Inti KMA 1503">
                {subjects.filter(s => s.kategori !== 'Muatan Lokal' && !s.isMulok).map(s => (
                  <option key={s.id} value={s.id}>
                    {s.nama} ({s.jpDefault} JP/Mgg)
                  </option>
                ))}
              </optgroup>
            </select>
          </div>
        </div>

        <div className="relative w-full md:w-64">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Cari materi pembelajaran..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      </div>

      {/* Promes Matrix Table (Full Detailed Responsive Layout) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="font-bold text-sm text-slate-900">
              Matriks Distribusi Pekan Efektif Semester Ganjil 2026/2027: {currentSubject?.nama}
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Tersedia 2 baris isian Jam Pelajaran (JP) per pekan (Sesi 1 &amp; Sesi 2 / Tambahan) sesuai kurikulum KMA 1503.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 text-[10px] bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200">
              <span className="inline-block w-3 h-3 bg-emerald-600 rounded"></span>
              <span className="text-slate-700 font-semibold">Sesi 1 (Atas)</span>
              <span className="text-slate-300">|</span>
              <span className="inline-block w-3 h-3 bg-teal-700 rounded border border-slate-300"></span>
              <span className="text-slate-700 font-semibold">Sesi 2 (Bawah)</span>
            </div>
            <span className="text-xs text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full font-semibold border border-emerald-200">
              {filteredList.length} Capaian / TP
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-300 text-center">
              <tr>
                <th rowSpan={2} className="p-2.5 border-r border-slate-300 w-10">No</th>
                <th rowSpan={2} className="p-2.5 border-r border-slate-300 text-left min-w-[200px]">
                  Materi Pokok / Tujuan Pembelajaran (TP)
                </th>
                <th rowSpan={2} className="p-2.5 border-r border-slate-300 w-16" title="Kolom Isian Jam Pelajaran (Total JP)">
                  Jml JP
                </th>
                {monthsHeader.map((m, mIdx) => (
                  <th key={mIdx} colSpan={5} className="p-2 border-r border-slate-300 bg-emerald-50/50">
                    {m.name} 2026
                  </th>
                ))}
                <th rowSpan={2} className="p-2.5 border-r border-slate-300 min-w-[120px]">
                  Tanggal Pembelajaran
                </th>
                <th rowSpan={2} className="p-2.5 min-w-[100px]">Keterangan</th>
              </tr>
              <tr className="bg-slate-50 text-[10px]">
                {monthsHeader.flatMap(m =>
                  m.weeks.map(w => {
                    const isIneffective = isWeekIneffective(m.name, w);
                    return (
                      <th
                        key={`${m.name}_${w}`}
                        className={`p-1 w-8 border-r border-slate-200 ${
                          isIneffective ? 'bg-amber-100/70 text-amber-900 font-extrabold' : ''
                        }`}
                        title={isIneffective ? 'Minggu Tidak Efektif di Kaldik' : `Minggu ${w} ${m.name} (Tersedia 2 Kolom Isian JP)`}
                      >
                        {w}
                      </th>
                    );
                  })
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredList.length === 0 ? (
                <tr>
                  <td colSpan={35} className="p-8 text-center text-slate-400">
                    Belum ada data Promes untuk kelas ini. Klik tombol <strong>[PERBARUI PROMES]</strong> di atas untuk membuat distribusi otomatis dari Prota dan Kaldik!
                  </td>
                </tr>
              ) : (
                filteredList.map((item, idx) => {
                  let sumDistributed = 0;
                  if (item.distribusiMingguan) {
                    Object.values(item.distribusiMingguan).forEach(val => (sumDistributed += Number(val) || 0));
                  } else if (item.distribusiMinggu) {
                    Object.values(item.distribusiMinggu).forEach((mW: any) => {
                      if (mW && typeof mW === 'object') {
                        Object.values(mW).forEach(val => (sumDistributed += Number(val) || 0));
                      }
                    });
                  }
                  if (item.distribusiMingguanSesi2) {
                    Object.values(item.distribusiMingguanSesi2).forEach(val => (sumDistributed += Number(val) || 0));
                  } else if (item.distribusiMingguSesi2) {
                    Object.values(item.distribusiMingguSesi2).forEach((mW: any) => {
                      if (mW && typeof mW === 'object') {
                        Object.values(mW).forEach(val => (sumDistributed += Number(val) || 0));
                      }
                    });
                  }

                  const itemTotalJP = item.totalJP ?? item.alokasiJP ?? 0;

                  return (
                    <tr key={item.id} className="hover:bg-slate-50/70">
                      <td className="p-2.5 text-center font-bold text-slate-400 border-r border-slate-200">
                        {idx + 1}
                      </td>
                      <td className="p-2.5 border-r border-slate-200">
                        <div className="font-bold text-slate-900">{item.materiTP}</div>
                      </td>
                      <td className="p-2 text-center font-extrabold text-teal-800 border-r border-slate-200 bg-teal-50/30">
                        <div className="flex flex-col items-center gap-0.5">
                          <input
                            type="number"
                            min={1}
                            value={itemTotalJP}
                            onChange={e => {
                              const newTotal = Number(e.target.value) || 0;
                              onUpdatePromesItem({
                                ...item,
                                totalJP: newTotal,
                                alokasiJP: newTotal
                              });
                            }}
                            title="Kolom Isian Jam Pelajaran (Total JP)"
                            className="w-12 h-6 text-center font-black text-xs text-teal-900 bg-white border border-teal-300 rounded shadow-2xs focus:ring-2 focus:ring-teal-500 focus:outline-none"
                          />
                          <span
                            className={`text-[9px] font-semibold ${
                              sumDistributed === itemTotalJP
                                ? 'text-emerald-700'
                                : sumDistributed > itemTotalJP
                                ? 'text-red-600 font-bold'
                                : 'text-slate-500'
                            }`}
                            title="Total Jam Pelajaran Terdistribusi"
                          >
                            {sumDistributed}/{itemTotalJP} JP
                          </span>
                        </div>
                      </td>

                      {/* 30 Weeks Matrix (6 months x 5 weeks) */}
                      {monthsHeader.flatMap(m =>
                        m.weeks.map(w => {
                          const val1 = getCellVal(item, m.name, w, 1);
                          const val2 = getCellVal(item, m.name, w, 2);
                          const isIneffective = isWeekIneffective(m.name, w);

                          return (
                            <td
                              key={`${m.name}_${w}`}
                              className={`p-0.5 text-center border-r border-slate-200 align-middle ${
                                isIneffective ? 'bg-amber-50/60' : ''
                              }`}
                            >
                              <div className="flex flex-col items-center justify-center gap-1 py-0.5">
                                {/* Kotak Isian Jam Pelajaran 1 (Sesi 1 / Rencana) */}
                                <input
                                  type="number"
                                  min={0}
                                  max={currentSubject?.jpDefault || 6}
                                  value={val1}
                                  onChange={e =>
                                    handleCellChange(item, m.name, w, Number(e.target.value) || 0, 1)
                                  }
                                  placeholder={isIneffective ? '-' : ''}
                                  title={`Isian Jam Pelajaran Sesi 1 - Minggu ${w} ${m.name}`}
                                  className={`w-6 h-6 text-center text-[11px] font-bold rounded focus:ring-1 focus:ring-emerald-500 focus:outline-none transition-all ${
                                    val1
                                      ? 'bg-emerald-600 text-white shadow-xs'
                                      : 'bg-transparent text-slate-400 border border-slate-200'
                                  }`}
                                />
                                {/* Kotak Isian Jam Pelajaran 2 (Sesi 2 / Jam Tambahan / Realisasi) */}
                                <input
                                  type="number"
                                  min={0}
                                  max={currentSubject?.jpDefault || 6}
                                  value={val2}
                                  onChange={e =>
                                    handleCellChange(item, m.name, w, Number(e.target.value) || 0, 2)
                                  }
                                  placeholder={isIneffective ? '-' : ''}
                                  title={`Kolom Isian Jam Pelajaran Sesi 2 / Tambahan - Minggu ${w} ${m.name}`}
                                  className={`w-6 h-6 text-center text-[11px] font-bold rounded focus:ring-1 focus:ring-teal-500 focus:outline-none transition-all ${
                                    val2
                                      ? 'bg-teal-700 text-white shadow-xs'
                                      : 'bg-white text-slate-400 border border-slate-300 hover:border-slate-400'
                                  }`}
                                />
                              </div>
                            </td>
                          );
                        })
                      )}

                      <td className="p-2.5 border-r border-slate-200 text-slate-700 font-medium whitespace-nowrap">
                        {item.tanggalPembelajaran || 'Sesuai Kaldik'}
                      </td>
                      <td className="p-2.5 text-slate-500">{item.keterangan || '-'}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
