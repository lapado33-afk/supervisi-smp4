
import React from 'react';
import { ObservationData } from '../types';
import { TEACHERS, OBSERVATION_INDICATORS } from '../constants';

interface Props {
  data: ObservationData;
  principalName: string;
  principalNip: string;
}

const PrintReport: React.FC<Props> = ({ data, principalName, principalNip }) => {
  const teacher = TEACHERS.find(t => String(t.id) === String(data.teacherId));
  const displayTeacherName = data.teacherName || teacher?.name || 'Guru Mata Pelajaran';
  const displayTeacherNip = data.teacherNip || teacher?.nip || '...........................';
  const displayPrincipalNip = principalNip || data.principalNip || '...........................';
  
  const dateStr = new Date(data.date).toLocaleDateString('id-ID', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <div className="bg-white p-10 text-black font-serif leading-tight text-[10px] max-w-[210mm] mx-auto min-h-[297mm]">
      {/* KOP SURAT */}
      <div className="border-b-4 border-double border-black pb-4 mb-6 text-center">
        <h1 className="text-sm font-bold uppercase tracking-tight">PEMERINTAH KABUPATEN LUWU UTARA</h1>
        <h1 className="text-sm font-bold uppercase tracking-tight">DINAS PENDIDIKAN DAN KEBUDAYAAN</h1>
        <h2 className="text-lg font-black uppercase mt-1">UPT SMPN 4 MAPPEDECENG</h2>
        <p className="text-[8px] italic mt-1">Alamat: Jl. Poros Desa, Kec. Mappedeceng, Kab. Luwu Utara, Sulawesi Selatan 92963</p>
      </div>

      <div className="text-center mb-6">
        <h3 className="text-xs font-bold underline uppercase">LAPORAN HASIL SUPERVISI AKADEMIK</h3>
        <p className="text-[9px] font-bold">TAHUN PELAJARAN 2024/2025</p>
      </div>

      {/* IDENTITAS */}
      <div className="mb-6 border border-black p-4 rounded-md">
        <table className="w-full text-[10px]">
          <tbody>
            <tr><td className="w-32 py-1 font-bold">Nama Guru</td><td className="w-4">:</td><td className="font-bold">{displayTeacherName}</td></tr>
            <tr><td className="w-32 py-1 font-bold">NIP Guru</td><td className="w-4">:</td><td>{displayTeacherNip}</td></tr>
            <tr><td className="py-1 font-bold">Mata Pelajaran</td><td>:</td><td>{data.subject || teacher?.subject}</td></tr>
            <tr><td className="py-1 font-bold">Hari / Tanggal</td><td>:</td><td>{dateStr}</td></tr>
            <tr><td className="py-1 font-bold">Jam / Waktu</td><td>:</td><td>{data.conversationTime || '-'} WITA</td></tr>
            <tr><td className="py-1 font-bold">Supervisor</td><td>:</td><td>{principalName}</td></tr>
          </tbody>
        </table>
      </div>

      {/* PRA-OBSERVASI */}
      <div className="mb-6">
        <h4 className="bg-gray-100 p-1 font-bold border-l-4 border-black mb-2 uppercase text-[9px]">I. CATATAN PRA-OBSERVASI</h4>
        <div className="pl-2 space-y-3">
          <div>
            <p className="font-bold underline text-[9px] mb-1">Tujuan Pembelajaran:</p>
            <p className="text-[10px] mb-2 leading-normal">{data.learningGoals || '-'}</p>
          </div>
          <div>
            <p className="font-bold underline text-[9px] mb-1">Area Pengembangan yang Hendak Dicapai:</p>
            <p className="text-[10px] mb-2 leading-normal">{data.developmentArea || '-'}</p>
          </div>
          <div>
            <p className="font-bold underline text-[9px] mb-1">Strategi / Metode yang Dipersiapkan:</p>
            <p className="text-[10px] mb-2 leading-normal">{data.strategy || '-'}</p>
          </div>
          <div>
            <p className="font-bold underline text-[9px] mb-1">Catatan Khusus Supervisor:</p>
            <p className="text-[10px] mb-2 leading-normal italic">{data.supervisorNotes || '-'}</p>
          </div>
        </div>
      </div>

      {/* OBSERVASI TABLE */}
      <div className="mb-6">
        <h4 className="bg-gray-100 p-1 font-bold border-l-4 border-black mb-2 uppercase text-[9px]">II. OBSERVASI PEMBELAJARAN</h4>
        <table className="w-full border-collapse border border-black text-[9px] mb-4">
          <thead>
            <tr className="bg-gray-50">
              <th className="border border-black p-1.5 w-8">No</th>
              <th className="border border-black p-1.5 text-left">Aspek Pengamatan</th>
              <th className="border border-black p-1.5 w-16">Status</th>
              <th className="border border-black p-1.5 text-left">Catatan / Bukti Nyata</th>
            </tr>
          </thead>
          <tbody>
            {OBSERVATION_INDICATORS.map((ind, idx) => (
              <tr key={ind.id}>
                <td className="border border-black p-1.5 text-center">{idx + 1}</td>
                <td className="border border-black p-1.5 font-bold">{ind.label}</td>
                <td className="border border-black p-1.5 text-center font-bold">
                  {data.indicators && data.indicators[ind.id]?.checked ? 'ADA' : 'TIDAK'}
                </td>
                <td className="border border-black p-1.5 italic text-[8px] leading-snug">
                  {data.indicators && data.indicators[ind.id]?.note ? data.indicators[ind.id].note : '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {data.additionalNotes && (
          <div className="pl-2">
            <p className="font-bold underline text-[9px] mb-1">Catatan Tambahan Observasi:</p>
            <p className="text-[10px] leading-normal italic">{data.additionalNotes}</p>
          </div>
        )}
      </div>

      {/* PASCA-OBSERVASI */}
      <div className="mb-10">
        <h4 className="bg-gray-100 p-1 font-bold border-l-4 border-black mb-2 uppercase text-[9px]">III. PASCA-OBSERVASI & TINDAK LANJUT</h4>
        <div className="space-y-4 pl-2">
          <div>
            <p className="font-bold underline text-[9px] mb-1">Refleksi Guru:</p>
            <p className="text-[10px] italic leading-normal">{data.reflection || '-'}</p>
          </div>
          <div>
            <p className="font-bold underline text-[9px] mb-1">Umpan Balik Supervisor:</p>
            <div className="text-[9px] border border-gray-200 p-3 bg-gray-50 whitespace-pre-wrap leading-relaxed text-justify">
              {data.coachingFeedback || '-'}
            </div>
          </div>
          <div>
            <p className="font-bold underline text-[9px] mb-1">Rencana Tindak Lanjut:</p>
            <p className="text-[10px] font-bold leading-normal">{data.rtl || '-'}</p>
          </div>
        </div>
      </div>

      {/* TANDA TANGAN */}
      <div className="flex justify-between mt-12 px-10">
        <div className="text-center">
          <p className="mb-20">Guru Mata Pelajaran,</p>
          <p className="font-bold underline uppercase">{displayTeacherName}</p>
          <p className="text-[9px]">NIP. {displayTeacherNip}</p>
        </div>
        <div className="text-center">
          <p className="mb-20">Kepala Sekolah / Supervisor,</p>
          <p className="font-bold underline uppercase">{principalName}</p>
          <p className="text-[9px]">NIP. {displayPrincipalNip}</p>
        </div>
      </div>
    </div>
  );
};

export default PrintReport;
