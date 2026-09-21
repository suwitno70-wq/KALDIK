import React, { useState } from 'react';
import {
  MadrasahProfile,
  Teacher,
  Subject,
  ClassRoom,
  ProtaItem,
  PromesItem,
  ScheduleItem,
  CalendarEvent
} from '../types';
import { KaldikCalculationResult } from '../services/kaldikEngine';
import { Printer, X, FileText, CheckCircle2, ChevronDown } from 'lucide-react';

export type PrintDocType =
  | 'kaldik'
  | 'minggu_efektif'
  | 'prota'
  | 'promes'
  | 'jadwal'
  | 'jadwal_guru'
  | 'rekap_beban';

interface PrintDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  docType: PrintDocType;
  profile: MadrasahProfile;
  teachers: Teacher[];
  subjects: Subject[];
  classes: ClassRoom[];
  protaList: ProtaItem[];
  promesList: PromesItem[];
  schedules: ScheduleItem[];
  kaldikMetrics: KaldikCalculationResult;
  calendarEvents: CalendarEvent[];
}

export const PrintDocumentModal: React.FC<PrintDocumentModalProps> = ({
  isOpen,
  onClose,
  docType,
  profile,
  teachers,
  subjects,
  classes,
  protaList,
  promesList,
  schedules,
  kaldikMetrics,
  calendarEvents
}) => {
  const [selectedType, setSelectedType] = useState<PrintDocType>(docType);
  const [selectedTeacherId, setSelectedTeacherId] = useState<string>(teachers[1]?.id || teachers[0]?.id);
  const [selectedClassId, setSelectedClassId] = useState<string>('c6');

  if (!isOpen) return null;

  const currentTeacher = teachers.find(t => t.id === selectedTeacherId);
  const currentClass = classes.find(c => c.id === selectedClassId);

  const handleTriggerPrint = () => {
    window.print();
  };

  const isLandscape = selectedType === 'promes' || selectedType === 'jadwal';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/70 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[96vh] flex flex-col overflow-hidden border border-slate-200">
        {/* Modal Controls (Hidden in Print) */}
        <div className="no-print p-4 bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-700/80 rounded-lg">
              <Printer className="w-5 h-5 text-emerald-100" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base">Pratinjau Dokumen Resmi Cetak A4</h3>
              <p className="text-xs text-slate-300">Format Resmi Kementerian Agama RI • Siap Cetak & PDF</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={selectedType}
              onChange={e => setSelectedType(e.target.value as PrintDocType)}
              className="bg-slate-800 text-white border border-slate-700 text-xs rounded-xl px-3 py-2 font-semibold focus:outline-none"
            >
              <option value="kaldik">Kalender Pendidikan (A4)</option>
              <option value="minggu_efektif">Rekap Minggu Efektif (A4)</option>
              <option value="prota">Program Tahunan / PROTA (A4)</option>
              <option value="promes">Program Semester / PROMES (A4 Landscape)</option>
              <option value="jadwal">Jadwal Pelajaran Rombel (A4 Landscape)</option>
              <option value="jadwal_guru">Jadwal Mengajar Guru (A4)</option>
              <option value="rekap_beban">Rekapitulasi Beban JP Dewan Guru (A4)</option>
            </select>

            <button
              onClick={handleTriggerPrint}
              className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs shadow-md transition-all active:scale-95"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak Dokumen (Print / PDF)</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-slate-100 flex justify-center">
          <div
            className={`bg-white shadow-lg p-6 sm:p-10 border border-slate-300 text-black text-xs font-serif leading-relaxed ${
              isLandscape ? 'w-[1000px] max-w-full' : 'w-[800px] max-w-full'
            }`}
            style={{ minHeight: '1050px' }}
          >
            {/* KOP SURAT RESMI */}
            <div className="border-b-[3px] border-black border-double pb-3 mb-5 text-center relative">
              <div className="text-[13pt] font-extrabold uppercase tracking-wide">
                KEMENTERIAN AGAMA REPUBLIK INDONESIA
              </div>
              <div className="text-[12pt] font-bold uppercase">
                KANTOR KEMENTERIAN AGAMA KABUPATEN {profile.kabupaten.toUpperCase()}
              </div>
              <div className="text-[15pt] font-black uppercase text-emerald-950 tracking-wider my-0.5">
                {profile.nama}
              </div>
              <div className="text-[9pt] text-slate-700 font-sans mt-1">
                {profile.alamat}, Kec. {profile.kecamatan}, Kab. {profile.kabupaten}, {profile.provinsi} {profile.kodePos}
                <br />
                Telepon: {profile.telepon} | Email: {profile.email} | NSM: {profile.nsm} | NPSN: {profile.npsn}
              </div>
            </div>

            {/* DOCUMENT TITLE & BODY BASED ON TYPE */}
            {selectedType === 'kaldik' && (
              <div className="space-y-4">
                <div className="text-center mb-4">
                  <h2 className="text-sm font-bold uppercase underline tracking-wider">
                    KALENDER PENDIDIKAN MADRASAH (KALDIK)
                  </h2>
                  <div className="text-xs font-semibold">
                    TAHUN PELAJARAN {profile.tahunPelajaranAktif} • SEMESTER {profile.semesterAktif.toUpperCase()}
                  </div>
                </div>

                <div className="text-xs text-slate-800 mb-3 leading-relaxed">
                  Berdasarkan Keputusan Direktur Jenderal Pendidikan Islam Kementerian Agama Republik Indonesia tentang Pedoman Kalender Pendidikan Madrasah dan hasil sinkronisasi sistem SIMADU:
                </div>

                <table className="w-full border-collapse border border-black text-[10pt]">
                  <thead>
                    <tr className="bg-slate-100 font-bold text-center">
                      <th className="border border-black p-2 w-10">No</th>
                      <th className="border border-black p-2">Uraian / Kegiatan Kalender</th>
                      <th className="border border-black p-2 w-32">Tanggal</th>
                      <th className="border border-black p-2 w-24">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {calendarEvents.map((ev, idx) => (
                      <tr key={ev.id}>
                        <td className="border border-black p-1.5 text-center">{idx + 1}</td>
                        <td className="border border-black p-1.5 font-semibold">
                          {ev.judul}
                          {ev.keterangan && <div className="text-[9pt] font-normal italic text-slate-600">{ev.keterangan}</div>}
                        </td>
                        <td className="border border-black p-1.5 text-center font-mono">{ev.tanggal}</td>
                        <td className="border border-black p-1.5 text-center uppercase font-bold text-[9pt]">{ev.tipe}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {selectedType === 'minggu_efektif' && (
              <div className="space-y-4">
                <div className="text-center mb-4">
                  <h2 className="text-sm font-bold uppercase underline tracking-wider">
                    RINCIAN PERHITUNGAN MINGGU EFEKTIF PEMBELAJARAN
                  </h2>
                  <div className="text-xs font-semibold">
                    TAHUN PELAJARAN {profile.tahunPelajaranAktif} • SEMESTER {profile.semesterAktif.toUpperCase()}
                  </div>
                </div>

                <table className="w-full border-collapse border border-black text-[10pt] mb-4">
                  <thead>
                    <tr className="bg-slate-100 font-bold text-center">
                      <th className="border border-black p-2 w-10">No</th>
                      <th className="border border-black p-2">Bulan</th>
                      <th className="border border-black p-2 text-center">Jml Minggu Kalender</th>
                      <th className="border border-black p-2 text-center">Hari Efektif KBM</th>
                      <th className="border border-black p-2 text-center">Minggu Efektif</th>
                      <th className="border border-black p-2 text-center">Minggu Tidak Efektif</th>
                    </tr>
                  </thead>
                  <tbody>
                    {kaldikMetrics.monthlySummaries.map((m, idx) => (
                      <tr key={idx}>
                        <td className="border border-black p-2 text-center">{idx + 1}</td>
                        <td className="border border-black p-2 font-bold">{m.bulanNama} 2026</td>
                        <td className="border border-black p-2 text-center">{m.mingguKalender}</td>
                        <td className="border border-black p-2 text-center">{m.hariEfektif} Hari</td>
                        <td className="border border-black p-2 text-center font-bold">{m.mingguEfektif} Minggu</td>
                        <td className="border border-black p-2 text-center">{m.mingguTidakEfektif} Minggu</td>
                      </tr>
                    ))}
                    <tr className="bg-slate-100 font-extrabold text-center">
                      <td colSpan={2} className="border border-black p-2">JUMLAH KESELURUHAN</td>
                      <td className="border border-black p-2">{kaldikMetrics.totalMingguKalender} Minggu</td>
                      <td className="border border-black p-2">{kaldikMetrics.totalHariEfektif} Hari</td>
                      <td className="border border-black p-2">{kaldikMetrics.totalMingguEfektif} Minggu</td>
                      <td className="border border-black p-2">{kaldikMetrics.totalMingguTidakEfektif} Minggu</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            {selectedType === 'prota' && (
              <div className="space-y-4">
                <div className="text-center mb-4">
                  <h2 className="text-sm font-bold uppercase underline tracking-wider">
                    PROGRAM TAHUNAN (PROTA) MADRASAH
                  </h2>
                  <div className="text-xs font-semibold">
                    TAHUN PELAJARAN {profile.tahunPelajaranAktif} • SEMESTER {profile.semesterAktif.toUpperCase()}
                  </div>
                </div>

                <table className="w-full border-collapse border border-black text-[9.5pt]">
                  <thead>
                    <tr className="bg-slate-100 font-bold text-center">
                      <th className="border border-black p-2 w-8">No</th>
                      <th className="border border-black p-2 text-left">Materi / Tujuan Pembelajaran (TP)</th>
                      <th className="border border-black p-2 w-20">Semester</th>
                      <th className="border border-black p-2 w-16">Alokasi JP</th>
                      <th className="border border-black p-2 w-20">Pekan Ke</th>
                      <th className="border border-black p-2 w-24">Bulan</th>
                      <th className="border border-black p-2">Keterangan</th>
                    </tr>
                  </thead>
                  <tbody>
                    {protaList.slice(0, 10).map((item, idx) => (
                      <tr key={item.id}>
                        <td className="border border-black p-1.5 text-center">{idx + 1}</td>
                        <td className="border border-black p-1.5 font-bold">
                          {item.materiTP}
                          {item.lingkupMateri && (
                            <div className="text-[8.5pt] font-normal text-slate-700">Lingkup: {item.lingkupMateri}</div>
                          )}
                        </td>
                        <td className="border border-black p-1.5 text-center">{item.semester}</td>
                        <td className="border border-black p-1.5 text-center font-bold">{item.alokasiJP} JP</td>
                        <td className="border border-black p-1.5 text-center">Minggu {item.perkiraanMingguKe}</td>
                        <td className="border border-black p-1.5 text-center">{item.perkiraanBulan}</td>
                        <td className="border border-black p-1.5 text-[8.5pt]">{item.keterangan || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {selectedType === 'promes' && (
              <div className="space-y-4">
                <div className="text-center mb-4">
                  <h2 className="text-sm font-bold uppercase underline tracking-wider">
                    PROGRAM SEMESTER (PROMES) KURIKULUM MERDEKA MADRASAH
                  </h2>
                  <div className="text-xs font-semibold">
                    TAHUN PELAJARAN {profile.tahunPelajaranAktif} • SEMESTER {profile.semesterAktif.toUpperCase()}
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-black text-[8.5pt]">
                    <thead>
                      <tr className="bg-slate-100 font-bold text-center">
                        <th className="border border-black p-1.5 w-8">No</th>
                        <th className="border border-black p-1.5 text-left min-w-[200px]">Materi / Tujuan Pembelajaran</th>
                        <th className="border border-black p-1.5 w-12">JP</th>
                        <th colSpan={5} className="border border-black p-1">Juli</th>
                        <th colSpan={5} className="border border-black p-1">Agustus</th>
                        <th colSpan={5} className="border border-black p-1">September</th>
                        <th colSpan={5} className="border border-black p-1">Oktober</th>
                        <th colSpan={5} className="border border-black p-1">November</th>
                        <th colSpan={5} className="border border-black p-1">Desember</th>
                        <th className="border border-black p-1.5 min-w-[100px]">Keterangan</th>
                      </tr>
                    </thead>
                    <tbody>
                      {promesList.slice(0, 8).map((p, idx) => (
                        <tr key={p.id}>
                          <td className="border border-black p-1 text-center font-bold">{idx + 1}</td>
                          <td className="border border-black p-1 font-semibold">{p.materiTP}</td>
                          <td className="border border-black p-1 text-center font-bold">{p.alokasiJP}</td>
                          {/* 30 Week Cells */}
                          {['juli', 'agustus', 'september', 'oktober', 'november', 'desember'].flatMap(m =>
                            [1, 2, 3, 4, 5].map(w => {
                              const monthDist = p.distribusiMinggu?.[m];
                              const val1 = monthDist?.[w] || p.distribusiMingguan?.[`${m.charAt(0).toUpperCase() + m.slice(1)}-${w}`] || '';
                              const val2 = p.distribusiMingguSesi2?.[m]?.[w] || p.distribusiMingguanSesi2?.[`${m.charAt(0).toUpperCase() + m.slice(1)}-${w}`] || '';
                              const displayVal = val1 && val2 ? `${val1}+${val2}` : (val1 || val2 || '');
                              return (
                                <td key={`${m}_${w}`} className="border border-black p-0.5 text-center font-bold text-[8pt]">
                                  {displayVal}
                                </td>
                              );
                            })
                          )}
                          <td className="border border-black p-1 text-[8pt]">{p.keterangan || '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {selectedType === 'jadwal' && (
              <div className="space-y-4">
                <div className="text-center mb-4">
                  <h2 className="text-sm font-bold uppercase underline tracking-wider">
                    JADWAL PELAJARAN MADRASAH IBTIDAIYAH NEGERI 1 KOTAWARINGIN TIMUR
                  </h2>
                  <div className="text-xs font-semibold">
                    TAHUN PELAJARAN {profile.tahunPelajaranAktif} • SEMESTER {profile.semesterAktif.toUpperCase()}
                  </div>
                </div>

                <table className="w-full border-collapse border border-black text-[9pt]">
                  <thead>
                    <tr className="bg-slate-100 font-bold text-center">
                      <th className="border border-black p-2 w-12">Jam</th>
                      <th className="border border-black p-2 w-24">Waktu</th>
                      {classes.map(c => (
                        <th key={c.id} className="border border-black p-2">{c.nama}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[1, 2, 3, 4, 5, 6, 7].map(hour => (
                      <tr key={hour}>
                        <td className="border border-black p-1.5 text-center font-bold">{hour}</td>
                        <td className="border border-black p-1.5 text-center font-mono text-[8.5pt]">
                          {hour === 1 ? '07.00 - 07.35' : hour === 2 ? '07.35 - 08.10' : '08.10 - 12.00'}
                        </td>
                        {classes.map(c => {
                          const sch = schedules.find(s => s.hari === 'Senin' && s.jamKe === hour && s.classId === c.id);
                          const subj = subjects.find(s => s.id === sch?.subjectId);
                          const tch = teachers.find(t => t.id === sch?.teacherId);
                          return (
                            <td key={c.id} className="border border-black p-1.5 text-center">
                              {sch ? (
                                <div>
                                  <div className="font-bold">{subj?.nama}</div>
                                  <div className="text-[8pt] text-slate-700">{tch?.nama}</div>
                                </div>
                              ) : (
                                <span className="text-slate-400">-</span>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {selectedType === 'rekap_beban' && (
              <div className="space-y-4">
                <div className="text-center mb-4">
                  <h2 className="text-sm font-bold uppercase underline tracking-wider">
                    REKAPITULASI BEBAN MENGAJAR DEWAN GURU (JP PER MINGGU)
                  </h2>
                  <div className="text-xs font-semibold">
                    TAHUN PELAJARAN {profile.tahunPelajaranAktif} • SEMESTER {profile.semesterAktif.toUpperCase()}
                  </div>
                </div>

                <table className="w-full border-collapse border border-black text-[10pt]">
                  <thead>
                    <tr className="bg-slate-100 font-bold text-center">
                      <th className="border border-black p-2 w-10">No</th>
                      <th className="border border-black p-2 text-left">Nama Guru & NIP</th>
                      <th className="border border-black p-2">Tugas / Mapel Utama</th>
                      <th className="border border-black p-2 w-28">Batas Maksimal</th>
                      <th className="border border-black p-2 w-28">Beban Terjadwal</th>
                      <th className="border border-black p-2 w-28">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {teachers.map((t, idx) => {
                      const load = schedules.filter(s => s.teacherId === t.id).length;
                      return (
                        <tr key={t.id}>
                          <td className="border border-black p-2 text-center">{idx + 1}</td>
                          <td className="border border-black p-2 font-bold">
                            {t.nama}, {t.gelar}
                            <div className="text-[8.5pt] font-normal text-slate-600">NIP. {t.nip}</div>
                          </td>
                          <td className="border border-black p-2">{t.mapelUtama}</td>
                          <td className="border border-black p-2 text-center font-semibold">{t.maxJp} JP</td>
                          <td className="border border-black p-2 text-center font-bold">{load} JP</td>
                          <td className="border border-black p-2 text-center font-semibold text-emerald-800">
                            Memenuhi Syarat
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {/* TANDA TANGAN RESMI PENGESAHAN */}
            <div className="mt-12 flex justify-between text-[10pt] page-break-inside-avoid">
              <div className="text-center w-52">
                <div>Mengetahui,</div>
                <div className="font-bold">Kepala Madrasah</div>
                <div className="h-16 flex items-center justify-center text-slate-300 italic">
                  [ Tanda Tangan & Cap ]
                </div>
                <div className="font-bold underline uppercase">{profile.kepalaMadrasah}</div>
                <div>NIP. {profile.nipKepala}</div>
              </div>

              <div className="text-center w-52">
                <div>Sampit, 13 Juli 2026</div>
                <div className="font-bold">Guru Pengampu / Wali Kelas</div>
                <div className="h-16 flex items-center justify-center text-slate-300 italic">
                  [ Tanda Tangan ]
                </div>
                <div className="font-bold underline uppercase">
                  {currentTeacher?.nama || 'Hj. Siti Rahmah, S.Pd.I.'}
                </div>
                <div>NIP. {currentTeacher?.nip || '19850312 200901 2 015'}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
