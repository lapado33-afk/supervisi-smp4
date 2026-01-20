
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { Users, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { ObservationData, SupervisionStatus } from '../types';

interface Props {
  observations: ObservationData[];
}

const Dashboard: React.FC<Props> = ({ observations }) => {
  const stats = [
    { label: 'Total Guru', value: '15', icon: Users, color: 'bg-blue-500' },
    { label: 'Terjadwal', value: observations.filter(o => o.status === SupervisionStatus.PLANNED).length || 0, icon: Clock, color: 'bg-amber-500' },
    { label: 'Selesai Observasi', value: observations.filter(o => o.status === SupervisionStatus.OBSERVED).length || 0, icon: CheckCircle2, color: 'bg-emerald-500' },
    { label: 'Perlu Tindak Lanjut', value: observations.filter(o => o.status === SupervisionStatus.OBSERVED).length || 0, icon: AlertCircle, color: 'bg-indigo-500' },
  ];

  const pieData = [
    { name: 'Terjadwal', value: observations.filter(o => o.status === SupervisionStatus.PLANNED).length || 2, color: '#f59e0b' },
    { name: 'Selesai', value: observations.filter(o => o.status === SupervisionStatus.FOLLOWED_UP).length || 1, color: '#10b981' },
    { name: 'Belum', value: 12, color: '#e2e8f0' },
  ];

  const barData = [
    { name: 'Senin', count: 2 },
    { name: 'Selasa', count: 4 },
    { name: 'Rabu', count: 1 },
    { name: 'Kamis', count: 5 },
    { name: 'Jumat', count: 3 },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Selamat Pagi, Bu Kepala Sekolah</h2>
        <p className="text-slate-500">Berikut adalah ringkasan progres supervisi akademik semester ini.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-4">
            <div className={`${stat.color} p-3 rounded-xl text-white`}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">{stat.label}</p>
              <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold mb-6">Tren Observasi Mingguan</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip cursor={{fill: '#f8fafc'}} />
                <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold mb-6">Status Distribusi</h3>
          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 space-y-2">
            {pieData.map((d, i) => (
              <div key={i} className="flex items-center justify-between text-sm">
                <span className="flex items-center text-slate-500">
                  <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: d.color }}></span>
                  {d.name}
                </span>
                <span className="font-bold">{d.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h3 className="text-lg font-bold">Jadwal Terdekat</h3>
          <button className="text-blue-600 font-semibold text-sm hover:underline">Lihat Semua Kalender</button>
        </div>
        <div className="divide-y divide-slate-100">
          {[
            { name: 'Mariati,S.Ag', time: '08:00 - 09:30', class: 'X-C', subject: 'Pendidikan Agama Islam' },
            { name: 'Selviyani,S.PDH', time: '10:15 - 11:45', class: 'XI-A', subject: 'Pendidikan Agama Hindu' },
          ].map((item, i) => (
            <div key={i} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 font-bold">
                  {item.name[0]}
                </div>
                <div>
                  <p className="font-bold text-slate-900">{item.name}</p>
                  <p className="text-sm text-slate-500">{item.subject} • {item.class}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-slate-900">{item.time}</p>
                <p className="text-xs text-blue-600 font-medium">Hari ini</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
