
import React from 'react';
import { ObservationData, SupervisionStatus } from '../types';
import { TEACHERS, OBSERVATION_INDICATORS } from '../constants';

interface Props {
  data: ObservationData;
  principalName: string;
}

const PrintReport: React.FC<Props> = ({ data, principalName }) => {
  const teacher = TEACHERS.find(t => t.id === data.teacherId);
  const dateStr = new Date(data.date).toLocaleDateString('id-ID', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <div className="print-document bg-white p-12 text-slate-900 leading-relaxed text-sm" id="printable-report">
      {/* KOP SURAT RESMI */}
      <div className="border-b-4 border-double border-slate-900 pb-4 mb-8 text-center">
        <h1 className="text-lg font-bold uppercase tracking-tight">PEMERINTAH KABUPATEN LUWU UTARA</h1>
        <h1 className="text-lg font-bold uppercase tracking-tight">DINAS PENDIDIKAN DAN KEBUDAYAAN</h1>
        <h2 className="text-2xl font-black uppercase tracking-widest mt-1">UPT SMPN 4 MAPPEDECENG</h2>
        <p className="text-[10px] italic mt-2">Alamat: Jl. Poros Desa, Kec. Mappedeceng, Kab. Luwu Utara, Sulawesi Selatan 92963</p>
      </div>

      <div className="text-center mb-8">
        <h3 className="text-lg font-bold underline uppercase">LAPORAN SIKLUS SUPERVISI AKADEMIK</h3>
        <p className="text-sm font-medium">Tahun Pelajaran 2024/2025</p>
      </div>

      {/* IDENTITAS */}
      <div className="grid grid-cols-2 gap-4 mb-8 border p-4 rounded-lg">
        <div>
          <table className="w-full text-xs">
            <tbody>
              <tr><td className="w-32 py-1">Nama Guru</td><td className="w-4">:</td><td className="font-bold">{teacher?.name}</td></tr>
              <tr><td className="py-1">Mata Pelajaran</td><td>:</td><td>{data.subject || teacher?.subject}</td></tr>
              <tr><td className="py-1">Fase / Kelas</td><td>:</td><td>{teacher?.phase}</td></tr>
            </tbody>
          </table>
        </div>
        <div>
          <table className="w-full text-xs">
            <tbody>
              <tr><td className="w-32 py-1">Hari / Tanggal</td><td className="w-4">:</td><td>{dateStr}</td></tr>
              <tr><td className="py-1">Waktu Percakapan</td><td>:</td><td>{data.conversationTime || '-'} WIB</td></tr>
              <tr><td className="py-1">Nama Supervisor</td><td>:</td><td>{principalName}</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* BAGIAN 1: PRA-OBSERVASI */}
      <div className="mb-8">
        <h4 className="bg-slate-100 p-2 font-bold border-l-4 border-slate-900 mb-3 uppercase text-xs">I. Catatan Percakapan Pra-Observasi</h4>
        <div className="space-y-4 px-2">
          <div>
            <p className="font-bold text-xs underline mb-1">Tujuan Pembelajaran:</p>
            <p className="text-xs text-slate-700 whitespace-pre-wrap">{data.learningGoals || 'Belum diisi'}</p>
          </div>
          <div>
            <p className="font-bold text-xs underline mb-1">Area Pengembangan yang Hendak Dicapai:</p>
            <p className="text-xs text-slate-700">Fokus pada indikator: {data.focusId === '1' ? 'Manajemen Kelas' : data.focusId === '2' ? 'Kualitas Instruksi' : 'Refleksi Pembelajaran'}</p>
          </div>
        </div>
      </div>

      {/* BAGIAN 2: OBSERVASI */}
      <div className="mb-8">
        <h4 className="bg-slate-100 p-2 font-bold border-l-4 border-slate-900 mb-3 uppercase text-xs">II. Hasil Observasi Pembelajaran</h4>
        <table className="w-full border-collapse border border-slate-300 text-[10px]">
          <thead>
            <tr className="bg-slate-50 text-center uppercase">
              <th className="border border-slate-300 p-2 w-10">No</th>
              <th className="border border-slate-300 p-2 text-left">Aspek / Indikator Pengamatan</th>
              <th className="border border-slate-300 p-2 w-20">Status</th>
              <th className="border border-slate-300 p-2 text-left">Catatan Fakta / Bukti Nyata</th>
            </tr>
          </thead>
          <tbody>
            {OBSERVATION_INDICATORS.map((ind, idx) => (
              <tr key={ind.id}>
                <td className="border border-slate-300 p-2 text-center">{idx + 1}</td>
                <td className="border border-slate-300 p-2 font-bold">{ind.label}</td>
                <td className="border border-slate-300 p-2 text-center">
                  {data.indicators[ind.id]?.checked ? 'ADA' : 'TIDAK'}
                </td>
                <td className="border border-slate-300 p-2 text-slate-600 italic">
                  {data.indicators[ind.id]?.note || '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* BAGIAN 3: PASCA-OBSERVASI */}
      <div className="mb-12 break-inside-avoid">
        <h4 className="bg-slate-100 p-2 font-bold border-l-4 border-slate-900 mb-3 uppercase text-xs">III. Catatan Pasca-Observasi & Tindak Lanjut</h4>
        <div className="space-y-4 px-2">
          <div>
            <p className="font-bold text-xs underline mb-1">Refleksi Guru:</p>
            <p className="text-xs text-slate-700 italic">{data.reflection || 'Tidak ada catatan refleksi.'}</p>
          </div>
          <div>
            <p className="font-bold text-xs underline mb-1">Rekomendasi Coaching / Umpan Balik:</p>
            <div className="text-[10px] text-slate-700 bg-slate-50 p-3 rounded border border-slate-200 whitespace-pre-wrap leading-relaxed">
              {data.coachingFeedback || 'Hasil analisis coaching belum tersedia.'}
            </div>
          </div>
          <div>
            <p className="font-bold text-xs underline mb-1">Rencana Tindak Lanjut (RTL):</p>
            <p className="text-xs text-slate-800 font-bold">{data.rtl || 'Belum ada rencana tindak lanjut.'}</p>
          </div>
        </div>
      </div>

      {/* TANDA TANGAN */}
      <div className="flex justify-between mt-16 px-12 break-inside-avoid">
        <div className="text-center">
          <p className="text-xs mb-16">Guru Mata Pelajaran,</p>
          <p className="text-xs font-bold underline">{teacher?.name}</p>
          <p className="text-[10px]">NIP. ...........................</p>
        </div>
        <div className="text-center">
          <p className="text-xs mb-16">Kepala Sekolah / Supervisor,</p>
          <p className="text-xs font-bold underline">{principalName}</p>
          <p className="text-[10px]">NIP. ...........................</p>
        </div>
      </div>
    </div>
  );
};

export default PrintReport;
