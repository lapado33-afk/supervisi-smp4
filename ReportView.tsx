import React, { useState } from 'react';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from 'recharts';
import { Download, Users, Printer, Filter } from 'lucide-react';
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
    const count = observations.filter(o => o.indicators && o.indicators[ind.id]?.checked).length;
    return {
      subject: ind.label,
      A: count,
      fullMark: Math.max(observations.length, 1),
    };
  });

  const exportToCSV = () => {
    if (observations.length === 0) return alert("Tidak ada data untuk diunduh.");
    
    // Header CSV
    const headers = ["Nama Guru", "Mata Pelajaran", "Tanggal Observasi", "Status", "Tujuan Pembelajaran", "Rencana Tindak Lanjut"];
    
    // Data Rows
    const rows = observations.map(obs => {
      const teacher = TEACHERS.find(t => t.id === obs.teacherId);
      return [
        `"${teacher?.name || 'Unknown'}"`,
        `"${obs.subject || teacher?.subject || ''}"`,
        `"${new Date(obs.date).toLocaleDateString('id-ID')}"`,
        `"${obs.status}"`,
        `"${(obs.learningGoals || '').replace(/"/g, '""')}"`,
        `"${(obs.rtl || '').replace(/"/g, '""')}"`
      ];
    });

    const csvContent = "\ufeff" + [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Laporan_Supervisi_SMPN4_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = (obs: ObservationData) => {
    setPrintData(obs);
    // Tunggu render selesai baru cetak
    setTimeout(() => {
      window.print();
    }, 500);
  };

  return (
    <div className="space-y-8 animate-in duration-500">
      {/* Container Khusus Cetak (Hanya terlihat saat print) */}
      <div className="print-only">
        {printData && <PrintReport data={printData} principalName={principalName} />}
      </div>

      <div className="flex items-center justify-between print-hidden">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Laporan & Analisis</h2>
          <p className="text-slate-500 text-sm">Analisis kompetensi pedagogik guru SMPN 4 Mappedeceng.</p>
        </div>
        <button 
          onClick={exportToCSV}
          className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-2xl text-sm font-bold hover:bg-blue-700 shadow-xl shadow-blue-100 transition-all active:scale-95"
        >
          <Download size={18} />
          <span>Unduh CSV</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 print-hidden">
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold mb-6 flex items-center">
            <Users className="mr-2 text-blue-600" size={20} />
            Peta Kekuatan Pembelajaran
          </h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: '#64748b', fontWeight: 'bold' }} />
                <PolarRadiusAxis angle={30} domain={[0, Math.max(observations.length, 5)]} hide />
                <Radar
                  name="Jumlah Guru"
                  dataKey="A"
                  stroke="#2563eb"
                  strokeWidth={3}
                  fill="#3b82f6"
                  fillOpacity={0.4}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm flex flex-col justify-center">
          <h3 className="text-lg font-bold mb-6">Ringkasan Status Progres</h3>
          <div className="space-y-6">
            <div className="bg-emerald-50 border border-emerald-100 p-8 rounded-3xl">
              <h4 className="text-emerald-900 font-bold text-sm mb-1 uppercase tracking-wider">Selesai Siklus</h4>
              <p className="text-4xl font-black text-emerald-600">
                {observations.filter(o => o.status === SupervisionStatus.FOLLOWED_UP).length}
                <span className="text-xs font-normal text-emerald-700 ml-2">Guru Terverifikasi</span>
              </p>
            </div>
            <div className="bg-blue-50 border border-blue-100 p-8 rounded-3xl">
              <h4 className="text-blue-900 font-bold text-sm mb-1 uppercase tracking-wider">Total Observasi</h4>
              <p className="text-4xl font-black text-blue-600">
                {observations.length}
                <span className="text-xs font-normal text-blue-700 ml-2">Dokumen Terarsip</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden print-hidden">
        <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h3 className="text-lg font-bold">Riwayat Dokumen Supervisi</h3>
          <div className="flex items-center text-xs text-slate-400 font-medium">
            <Filter size={14} className="mr-2" /> Klik "CETAK" untuk laporan individu (A4)
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Nama Guru</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Status</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {observations.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-8 py-20 text-center text-slate-400 text-sm italic">Belum ada data observasi yang tersimpan.</td>
                </tr>
              ) : (
                observations.map((obs, i) => {
                  const teacher = TEACHERS.find(t => t.id === obs.teacherId);
                  return (
                    <tr key={i} className="hover:bg-blue-50/30 transition-colors group">
                      <td className="px-8 py-6">
                        <p className="font-bold text-slate-900 text-sm">{teacher?.name || 'Guru'}</p>
                        <p className="text-[11px] text-slate-500 font-medium uppercase">{teacher?.subject} • {new Date(obs.date).toLocaleDateString('id-ID')}</p>
                      </td>
                      <td className="px-8 py-6">
                        <span className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider ${
                          obs.status === SupervisionStatus.FOLLOWED_UP 
                          ? 'bg-emerald-100 text-emerald-700' 
                          : 'bg-blue-100 text-blue-700'
                        }`}>
                          {obs.status}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-center">
                        <button 
                          onClick={() => handlePrint(obs)}
                          className="inline-flex items-center space-x-2 bg-slate-900 text-white px-5 py-2.5 rounded-xl text-xs font-bold hover:bg-blue-600 transition-all shadow-md active:scale-95"
                        >
                          <Printer size={14} />
                          <span>CETAK</span>
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
