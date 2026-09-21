import React from 'react';
import { ValidationConflict } from '../types';
import {
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Sparkles,
  ArrowRight,
  Filter,
  Check
} from 'lucide-react';

interface ConflictViewProps {
  conflicts: ValidationConflict[];
  onNavigateToTab: (tab: any) => void;
  onAutoResolveConflicts?: () => void;
}

export const ConflictView: React.FC<ConflictViewProps> = ({
  conflicts,
  onNavigateToTab,
  onAutoResolveConflicts
}) => {
  const [filterSeverity, setFilterSeverity] = React.useState<'all' | 'conflict' | 'warning'>('all');

  const errorCount = conflicts.filter(c => c.severity === 'conflict').length;
  const warningCount = conflicts.filter(c => c.severity === 'warning').length;

  const filteredConflicts = conflicts.filter(c => {
    if (filterSeverity === 'conflict') return c.severity === 'conflict';
    if (filterSeverity === 'warning') return c.severity === 'warning';
    return true;
  });

  const ruleCategories = [
    { title: 'Aturan 1: Guru Mengajar Bentrok', desc: 'Guru tidak boleh mengajar di 2 kelas berbeda pada hari & jam yang sama.' },
    { title: 'Aturan 2: Ruang Terpakai Ganda', desc: 'Satu ruangan fisik tidak dapat dipakai oleh 2 rombel bersamaan.' },
    { title: 'Aturan 3: Kelas Mapel Ganda', desc: 'Satu kelas hanya boleh menerima 1 mata pelajaran pada 1 jam pembelajaran.' },
    { title: 'Aturan 4: Jam Istirahat Terisi KBM', desc: 'Jam istirahat dan ibadah dhuha wajib steril dari sesi tatap muka.' },
    { title: 'Aturan 5: Beban Mengajar Guru', desc: 'Beban mengajar mingguan guru tidak boleh melampaui kuota jam maksimal.' },
    { title: 'Aturan 6: Alokasi JP Struktur Kurikulum', desc: 'Jumlah jam mengajar mapel per minggu wajib sesuai KMA 1503.' },
    { title: 'Aturan 7: Keselarasan Prota vs Kaldik', desc: 'Total JP pada Prota tidak boleh melebihi kapasitas minggu efektif Kaldik.' },
    { title: 'Aturan 8: Keselarasan Promes vs Libur Kaldik', desc: 'Pekan pada Promes tidak boleh menaruh beban JP pada pekan libur kalender.' }
  ];

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Top Banner */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-emerald-700" />
            <h2 className="text-lg font-bold text-slate-900">
              Pusat Diagnostik & Validasi Konflik Terpadu
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Sistem pengawasan 8 aturan anti-bentrok secara real-time pada seluruh modul administrasi pembelajaran.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {errorCount > 0 && onAutoResolveConflicts && (
            <button
              onClick={onAutoResolveConflicts}
              className="flex items-center gap-1.5 px-3 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-xs shadow-xs transition-colors"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Perbaiki Otomatis</span>
            </button>
          )}
        </div>
      </div>

      {/* KPI Status Diagnostics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div
          className={`p-4 rounded-xl border shadow-xs ${
            errorCount === 0
              ? 'bg-emerald-50/80 border-emerald-300 text-emerald-950'
              : 'bg-red-50/80 border-red-300 text-red-950'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider">Status Konflik Kritis</span>
            {errorCount === 0 ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            ) : (
              <XCircle className="w-5 h-5 text-red-600" />
            )}
          </div>
          <div className="text-2xl font-black mt-1">
            {errorCount === 0 ? 'NOL KONFLIK (AMAN)' : `${errorCount} Bentrok Ditemukan`}
          </div>
          <div className="text-xs mt-0.5 opacity-80">
            {errorCount === 0 ? 'Semua guru, ruang, dan kelas sinkron' : 'Perlu penyesuaian jadwal segera'}
          </div>
        </div>

        <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/60 text-amber-950 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider">Peringatan / Info</span>
            <AlertTriangle className="w-5 h-5 text-amber-600" />
          </div>
          <div className="text-2xl font-black mt-1">{warningCount} Peringatan</div>
          <div className="text-xs mt-0.5 opacity-80">Rekomendasi optimasi beban jam</div>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Aturan Valid</span>
            <Check className="w-5 h-5 text-teal-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 mt-1">8 / 8 Aturan</div>
          <div className="text-xs text-slate-500 mt-0.5">Standar Kemenag RI (KMA 1503)</div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between bg-white p-3 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setFilterSeverity('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filterSeverity === 'all'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Semua ({conflicts.length})
          </button>
          <button
            onClick={() => setFilterSeverity('conflict')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filterSeverity === 'conflict'
                ? 'bg-red-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Hanya Konflik ({errorCount})
          </button>
          <button
            onClick={() => setFilterSeverity('warning')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filterSeverity === 'warning'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Hanya Peringatan ({warningCount})
          </button>
        </div>
      </div>

      {/* Conflicts List */}
      <div className="space-y-3">
        {filteredConflicts.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-3">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-slate-900">Sistem Berjalan Mulus & Bersih</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
              Tidak ada bentrok guru, ruang, atau rombel yang terdeteksi. Kalender Pendidikan, Minggu Efektif, Prota, Promes, dan Jadwal berada dalam status valid.
            </p>
          </div>
        ) : (
          filteredConflicts.map(c => (
            <div
              key={c.id}
              className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs ${
                c.severity === 'conflict'
                  ? 'bg-red-50/60 border-red-200 text-red-950'
                  : 'bg-amber-50/60 border-amber-200 text-amber-950'
              }`}
            >
              <div className="flex items-start gap-3">
                {c.severity === 'conflict' ? (
                  <XCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                )}
                <div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                        c.severity === 'conflict'
                          ? 'bg-red-200 text-red-900'
                          : 'bg-amber-200 text-amber-900'
                      }`}
                    >
                      {c.severity}
                    </span>
                    <span className="font-bold text-xs capitalize text-slate-700">
                      Modul: {c.type.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="text-xs sm:text-sm font-semibold mt-1 text-slate-900">
                    {c.message}
                  </div>
                  {c.detail && (
                    <div className="text-xs text-slate-600 mt-0.5">
                      {c.detail}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center">
                <button
                  onClick={() => onNavigateToTab('jadwal')}
                  className="flex items-center gap-1 px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold rounded-xl border border-slate-200 shadow-xs transition-colors"
                >
                  <span>Atur di Jadwal</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Standar 8 Aturan Anti-Bentrok SIMADU */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
        <h3 className="font-bold text-sm text-slate-900 mb-3">
          Parameter 8 Standar Validasi Otomatis SIMADU:
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          {ruleCategories.map((r, idx) => (
            <div key={idx} className="p-3 rounded-xl border border-slate-100 bg-slate-50/50">
              <div className="font-bold text-slate-800 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>{r.title}</span>
              </div>
              <p className="text-slate-500 mt-0.5 pl-5">{r.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
