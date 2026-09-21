import {
  MadrasahProfile,
  Teacher,
  Subject,
  ClassRoom,
  CalendarEvent,
  ProtaItem,
  PromesItem,
  ScheduleItem
} from '../types';

export function exportToCSV(filename: string, rows: Record<string, any>[]): void {
  if (!rows || rows.length === 0) return;
  const headers = Object.keys(rows[0]);
  const csvContent = [
    headers.join(','),
    ...rows.map(row =>
      headers
        .map(header => {
          const val = row[header] ?? '';
          const escaped = String(val).replace(/"/g, '""');
          return `"${escaped}"`;
        })
        .join(',')
    )
  ].join('\n');

  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename.endsWith('.csv') ? filename : `${filename}.csv`;
  link.click();
}

export function downloadTextFile(filename: string, content: string, mimeType: string = 'text/plain;charset=utf-8;'): void {
  const blob = new Blob([content], { type: mimeType });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
}

export function generateKopSuratHTML(profile: MadrasahProfile, docTitle: string, docSub: string): string {
  return `
    <div style="border-bottom: 3px double #000; padding-bottom: 12px; margin-bottom: 18px; text-align: center; position: relative;">
      <div style="font-size: 13pt; font-weight: 700; letter-spacing: 0.5px; text-transform: uppercase;">KEMENTERIAN AGAMA REPUBLIK INDONESIA</div>
      <div style="font-size: 12pt; font-weight: 600; text-transform: uppercase;">KANTOR KEMENTERIAN AGAMA KABUPATEN ${profile.kabupaten.toUpperCase()}</div>
      <div style="font-size: 15pt; font-weight: 800; letter-spacing: 1px; color: #064e3b; margin: 2px 0;">MADRASAH IBTIDAIYAH NEGERI 1 KOTAWARINGIN TIMUR</div>
      <div style="font-size: 9pt; color: #475569;">
        ${profile.alamat}, ${profile.kecamatan}, ${profile.kabupaten}, ${profile.provinsi} ${profile.kodePos}
        <br/>Telp: ${profile.telepon} | Email: ${profile.email} | NSM: ${profile.nsm} | NPSN: ${profile.npsn}
      </div>
    </div>
    <div style="text-align: center; margin-bottom: 16px;">
      <h2 style="font-size: 13pt; font-weight: 800; text-transform: uppercase; margin: 0; text-decoration: underline; letter-spacing: 0.5px;">${docTitle}</h2>
      <div style="font-size: 10pt; font-weight: 600; color: #334155; margin-top: 3px;">${docSub}</div>
    </div>
  `;
}

export function generateTandaTanganHTML(profile: MadrasahProfile, guruNama?: string, guruNip?: string): string {
  const dateStr = `Sampit, ${new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}`;
  return `
    <div style="margin-top: 35px; display: flex; justify-content: space-between; page-break-inside: avoid; font-size: 10pt;">
      <div style="text-align: center; width: 45%;">
        <div>Mengetahui,</div>
        <div style="font-weight: 700;">Kepala Madrasah</div>
        <div style="height: 60px;"></div>
        <div style="font-weight: 700; text-decoration: underline;">${profile.kepalaMadrasah}</div>
        <div>NIP. ${profile.nipKepala}</div>
      </div>
      <div style="text-align: center; width: 45%;">
        <div>${dateStr}</div>
        <div style="font-weight: 700;">Guru Pengampu / Wali Kelas</div>
        <div style="height: 60px;"></div>
        <div style="font-weight: 700; text-decoration: underline;">${guruNama || '................................................'}</div>
        <div>NIP. ${guruNip || '..........................................'}</div>
      </div>
    </div>
  `;
}
