import React, { useState } from 'react';
import { Sparkles, MessageCircle, RefreshCcw, Check, Clock, History, AlertCircle, MousePointer2, ListChecks, Lightbulb } from 'lucide-react';
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
  { category: 'Instruksi', label: 'Instruksi tugas kurang dipahami sebagian murid', color: 'bg-blue-50 text-blue-700 border-blue-100' },
  { category: 'Instruksi', label: 'Pertanyaan pemantik berhasil memicu daya kritis murid', color: 'bg-blue-50 text-blue-700 border-blue-100' },
  { category: 'Diferensiasi', label: 'Perlu pengayaan lebih untuk murid yang selesai lebih cepat', color: 'bg-indigo-50 text-indigo-700 border-indigo-100' },
  { category: 'Diferensiasi', label: 'Diferensiasi produk sudah terlihat namun perlu bimbingan intensif', color: 'bg-indigo-50 text-indigo-700 border-indigo-100' },
];

const RTL_SUGGESTIONS = [
  { category: 'PMM', label: 'Pelatihan Mandiri PMM Topik Diferensiasi', color: 'bg-blue-50 text-blue-700' },
  { category: 'PMM', label: 'Pelatihan Mandiri PMM Topik Disiplin Positif', color: 'bg-blue-50 text-blue-700' },
  { category: 'Kolaborasi', label: 'Observasi Rekan Sejawat (Peer Coaching)', color: 'bg-emerald-50 text-emerald-700' },
  { category: 'Kolaborasi', label: 'Berbagi Praktik Baik di Komunitas Belajar (Kombel)', color: 'bg-emerald-50 text-emerald-700' },
  { category: 'Teknis', label: 'Penyusunan Ulang Modul Ajar (Diferensiasi Produk)', color: 'bg-amber-50 text-amber-700' },
  { category: 'Teknis', label: 'Simulasi Penggunaan Media Digital Interaktif', color: 'bg-amber-50 text-amber-700' },
  { category: 'Psikologis', label: 'Penerapan Segitiga Restitusi di Kelas', color: 'bg-rose-50 text-rose-700' },
  { category: 'Psikologis', label: 'Pembuatan Kesepakatan Kelas Baru', color: 'bg-rose-50 text-rose-700' },
];

const PostObservation: React.FC<Props> = ({ observations, onSave }) => {
  const [selectedObs, setSelectedObs] = useState<ObservationData | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [reflection, setReflection] = useState('');
  const [feedback, setFeedback] = useState('');
  const [rtl, setRtl] = useState('');
  const [viewMode, setViewMode] = useState<'pending' | 'history'>('pending');

  const pendingObs = observations.filter(o => o.status === SupervisionStatus.OBSERVED);
  const historyObs = observations.filter(o => o.status === SupervisionStatus.FOLLOWED_UP);

  const handleSelect = (obs: ObservationData) => {
    setSelectedObs(obs);
    setReflection(obs.reflection || '');
    setFeedback(obs.coachingFeedback || '');
    setRtl(obs.rtl || '');
  };

  const addReflectionSuggestion = (suggestion: string) => {
    const current = reflection.trim();
    const formatted = current ? `${current}. ${suggestion}` : suggestion;
    setReflection(formatted);
  };

  const addRtlSuggestion = (suggestion: string) => {
    const currentRtl = rtl.trim();
    const newRtl = currentRtl ? `${currentRtl}; ${suggestion}` : suggestion;
    setRtl(newRtl);
  };

  const handleGenerateAI = async () => {
    if (!selectedObs) return;
    setIsGenerating(true);
    
    const allNotes = Object.values(selectedObs.indicators)
      .map(i => (i as { note: string }).note)
      .filter(n => n)
      .join(". ");

    const advice = await generateCoachingAdvice(allNotes || "Guru telah mengajar dengan baik sesuai modul ajar.", selectedObs.focusId);
    setFeedback(advice || '');
    setIsGenerating(false);
  };

  const handleSave = () => {
    if (!selectedObs) return;
    
    // Pastikan Nama Guru dari konstanta referensi ikut tersimpan
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
    setSelectedObs(null);
  };

  if (!selectedObs) {
    const currentList = viewMode === 'pending' ? pendingObs : historyObs;

    return (
      <div className="space-y-6 animate-in fade-in duration-500">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Pasca-Observasi & Coaching</h2>
            <p className="text-slate-500 text-sm font-medium">Tahap refleksi dan pemberian umpan balik produktif alur TIRTA.</p>
          </div>
          
          <div className="flex bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
            <button 
              onClick={() => setViewMode('pending')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${viewMode === 'pending' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
            >
              <Clock size={16} />
              <span>Antrean ({pendingObs.length})</span>
            </button>
            <button 
              onClick={() => setViewMode('history')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${viewMode === 'history' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
            >
              <History size={16} />
              <span>Riwayat ({historyObs.length})</span>
            </button>
          </div>
        </div>

        {currentList.length === 0 ? (
          <div className="py-24 bg-white border-2 border-dashed border-slate-200 rounded-[2.5rem] flex flex-col items-center justify-center text-center px-6">
            <div className={`p-8 rounded-full mb-6 ${viewMode === 'pending' ? 'bg-blue-50 text-blue-400' : 'bg-emerald-50 text-emerald-400'}`}>
              {viewMode === 'pending' ? <MessageCircle size={48} /> : <History size={48} />}
            </div>
            <h3 className="text-xl font-bold text-slate-900">
              {viewMode === 'pending' ? 'Belum Ada Antrean Coaching' : 'Belum Ada Riwayat Coaching'}
            </h3>
            <p className="text-slate-500 max-w-sm mt-2 text-sm">
              {viewMode === 'pending' 
                ? 'Selesaikan tahap "Pelaksanaan Observasi" terlebih dahulu agar guru muncul di daftar ini.' 
                : 'Setelah Anda menyelesaikan sesi coaching, datanya akan tersimpan otomatis di sini.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {currentList.map((obs) => {
              const teacher = TEACHERS.find(t => String(t.id) === String(obs.teacherId));
              const displayTeacherName = obs.teacherName || teacher?.name || 'Guru';

              return (
                <div key={obs.teacherId} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all flex items-center justify-between group">
                  <div className="flex items-center space-x-4">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-bold ${viewMode === 'pending' ? 'bg-blue-50 text-blue-600' : 'bg-emerald-50 text-emerald-600'}`}>
                      {displayTeacherName[0]}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">{displayTeacherName}</p>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{obs.subject} • {new Date(obs.date).toLocaleDateString('id-ID')}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleSelect(obs)}
                    className={`px-5 py-3 rounded-2xl text-xs font-black uppercase tracking-wider transition-all flex items-center space-x-2 ${
                      viewMode === 'pending' 
                      ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-md' 
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    <span>{viewMode === 'pending' ? 'Mulai Coaching' : 'Detail'}</span>
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  const teacher = TEACHERS.find(t => String(t.id) === String(selectedObs.teacherId));
  const currentTeacherName = selectedObs.teacherName || teacher?.name || 'Guru';

  return (
    <div className="space-y-8 animate-in slide-in-from-right-8 duration-500 pb-20">
      <div className="flex items-center justify-between">
        <button onClick={() => setSelectedObs(null)} className="text-slate-500 hover:text-slate-900 font-bold flex items-center text-sm group">
          <RefreshCcw size={16} className="mr-2 group-hover:rotate-180 transition-transform duration-500" /> Kembali
        </button>
        <div className="text-right">
          <h2 className="text-xl font-bold text-slate-900">{currentTeacherName}</h2>
          <p className="text-xs text-slate-500">{selectedObs.subject} • {teacher?.phase}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-8">
            <div className="flex items-center space-x-3 text-blue-600">
              <MessageCircle size={24} />
              <h3 className="text-lg font-bold">Dokumentasi Coaching</h3>
            </div>

            <div className="space-y-4">
              <label className="block text-sm font-bold text-slate-700 flex items-center">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mr-2"></span>
                1. Catatan Refleksi Guru
              </label>

              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 space-y-4">
                <div className="flex items-center text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">
                  <Lightbulb size={12} className="mr-2 text-amber-500" /> Pilih Kejadian yang Sesuai:
                </div>
                <div className="flex flex-wrap gap-2">
                  {REFLECTION_SUGGESTIONS.map((s, idx) => (
                    <button
                      key={idx}
                      onClick={() => addReflectionSuggestion(s.label)}
                      className={`text-[10px] font-bold px-3 py-2 rounded-xl border hover:shadow-sm transition-all text-left ${s.color}`}
                    >
                      + {s.label}
                    </button>
                  ))}
                </div>
                <textarea 
                  value={reflection}
                  onChange={(e) => setReflection(e.target.value)}
                  placeholder="Atau tuliskan refleksi guru secara manual..."
                  className="w-full bg-white border border-slate-200 p-5 rounded-2xl h-32 text-sm outline-none focus:ring-2 focus:ring-blue-500 shadow-inner"
                />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-bold text-slate-700 flex items-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 mr-2"></span>
                  2. Umpan Balik Supervisor (Alur TIRTA)
                </label>
                <button 
                  onClick={handleGenerateAI}
                  disabled={isGenerating}
                  className="flex items-center space-x-2 text-[10px] font-black uppercase tracking-widest text-indigo-600 bg-indigo-50 px-4 py-2 rounded-full hover:bg-indigo-100 transition-all border border-indigo-100 shadow-sm"
                >
                  <Sparkles size={14} />
                  <span>{isGenerating ? 'AI Analisis...' : 'Saran AI'}</span>
                </button>
              </div>
              <textarea 
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Hasil diskusi coaching..."
                className="w-full bg-slate-50 border border-slate-200 p-5 rounded-2xl h-64 text-xs font-medium leading-relaxed outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-4 pt-4 border-t border-slate-100">
              <label className="block text-sm font-bold text-slate-700 flex items-center">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mr-2"></span>
                3. Rencana Tindak Lanjut (RTL)
              </label>
              
              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 space-y-4">
                <div className="flex items-center text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">
                  <MousePointer2 size={12} className="mr-2" /> Pilih RTL Relevan:
                </div>
                <div className="flex flex-wrap gap-2">
                  {RTL_SUGGESTIONS.map((s, idx) => (
                    <button
                      key={idx}
                      onClick={() => addRtlSuggestion(s.label)}
                      className={`text-[10px] font-bold px-3 py-2 rounded-xl border border-slate-200 hover:shadow-sm transition-all text-left ${s.color}`}
                    >
                      + {s.label}
                    </button>
                  ))}
                </div>
                <div className="pt-2">
                  <textarea 
                    value={rtl}
                    onChange={(e) => setRtl(e.target.value)}
                    placeholder="Komitmen langkah selanjutnya..."
                    className="w-full bg-white border border-slate-200 p-5 rounded-2xl h-32 text-sm outline-none focus:ring-2 focus:ring-emerald-500 shadow-inner"
                  />
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100 flex justify-end">
              <button 
                onClick={handleSave}
                className="bg-emerald-600 text-white px-10 py-5 rounded-2xl font-bold flex items-center space-x-2 hover:bg-emerald-700 shadow-xl shadow-emerald-200 transition-all active:scale-95"
              >
                <Check size={20} />
                <span>Simpan & Selesaikan Siklus</span>
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-slate-900 text-white p-8 rounded-[2.5rem] shadow-xl relative overflow-hidden">
            <Sparkles className="absolute top-4 right-4 text-blue-400 opacity-20" size={80} />
            <h4 className="font-bold mb-6 text-lg">Prinsip Coaching</h4>
            <div className="space-y-6 relative z-10">
              {[
                { k: 'T', l: 'Tujuan', d: 'Sepakati tujuan percakapan' },
                { k: 'I', l: 'Identifikasi', d: 'Gali fakta yang terjadi' },
                { k: 'R', l: 'Rencana Aksi', d: 'Kembangkan ide dari guru' },
                { k: 'TA', l: 'Tanggung Jawab', d: 'Komitmen langkah selanjutnya' }
              ].map(p => (
                <div key={p.k} className="flex items-start">
                  <div className="bg-blue-500/20 text-blue-400 p-2 rounded-lg mr-4 font-black min-w-[32px] text-center">{p.k}</div>
                  <div>
                    <p className="font-bold text-sm">{p.l}</p>
                    <p className="text-[10px] text-slate-400 font-medium">{p.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostObservation;
