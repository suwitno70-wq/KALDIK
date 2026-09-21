import React, { useState } from 'react';
import {
  Teacher,
  Subject,
  ClassRoom,
  SchoolDay,
  LessonHour,
  CurriculumStructure,
  User,
  MadrasahProfile
} from '../types';
import {
  Layers,
  Users,
  BookOpen,
  GraduationCap,
  DoorOpen,
  Clock,
  Settings,
  Plus,
  Trash2,
  Edit2,
  Download,
  Upload,
  Search,
  CheckCircle2,
  Sparkles
} from 'lucide-react';

interface MasterDataViewProps {
  teachers: Teacher[];
  subjects: Subject[];
  classes: ClassRoom[];
  schoolDays: SchoolDay[];
  lessonHours: LessonHour[];
  curriculumStructures: CurriculumStructure[];
  users: User[];
  profile: MadrasahProfile;
  onAddTeacher: (teacher: Teacher) => void;
  onUpdateTeacher: (teacher: Teacher) => void;
  onDeleteTeacher: (id: string) => void;
  onAddSubject: (subject: Subject) => void;
  onUpdateSubject: (subject: Subject) => void;
  onDeleteSubject: (id: string) => void;
  onAddClass: (c: ClassRoom) => void;
  onUpdateClass: (c: ClassRoom) => void;
  onDeleteClass: (id: string) => void;
  onExportCSV: (type: string) => void;
}

export const MasterDataView: React.FC<MasterDataViewProps> = ({
  teachers,
  subjects,
  classes,
  schoolDays,
  lessonHours,
  curriculumStructures,
  users,
  profile,
  onAddTeacher,
  onUpdateTeacher,
  onDeleteTeacher,
  onAddSubject,
  onUpdateSubject,
  onDeleteSubject,
  onAddClass,
  onUpdateClass,
  onDeleteClass,
  onExportCSV
}) => {
  type MasterTab = 'guru' | 'mapel' | 'kelas' | 'jam' | 'kurikulum' | 'user';
  const [activeSubTab, setActiveSubTab] = useState<MasterTab>('guru');
  const [searchQuery, setSearchQuery] = useState('');

  const getSubjectTingkatText = (s: Subject) => {
    if (s.tingkat && Array.isArray(s.tingkat) && s.tingkat.length > 0) {
      return `Kelas ${s.tingkat.join(', ')}`;
    }
    const matchingTingkat: number[] = curriculumStructures
      ?.filter(cs => cs.subjectId === s.id)
      .map(cs => cs.tingkat) || [];
    const unique: number[] = Array.from(new Set<number>(matchingTingkat)).sort((a: number, b: number) => a - b);
    if (unique.length > 0) {
      return `Kelas ${unique.join(', ')}`;
    }
    return 'Kelas 1 - 6 (Semua)';
  };

  // Modal State for Teacher
  const [teacherModalOpen, setTeacherModalOpen] = useState(false);
  const [editingTeacherId, setEditingTeacherId] = useState<string | null>(null);
  const [tNama, setTNama] = useState('');
  const [tNip, setTNip] = useState('');
  const [tGelar, setTGelar] = useState('S.Pd.I.');
  const [tMapel, setTMapel] = useState('Guru Kelas');
  const [tJabatan, setTJabatan] = useState('Guru Pengampu');
  const [tMaxJp, setTMaxJp] = useState(30);
  const [tWarna, setTWarna] = useState('#059669');

  const handleOpenAddTeacher = () => {
    setEditingTeacherId(null);
    setTNama('');
    setTNip('19850101 201001 1 001');
    setTGelar('S.Pd.I.');
    setTMapel('Guru Kelas');
    setTJabatan('Guru Pengampu');
    setTMaxJp(30);
    setTWarna('#059669');
    setTeacherModalOpen(true);
  };

  const handleOpenEditTeacher = (t: Teacher) => {
    setEditingTeacherId(t.id);
    setTNama(t.nama);
    setTNip(t.nip);
    setTGelar(t.gelar);
    setTMapel(t.mapelUtama);
    setTJabatan(t.jabatan);
    setTMaxJp(t.maxJp);
    setTWarna(t.warna);
    setTeacherModalOpen(true);
  };

  const handleSaveTeacher = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tNama) return;

    if (editingTeacherId) {
      onUpdateTeacher({
        id: editingTeacherId,
        nama: tNama,
        nip: tNip,
        gelar: tGelar,
        mapelUtama: tMapel,
        jabatan: tJabatan,
        maxJp: Number(tMaxJp),
        warna: tWarna
      });
    } else {
      onAddTeacher({
        id: `t_${Date.now()}`,
        nama: tNama,
        nip: tNip,
        gelar: tGelar,
        mapelUtama: tMapel,
        jabatan: tJabatan,
        maxJp: Number(tMaxJp),
        warna: tWarna
      });
    }
    setTeacherModalOpen(false);
  };

  // Modal State for Subject (including Custom Muatan Lokal)
  const [subjectModalOpen, setSubjectModalOpen] = useState(false);
  const [editingSubjectId, setEditingSubjectId] = useState<string | null>(null);
  const [sKode, setSKode] = useState('');
  const [sNama, setSNama] = useState('');
  const [sKategori, setSKategori] = useState<'Agama' | 'Umum' | 'Muatan Lokal' | 'Pilihan'>('Muatan Lokal');
  const [sKelompok, setSKelompok] = useState<'A' | 'B'>('B');
  const [sJpDefault, setSJpDefault] = useState(2);
  const [sWarna, setSWarna] = useState('#0d9488');
  const [sTingkat, setSTingkat] = useState<number[]>([1, 2, 3, 4, 5, 6]);
  const [sDeskripsi, setSDeskripsi] = useState('');

  const handleOpenAddSubject = (isMulokOnly: boolean = false) => {
    setEditingSubjectId(null);
    if (isMulokOnly) {
      setSKode(`ML-${Date.now().toString().slice(-3)}`);
      setSNama('');
      setSKategori('Muatan Lokal');
      setSKelompok('B');
      setSJpDefault(2);
      setSWarna('#0d9488');
      setSTingkat([1, 2, 3, 4, 5, 6]);
      setSDeskripsi('Kurikulum Muatan Lokal Khas Daerah Kotim / Madrasah');
    } else {
      setSKode('');
      setSNama('');
      setSKategori('Umum');
      setSKelompok('A');
      setSJpDefault(4);
      setSWarna('#2563eb');
      setSTingkat([1, 2, 3, 4, 5, 6]);
      setSDeskripsi('');
    }
    setSubjectModalOpen(true);
  };

  const handleOpenEditSubject = (s: Subject) => {
    setEditingSubjectId(s.id);
    setSKode(s.kode);
    setSNama(s.nama);
    setSKategori(s.kategori);
    setSKelompok(s.kelompok);
    setSJpDefault(s.jpDefault);
    setSWarna(s.warna);
    setSTingkat(s.tingkat && s.tingkat.length > 0 ? s.tingkat : [1, 2, 3, 4, 5, 6]);
    setSDeskripsi(s.deskripsi || '');
    setSubjectModalOpen(true);
  };

  const handleToggleTingkat = (tingkatVal: number) => {
    if (sTingkat.includes(tingkatVal)) {
      if (sTingkat.length > 1) {
        setSTingkat(sTingkat.filter(t => t !== tingkatVal));
      }
    } else {
      setSTingkat([...sTingkat, tingkatVal].sort());
    }
  };

  const handleSaveSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sNama || !sKode) return;

    if (editingSubjectId) {
      onUpdateSubject({
        id: editingSubjectId,
        kode: sKode.toUpperCase(),
        nama: sNama,
        kategori: sKategori,
        kelompok: sKelompok,
        jpDefault: Number(sJpDefault),
        warna: sWarna,
        tingkat: sTingkat,
        isMulok: sKategori === 'Muatan Lokal',
        deskripsi: sDeskripsi
      });
    } else {
      onAddSubject({
        id: `sb_${Date.now()}`,
        kode: sKode.toUpperCase(),
        nama: sNama,
        kategori: sKategori,
        kelompok: sKelompok,
        jpDefault: Number(sJpDefault),
        warna: sWarna,
        tingkat: sTingkat,
        isMulok: sKategori === 'Muatan Lokal',
        deskripsi: sDeskripsi
      });
    }
    setSubjectModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Top Banner */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-emerald-700" />
            <h2 className="text-lg font-bold text-slate-900">
              Master Data Madrasah (Input Sekali → Dipakai di Semua Modul)
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Kelola data dewan guru, mata pelajaran KMA 1503, rombel kelas, jam pelajaran, dan struktur kurikulum.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onExportCSV(activeSubTab)}
            className="flex items-center gap-1 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Sub Tab Navigation */}
      <div className="bg-white p-2.5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-1.5 overflow-x-auto">
        <button
          onClick={() => setActiveSubTab('guru')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeSubTab === 'guru'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Dewan Guru ({teachers.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('mapel')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeSubTab === 'mapel'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Mata Pelajaran ({subjects.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('kelas')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeSubTab === 'kelas'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <GraduationCap className="w-4 h-4" />
          <span>Rombel & Kelas ({classes.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('jam')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeSubTab === 'jam'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Jam & Hari Belajar</span>
        </button>

        <button
          onClick={() => setActiveSubTab('kurikulum')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeSubTab === 'kurikulum'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>Struktur Kurikulum KMA 1503</span>
        </button>

        <button
          onClick={() => setActiveSubTab('user')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeSubTab === 'user'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Pengguna & Role ({users.length})</span>
        </button>
      </div>

      {/* SUB-TAB 1: DEWAN GURU */}
      {activeSubTab === 'guru' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="font-bold text-sm text-slate-900">
              Daftar Dewan Guru & Tenaga Kependidikan ({teachers.length})
            </div>
            <button
              onClick={handleOpenAddTeacher}
              className="flex items-center gap-1 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Guru</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 font-bold">
                <tr>
                  <th className="p-3">Nama Lengkap & NIP</th>
                  <th className="p-3">Gelar</th>
                  <th className="p-3">Mapel Utama</th>
                  <th className="p-3">Jabatan / Tugas Tambahan</th>
                  <th className="p-3 text-center">Batas Max JP</th>
                  <th className="p-3 text-center">Warna Jadwal</th>
                  <th className="p-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {teachers.map(t => (
                  <tr key={t.id} className="hover:bg-slate-50/70">
                    <td className="p-3">
                      <div className="font-bold text-slate-900">{t.nama}</div>
                      <div className="text-[11px] text-slate-400">NIP. {t.nip}</div>
                    </td>
                    <td className="p-3 font-semibold text-slate-700">{t.gelar}</td>
                    <td className="p-3 font-semibold text-emerald-800">{t.mapelUtama}</td>
                    <td className="p-3 text-slate-600">{t.jabatan}</td>
                    <td className="p-3 text-center font-bold text-slate-800">{t.maxJp} JP/Mgg</td>
                    <td className="p-3 text-center">
                      <span
                        className="inline-block w-5 h-5 rounded-full shadow-xs border border-white"
                        style={{ backgroundColor: t.warna }}
                      />
                    </td>
                    <td className="p-3 text-right space-x-1 whitespace-nowrap">
                      <button
                        onClick={() => handleOpenEditTeacher(t)}
                        className="p-1 rounded text-slate-400 hover:text-emerald-700 hover:bg-emerald-50"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onDeleteTeacher(t.id)}
                        className="p-1 rounded text-slate-400 hover:text-red-700 hover:bg-red-50"
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
      )}

      {/* SUB-TAB 2: MATA PELAJARAN */}
      {activeSubTab === 'mapel' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50">
            <div>
              <div className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <span>Struktur Mata Pelajaran KMA 1503 Madrasah ({subjects.length})</span>
                <span className="text-[11px] font-semibold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                  {subjects.filter(s => s.kategori === 'Muatan Lokal' || s.isMulok).length} Muatan Lokal
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Struktur kurikulum inti nasional KMA 1503 (Pembelajaran Mendalam) &amp; muatan lokal madrasah yang dapat disesuaikan (custom).
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleOpenAddSubject(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
                title="Tambah Mata Pelajaran Muatan Lokal Khas Daerah/Madrasah"
              >
                <Sparkles className="w-3.5 h-3.5" />
                + Tambah Muatan Lokal
              </button>
              <button
                type="button"
                onClick={() => handleOpenAddSubject(false)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                + Mapel Umum/Agama
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 font-bold">
                <tr>
                  <th className="p-3">Kode</th>
                  <th className="p-3">Nama Mata Pelajaran</th>
                  <th className="p-3">Kategori</th>
                  <th className="p-3">Kelompok</th>
                  <th className="p-3 text-center">Beban Default</th>
                  <th className="p-3 text-center">Tingkat Kelas</th>
                  <th className="p-3 text-center">Warna Visual</th>
                  <th className="p-3 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {subjects.map(s => {
                  const isMulokSubject = s.kategori === 'Muatan Lokal' || s.isMulok;
                  return (
                    <tr key={s.id} className={`hover:bg-slate-50/70 ${isMulokSubject ? 'bg-teal-50/20' : ''}`}>
                      <td className="p-3 font-bold text-slate-800 whitespace-nowrap">
                        <span className="font-mono bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                          {s.kode}
                        </span>
                      </td>
                      <td className="p-3">
                        <div className="font-bold text-slate-900 flex items-center gap-1.5">
                          {s.nama}
                          {isMulokSubject && (
                            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-teal-100 text-teal-800 border border-teal-200">
                              Mulok Khas
                            </span>
                          )}
                        </div>
                        {s.deskripsi && (
                          <div className="text-[11px] text-slate-500 italic mt-0.5">
                            {s.deskripsi}
                          </div>
                        )}
                      </td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded-full font-medium text-[11px] ${
                          s.kategori === 'Muatan Lokal'
                            ? 'bg-teal-100 text-teal-800 font-semibold'
                            : s.kategori === 'Agama'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {s.kategori}
                        </span>
                      </td>
                      <td className="p-3">
                        <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-medium">
                          Kel. {s.kelompok}
                        </span>
                      </td>
                      <td className="p-3 text-center font-extrabold text-emerald-700 whitespace-nowrap">
                        {s.jpDefault} JP/Mgg
                      </td>
                      <td className="p-3 text-center text-slate-600 whitespace-nowrap">
                        {getSubjectTingkatText(s)}
                      </td>
                      <td className="p-3 text-center">
                        <span
                          className="inline-block w-5 h-5 rounded-full shadow-xs border border-white"
                          style={{ backgroundColor: s.warna }}
                          title={s.warna}
                        />
                      </td>
                      <td className="p-3 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleOpenEditSubject(s)}
                            className="p-1 text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 rounded"
                            title="Edit Mapel"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              if (confirm(`Hapus mata pelajaran "${s.nama}"?`)) {
                                onDeleteSubject(s.id);
                              }
                            }}
                            className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded"
                            title="Hapus Mapel"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: KELAS & ROMBEL */}
      {activeSubTab === 'kelas' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <div className="font-bold text-sm text-slate-900">
              Daftar Rombongan Belajar (Rombel) Kelas ({classes.length})
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 font-bold">
                <tr>
                  <th className="p-3">Nama Rombel</th>
                  <th className="p-3 text-center">Tingkat</th>
                  <th className="p-3">Wali Kelas</th>
                  <th className="p-3">Ruang Belajar Default</th>
                  <th className="p-3 text-center">Kapasitas Siswa</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {classes.map(c => {
                  const wali = teachers.find(t => t.id === c.waliKelasId);
                  return (
                    <tr key={c.id} className="hover:bg-slate-50/70">
                      <td className="p-3 font-bold text-slate-900">{c.nama}</td>
                      <td className="p-3 text-center font-bold text-slate-700">Kelas {c.tingkat}</td>
                      <td className="p-3 font-medium text-emerald-800">
                        {wali ? `${wali.nama}, ${wali.gelar}` : 'Belum Ditentukan'}
                      </td>
                      <td className="p-3 text-slate-700 font-medium">{c.ruangDefault || `Ruang ${c.ruangId}`}</td>
                      <td className="p-3 text-center font-semibold text-slate-800">{c.kapasitas || c.jumlahSiswa || 28} Siswa</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUB-TAB 4: JAM & HARI */}
      {activeSubTab === 'jam' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-100 font-bold text-sm text-slate-900">
              Hari Belajar Madrasah (6 Hari Sekolah)
            </div>
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                <tr>
                  <th className="p-3">Hari</th>
                  <th className="p-3 text-center">Urutan</th>
                  <th className="p-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {schoolDays.map(sd => (
                  <tr key={sd.id}>
                    <td className="p-3 font-bold text-slate-800">{sd.nama || sd.hari}</td>
                    <td className="p-3 text-center text-slate-500">{sd.urutan || sd.id}</td>
                    <td className="p-3 text-center">
                      <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full text-[10px]">
                        Aktif KBM
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-100 font-bold text-sm text-slate-900">
              Alokasi Waktu Jam Pelajaran (8 Jam per Hari)
            </div>
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                <tr>
                  <th className="p-3 text-center">Jam Ke</th>
                  <th className="p-3">Mulai</th>
                  <th className="p-3">Selesai</th>
                  <th className="p-3">Keterangan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {lessonHours.map(lh => (
                  <tr key={lh.jamKe} className={lh.isBreak ? 'bg-amber-50/50' : ''}>
                    <td className="p-3 text-center font-bold text-slate-800">{lh.jamKe}</td>
                    <td className="p-3 font-semibold text-slate-700">{lh.mulai}</td>
                    <td className="p-3 font-semibold text-slate-700">{lh.selesai}</td>
                    <td className="p-3">
                      {lh.isBreak ? (
                        <span className="bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full text-[10px]">
                          ISTIRAHAT (Dhuha)
                        </span>
                      ) : (
                        <span className="text-slate-500">Tatap Muka KBM</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUB-TAB 5: STRUKTUR KURIKULUM */}
      {activeSubTab === 'kurikulum' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <div className="font-bold text-sm text-slate-900">
              Relasi Beban Jam Mengajar Struktur Kurikulum (KMA 1503)
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 font-bold">
                <tr>
                  <th className="p-3">Tingkat Kelas</th>
                  <th className="p-3">Mata Pelajaran</th>
                  <th className="p-3 text-center">Beban JP per Minggu</th>
                  <th className="p-3 text-center">Beban JP per Tahun</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {curriculumStructures.map(cs => {
                  const subj = subjects.find(s => s.id === cs.subjectId);
                  const jpWeek = cs.jpMingguan ?? cs.jpPerMinggu ?? subj?.jpDefault ?? 2;
                  const jpYear = cs.jpTahunan ?? (jpWeek * 36);
                  const isMulok = subj?.kategori === 'Muatan Lokal' || subj?.isMulok;
                  return (
                    <tr key={cs.id} className={`hover:bg-slate-50/70 ${isMulok ? 'bg-teal-50/20' : ''}`}>
                      <td className="p-3 font-bold text-slate-800">Kelas {cs.tingkat}</td>
                      <td className="p-3 font-bold text-slate-900">
                        <div className="flex items-center gap-1.5">
                          {subj?.nama || cs.subjectId}
                          {isMulok && (
                            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-teal-100 text-teal-800">
                              Mulok
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-3 text-center font-black text-teal-800">{jpWeek} JP / Pekan</td>
                      <td className="p-3 text-center font-bold text-slate-700">{jpYear} JP / Tahun</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUB-TAB 6: PENGGUNA & ROLE */}
      {activeSubTab === 'user' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <div className="font-bold text-sm text-slate-900">
              Akun Pengguna Sistem & Hak Akses ({users.length})
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 font-bold">
                <tr>
                  <th className="p-3">Nama Pengguna</th>
                  <th className="p-3">Username</th>
                  <th className="p-3">Peran / Role</th>
                  <th className="p-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map(u => (
                  <tr key={u.id} className="hover:bg-slate-50/70">
                    <td className="p-3 font-bold text-slate-900">{u.name}</td>
                    <td className="p-3 text-slate-600 font-mono">{u.username}</td>
                    <td className="p-3">
                      <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full text-[10px] capitalize">
                        {u.role.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      <span className="text-emerald-700 font-semibold">Aktif</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal Teacher Add / Edit */}
      {teacherModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-5 border border-slate-200">
            <h3 className="font-bold text-base text-slate-900 mb-3">
              {editingTeacherId ? 'Ubah Data Guru' : 'Tambah Guru Baru'}
            </h3>

            <form onSubmit={handleSaveTeacher} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Nama Lengkap (Tanpa Gelar)</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Muhammad Witno"
                  value={tNama}
                  onChange={e => setTNama(e.target.value)}
                  className="w-full border border-slate-300 rounded-xl p-2.5 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Gelar Akademik</label>
                  <input
                    type="text"
                    value={tGelar}
                    onChange={e => setTGelar(e.target.value)}
                    className="w-full border border-slate-300 rounded-xl p-2.5 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">NIP</label>
                  <input
                    type="text"
                    value={tNip}
                    onChange={e => setTNip(e.target.value)}
                    className="w-full border border-slate-300 rounded-xl p-2.5 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Mapel Utama / Guru Kelas</label>
                <input
                  type="text"
                  value={tMapel}
                  onChange={e => setTMapel(e.target.value)}
                  className="w-full border border-slate-300 rounded-xl p-2.5 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Batas Beban JP</label>
                  <input
                    type="number"
                    min={12}
                    max={45}
                    value={tMaxJp}
                    onChange={e => setTMaxJp(Number(e.target.value))}
                    className="w-full border border-slate-300 rounded-xl p-2.5 focus:ring-2 focus:ring-emerald-500 focus:outline-none font-bold"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Warna Jadwal</label>
                  <input
                    type="color"
                    value={tWarna}
                    onChange={e => setTWarna(e.target.value)}
                    className="w-full h-10 border border-slate-300 rounded-xl p-1 focus:outline-none cursor-pointer"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Jabatan / Tugas Tambahan</label>
                <input
                  type="text"
                  value={tJabatan}
                  onChange={e => setTJabatan(e.target.value)}
                  className="w-full border border-slate-300 rounded-xl p-2.5 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setTeacherModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold shadow-xs"
                >
                  Simpan Guru
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Tambah / Edit Mata Pelajaran & Muatan Lokal */}
      {subjectModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className={`p-2 rounded-xl ${sKategori === 'Muatan Lokal' ? 'bg-teal-100 text-teal-700' : 'bg-emerald-100 text-emerald-700'}`}>
                  {sKategori === 'Muatan Lokal' ? <Sparkles className="w-5 h-5" /> : <BookOpen className="w-5 h-5" />}
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900">
                    {editingSubjectId 
                      ? (sKategori === 'Muatan Lokal' ? 'Edit Muatan Lokal' : 'Edit Mata Pelajaran') 
                      : (sKategori === 'Muatan Lokal' ? 'Tambah Muatan Lokal (Custom KMA 1503)' : 'Tambah Mata Pelajaran')}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {sKategori === 'Muatan Lokal' 
                      ? 'Disesuaikan dengan keunggulan lokal Kotim / kekhasan madrasah' 
                      : 'Komponen struktur kurikulum madrasah KMA 1503'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSubjectModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveSubject} className="space-y-4 pt-4 text-xs">
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-1">
                  <label className="font-semibold text-slate-700 block mb-1">
                    Kode Mapel <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. ML-BD"
                    value={sKode}
                    onChange={e => setSKode(e.target.value.toUpperCase())}
                    className="w-full border border-slate-300 rounded-xl p-2.5 focus:ring-2 focus:ring-emerald-500 focus:outline-none font-mono font-bold"
                  />
                </div>
                <div className="col-span-2">
                  <label className="font-semibold text-slate-700 block mb-1">
                    Kategori Mapel <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={sKategori}
                    onChange={e => {
                      const val = e.target.value as 'Agama' | 'Umum' | 'Muatan Lokal' | 'Pilihan';
                      setSKategori(val);
                      if (val === 'Muatan Lokal') {
                        setSKelompok('B');
                        setSWarna('#0d9488');
                      }
                    }}
                    className="w-full border border-slate-300 rounded-xl p-2.5 focus:ring-2 focus:ring-emerald-500 focus:outline-none font-medium"
                  >
                    <option value="Muatan Lokal">Muatan Lokal (Khas Madrasah / Daerah)</option>
                    <option value="Umum">Mata Pelajaran Umum</option>
                    <option value="Agama">Pendidikan Agama Islam (PAI/Bahasa Arab)</option>
                    <option value="Pilihan">Mata Pelajaran Pilihan / Ekstra</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Nama Mata Pelajaran <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Bahasa Daerah Dayak Kotim / Tahfidz Quran"
                  value={sNama}
                  onChange={e => setSNama(e.target.value)}
                  className="w-full border border-slate-300 rounded-xl p-2.5 focus:ring-2 focus:ring-emerald-500 focus:outline-none font-semibold text-sm"
                />
              </div>

              {sKategori === 'Muatan Lokal' && (
                <div className="p-2.5 bg-teal-50/70 border border-teal-200 rounded-xl text-xs text-teal-800 flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-teal-600 mt-0.5 shrink-0" />
                  <div>
                    <span className="font-bold">KMA 1503:</span> Madrasah dapat menambahkan muatan lokal maksimal 2 JP/minggu per mapel sesuai potensi daerah (Dayak Kotim, Gambus, Kaligrafi, Tilawah/Tahfidz, dll).
                  </div>
                </div>
              )}

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Kelompok</label>
                  <select
                    value={sKelompok}
                    onChange={e => setSKelompok(e.target.value as 'A' | 'B')}
                    className="w-full border border-slate-300 rounded-xl p-2.5 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  >
                    <option value="A">Kelompok A (Wajib/Inti)</option>
                    <option value="B">Kelompok B (Pengembangan/Mulok)</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Beban JP Default</label>
                  <div className="flex items-center">
                    <input
                      type="number"
                      min={1}
                      max={10}
                      value={sJpDefault}
                      onChange={e => setSJpDefault(Number(e.target.value))}
                      className="w-full border border-slate-300 rounded-xl p-2.5 focus:ring-2 focus:ring-emerald-500 focus:outline-none font-bold"
                    />
                  </div>
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Warna Visual</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={sWarna}
                      onChange={e => setSWarna(e.target.value)}
                      className="w-full h-10 border border-slate-300 rounded-xl p-1 focus:outline-none cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1.5">
                  Diberlakukan Pada Tingkat Kelas:
                </label>
                <div className="grid grid-cols-6 gap-2">
                  {[1, 2, 3, 4, 5, 6].map(t => {
                    const isChecked = sTingkat.includes(t);
                    return (
                      <button
                        key={t}
                        type="button"
                        onClick={() => handleToggleTingkat(t)}
                        className={`py-1.5 text-center font-bold rounded-xl border text-xs transition-all ${
                          isChecked
                            ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs'
                            : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        Kelas {t}
                      </button>
                    );
                  })}
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Pilih tingkat kelas yang diajarkan mata pelajaran ini.
                </p>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Deskripsi / Keterangan Muatan Lokal
                </label>
                <textarea
                  rows={2}
                  placeholder="Keterangan kurikulum, fokus kompetensi, atau rujukan SK penetapan muatan lokal..."
                  value={sDeskripsi}
                  onChange={e => setSDeskripsi(e.target.value)}
                  className="w-full border border-slate-300 rounded-xl p-2.5 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSubjectModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className={`px-4 py-2 text-white rounded-xl font-bold shadow-xs transition-colors ${
                    sKategori === 'Muatan Lokal'
                      ? 'bg-teal-700 hover:bg-teal-800'
                      : 'bg-emerald-700 hover:bg-emerald-800'
                  }`}
                >
                  {editingSubjectId ? 'Perbarui Mapel' : 'Simpan Mapel'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
