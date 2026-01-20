import React from 'react';
import { ObservationData } from '../types';
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
    <div className="bg-white p-10 text-black font-serif leading-tight text-xs max-w-[210mm] mx-auto min-h-[297mm]">
      {/* KOP SURAT */}
      <div className="border-b-4 border-double border-black pb-4 mb-6 text-center">
        <h1 className="text-base font-bold uppercase">PEMERINTAH KABUPATEN LUWU UTARA</h1>
        <h1 className="text-base font-bold uppercase">DINAS PENDIDIKAN DAN KEBUDAYAAN</h1>
        <h2 className="text-xl font-black uppercase mt-1">UPT SMPN 4 MAPPEDECENG</h2>
        <p className="text-[9px] italic mt-1">Alamat: Jl. Poros Desa, Kec. Mappedeceng, Kab. Luwu Utara, Sulawesi Selatan 92963</p>
      </div>

      <div className="text-center mb-6">
        <h3 className="text-sm font-bold underline uppercase">LAPORAN HASIL SUPERVISI AKADEMIK</h3>
        <p className="text-[10px] font-bold">TAHUN PELAJARAN 2024/2025</p>
      </div>

      {/* IDENTITAS */}
      <div className="mb-6 border p-4 rounded-md">
        <table className="w-full text-[10px]">
          <tbody>
            <tr><td className="w-32 py-1 font-bold">Nama Guru</td><td className="w-4">:</td><td>{teacher?.name}</td></tr>
            <tr><td className="py-1 font-bold">Mata Pelajaran</td><td>:</td><td>{data.subject || teacher?.subject}</td></tr>
            <tr><td className="py-1 font-bold">Hari / Tanggal</td><td>:</td><td>{dateStr}</td></tr>
            <tr><td className="py-1 font-bold">Supervisor</td><td>:</td><td>{principalName}</td></tr>
          </tbody>
        </table>
      </div>

      {/* PRA-OBSERVASI */}
      <div className="mb-6">
        <h4 className="bg-gray-100 p-1 font-bold border-l-4 border-black mb-2 uppercase text-[9px]">I. CATATAN PRA-OBSERVASI</h4>
        <div className="pl-2">
          <p className="font-bold underline text-[9px]">Tujuan Pembelajaran:</p>
          <p className="text-[10px] mb-2">{data.learningGoals || '-'}</p>
        </div>
      </div>

      {/* OBSERVASI TABLE */}
      <div className="mb-6">
        <h4 className="bg-gray-100 p-1 font-bold border-l-4 border-black mb-2 uppercase text-[9px]">II. OBSERVASI PEMBELAJARAN</h4>
        <table className="w-full border-collapse border border-black text-[9px]">
          <thead>
            <tr className="bg-gray-50">
              <th className="border border-black p-1 w-8">No</th>
              <th className="border border-black p-1 text-left">Aspek Pengamatan</th>
              <th className="border border-black p-1 w-16">Status</th>
              <th className="border border-black p-1 text-left">Catatan / Bukti Nyata</th>
            </tr>
          </thead>
          <tbody>
            {OBSERVATION_INDICATORS.map((ind, idx) => (
              <tr key={ind.id}>
                <td className="border border-black p-1 text-center">{idx + 1}</td>
                <td className="border border-black p-1 font-bold">{ind.label}</td>
                <td className="border border-black p-1 text-center font-bold">
                  {data.indicators && data.indicators[ind.id]?.checked ? 'ADA' : 'TIDAK'}
                </td>
                <td className="border border-black p-1 italic text-[8px]">
                  {data.indicators && data.indicators[ind.id]?.note ? data.indicators[ind.id].note : '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* PASCA-OBSERVASI */}
      <div className="mb-10 page-break-before-auto">
        <h4 className="bg-gray-100 p-1 font-bold border-l-4 border-black mb-2 uppercase text-[9px]">III. PASCA-OBSERVASI & TINDAK LANJUT</h4>
        <div className="space-y-3 pl-2">
          <div>
            <p className="font-bold underline text-[9px]">Refleksi Guru:</p>
            <p className="text-[10px] italic">{data.reflection || '-'}</p>
          </div>
          <div>
            <p className="font-bold underline text-[9px]">Umpan Balik Supervisor:</p>
            <div className="text-[9px] border p-2 bg-gray-50 whitespace-pre-wrap leading-normal">
              {data.coachingFeedback || '-'}
            </div>
          </div>
          <div>
            <p className="font-bold underline text-[9px]">Rencana Tindak Lanjut:</p>
            <p className="text-[10px] font-bold">{data.rtl || '-'}</p>
          </div>
        </div>
      </div>

      {/* TANDA TANGAN */}
      <div className="flex justify-between mt-12 px-10">
        <div className="text-center">
          <p className="mb-16">Guru Mata Pelajaran,</p>
          <p className="font-bold underline">{teacher?.name}</p>
          <p className="text-[9px]">NIP. ...........................</p>
        </div>
        <div className="text-center">
          <p className="mb-16">Kepala Sekolah / Supervisor,</p>
          <p className="font-bold underline">{principalName}</p>
          <p className="text-[9px]">NIP. ...........................</p>
        </div>
      </div>
    </div>
  );
};

export default PrintReport;
