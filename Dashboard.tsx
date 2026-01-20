import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { Users, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { ObservationData, SupervisionStatus } from '../types';

interface Props {
  observations: ObservationData[];
}

const Dashboard: React.FC<Props> = ({ observations }) => {
  const stats = [
    { label: 'Total Guru', value: '15', icon: Users, color: 'bg-blue-500' },
    { label: 'Terjadwal', value: observations.filter(o => o.status === SupervisionStatus.PLANNED).length, icon: Clock, color: 'bg-amber-500' },
    { label: 'Selesai Observasi', value: observations.filter(o => o.status === SupervisionStatus.OBSERVED).length, icon: CheckCircle2, color: 'bg-emerald-500' },
    { label: 'Siklus Selesai', value: observations.filter(o => o.status === SupervisionStatus.FOLLOWED_UP).length, icon: AlertCircle, color: 'bg-indigo-500' },
  ];

  const pieData = [
    { name: 'Terjadwal', value: Math.max(observations.filter(o => o.status === SupervisionStatus.PLANNED).length, 0), color: '#f59e0b' },
    { name: 'Selesai', value: Math.max(observations.filter(o => o.status === SupervisionStatus.FOLLOWED_UP).length, 0), color: '#10b981' },
    { name: 'Belum', value: Math.max(15 - observations.length, 0), color: '#e2e8f0' },
  ];

  const barData = [
    { name: 'Minggu 1', count: observations.length > 5 ? 5 : observations.length },
    { name: 'Minggu 2', count: 0 },
    { name: 'Minggu 3', count: 0 },
    { name: 'Minggu 4', count: 0 },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Dashboard Supervisi</h2>
        <p className="text-slate-500 text-sm">Pemantauan progres penjaminan mutu guru SMPN 4 Mappedeceng.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-4">
            <div className={`${stat.color} p-3 rounded-xl text-white`}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500">{stat.label}</p>
              <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold mb-6">Volume Observasi</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12}} />
                <YAxis hide />
                <Tooltip cursor={{fill: '#f8fafc'}} />
                <Bar dataKey="count" fill="#3b82f6" radius={[6, 6, 0, 0]} barSize={50} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold mb-6">Status Progres</h3>
          <div className="h-64 w-full flex items-center justify-center">
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
              <div key={i} className="flex items-center justify-between text-xs">
                <span className="flex items-center text-slate-500">
                  <span className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: d.color }}></span>
                  {d.name}
                </span>
                <span className="font-bold">{d.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
