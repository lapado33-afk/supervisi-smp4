
import React, { useState } from 'react';
import { Sparkles, MessageCircle, RefreshCcw, Check, Clock, History, AlertCircle, MousePointer2, ListChecks, Lightbulb, CheckCircle, Copy } from 'lucide-react';
import { ObservationData, SupervisionStatus } from '../types';
import { TEACHERS, FOCUS_OPTIONS } from '../constants';
import { generateCoachingAdvice } from '../services/geminiService';

interface Props {
  observations: ObservationData[];
  onSave: (data: ObservationData) => void;
}

const REFLECTION_SUGGESTIONS = [
  { category: 'Positif', label: 'Murid sangat antusias and aktif berdiskusi kelompok', color: 'bg-emerald-50 text-emerald-700 border-emerald-100' },
  { category: 'Positif', label: 'Tujuan pembelajaran tercapai melalui media visual yang tepat', color: 'bg-emerald-50 text-emerald-700 border-emerald-100' },
  { category: 'Tantangan', label: 'Manajemen waktu meleset pada bagian penutup/refleksi', color: 'bg-amber-50 text-amber-700 border-amber-100' },
  { category: 'Tantangan', label: 'Beberapa murid di baris belakang kurang fokus/terlibat', color: 'bg-amber-50 text-amber-700 border-amber-100' },
];

const RTL_SUGGESTIONS = [
  { category: 'PMM', label: 'Pelatihan Mandiri PMM Topik Diferensiasi', color: 'bg-blue-50 text-blue-700' },
  { category: 'Kolaborasi', label: 'Observasi Rekan Sejawat (Peer Coaching)', color: 'bg-emerald-50 text-emerald-700' },
  { category: 'Teknis', label: 'Penyusunan Ulang Modul Ajar (Diferensiasi Produk)', color: 'bg-amber-50 text-amber-700' },
];

const PostObservation: React.FC<Props> = ({ observations, onSave }) => {
  const [selectedObs, setSelectedObs] = useState<ObservationData | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [reflection, setReflection] = useState('');
  const [feedback, setFeedback] = useState('');
  const [rtl, setRtl] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [viewMode, setViewMode] = useState<'pending' | 'history'>('pending');

  const pendingObs = observations.filter(o => o.status === SupervisionStatus.OBSERVED);
  const historyObs = observations.filter(o => o.status === SupervisionStatus.FOLLOWED_UP);

  const handleSelect = (obs: ObservationData) => {
    setSelectedObs(obs);
    setReflection(obs.reflection || '');
    setFeedback(obs.coachingFeedback || '');
    setRtl(obs.rtl || '');
  };

  const copyFeedback = () => {
    if (!feedback) return;
    navigator.clipboard.writeText(feedback).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  };

  const handleGenerateAI = async () => {
    if (!selectedObs) return;
    setIsGenerating(true);
    
    const allNotes = Object.values(selectedObs.indicators)
      .map(i => (i as { note: string }).note)
      .filter(n => n)
      .join(". ");

    const advice = await generateCoachingAdvice(allNotes || "Guru telah mengajar dengan baik.", selectedObs.focusId);
    setFeedback(advice || '');
    setIsGenerating(false);
  };

  const handleSave = () => {
    if (!selectedObs) return;
    
    const teacherRef = TEACHERS.find(t => String(t.id) === String(selectedObs.teacherId));

    const updated: ObservationData = {
      ...selectedObs,
      teacherName: teacherRef?.name || selectedObs.teacherName || 'Guru',
      teacherNip: selectedObs.teacherNip || teacherRef?.nip || '',
      principalNip: selectedObs.principalNip || '',
      reflection,
      coachingFeedback: feedback,
      rtl,
      status: SupervisionStatus.FOLLOWED_UP
    };
    onSave(updated);
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      setSelectedObs(null);
    }, 1500);
  };

  if (!selectedObs) {
    const currentList = viewMode === 'pending' ? pendingObs : historyObs;

    return (
      <div className="space-y-6 animate-in fade-in duration-500">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Pasca-Observasi & Coaching</h2>
            <p className="text-slate-500 text-sm font-medium">Refleksi dan umpan balik alur TIRTA.</p>
          </div>
          
          <div className="flex bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
            <button 
              onClick={() => setViewMode('pending')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${viewMode === 'pending' ? 'bg-blue-600 text-white' : 'text-slate-500 hover:bg-slate-50'}`}
            >
              <Clock size={16} />
              <span>Antrean ({pendingObs.length})</span>
            </button>
            <button 
              onClick={() => setViewMode('history')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${viewMode === 'history' ? 'bg-emerald-600 text-white' : 'text-slate-500 hover:bg-slate-50'}`}
            >
              <History size={16} />
              <span>Selesai ({historyObs.length})</span>
            </button>
          </div>
        </div>

        {currentList.length === 0 ? (
          <div className="py-24 bg-white border-2 border-dashed border-slate-200 rounded-[2.5rem] flex flex-col items-center justify-center text-center px-6">
            <h3 className="text-xl font-bold text-slate-900">Kosong</h3>
            <p className="text-slate-500 max-w-sm mt-2 text-sm">Tidak ada data untuk ditampilkan saat ini.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {currentList.map((obs) => (
              <div key={obs.teacherId} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between group">
                <div>
                  <p className="font-bold text-slate-900">{obs.teacherName}</p>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{obs.subject}</p>
                </div>
                <button 
                  onClick={() => handleSelect(obs)}
                  className={`px-5 py-3 rounded-2xl text-xs font-black uppercase tracking-wider transition-all ${
                    viewMode === 'pending' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {viewMode === 'pending' ? 'Coaching' : 'Buka'}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in slide-in-from-right-8 duration-500 pb-20">
      <div className="flex items-center justify-between">
        <button onClick={() => setSelectedObs(null)} className="text-slate-500 hover:text-slate-900 font-bold flex items-center text-sm">
          <RefreshCcw size={16} className="mr-2" /> Kembali
        </button>
        <div className="text-right">
          <h2 className="text-xl font-bold text-slate-900 uppercase tracking-tight">{selectedObs.teacherName}</h2>
          <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">{selectedObs.subject}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-6">
          <div className="space-y-4">
            <label className="block text-sm font-bold text-slate-700">1. Refleksi Guru</label>
            <div className="flex flex-wrap gap-2">
              {REFLECTION_SUGGESTIONS.map((s, idx) => (
                <button 
                  key={idx} 
                  onClick={() => setReflection(prev => prev ? `${prev}. ${s.label}` : s.label)} 
                  className={`text-[10px] font-bold px-3 py-2 rounded-xl border ${s.color}`}
                >
                  + {s.label}
                </button>
              ))}
            </div>
            <textarea value={reflection} onChange={(e) => setReflection(e.target.value)} className="w-full bg-slate-50 border border-slate-200 p-5 rounded-2xl h-32 text-sm outline-none focus:ring-2 focus:ring-blue-500" placeholder="Hasil refleksi guru..." />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-bold text-slate-700">2. Feedback Supervisor (TIRTA)</label>
              <div className="flex items-center space-x-2">
                <button 
                  onClick={copyFeedback}
                  disabled={!feedback}
                  className={`flex items-center space-x-2 text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-full transition-all border ${
                    isCopied ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {isCopied ? <CheckCircle size={14} /> : <Copy size={14} />}
                  <span>{isCopied ? 'Tersalin' : 'Salin'}</span>
                </button>
                <button onClick={handleGenerateAI} disabled={isGenerating} className="flex items-center space-x-2 text-[10px] font-black uppercase tracking-widest text-indigo-600 bg-indigo-50 px-4 py-2 rounded-full hover:bg-indigo-100 transition-all">
                  <Sparkles size={14} /> <span>{isGenerating ? 'Analisis...' : 'Saran AI'}</span>
                </button>
              </div>
            </div>
            <textarea value={feedback} onChange={(e) => setFeedback(e.target.value)} className="w-full bg-slate-50 border border-slate-200 p-5 rounded-2xl h-48 text-xs font-medium leading-relaxed outline-none focus:ring-2 focus:ring-blue-500" placeholder="Umpan balik coaching..." />
          </div>

          <div className="space-y-4">
            <label className="block text-sm font-bold text-slate-700">3. Rencana Tindak Lanjut (RTL)</label>
            <div className="flex flex-wrap gap-2">
              {RTL_SUGGESTIONS.map((s, idx) => (
                <button 
                  key={idx} 
                  onClick={() => setRtl(prev => prev ? `${prev}. ${s.label}` : s.label)} 
                  className={`text-[10px] font-bold px-3 py-2 rounded-xl border border-slate-200 ${s.color}`}
                >
                  + {s.label}
                </button>
              ))}
            </div>
            <textarea value={rtl} onChange={(e) => setRtl(e.target.value)} className="w-full bg-slate-50 border border-slate-200 p-5 rounded-2xl h-32 text-sm outline-none focus:ring-2 focus:ring-blue-500" placeholder="Komitmen pengembangan..." />
          </div>

          <div className="pt-6 border-t border-slate-100 flex justify-end">
            <button 
              onClick={handleSave}
              className="bg-emerald-600 text-white px-10 py-5 rounded-2xl font-bold flex items-center space-x-2 hover:bg-emerald-700 shadow-xl shadow-emerald-200 transition-all active:scale-95"
            >
              {isSaved ? <><CheckCircle size={20} /> <span>Siklus Selesai</span></> : <><Check size={20} /> <span>Simpan & Selesaikan</span></>}
            </button>
          </div>
        </div>

        <div className="hidden lg:block bg-slate-900 text-white p-10 rounded-[2.5rem] shadow-xl relative overflow-hidden">
          <Sparkles className="absolute top-4 right-4 text-blue-400 opacity-20" size={100} />
          <h4 className="font-bold mb-8 text-xl">Prinsip Coaching Alur TIRTA</h4>
          <div className="space-y-8 relative z-10">
            {[
              { k: 'T', l: 'Tujuan', d: 'Menentukan arah pembicaraan' },
              { k: 'I', l: 'Identifikasi', d: 'Memetakan situasi nyata' },
              { k: 'R', l: 'Rencana', d: 'Mengeksplorasi ide guru' },
              { k: 'TA', l: 'Aksi', d: 'Komitmen langkah nyata' }
            ].map(p => (
              <div key={p.k} className="flex items-start">
                <div className="bg-blue-600 text-white p-3 rounded-xl mr-4 font-black min-w-[40px] text-center shadow-lg">{p.k}</div>
                <div><p className="font-bold">{p.l}</p><p className="text-xs text-slate-400 font-medium">{p.d}</p></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostObservation;
