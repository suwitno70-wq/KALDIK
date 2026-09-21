import React, { useState } from 'react';
import {
  CalendarEvent,
  CalendarEventType,
  SchoolDay,
  MadrasahProfile
} from '../types';
import { KaldikCalculationResult } from '../services/kaldikEngine';
import {
  CalendarDays,
  Plus,
  Trash2,
  Edit2,
  Sparkles,
  RefreshCw,
  Info,
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Printer,
  Download
} from 'lucide-react';

interface KaldikViewProps {
  events: CalendarEvent[];
  onAddEvent: (event: CalendarEvent) => void;
  onUpdateEvent: (event: CalendarEvent) => void;
  onDeleteEvent: (id: string) => void;
  onGenerateKaldikOtomatis: () => void;
  schoolDays: SchoolDay[];
  kaldikMetrics: KaldikCalculationResult;
  profile: MadrasahProfile;
  onOpenPrint: (type: any) => void;
  onExportCSV: () => void;
}

export const KaldikView: React.FC<KaldikViewProps> = ({
  events,
  onAddEvent,
  onUpdateEvent,
  onDeleteEvent,
  onGenerateKaldikOtomatis,
  schoolDays,
  kaldikMetrics,
  profile,
  onOpenPrint,
  onExportCSV
}) => {
  // Calendar month navigation (July 2026 to December 2026)
  const [selectedMonthIndex, setSelectedMonthIndex] = useState(6); // 6 = July (0-indexed)
  const [year, setYear] = useState(2026);

  // Modal State for Adding/Editing an Event
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEventId, setEditingEventId] = useState<string | null>(null);
  const [formTanggal, setFormTanggal] = useState('2026-07-20');
  const [formJudul, setFormJudul] = useState('');
  const [formTipe, setFormTipe] = useState<CalendarEventType>('LIBUR');
  const [formKeterangan, setFormKeterangan] = useState('');

  const months = [
    { name: 'Juli 2026', monthIndex: 6, year: 2026 },
    { name: 'Agustus 2026', monthIndex: 7, year: 2026 },
    { name: 'September 2026', monthIndex: 8, year: 2026 },
    { name: 'Oktober 2026', monthIndex: 9, year: 2026 },
    { name: 'November 2026', monthIndex: 10, year: 2026 },
    { name: 'Desember 2026', monthIndex: 11, year: 2026 }
  ];

  // Helper to open Add modal
  const handleOpenAddModal = (defaultDate?: string) => {
    setEditingEventId(null);
    setFormTanggal(defaultDate || `${year}-${String(selectedMonthIndex + 1).padStart(2, '0')}-15`);
    setFormJudul('');
    setFormTipe('LIBUR');
    setFormKeterangan('');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (ev: CalendarEvent) => {
    setEditingEventId(ev.id);
    setFormTanggal(ev.tanggal);
    setFormJudul(ev.judul);
    setFormTipe(ev.tipe);
    setFormKeterangan(ev.keterangan || '');
    setIsModalOpen(true);
  };

  const handleSaveEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formJudul || !formTanggal) return;

    if (editingEventId) {
      onUpdateEvent({
        id: editingEventId,
        tanggal: formTanggal,
        judul: formJudul,
        tipe: formTipe,
        keterangan: formKeterangan
      });
    } else {
      onAddEvent({
        id: `cal_${Date.now()}`,
        tanggal: formTanggal,
        judul: formJudul,
        tipe: formTipe,
        keterangan: formKeterangan
      });
    }
    setIsModalOpen(false);
  };

  // Build grid days for visual calendar
  const firstDayOfMonth = new Date(year, selectedMonthIndex, 1);
  const lastDayOfMonth = new Date(year, selectedMonthIndex + 1, 0);
  const startDayOfWeek = firstDayOfMonth.getDay(); // 0 = Sun, 1 = Mon ...
  const daysInMonth = lastDayOfMonth.getDate();

  const calendarDaysArray: { dateStr: string; dayNum: number; isCurrentMonth: boolean }[] = [];

  // Pad previous month days
  for (let i = 0; i < startDayOfWeek; i++) {
    calendarDaysArray.push({
      dateStr: '',
      dayNum: 0,
      isCurrentMonth: false
    });
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const dStr = `${year}-${String(selectedMonthIndex + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    calendarDaysArray.push({
      dateStr: dStr,
      dayNum: d,
      isCurrentMonth: true
    });
  }

  // Fast event lookup
  const eventMap = new Map<string, CalendarEvent>();
  events.forEach(e => eventMap.set(e.tanggal, e));

  const getEventBadgeClass = (tipe: CalendarEventType) => {
    switch (tipe) {
      case 'LIBUR':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'KEGIATAN':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'ASESMEN':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'RAPOR':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'EFEKTIF':
      default:
        return 'bg-teal-50 text-teal-800 border-teal-200';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-emerald-700" />
            <h2 className="text-lg font-bold text-slate-900">Kalender Pendidikan (KALDIK) Terpadu</h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Semester Ganjil TP 2026/2027 • Mengatur hari efektif, hari libur nasional, libur keagamaan, kegiatan madrasah, dan asesmen.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={onGenerateKaldikOtomatis}
            className="flex items-center gap-1.5 px-3 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold rounded-xl text-xs shadow-xs transition-all"
            title="Hitung & Terapkan Standar Kalender Madrasah Kemenag"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>GENERATE KALDIK OTOMATIS</span>
          </button>

          <button
            onClick={() => handleOpenAddModal()}
            className="flex items-center gap-1 px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl text-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Agenda</span>
          </button>

          <button
            onClick={() => onOpenPrint('kaldik')}
            className="p-2 border border-slate-200 hover:bg-slate-50 rounded-xl text-slate-700"
            title="Cetak Kaldik Resmi A4"
          >
            <Printer className="w-4 h-4" />
          </button>

          <button
            onClick={onExportCSV}
            className="p-2 border border-slate-200 hover:bg-slate-50 rounded-xl text-slate-700"
            title="Export CSV Kaldik"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Metric Counters (Computed automatically from Kaldik) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
        <div className="bg-white p-3 rounded-xl border border-slate-200 text-center">
          <div className="text-[10px] uppercase font-bold text-slate-400">Total Hari</div>
          <div className="text-lg font-black text-slate-800 mt-0.5">{kaldikMetrics.totalHariSemester}</div>
          <div className="text-[10px] text-slate-500">1 Semester</div>
        </div>

        <div className="bg-white p-3 rounded-xl border border-slate-200 text-center">
          <div className="text-[10px] uppercase font-bold text-slate-400">Hari Sekolah</div>
          <div className="text-lg font-black text-blue-700 mt-0.5">{kaldikMetrics.totalHariSekolah}</div>
          <div className="text-[10px] text-slate-500">Senin - Sabtu</div>
        </div>

        <div className="bg-white p-3 rounded-xl border border-slate-200 text-center">
          <div className="text-[10px] uppercase font-bold text-slate-400">Hari Libur</div>
          <div className="text-lg font-black text-red-600 mt-0.5">{kaldikMetrics.totalHariLibur}</div>
          <div className="text-[10px] text-slate-500">Nasional & Ahad</div>
        </div>

        <div className="bg-white p-3 rounded-xl border border-emerald-200 bg-emerald-50/50 text-center">
          <div className="text-[10px] uppercase font-bold text-emerald-800">Hari Efektif KBM</div>
          <div className="text-lg font-black text-emerald-700 mt-0.5">{kaldikMetrics.totalHariEfektif}</div>
          <div className="text-[10px] text-emerald-700 font-semibold">Tatap Muka</div>
        </div>

        <div className="bg-white p-3 rounded-xl border border-slate-200 text-center">
          <div className="text-[10px] uppercase font-bold text-slate-400">Minggu Kalender</div>
          <div className="text-lg font-black text-slate-800 mt-0.5">{kaldikMetrics.totalMingguKalender}</div>
          <div className="text-[10px] text-slate-500">Rentang Kalender</div>
        </div>

        <div className="bg-white p-3 rounded-xl border border-emerald-300 bg-emerald-100/60 text-center">
          <div className="text-[10px] uppercase font-bold text-emerald-900">Minggu Efektif</div>
          <div className="text-xl font-black text-emerald-800 mt-0.5">{kaldikMetrics.totalMingguEfektif}</div>
          <div className="text-[10px] text-emerald-800 font-bold">KBM Efektif</div>
        </div>

        <div className="bg-white p-3 rounded-xl border border-slate-200 text-center">
          <div className="text-[10px] uppercase font-bold text-slate-400">Minggu Tdk Efektif</div>
          <div className="text-lg font-black text-amber-700 mt-0.5">{kaldikMetrics.totalMingguTidakEfektif}</div>
          <div className="text-[10px] text-slate-500">Asesmen & Libur</div>
        </div>
      </div>

      {/* Month Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        {months.map((m, idx) => (
          <button
            key={idx}
            onClick={() => {
              setSelectedMonthIndex(m.monthIndex);
              setYear(m.year);
            }}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              selectedMonthIndex === m.monthIndex && year === m.year
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {m.name}
          </button>
        ))}
      </div>

      {/* Visual Calendar Grid */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-base text-slate-900">
            {months.find(m => m.monthIndex === selectedMonthIndex)?.name}
          </h3>
          <div className="flex items-center gap-2 text-xs">
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span className="text-slate-600">Efektif</span>
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
              <span className="text-slate-600">Libur</span>
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
              <span className="text-slate-600">Kegiatan</span>
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <span className="text-slate-600">Asesmen</span>
            </span>
          </div>
        </div>

        {/* Days of week header */}
        <div className="grid grid-cols-7 gap-1 sm:gap-2 text-center text-xs font-bold text-slate-500 mb-2">
          <div className="text-red-600">Ahad</div>
          <div>Senin</div>
          <div>Selasa</div>
          <div>Rabu</div>
          <div>Kamis</div>
          <div>Jumat</div>
          <div>Sabtu</div>
        </div>

        {/* Calendar Day Cells */}
        <div className="grid grid-cols-7 gap-1 sm:gap-2">
          {calendarDaysArray.map((cell, idx) => {
            if (!cell.isCurrentMonth) {
              return (
                <div key={idx} className="min-h-[72px] sm:min-h-[92px] rounded-xl bg-slate-50/50 border border-dashed border-slate-200 p-1.5 opacity-40" />
              );
            }

            const event = eventMap.get(cell.dateStr);
            const dateObj = new Date(cell.dateStr);
            const isSunday = dateObj.getDay() === 0;

            return (
              <div
                key={idx}
                onClick={() => {
                  if (event) {
                    handleOpenEditModal(event);
                  } else {
                    handleOpenAddModal(cell.dateStr);
                  }
                }}
                className={`min-h-[72px] sm:min-h-[92px] rounded-xl p-1.5 sm:p-2 border transition-all cursor-pointer flex flex-col justify-between ${
                  event
                    ? event.tipe === 'LIBUR'
                      ? 'bg-red-50/70 border-red-200 hover:border-red-400'
                      : event.tipe === 'ASESMEN'
                      ? 'bg-amber-50/70 border-amber-200 hover:border-amber-400'
                      : event.tipe === 'RAPOR'
                      ? 'bg-emerald-50/80 border-emerald-300 hover:border-emerald-500'
                      : 'bg-blue-50/70 border-blue-200 hover:border-blue-400'
                    : isSunday
                    ? 'bg-slate-50 border-slate-200 text-red-500 hover:border-slate-300'
                    : 'bg-white border-slate-200 hover:border-emerald-300 hover:shadow-xs'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`text-xs font-bold ${
                      isSunday || event?.tipe === 'LIBUR' ? 'text-red-600' : 'text-slate-800'
                    }`}
                  >
                    {cell.dayNum}
                  </span>
                  {event && (
                    <span
                      className={`text-[9px] uppercase font-extrabold px-1 rounded ${
                        event.tipe === 'LIBUR'
                          ? 'bg-red-200 text-red-800'
                          : event.tipe === 'ASESMEN'
                          ? 'bg-amber-200 text-amber-800'
                          : event.tipe === 'RAPOR'
                          ? 'bg-emerald-200 text-emerald-900'
                          : 'bg-blue-200 text-blue-900'
                      }`}
                    >
                      {event.tipe}
                    </span>
                  )}
                </div>

                {event ? (
                  <div className="mt-1">
                    <div className="text-[10px] sm:text-[11px] font-bold text-slate-900 line-clamp-2 leading-tight">
                      {event.judul}
                    </div>
                    {event.keterangan && (
                      <div className="text-[9px] text-slate-500 line-clamp-1 mt-0.5 hidden sm:block">
                        {event.keterangan}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-[10px] text-slate-400 font-medium self-end">
                    {isSunday ? 'Libur' : 'Efektif'}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Events Table List for the Semester */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="font-bold text-sm text-slate-900">
            Daftar Agenda & Libur Khusus Kalender Pendidikan ({events.length} Terdata)
          </div>
          <span className="text-xs text-slate-400">Klik ikon untuk edit/hapus</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
              <tr>
                <th className="p-3">Tanggal</th>
                <th className="p-3">Nama Agenda / Hari Libur</th>
                <th className="p-3">Kategori</th>
                <th className="p-3">Keterangan & Dampak</th>
                <th className="p-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {events
                .slice()
                .sort((a, b) => a.tanggal.localeCompare(b.tanggal))
                .map(e => (
                  <tr key={e.id} className="hover:bg-slate-50/70">
                    <td className="p-3 font-semibold text-slate-800 whitespace-nowrap">{e.tanggal}</td>
                    <td className="p-3 font-bold text-slate-900">{e.judul}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${getEventBadgeClass(e.tipe)}`}>
                        {e.tipe}
                      </span>
                    </td>
                    <td className="p-3 text-slate-500">{e.keterangan || '-'}</td>
                    <td className="p-3 text-right space-x-1 whitespace-nowrap">
                      <button
                        onClick={() => handleOpenEditModal(e)}
                        className="p-1 rounded text-slate-500 hover:text-emerald-700 hover:bg-emerald-50"
                        title="Edit"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onDeleteEvent(e.id)}
                        className="p-1 rounded text-slate-500 hover:text-red-700 hover:bg-red-50"
                        title="Hapus"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Event Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-5 border border-slate-200">
            <h3 className="font-bold text-base text-slate-900 mb-4">
              {editingEventId ? 'Ubah Agenda Kalender' : 'Tambah Agenda Kalender'}
            </h3>

            <form onSubmit={handleSaveEvent} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Tanggal Kegiatan/Libur</label>
                <input
                  type="date"
                  value={formTanggal}
                  onChange={e => setFormTanggal(e.target.value)}
                  required
                  className="w-full border border-slate-300 rounded-xl p-2.5 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Judul / Nama Agenda</label>
                <input
                  type="text"
                  placeholder="Contoh: Asesmen Tengah Semester, Libur Maulid Nabi..."
                  value={formJudul}
                  onChange={e => setFormJudul(e.target.value)}
                  required
                  className="w-full border border-slate-300 rounded-xl p-2.5 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Kategori Status Tanggal</label>
                <select
                  value={formTipe}
                  onChange={e => setFormTipe(e.target.value as CalendarEventType)}
                  className="w-full border border-slate-300 rounded-xl p-2.5 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                >
                  <option value="LIBUR">LIBUR (Tidak Dihitung Hari Belajar Efektif)</option>
                  <option value="KEGIATAN">KEGIATAN (Matsama, Upacara, Pramuka, Classmeeting)</option>
                  <option value="ASESMEN">ASESMEN (ATS / AAS / Sumatif Lingkup Materi)</option>
                  <option value="RAPOR">RAPOR (Penyerahan Laporan Hasil Belajar)</option>
                  <option value="EFEKTIF">EFEKTIF (KBM Tatap Muka Normal)</option>
                  <option value="LAINNYA">LAINNYA</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Keterangan / Catatan Tambahan</label>
                <textarea
                  rows={2}
                  placeholder="Keterangan opsional..."
                  value={formKeterangan}
                  onChange={e => setFormKeterangan(e.target.value)}
                  className="w-full border border-slate-300 rounded-xl p-2.5 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
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
                  Simpan Agenda
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
