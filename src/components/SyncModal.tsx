import React, { useEffect, useState } from 'react';
import { SyncReport } from '../types';
import {
  CheckCircle2,
  RefreshCw,
  AlertCircle,
  CalendarCheck,
  FileCheck,
  CalendarRange,
  Clock,
  ShieldCheck,
  X
} from 'lucide-react';

interface SyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  report: SyncReport | null;
  isProcessing: boolean;
}

export const SyncModal: React.FC<SyncModalProps> = ({
  isOpen,
  onClose,
  report,
  isProcessing
}) => {
  const [stepIndex, setStepIndex] = useState(0);

  const steps = [
    { label: 'Membaca Kalender Pendidikan (Kaldik) 2026/2027...', icon: <CalendarCheck className="w-4 h-4 text-emerald-600" /> },
    { label: 'Menghitung Hari Efektif & Minggu Efektif Riil...', icon: <CalendarCheck className="w-4 h-4 text-emerald-600" /> },
    { label: 'Menghitung Alokasi JP Efektif berdasarkan Struktur Kurikulum...', icon: <FileCheck className="w-4 h-4 text-emerald-600" /> },
    { label: 'Sinkronisasi Alokasi JP Program Tahunan (PROTA)...', icon: <FileCheck className="w-4 h-4 text-emerald-600" /> },
    { label: 'Penyesuaian Distribusi Mingguan Program Semester (PROMES)...', icon: <CalendarRange className="w-4 h-4 text-emerald-600" /> },
    { label: 'Menyelaraskan Jadwal Pelajaran Mingguan terhadap Kalender...', icon: <Clock className="w-4 h-4 text-emerald-600" /> },
    { label: 'Validasi Deteksi Konflik Guru, Kelas, dan Ruangan...', icon: <ShieldCheck className="w-4 h-4 text-emerald-600" /> }
  ];

  useEffect(() => {
    if (isProcessing) {
      setStepIndex(0);
      const interval = setInterval(() => {
        setStepIndex(prev => {
          if (prev < steps.length - 1) return prev + 1;
          clearInterval(interval);
          return prev;
        });
      }, 250);
      return () => clearInterval(interval);
    }
  }, [isProcessing]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-emerald-100 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-800 to-teal-800 text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-700/50 rounded-lg">
              <RefreshCw className={`w-5 h-5 text-emerald-200 ${isProcessing ? 'animate-spin' : ''}`} />
            </div>
            <div>
              <h3 className="font-bold text-base">Sinkronisasi Terpadu SIMADU</h3>
              <p className="text-xs text-emerald-200">Prinsip: Input Sekali → Terhubung di Semua Modul</p>
            </div>
          </div>
          {!isProcessing && (
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-emerald-200 hover:text-white hover:bg-emerald-700/50 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-4">
          {isProcessing ? (
            <div className="space-y-3">
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Proses Sinkronisasi Lintas Modul:
              </div>
              <div className="space-y-2">
                {steps.map((s, idx) => (
                  <div
                    key={idx}
                    className={`flex items-center gap-3 p-2.5 rounded-xl text-xs transition-all ${
                      idx <= stepIndex ? 'bg-emerald-50 text-emerald-950 font-medium' : 'text-slate-400 bg-slate-50'
                    }`}
                  >
                    {idx < stepIndex ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : idx === stepIndex ? (
                      <RefreshCw className="w-4 h-4 text-amber-500 animate-spin shrink-0" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border border-slate-300 shrink-0" />
                    )}
                    <span>{s.label}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : report ? (
            <div className="space-y-4 animate-in fade-in">
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" />
                <div>
                  <h4 className="font-bold text-sm text-emerald-950">Sinkronisasi Berhasil Sempurna!</h4>
                  <p className="text-xs text-emerald-800 mt-0.5">
                    Seluruh perubahan pada Kalender Pendidikan telah dihitung ulang dan otomatis diterapkan ke Minggu Efektif, Prota, Promes, dan Jadwal Pelajaran.
                  </p>
                </div>
              </div>

              {/* Stat Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-center">
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="text-[11px] text-slate-500">Hari Efektif</div>
                  <div className="text-base font-extrabold text-emerald-700">{report.totalHariEfektif} Hari</div>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="text-[11px] text-slate-500">Minggu Efektif</div>
                  <div className="text-base font-extrabold text-emerald-700">{report.totalMingguEfektif} Minggu</div>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="text-[11px] text-slate-500">Total JP Efektif</div>
                  <div className="text-base font-extrabold text-emerald-700">{report.totalJPEfektif} JP</div>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="text-[11px] text-slate-500">Prota Tersinkron</div>
                  <div className="text-base font-extrabold text-blue-700">{report.protaSyncedCount} Dokumen</div>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="text-[11px] text-slate-500">Promes Tersinkron</div>
                  <div className="text-base font-extrabold text-blue-700">{report.promesSyncedCount} Dokumen</div>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="text-[11px] text-slate-500">Jadwal Tervalidasi</div>
                  <div className="text-base font-extrabold text-purple-700">{report.schedulesCheckedCount} Jam</div>
                </div>
              </div>

              {/* Status Validasi */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="text-xs font-bold text-slate-700 mb-2 flex items-center justify-between">
                  <span>Hasil Validasi & Deteksi Bentrok</span>
                  {report.conflictsCount === 0 ? (
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                      ✓ AMAN (0 Konflik)
                    </span>
                  ) : (
                    <span className="text-[10px] bg-red-100 text-red-800 font-bold px-2 py-0.5 rounded-full">
                      ✕ {report.conflictsCount} Konflik Terdeteksi
                    </span>
                  )}
                </div>
                <ul className="text-xs space-y-1 text-slate-600">
                  {report.details.map((det, i) => (
                    <li key={i} className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                      <span>{det}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : null}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            disabled={isProcessing}
            className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs sm:text-sm font-bold rounded-xl shadow-xs transition-colors disabled:opacity-50"
          >
            Tutup Laporan
          </button>
        </div>
      </div>
    </div>
  );
};
