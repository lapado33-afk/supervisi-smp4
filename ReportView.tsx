
import React, { useState } from 'react';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from 'recharts';
import { Download, FileText, Filter, Calendar, Users, Printer } from 'lucide-react';
import { ObservationData, SupervisionStatus } from '../types';
import { OBSERVATION_INDICATORS, TEACHERS } from '../constants';
import PrintReport from './PrintReport';

interface Props {
  observations: ObservationData[];
  principalName: string;
}

const ReportView: React.FC<Props> = ({ observations, principalName }) => {
  const [printData, setPrintData] = useState<ObservationData | null>(null);

  const radarData = OBSERVATION_INDICATORS.map(ind => {
    const count = observations.filter(o => o.indicators[ind.id]?.checked).length;
    return {
      subject: ind.label,
      A: count,
      fullMark: Math.max(observations.length, 1),
    };
  });

  const handlePrint = (obs: ObservationData) => {
    setPrintData(obs);
    // Delay sedikit agar React selesai merender komponen print sebelum memanggil window.print()
    setTimeout(() => {
      window.print();
      setPrintData(null);
    }, 500);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Container untuk Cetak (Hanya Muncul Saat Print) */}
      <div className="hidden print:block fixed inset-0 z-[9999] bg-white">
        {printData && <PrintReport data={printData} principalName={principalName} />}
      </div>

      <div className="flex items-center justify-between print:hidden">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Laporan & Analisis Sekolah</h2>
          <p className="text-slate-500">Pemetaan kompetensi guru UPT SMPN 4 Mappedeceng.</p>
        </div>
        <div className="flex space-x-3">
          <button className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-xl text-sm font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all active:scale-95">
            <Download size={18} />
            <span>Unduh Semua Data (.CSV)</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 print:hidden">
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold mb-6 flex items-center">
            <Users className="mr-2 text-blue-600" size={20} />
            Peta Kekuatan Pembelajaran
          </h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: '#64748b' }} />
                <PolarRadiusAxis hide />
                <Radar
                  name="Guru"
                  dataKey="A"
                  stroke="#3b82f6"
                  fill="#3b82f6"
                  fillOpacity={0.6}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-[10px] text-slate-400 mt-4 text-center">Grafik ini menunjukkan sebaran kompetensi guru berdasarkan hasil observasi.</p>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-center">
          <h3 className="text-lg font-bold mb-4">Ringkasan Capaian</h3>
          <div className="space-y-4">
            <div className="bg-emerald-50 border border-emerald-100 p-5 rounded-2xl">
              <h4 className="text-emerald-900 font-bold text-sm mb-1">Guru Selesai Siklus</h4>
              <p className="text-2xl font-black text-emerald-600">
                {observations.filter(o => o.status === SupervisionStatus.FOLLOWED_UP).length} <span className="text-xs font-normal text-emerald-700">dari 15 Guru</span>
              </p>
            </div>
            <div className="bg-amber-50 border border-amber-100 p-5 rounded-2xl">
              <h4 className="text-amber-900 font-bold text-sm mb-1">Sedang Berlangsung</h4>
              <p className="text-2xl font-black text-amber-600">
                {observations.filter(o => o.status === SupervisionStatus.OBSERVED).length} <span className="text-xs font-normal text-amber-700">Menunggu Coaching</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden print:hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h3 className="text-lg font-bold">Riwayat Siklus Supervisi</h3>
          <div className="flex items-center text-xs text-slate-400 italic">
            <Filter size={14} className="mr-1" /> Klik tombol "Cetak" untuk mengunduh dokumen resmi guru.
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Nama Guru</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Tanggal</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-center">Aksi Laporan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {observations.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-16 text-center text-slate-400 italic text-sm">Belum ada data supervisi yang terekam.</td>
                </tr>
              ) : (
                observations.map((obs, i) => {
                  const teacher = TEACHERS.find(t => t.id === obs.teacherId);
                  return (
                    <tr key={i} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-bold text-slate-900">{teacher?.name || 'Unknown'}</p>
                        <p className="text-[10px] text-slate-500">{teacher?.subject}</p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center text-xs text-slate-600">
                          <Calendar size={14} className="mr-2 text-slate-400" />
                          {new Date(obs.date).toLocaleDateString('id-ID')}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase ${
                          obs.status === SupervisionStatus.FOLLOWED_UP ? 'bg-emerald-100 text-emerald-700' : 
                          obs.status === SupervisionStatus.OBSERVED ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'
                        }`}>
                          {obs.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button 
                          onClick={() => handlePrint(obs)}
                          className="inline-flex items-center space-x-2 bg-slate-900 text-white px-4 py-2 rounded-lg text-[10px] font-bold hover:bg-slate-800 transition-all shadow-sm active:scale-95"
                        >
                          <Printer size={14} />
                          <span>CETAK LAPORAN</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ReportView;
