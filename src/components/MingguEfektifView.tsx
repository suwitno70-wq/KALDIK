import React, { useState } from 'react';
import { MadrasahProfile } from '../types';
import { KaldikCalculationResult } from '../services/kaldikEngine';
import {
  Calculator,
  CheckCircle2,
  AlertCircle,
  Printer,
  Download,
  Sliders,
  CalendarCheck
} from 'lucide-react';

interface MingguEfektifViewProps {
  kaldikMetrics: KaldikCalculationResult;
  profile: MadrasahProfile;
  onOpenPrint: (type: any) => void;
  onExportCSV: () => void;
}

export const MingguEfektifView: React.FC<MingguEfektifViewProps> = ({
  kaldikMetrics,
  profile,
  onOpenPrint,
  onExportCSV
}) => {
  const [jpPerMinggu, setJpPerMinggu] = useState<number>(5);

  const totalJPEfektif = kaldikMetrics.totalMingguEfektif * jpPerMinggu;

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <Calculator className="w-5 h-5 text-emerald-700" />
            <h2 className="text-lg font-bold text-slate-900">Perhitungan Rekap Minggu Efektif</h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Dihitung otomatis berdasarkan tanggal nyata Kalender Pendidikan Semester {profile.semesterAktif} TP {profile.tahunPelajaranAktif}.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* JP Multiplier Setting */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl text-xs">
            <Sliders className="w-3.5 h-3.5 text-slate-500" />
            <span className="text-slate-600 font-medium">Beban JP/Minggu:</span>
            <select
              value={jpPerMinggu}
              onChange={e => setJpPerMinggu(Number(e.target.value))}
              className="bg-white border border-slate-300 font-bold text-slate-800 rounded px-1.5 py-0.5"
            >
              <option value={2}>2 JP (Bhs Arab)</option>
              <option value={3}>3 JP (PJOK/Seni)</option>
              <option value={4}>4 JP (PAI/Pancasila)</option>
              <option value={5}>5 JP (Matematika/IPAS)</option>
              <option value={6}>6 JP (Bhs Indonesia)</option>
            </select>
          </div>

          <button
            onClick={() => onOpenPrint('minggu_efektif')}
            className="flex items-center gap-1.5 px-3 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak A4 Resmi</span>
          </button>

          <button
            onClick={onExportCSV}
            className="p-2 border border-slate-200 hover:bg-slate-50 rounded-xl text-slate-700"
            title="Export CSV"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Total Hari Efektif</div>
          <div className="text-2xl font-black text-slate-900 mt-1">{kaldikMetrics.totalHariEfektif} Hari</div>
          <div className="text-xs text-slate-500 mt-0.5">Tatap Muka Pembelajaran</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-emerald-200 bg-emerald-50/50 shadow-xs">
          <div className="text-[11px] font-semibold text-emerald-800 uppercase tracking-wider">Minggu Efektif</div>
          <div className="text-2xl font-black text-emerald-700 mt-1">{kaldikMetrics.totalMingguEfektif} Minggu</div>
          <div className="text-xs text-emerald-700 mt-0.5">Memenuhi Syarat (≥ 3 Hari)</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Minggu Tidak Efektif</div>
          <div className="text-2xl font-black text-amber-700 mt-1">{kaldikMetrics.totalMingguTidakEfektif} Minggu</div>
          <div className="text-xs text-slate-500 mt-0.5">Asesmen / Libur Khusus</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-teal-200 bg-teal-50/50 shadow-xs">
          <div className="text-[11px] font-semibold text-teal-800 uppercase tracking-wider">Alokasi JP Efektif</div>
          <div className="text-2xl font-black text-teal-700 mt-1">{totalJPEfektif} JP</div>
          <div className="text-xs text-teal-700 mt-0.5">{kaldikMetrics.totalMingguEfektif} Minggu × {jpPerMinggu} JP</div>
        </div>
      </div>

      {/* Table 1: Rekapitulasi per Bulan (Format Permintaan User) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-sm text-slate-900">
            Tabel Rekapitulasi Jumlah Minggu & Hari Efektif per Bulan
          </h3>
          <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
            KMA 1503 Madrasah
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-700 border-b border-slate-200 font-bold">
              <tr>
                <th className="p-3">No</th>
                <th className="p-3">Bulan</th>
                <th className="p-3 text-center">Minggu Kalender</th>
                <th className="p-3 text-center">Hari Efektif</th>
                <th className="p-3 text-center">Minggu Efektif</th>
                <th className="p-3 text-center">Minggu Tdk Efektif</th>
                <th className="p-3 text-center">Alokasi JP Efektif ({jpPerMinggu} JP)</th>
                <th className="p-3">Keterangan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {kaldikMetrics.monthlySummaries.map((m, idx) => (
                <tr key={idx} className="hover:bg-slate-50/70">
                  <td className="p-3 font-semibold text-slate-400">{idx + 1}</td>
                  <td className="p-3 font-bold text-slate-900">{m.bulanNama} 2026</td>
                  <td className="p-3 text-center font-semibold text-slate-700">{m.mingguKalender}</td>
                  <td className="p-3 text-center font-semibold text-slate-700">{m.hariEfektif} Hari</td>
                  <td className="p-3 text-center font-bold text-emerald-700">{m.mingguEfektif} Minggu</td>
                  <td className="p-3 text-center font-semibold text-amber-700">{m.mingguTidakEfektif} Minggu</td>
                  <td className="p-3 text-center font-black text-teal-800">{m.mingguEfektif * jpPerMinggu} JP</td>
                  <td className="p-3 text-slate-500">
                    {m.mingguTidakEfektif > 0
                      ? idx === 2
                        ? 'Terdapat Asesmen Tengah Semester (ATS)'
                        : idx === 4 || idx === 5
                        ? 'Asesmen Akhir Semester (AAS) & Rapor'
                        : 'Awal Masuk / Matsama'
                      : 'KBM Tatap Muka Penuh'}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-emerald-50 text-emerald-950 font-bold border-t-2 border-emerald-300">
              <tr>
                <td className="p-3 text-center" colSpan={2}>JUMLAH TOTAL</td>
                <td className="p-3 text-center">{kaldikMetrics.totalMingguKalender}</td>
                <td className="p-3 text-center">{kaldikMetrics.totalHariEfektif} Hari</td>
                <td className="p-3 text-center text-emerald-800 font-extrabold">{kaldikMetrics.totalMingguEfektif} Minggu</td>
                <td className="p-3 text-center text-amber-800">{kaldikMetrics.totalMingguTidakEfektif} Minggu</td>
                <td className="p-3 text-center text-teal-900 font-extrabold">{totalJPEfektif} JP</td>
                <td className="p-3">Semester Ganjil Selesai</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Table 2: Rincian Lengkap per Minggu Kalender */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-sm text-slate-900">
            Rincian Lengkap Pembagian Minggu per Pekan Kalender
          </h3>
          <span className="text-xs text-slate-500">Berdasarkan data hari kalender riil</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
              <tr>
                <th className="p-3">Bulan</th>
                <th className="p-3 text-center">Pekan Ke-</th>
                <th className="p-3">Rentang Tanggal</th>
                <th className="p-3 text-center">Hari Sekolah</th>
                <th className="p-3 text-center">Hari Libur</th>
                <th className="p-3 text-center">Hari Efektif</th>
                <th className="p-3 text-center">Status</th>
                <th className="p-3">Keterangan Aktivitas</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {kaldikMetrics.effectiveWeeksList.map((ew, idx) => (
                <tr
                  key={idx}
                  className={`hover:bg-slate-50/70 ${
                    ew.status === 'EFEKTIF' ? '' : 'bg-amber-50/30'
                  }`}
                >
                  <td className="p-3 font-semibold text-slate-800">{ew.bulanNama}</td>
                  <td className="p-3 text-center font-bold text-slate-700">M{ew.mingguKe}</td>
                  <td className="p-3 font-medium text-slate-800 whitespace-nowrap">{ew.rentangTanggal}</td>
                  <td className="p-3 text-center text-slate-600">{ew.hariSekolah}</td>
                  <td className="p-3 text-center text-slate-600">{ew.hariLibur}</td>
                  <td className="p-3 text-center font-bold text-emerald-700">{ew.hariEfektif}</td>
                  <td className="p-3 text-center">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        ew.status === 'EFEKTIF'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {ew.status === 'EFEKTIF' ? 'EFEKTIF' : 'TIDAK EFEKTIF'}
                    </span>
                  </td>
                  <td className="p-3 text-slate-500">{ew.keterangan}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
