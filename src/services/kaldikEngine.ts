import { CalendarEvent, EffectiveWeekItem, MonthlyEffectiveSummary, SchoolDay } from '../types';

export interface KaldikCalculationResult {
  totalHariSemester: number;
  totalHariSekolah: number;
  totalHariLibur: number;
  totalHariEfektif: number;
  totalMingguKalender: number;
  totalMingguEfektif: number;
  totalMingguTidakEfektif: number;
  monthlySummaries: MonthlyEffectiveSummary[];
  effectiveWeeksList: EffectiveWeekItem[];
}

export function computeKaldikMetrics(
  events: CalendarEvent[],
  schoolDays: SchoolDay[],
  startDateStr: string = '2026-07-13',
  endDateStr: string = '2026-12-19',
  multiplierJP: number = 5 // default JP per minggu
): KaldikCalculationResult {
  const start = new Date(startDateStr);
  const end = new Date(endDateStr);

  const activeDaysMap = new Map<number, boolean>();
  // 0 = Minggu, 1 = Senin, ... 6 = Sabtu
  schoolDays.forEach(sd => {
    // SchoolDay: 1=Senin..6=Sabtu, 7=Minggu
    const jsDay = sd.id === 7 ? 0 : sd.id;
    activeDaysMap.set(jsDay, sd.isBelajar);
  });

  const eventMap = new Map<string, CalendarEvent>();
  events.forEach(e => {
    eventMap.set(e.tanggal, e);
  });

  const monthNames = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

  let totalHariSemester = 0;
  let totalHariSekolah = 0;
  let totalHariLibur = 0;
  let totalHariEfektif = 0;

  // Group by Month -> Weeks
  interface DayInfo {
    date: Date;
    dateStr: string;
    isBelajarHari: boolean;
    event?: CalendarEvent;
    isEfektif: boolean;
  }

  const daysByMonth: Record<string, DayInfo[]> = {};

  const curr = new Date(start);
  while (curr <= end) {
    const y = curr.getFullYear();
    const m = curr.getMonth(); // 0-11
    const mKey = `${y}-${String(m + 1).padStart(2, '0')}`;

    if (!daysByMonth[mKey]) {
      daysByMonth[mKey] = [];
    }

    const dateStr = curr.toISOString().split('T')[0];
    const jsDay = curr.getDay();
    const isSchoolDay = activeDaysMap.get(jsDay) ?? false;
    const event = eventMap.get(dateStr);

    totalHariSemester++;

    let isLibur = false;
    let isEfektif = false;

    if (!isSchoolDay) {
      isLibur = true;
      totalHariLibur++;
    } else {
      totalHariSekolah++;
      if (event) {
        if (event.tipe === 'LIBUR') {
          isLibur = true;
          totalHariLibur++;
        } else if (event.tipe === 'ASESMEN' || event.tipe === 'RAPOR') {
          // Asesmen/Rapor tidak dihitung KBM efektif tatap muka reguler
          isLibur = false;
        } else {
          // KEGIATAN / EFEKTIF
          isEfektif = true;
          totalHariEfektif++;
        }
      } else {
        isEfektif = true;
        totalHariEfektif++;
      }
    }

    daysByMonth[mKey].push({
      date: new Date(curr),
      dateStr,
      isBelajarHari: isSchoolDay,
      event,
      isEfektif
    });

    curr.setDate(curr.getDate() + 1);
  }

  const monthlySummaries: MonthlyEffectiveSummary[] = [];
  const effectiveWeeksList: EffectiveWeekItem[] = [];

  let overallMingguKalender = 0;
  let overallMingguEfektif = 0;
  let overallMingguTidakEfektif = 0;

  Object.keys(daysByMonth).sort().forEach(mKey => {
    const days = daysByMonth[mKey];
    const firstDate = days[0].date;
    const monthName = monthNames[firstDate.getMonth()];

    // Segment days into calendar weeks (chunks of 7 days or Monday to Saturday)
    const weeks: DayInfo[][] = [];
    let currentWeek: DayInfo[] = [];

    days.forEach((day, idx) => {
      currentWeek.push(day);
      // Break week on Saturday (day 6) or Sunday (day 0) or at end of month
      if (day.date.getDay() === 6 || idx === days.length - 1) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
    });

    let mHariEfektif = 0;
    let mMingguEfektif = 0;
    let mMingguTidakEfektif = 0;

    weeks.forEach((wDays, wIdx) => {
      const wHariSekolah = wDays.filter(d => d.isBelajarHari).length;
      const wHariEfektif = wDays.filter(d => d.isEfektif).length;
      const wHariLibur = wDays.filter(d => !d.isEfektif).length;
      mHariEfektif += wHariEfektif;

      const startDate = wDays[0].date.getDate();
      const endDate = wDays[wDays.length - 1].date.getDate();
      const rentang = `${String(startDate).padStart(2, '0')} - ${String(endDate).padStart(2, '0')} ${monthName}`;

      // A week is considered effective if it has >= 3 effective school days
      const isWeekEffective = wHariEfektif >= 3;
      if (isWeekEffective) {
        mMingguEfektif++;
        overallMingguEfektif++;
      } else {
        mMingguTidakEfektif++;
        overallMingguTidakEfektif++;
      }

      effectiveWeeksList.push({
        bulanKey: mKey,
        bulanNama: monthName,
        mingguKe: wIdx + 1,
        rentangTanggal: rentang,
        tanggalMulai: wDays[0].dateStr,
        tanggalSelesai: wDays[wDays.length - 1].dateStr,
        hariSekolah: wHariSekolah,
        hariLibur: wHariLibur,
        hariEfektif: wHariEfektif,
        status: isWeekEffective ? 'EFEKTIF' : 'TIDAK_EFEKTIF',
        keterangan: isWeekEffective
          ? 'KBM Tatap Muka Efektif'
          : wDays.some(d => d.event?.tipe === 'ASESMEN')
            ? 'Pekan Asesmen Sumatif (ATS/AAS)'
            : wDays.some(d => d.event?.tipe === 'RAPOR')
              ? 'Penyerahan Rapor'
              : 'Hari Efektif Belajar < 3 Hari (Tidak Efektif)'
      });
    });

    overallMingguKalender += weeks.length;

    monthlySummaries.push({
      bulanNama: monthName,
      bulanKey: mKey,
      mingguKalender: weeks.length,
      hariEfektif: mHariEfektif,
      mingguEfektif: mMingguEfektif,
      mingguTidakEfektif: mMingguTidakEfektif,
      jpEfektifMapelStandard: mMingguEfektif * multiplierJP
    });
  });

  return {
    totalHariSemester,
    totalHariSekolah,
    totalHariLibur,
    totalHariEfektif,
    totalMingguKalender: overallMingguKalender,
    totalMingguEfektif: overallMingguEfektif,
    totalMingguTidakEfektif: overallMingguTidakEfektif,
    monthlySummaries,
    effectiveWeeksList
  };
}

export const calculateKaldikMetrics = computeKaldikMetrics;

export function generateDefaultKaldikEvents(): CalendarEvent[] {
  return [
    { id: 'ev_1', tanggal: '2026-07-13', judul: 'Hari Pertama Masuk Madrasah & MATSAMA', tipe: 'KEGIATAN', keterangan: 'Masa Ta’aruf Siswa Madrasah', warna: '#059669' },
    { id: 'ev_2', tanggal: '2026-07-14', judul: 'MATSAMA Hari Ke-2', tipe: 'KEGIATAN', keterangan: 'Pengenalan Lingkungan Belajar', warna: '#059669' },
    { id: 'ev_3', tanggal: '2026-07-15', judul: 'MATSAMA Hari Ke-3', tipe: 'KEGIATAN', keterangan: 'Penutupan Orientasi', warna: '#059669' },
    { id: 'ev_4', tanggal: '2026-08-17', judul: 'HUT Kemerdekaan RI Ke-81 (Libur Nasional)', tipe: 'LIBUR', keterangan: 'Upacara Bendera', warna: '#dc2626' },
    { id: 'ev_5', tanggal: '2026-08-25', judul: 'Maulid Nabi Muhammad SAW (Libur Nasional)', tipe: 'LIBUR', keterangan: 'Peringatan Hari Besar Islam', warna: '#dc2626' },
    { id: 'ev_6', tanggal: '2026-09-21', judul: 'Asesmen Tengah Semester (ATS) Hari 1', tipe: 'ASESMEN', keterangan: 'Evaluasi Pembelajaran Semester Ganjil', warna: '#d97706' },
    { id: 'ev_7', tanggal: '2026-09-22', judul: 'Asesmen Tengah Semester (ATS) Hari 2', tipe: 'ASESMEN', keterangan: 'Evaluasi Pembelajaran Semester Ganjil', warna: '#d97706' },
    { id: 'ev_8', tanggal: '2026-09-23', judul: 'Asesmen Tengah Semester (ATS) Hari 3', tipe: 'ASESMEN', keterangan: 'Evaluasi Pembelajaran Semester Ganjil', warna: '#d97706' },
    { id: 'ev_9', tanggal: '2026-09-24', judul: 'Asesmen Tengah Semester (ATS) Hari 4', tipe: 'ASESMEN', keterangan: 'Evaluasi Pembelajaran Semester Ganjil', warna: '#d97706' },
    { id: 'ev_10', tanggal: '2026-09-25', judul: 'Asesmen Tengah Semester (ATS) Hari 5', tipe: 'ASESMEN', keterangan: 'Evaluasi Pembelajaran Semester Ganjil', warna: '#d97706' },
    { id: 'ev_11', tanggal: '2026-11-25', judul: 'Peringatan Hari Guru Nasional (HGN)', tipe: 'KEGIATAN', keterangan: 'Upacara & Apresiasi Dewan Guru', warna: '#2563eb' },
    { id: 'ev_12', tanggal: '2026-12-07', judul: 'Asesmen Akhir Semester (AAS) Ganjil Hari 1', tipe: 'ASESMEN', keterangan: 'Ujian Sumatif Akhir Semester', warna: '#d97706' },
    { id: 'ev_13', tanggal: '2026-12-08', judul: 'Asesmen Akhir Semester (AAS) Ganjil Hari 2', tipe: 'ASESMEN', keterangan: 'Ujian Sumatif Akhir Semester', warna: '#d97706' },
    { id: 'ev_14', tanggal: '2026-12-09', judul: 'Asesmen Akhir Semester (AAS) Ganjil Hari 3', tipe: 'ASESMEN', keterangan: 'Ujian Sumatif Akhir Semester', warna: '#d97706' },
    { id: 'ev_15', tanggal: '2026-12-10', judul: 'Asesmen Akhir Semester (AAS) Ganjil Hari 4', tipe: 'ASESMEN', keterangan: 'Ujian Sumatif Akhir Semester', warna: '#d97706' },
    { id: 'ev_16', tanggal: '2026-12-11', judul: 'Asesmen Akhir Semester (AAS) Ganjil Hari 5', tipe: 'ASESMEN', keterangan: 'Ujian Sumatif Akhir Semester', warna: '#d97706' },
    { id: 'ev_17', tanggal: '2026-12-12', judul: 'Asesmen Akhir Semester (AAS) Ganjil Hari 6', tipe: 'ASESMEN', keterangan: 'Ujian Sumatif Akhir Semester', warna: '#d97706' },
    { id: 'ev_18', tanggal: '2026-12-18', judul: 'Pembagian Buku Laporan Hasil Belajar (Rapor)', tipe: 'RAPOR', keterangan: 'Penyerahan Rapor ke Wali Murid', warna: '#059669' },
    { id: 'ev_19', tanggal: '2026-12-21', judul: 'Libur Akhir Semester Ganjil', tipe: 'LIBUR', keterangan: 'Libur Akhir Semester', warna: '#dc2626' }
  ];
}
