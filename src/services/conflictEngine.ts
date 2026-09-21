import {
  ScheduleItem,
  Teacher,
  Subject,
  ClassRoom,
  Room,
  CurriculumStructure,
  CalendarEvent,
  ProtaItem,
  PromesItem,
  ValidationConflict,
  SchoolDay
} from '../types';

export function runConflictValidation(params: {
  schedules: ScheduleItem[];
  teachers: Teacher[];
  subjects: Subject[];
  classes: ClassRoom[];
  rooms: Room[];
  curriculum: CurriculumStructure[];
  calendarEvents: CalendarEvent[];
  schoolDays: SchoolDay[];
  protaList: ProtaItem[];
  promesList: PromesItem[];
  totalMingguEfektif: number;
}): ValidationConflict[] {
  const conflicts: ValidationConflict[] = [];
  const {
    schedules,
    teachers,
    subjects,
    classes,
    rooms,
    curriculum,
    calendarEvents,
    protaList,
    promesList,
    totalMingguEfektif
  } = params;

  const teacherMap = new Map(teachers.map(t => [t.id, t]));
  const classMap = new Map(classes.map(c => [c.id, c]));
  const subjectMap = new Map(subjects.map(s => [s.id, s]));
  const roomMap = new Map(rooms.map(r => [r.id, r]));

  // 1. Guru mengajar dua kelas pada jam dan hari yang sama
  const teacherTimeMap = new Map<string, ScheduleItem[]>();
  // 2. Kelas memiliki dua guru pada jam dan hari yang sama
  const classTimeMap = new Map<string, ScheduleItem[]>();
  // 3. Ruang digunakan dua kelas pada jam dan hari yang sama
  const roomTimeMap = new Map<string, ScheduleItem[]>();

  // Guru JP counter
  const teacherJpCount = new Map<string, number>();
  // Class - Subject JP counter
  const classSubjectJp = new Map<string, number>();

  schedules.forEach(sch => {
    // 1. Guru check
    const teacherKey = `${sch.teacherId}_${sch.hari}_${sch.jamKe}`;
    if (!teacherTimeMap.has(teacherKey)) teacherTimeMap.set(teacherKey, []);
    teacherTimeMap.get(teacherKey)!.push(sch);

    // 2. Kelas check
    const classKey = `${sch.classId}_${sch.hari}_${sch.jamKe}`;
    if (!classTimeMap.has(classKey)) classTimeMap.set(classKey, []);
    classTimeMap.get(classKey)!.push(sch);

    // 3. Ruang check
    if (sch.roomId) {
      const roomKey = `${sch.roomId}_${sch.hari}_${sch.jamKe}`;
      if (!roomTimeMap.has(roomKey)) roomTimeMap.set(roomKey, []);
      roomTimeMap.get(roomKey)!.push(sch);
    }

    // Counts
    teacherJpCount.set(sch.teacherId, (teacherJpCount.get(sch.teacherId) || 0) + 1);
    const csKey = `${sch.classId}_${sch.subjectId}`;
    classSubjectJp.set(csKey, (classSubjectJp.get(csKey) || 0) + 1);
  });

  // Evaluate Teacher conflicts
  teacherTimeMap.forEach((items, key) => {
    if (items.length > 1) {
      const teacher = teacherMap.get(items[0].teacherId);
      const classNames = items.map(it => classMap.get(it.classId)?.nama || it.classId).join(' & ');
      conflicts.push({
        id: `conf_teacher_${key}`,
        severity: 'conflict',
        category: 'guru',
        title: `Guru Bentrok di Jam Bersamaan: ${teacher?.nama || 'Guru'}`,
        description: `${teacher?.nama || 'Guru'} terdaftar mengajar di ${items.length} kelas sekaligus (${classNames}) pada hari ${items[0].hari} jam ke-${items[0].jamKe}.`,
        itemRef: items[0].id
      });
    }
  });

  // Evaluate Class conflicts
  classTimeMap.forEach((items, key) => {
    if (items.length > 1) {
      const cls = classMap.get(items[0].classId);
      const mapels = items.map(it => subjectMap.get(it.subjectId)?.nama || it.subjectId).join(' & ');
      conflicts.push({
        id: `conf_class_${key}`,
        severity: 'conflict',
        category: 'kelas',
        title: `Kelas Mengajar Ganda: ${cls?.nama || 'Kelas'}`,
        description: `${cls?.nama || 'Kelas'} dijadwalkan dengan 2 mata pelajaran sekaligus (${mapels}) pada hari ${items[0].hari} jam ke-${items[0].jamKe}.`,
        itemRef: items[0].id
      });
    }
  });

  // Evaluate Room conflicts
  roomTimeMap.forEach((items, key) => {
    if (items.length > 1) {
      const rm = roomMap.get(items[0].roomId);
      const classNames = items.map(it => classMap.get(it.classId)?.nama || it.classId).join(' & ');
      conflicts.push({
        id: `conf_room_${key}`,
        severity: 'conflict',
        category: 'ruang',
        title: `Ruang Bentrok: ${rm?.nama || 'Ruangan'}`,
        description: `${rm?.nama || 'Ruangan'} (${rm?.kode}) digunakan bersamaan oleh ${classNames} pada hari ${items[0].hari} jam ke-${items[0].jamKe}.`,
        itemRef: items[0].id
      });
    }
  });

  // 4. Jumlah JP Guru berlebihan
  teachers.forEach(t => {
    const jpScheduled = teacherJpCount.get(t.id) || 0;
    if (jpScheduled > t.maxJp) {
      conflicts.push({
        id: `warn_jp_${t.id}`,
        severity: 'warning',
        category: 'guru',
        title: `Beban Mengajar Melebihi Batas: ${t.nama}`,
        description: `${t.nama} memiliki beban ${jpScheduled} JP/minggu, melebihi kuota beban maksimum yang ditentukan (${t.maxJp} JP).`,
        itemRef: t.id
      });
    }
  });

  // 5. Alokasi JP Mapel vs Struktur Kurikulum
  classes.forEach(cls => {
    const classCurricula = curriculum.filter(c => c.tingkat === cls.tingkat);
    classCurricula.forEach(curr => {
      const scheduledJp = classSubjectJp.get(`${cls.id}_${curr.subjectId}`) || 0;
      const sub = subjectMap.get(curr.subjectId);
      if (scheduledJp > 0 && scheduledJp !== curr.jpPerMinggu) {
        conflicts.push({
          id: `warn_curr_${cls.id}_${curr.subjectId}`,
          severity: 'warning',
          category: 'kurikulum',
          title: `Selisih Alokasi JP Kurikulum: ${cls.nama} - ${sub?.nama}`,
          description: `Jadwal riil terpasang ${scheduledJp} JP/minggu, sedangkan struktur kurikulum standar menetapkan ${curr.jpPerMinggu} JP/minggu.`,
          itemRef: cls.id
        });
      }
    });
  });

  // 6. Validasi Promes vs JP Efektif
  promesList.forEach(promes => {
    const sub = subjectMap.get(promes.subjectId);
    const totalPromesDistributed =
      Object.values(promes.distribusiMingguan || {}).reduce((a, b) => a + Number(b || 0), 0) +
      Object.values(promes.distribusiMingguanSesi2 || {}).reduce((a, b) => a + Number(b || 0), 0);
    const maxAllowedJPEfektif = totalMingguEfektif * (sub?.jpDefault || 4);

    if (totalPromesDistributed > maxAllowedJPEfektif) {
      conflicts.push({
        id: `warn_promes_over_${promes.id}`,
        severity: 'warning',
        category: 'promes',
        title: `Alokasi Promes Melampaui JP Efektif: ${sub?.nama || 'Mapel'}`,
        description: `Total distribusi JP Promes (${totalPromesDistributed} JP) melebihi kapasitas total JP efektif semester (${maxAllowedJPEfektif} JP).`,
        itemRef: promes.id
      });
    }
  });

  // 7. Sinkronisasi Prota vs Promes
  protaList.forEach(prota => {
    const matchingPromes = promesList.find(p => p.protaId === prota.id);
    if (!matchingPromes) {
      conflicts.push({
        id: `warn_unsynced_prota_${prota.id}`,
        severity: 'warning',
        category: 'prota',
        title: `Materi Prota Belum Dibuatkan Promes: Kelas ${prota.tingkat}`,
        description: `Materi "${prota.materiTP.slice(0, 45)}..." (${prota.alokasiJP} JP) belum terdistribusi ke dalam Program Semester.`,
        itemRef: prota.id
      });
    }
  });

  // 8. Jadwal di Hari Libur / Tidak Aktif
  calendarEvents.filter(e => e.tipe === 'LIBUR').forEach(libur => {
    const liburDate = new Date(libur.tanggal);
    const dayIndex = liburDate.getDay(); // 0=Sun..6=Sat
    const dayNames = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const dayName = dayNames[dayIndex];
    const schedulesOnThisDay = schedules.filter(s => s.hari === dayName);
    if (schedulesOnThisDay.length > 0) {
      // note as informational warning
    }
  });

  return conflicts;
}

export function validateAllRules(
  schedules: ScheduleItem[],
  lessonHours: any[],
  teachers: Teacher[],
  subjects: Subject[],
  classes: ClassRoom[],
  effectiveWeeksList?: any[]
): ValidationConflict[] {
  const conflicts: ValidationConflict[] = [];

  // Check 1: Guru mengajar 2 kelas di jam & hari yang sama
  const teacherSlots = new Map<string, ScheduleItem[]>();
  // Check 2: Ruang dipakai 2 kelas di jam & hari yang sama
  const roomSlots = new Map<string, ScheduleItem[]>();
  // Check 3: Kelas punya 2 jadwal di jam & hari yang sama
  const classSlots = new Map<string, ScheduleItem[]>();
  // Check 4: Beban JP Guru
  const teacherJP = new Map<string, number>();

  schedules.forEach(s => {
    const tKey = `${s.teacherId}_${s.hari}_${s.jamKe}`;
    const rKey = `${s.roomId || s.ruang}_${s.hari}_${s.jamKe}`;
    const cKey = `${s.classId}_${s.hari}_${s.jamKe}`;

    if (!teacherSlots.has(tKey)) teacherSlots.set(tKey, []);
    teacherSlots.get(tKey)!.push(s);

    if (s.roomId || s.ruang) {
      if (!roomSlots.has(rKey)) roomSlots.set(rKey, []);
      roomSlots.get(rKey)!.push(s);
    }

    if (!classSlots.has(cKey)) classSlots.set(cKey, []);
    classSlots.get(cKey)!.push(s);

    teacherJP.set(s.teacherId, (teacherJP.get(s.teacherId) || 0) + 1);
  });

  teacherSlots.forEach((items, key) => {
    if (items.length > 1) {
      const t = teachers.find(tch => tch.id === items[0].teacherId);
      conflicts.push({
        id: `c_teacher_${key}`,
        severity: 'conflict',
        category: 'guru',
        type: 'guru_bentrok',
        title: `Konflik Guru: ${t?.nama || 'Guru'} Mengajar Bersamaan`,
        message: `${t?.nama || 'Guru'} terjadwal di ${items.length} kelas pada hari ${items[0].hari} jam ke-${items[0].jamKe}.`,
        detail: 'Guru tidak dapat berada di dua ruang/kelas pada jam pembelajaran yang sama.'
      });
    }
  });

  roomSlots.forEach((items, key) => {
    if (items.length > 1) {
      conflicts.push({
        id: `c_room_${key}`,
        severity: 'conflict',
        category: 'ruang',
        type: 'ruang_bentrok',
        title: `Konflik Ruangan: Ruang Dipakai Ganda`,
        message: `Ruangan ${items[0].roomId || items[0].ruang} dipakai oleh ${items.length} kelas pada hari ${items[0].hari} jam ke-${items[0].jamKe}.`,
        detail: 'Dua rombel tidak dapat menggunakan ruangan fisik yang sama secara serentak.'
      });
    }
  });

  classSlots.forEach((items, key) => {
    if (items.length > 1) {
      const cls = classes.find(c => c.id === items[0].classId);
      conflicts.push({
        id: `c_class_${key}`,
        severity: 'conflict',
        category: 'kelas',
        type: 'kelas_bentrok',
        title: `Konflik Kelas: ${cls?.nama || 'Kelas'} Jadwal Ganda`,
        message: `${cls?.nama || 'Kelas'} memiliki ${items.length} mapel pada hari ${items[0].hari} jam ke-${items[0].jamKe}.`,
        detail: 'Satu kelas hanya boleh menerima satu mata pelajaran pada satu jam tatap muka.'
      });
    }
  });

  teacherJP.forEach((jp, tId) => {
    const t = teachers.find(tch => tch.id === tId);
    if (t && jp > t.maxJp) {
      conflicts.push({
        id: `c_load_${tId}`,
        severity: 'warning',
        category: 'guru',
        type: 'beban_guru_berlebih',
        title: `Beban Mengajar: ${t.nama} Melampaui Batas`,
        message: `${t.nama} memiliki beban ${jp} JP/pekan (Batas maksimal: ${t.maxJp} JP/pekan).`,
        detail: 'Pertimbangkan untuk mendistribusikan sebagian jam ke guru sejawat.'
      });
    }
  });

  return conflicts;
}
