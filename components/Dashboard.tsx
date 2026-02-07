
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { Users, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { ObservationData, SupervisionStatus } from '../types';

interface Props {
  observations: ObservationData[];
}

const Dashboard: React.FC<Props> = ({ observations }) => {
  const stats = [
    { label: 'Total Guru', value: '15', icon: Users, color: 'bg-blue-500' },
    { label: 'Terjadwal', value: observations.filter(o => o.status === SupervisionStatus.PLANNED).length, icon: Clock, color: 'bg-amber-500' },
    { label: 'Selesai Observasi', value: observations.filter(o => o.status === SupervisionStatus.OBSERVED).length, icon: CheckCircle, color: 'bg-emerald-500' },
    { label: 'Siklus Selesai', value: observations.filter(o => o.status === SupervisionStatus.FOLLOWED_UP).length, icon: AlertCircle, color: 'bg-indigo-500' },
  ];

  const pieData = [
    { name: 'Terjadwal', value: observations.filter(o => o.status === SupervisionStatus.PLANNED).length || 0, color: '#f59e0b' },
    { name: 'Selesai', value: observations.filter(o => o.status === SupervisionStatus.FOLLOWED_UP).length || 0, color: '#10b981' },
    { name: 'Sisa', value: Math.max(15 - observations.length, 0), color: '#e2e8f0' },
  ];

  const barData = [
    { name: 'Minggu 1', count: observations.length > 5 ? 5 : observations.length },
    { name: 'Minggu 2', count: 0 },
    { name: 'Minggu 3', count: 0 },
    { name: 'Minggu 4', count: 0 },
  ];

  return (
    <div className="space-y-8 animate-in duration-500">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Dashboard Supervisi</h2>
        <p className="text-slate-500 text-sm">Pemantauan progres penjaminan mutu guru SMPN 4 Mappedeceng.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-4 transition-transform hover:scale-[1.02]">
            <div className={`${stat.color} p-3 rounded-xl text-white shadow-lg shadow-blue-100`}>
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
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold mb-6">Volume Observasi</h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} />
                <YAxis hide />
                <Tooltip cursor={{fill: '#f1f5f9'}} contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} />
                <Bar dataKey="count" fill="#3b82f6" radius={[8, 8, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold mb-6">Status Progres</h3>
          <div className="h-72 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={85}
                  paddingAngle={5}
                  dataKey="value"
                  animationDuration={1000}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                  ))}
                </Pie>
                <Tooltip contentStyle={{borderRadius: '12px'}} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 space-y-3">
            {pieData.map((d, i) => (
              <div key={i} className="flex items-center justify-between text-xs font-medium">
                <span className="flex items-center text-slate-500">
                  <span className="w-2.5 h-2.5 rounded-full mr-2" style={{ backgroundColor: d.color }}></span>
                  {d.name}
                </span>
                <span className="font-bold text-slate-900">{d.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
