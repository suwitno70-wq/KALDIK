import React, { useState } from 'react';
import {
  ProtaItem,
  Subject,
  Teacher,
  ClassRoom,
  MadrasahProfile
} from '../types';
import { KaldikCalculationResult } from '../services/kaldikEngine';
import {
  FileText,
  Plus,
  Trash2,
  Edit2,
  Copy,
  Printer,
  Download,
  Sparkles,
  Layers,
  Search,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface ProtaViewProps {
  protaList: ProtaItem[];
  subjects: Subject[];
  teachers: Teacher[];
  classes: ClassRoom[];
  kaldikMetrics: KaldikCalculationResult;
  profile: MadrasahProfile;
  onAddProta: (item: ProtaItem) => void;
  onUpdateProta: (item: ProtaItem) => void;
  onDeleteProta: (id: string) => void;
  onDuplicateProta: (item: ProtaItem) => void;
  onGenerateProtaOtomatis: (tingkat: number, subjectId: string) => void;
  onOpenPrint: (type: any) => void;
  onExportCSV: () => void;
}

export const ProtaView: React.FC<ProtaViewProps> = ({
  protaList,
  subjects,
  teachers,
  classes,
  kaldikMetrics,
  profile,
  onAddProta,
  onUpdateProta,
  onDeleteProta,
  onDuplicateProta,
  onGenerateProtaOtomatis,
  onOpenPrint,
  onExportCSV
}) => {
  const [selectedTingkat, setSelectedTingkat] = useState<number>(6);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('sb_mat');
  const [searchQuery, setSearchQuery] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formLingkup, setFormLingkup] = useState('');
  const [formATP, setFormATP] = useState('');
  const [formMateriTP, setFormMateriTP] = useState('');
  const [formJP, setFormJP] = useState<number>(10);
  const [formBulan, setFormBulan] = useState('Juli');
  const [formMingguKe, setFormMingguKe] = useState<number>(1);
  const [formKet, setFormKet] = useState('');

  const currentSubject = subjects.find(s => s.id === selectedSubjectId);
  const filteredList = protaList.filter(
    p =>
      p.tingkat === selectedTingkat &&
      p.subjectId === selectedSubjectId &&
      (p.materiTP.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.lingkupMateri.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const totalAllocatedJP = filteredList.reduce((sum, item) => sum + item.alokasiJP, 0);
  // Reference target JP: 19 Minggu Efektif x JP default (e.g. 5)
  const targetJPEfektif = kaldikMetrics.totalMingguEfektif * (currentSubject?.jpDefault || 5);

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormLingkup('');
    setFormATP('');
    setFormMateriTP('');
    setFormJP(10);
    setFormBulan('Juli');
    setFormMingguKe(1);
    setFormKet('Kurikulum Merdeka Madrasah');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: ProtaItem) => {
    setEditingId(item.id);
    setFormLingkup(item.lingkupMateri);
    setFormATP(item.atp);
    setFormMateriTP(item.materiTP);
    setFormJP(item.alokasiJP);
    setFormBulan(item.perkiraanBulan);
    setFormMingguKe(item.perkiraanMingguKe);
    setFormKet(item.keterangan || '');
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formMateriTP) return;

    const teacher = teachers.find(t => t.mapelUtama.toLowerCase().includes(currentSubject?.nama.toLowerCase() || '')) || teachers[1];

    if (editingId) {
      const existing = protaList.find(p => p.id === editingId);
      if (existing) {
        onUpdateProta({
          ...existing,
          lingkupMateri: formLingkup,
          atp: formATP,
          materiTP: formMateriTP,
          alokasiJP: Number(formJP),
          perkiraanBulan: formBulan,
          perkiraanMingguKe: Number(formMingguKe),
          keterangan: formKet
        });
      }
    } else {
      onAddProta({
        id: `prota_${Date.now()}`,
        tingkat: selectedTingkat,
        subjectId: selectedSubjectId,
        teacherId: teacher.id,
        semester: 'Ganjil',
        noUrut: filteredList.length + 1,
        lingkupMateri: formLingkup || 'Lingkup Materi Utama',
        atp: formATP || 'Alur Tujuan Pembelajaran Madrasah',
        materiTP: formMateriTP,
        alokasiJP: Number(formJP),
        perkiraanBulan: formBulan,
        perkiraanMingguKe: Number(formMingguKe),
        keterangan: formKet
      });
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-teal-700" />
            <h2 className="text-lg font-bold text-slate-900">Program Tahunan (PROTA) Terpadu</h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Tersambung langsung dengan Kalender Pendidikan dan Alokasi Minggu Efektif (KMA 450)
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => onGenerateProtaOtomatis(selectedTingkat, selectedSubjectId)}
            className="flex items-center gap-1.5 px-3 py-2 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-bold rounded-xl text-xs shadow-xs transition-all"
            title="Generate Prota dari Struktur Kurikulum & Minggu Efektif"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Generate Otomatis</span>
          </button>

          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-1 px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl text-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Materi/TP</span>
          </button>

          <button
            onClick={() => onOpenPrint('prota')}
            className="p-2 border border-slate-200 hover:bg-slate-50 rounded-xl text-slate-700"
            title="Cetak PROTA A4 Resmi"
          >
            <Printer className="w-4 h-4" />
          </button>

          <button
            onClick={onExportCSV}
            className="p-2 border border-slate-200 hover:bg-slate-50 rounded-xl text-slate-700"
            title="Export CSV PROTA"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Selectors: Tingkat & Mapel */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {/* Tingkat */}
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

          {/* Mata Pelajaran */}
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

        {/* Search Input */}
        <div className="relative w-full md:w-64">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Cari materi atau TP..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      </div>

      {/* Real-time JP Balance Card */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Total Alokasi JP Terencana
          </div>
          <div className="text-xl font-black text-slate-900 mt-0.5">{totalAllocatedJP} JP</div>
          <div className="text-xs text-slate-500">{filteredList.length} Capaian / TP Terdaftar</div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Target JP Efektif Semester
          </div>
          <div className="text-xl font-black text-emerald-700 mt-0.5">{targetJPEfektif} JP</div>
          <div className="text-xs text-slate-500">{kaldikMetrics.totalMingguEfektif} Minggu Efektif × {currentSubject?.jpDefault} JP</div>
        </div>

        <div className={`p-3.5 rounded-xl border shadow-xs ${
          totalAllocatedJP <= targetJPEfektif
            ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
            : 'bg-amber-50/70 border-amber-200 text-amber-900'
        }`}>
          <div className="text-[11px] font-semibold uppercase tracking-wider">
            Status Sinkronisasi
          </div>
          <div className="text-sm font-bold flex items-center gap-1.5 mt-1">
            {totalAllocatedJP <= targetJPEfektif ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Alokasi Sesuai Kapasitas</span>
              </>
            ) : (
              <>
                <AlertCircle className="w-4 h-4 text-amber-600" />
                <span>Kelebihan {totalAllocatedJP - targetJPEfektif} JP</span>
              </>
            )}
          </div>
          <div className="text-[11px] mt-0.5 opacity-80">
            Sisa JP bebas: {Math.max(0, targetJPEfektif - totalAllocatedJP)} JP
          </div>
        </div>
      </div>

      {/* Prota Table (Format Sesuai Permintaan User: No | Materi/TP | Semester | Alokasi JP | Minggu Ke | Bulan | Keterangan) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-sm text-slate-900">
            Daftar Alokasi Program Tahunan: {currentSubject?.nama} - Kelas {selectedTingkat}
          </h3>
          <span className="text-xs text-slate-500">{filteredList.length} Materi Pembelajaran</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-700 border-b border-slate-200 font-bold">
              <tr>
                <th className="p-3 text-center">No</th>
                <th className="p-3">Materi / Tujuan Pembelajaran (TP)</th>
                <th className="p-3 text-center">Semester</th>
                <th className="p-3 text-center">Alokasi JP</th>
                <th className="p-3 text-center">Minggu Ke</th>
                <th className="p-3 text-center">Bulan</th>
                <th className="p-3">Keterangan</th>
                <th className="p-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredList.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-6 text-center text-slate-400">
                    Belum ada data Prota untuk mata pelajaran ini. Klik <strong>[Generate Otomatis]</strong> atau <strong>[Tambah Materi/TP]</strong>.
                  </td>
                </tr>
              ) : (
                filteredList.map((item, idx) => (
                  <tr key={item.id} className="hover:bg-slate-50/70">
                    <td className="p-3 text-center font-semibold text-slate-400">{idx + 1}</td>
                    <td className="p-3">
                      <div className="font-bold text-slate-900">{item.materiTP}</div>
                      {item.lingkupMateri && (
                        <div className="text-[11px] text-emerald-800 font-medium mt-0.5">
                          Lingkup: {item.lingkupMateri}
                        </div>
                      )}
                      {item.atp && (
                        <div className="text-[10px] text-slate-500 mt-0.5 line-clamp-1 italic">
                          ATP: {item.atp}
                        </div>
                      )}
                    </td>
                    <td className="p-3 text-center font-semibold text-slate-700">{item.semester}</td>
                    <td className="p-3 text-center">
                      <span className="font-extrabold text-teal-800 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-200">
                        {item.alokasiJP} JP
                      </span>
                    </td>
                    <td className="p-3 text-center font-bold text-slate-700">M{item.perkiraanMingguKe}</td>
                    <td className="p-3 text-center font-semibold text-slate-800">{item.perkiraanBulan}</td>
                    <td className="p-3 text-slate-500">{item.keterangan || '-'}</td>
                    <td className="p-3 text-right space-x-1 whitespace-nowrap">
                      <button
                        onClick={() => onDuplicateProta(item)}
                        className="p-1 rounded text-slate-400 hover:text-teal-700 hover:bg-teal-50"
                        title="Duplikasi"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleOpenEdit(item)}
                        className="p-1 rounded text-slate-400 hover:text-emerald-700 hover:bg-emerald-50"
                        title="Edit"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onDeleteProta(item.id)}
                        className="p-1 rounded text-slate-400 hover:text-red-700 hover:bg-red-50"
                        title="Hapus"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
            {filteredList.length > 0 && (
              <tfoot className="bg-slate-50 font-bold border-t border-slate-200">
                <tr>
                  <td colSpan={3} className="p-3 text-center">TOTAL JP TERDISTRIBUSI</td>
                  <td className="p-3 text-center font-black text-teal-900">{totalAllocatedJP} JP</td>
                  <td colSpan={4} className="p-3 text-slate-500">
                    Kapasitas Maksimal Semester: {targetJPEfektif} JP
                  </td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-5 border border-slate-200">
            <h3 className="font-bold text-base text-slate-900 mb-3">
              {editingId ? 'Edit Materi / TP Prota' : 'Tambah Materi / TP Prota'}
            </h3>

            <form onSubmit={handleSave} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Materi Pokok / Tujuan Pembelajaran (TP)</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Contoh: Operasi Hitung Penjumlahan dan Pengurangan Bilangan Bulat..."
                  value={formMateriTP}
                  onChange={e => setFormMateriTP(e.target.value)}
                  className="w-full border border-slate-300 rounded-xl p-2.5 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Lingkup Materi / Elemen CP</label>
                <input
                  type="text"
                  placeholder="Contoh: Bilangan Bulat & Pecahan"
                  value={formLingkup}
                  onChange={e => setFormLingkup(e.target.value)}
                  className="w-full border border-slate-300 rounded-xl p-2.5 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Alur Tujuan Pembelajaran (ATP)</label>
                <input
                  type="text"
                  placeholder="Kode & deskripsi ATP (opsional)..."
                  value={formATP}
                  onChange={e => setFormATP(e.target.value)}
                  className="w-full border border-slate-300 rounded-xl p-2.5 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Alokasi JP</label>
                  <input
                    type="number"
                    min={1}
                    max={40}
                    required
                    value={formJP}
                    onChange={e => setFormJP(Number(e.target.value))}
                    className="w-full border border-slate-300 rounded-xl p-2.5 focus:ring-2 focus:ring-emerald-500 focus:outline-none font-bold"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Perkiraan Bulan</label>
                  <select
                    value={formBulan}
                    onChange={e => setFormBulan(e.target.value)}
                    className="w-full border border-slate-300 rounded-xl p-2.5 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  >
                    {['Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'].map(b => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Minggu Ke-</label>
                  <select
                    value={formMingguKe}
                    onChange={e => setFormMingguKe(Number(e.target.value))}
                    className="w-full border border-slate-300 rounded-xl p-2.5 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  >
                    {[1, 2, 3, 4, 5].map(w => (
                      <option key={w} value={w}>
                        Minggu {w}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Keterangan Tambahan</label>
                <input
                  type="text"
                  placeholder="Keterangan kurikulum / sarana..."
                  value={formKet}
                  onChange={e => setFormKet(e.target.value)}
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
                  className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-xl font-bold shadow-xs"
                >
                  Simpan Prota
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
