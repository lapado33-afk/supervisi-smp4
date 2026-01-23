
import React, { useState, useEffect } from 'react';
import { Save, AlertCircle, Camera, CheckCircle2, XCircle, MousePointer2, CloudUpload } from 'lucide-react';
import { OBSERVATION_INDICATORS, TEACHERS } from '../constants';
import { ObservationData, SupervisionStatus } from '../types';

interface Props {
  observations: ObservationData[];
  onSave: (data: ObservationData) => void;
}

const ObservationForm: React.FC<Props> = ({ observations, onSave }) => {
  const [teacherId, setTeacherId] = useState('');
  const [indicators, setIndicators] = useState<{[key: string]: {checked: boolean, note: string}}>({});
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    if (teacherId) {
      const existing = observations.find(o => String(o.teacherId) === String(teacherId));
      if (existing && existing.indicators) {
        setIndicators(existing.indicators);
      } else {
        setIndicators({});
      }
    }
  }, [teacherId, observations]);

  const toggleIndicator = (id: string) => {
    setIndicators(prev => ({
      ...prev,
      [id]: { 
        checked: !prev[id]?.checked, 
        note: prev[id]?.note || '' 
      }
    }));
  };

  const updateNote = (id: string, note: string) => {
    setIndicators(prev => ({
      ...prev,
      [id]: { 
        checked: prev[id]?.checked || false, 
        note 
      }
    }));
  };

  const addSuggestion = (id: string, suggestion: string) => {
    const currentNote = indicators[id]?.note || '';
    const newNote = currentNote ? `${currentNote.trim()} ${suggestion}` : suggestion;
    updateNote(id, newNote);
    
    if (!indicators[id]?.checked) {
      toggleIndicator(id);
    }
  };

  const handleSave = () => {
    if (!teacherId) return alert('Pilih guru terlebih dahulu!');
    
    // Ambil data referensi guru dari konstanta agar nama AKURAT
    const teacherRef = TEACHERS.find(t => String(t.id) === String(teacherId));
    const existingData = observations.find(o => String(o.teacherId) === String(teacherId));

    const data: ObservationData = {
      teacherId,
      // Pastikan Nama Guru diambil dari referensi utama (TEACHERS)
      teacherName: teacherRef?.name || existingData?.teacherName || 'Guru',
      teacherNip: existingData?.teacherNip || teacherRef?.nip || '',
      principalNip: existingData?.principalNip || '',
      date: existingData?.date || new Date().toISOString(),
      subject: existingData?.subject || teacherRef?.subject || '',
      conversationTime: existingData?.conversationTime || '',
      learningGoals: existingData?.learningGoals || '',
      focusId: existingData?.focusId || '1', 
      indicators,
      reflection: existingData?.reflection || '',
      coachingFeedback: existingData?.coachingFeedback || '',
      rtl: existingData?.rtl || '',
      status: SupervisionStatus.OBSERVED
    };

    onSave(data);
    setShowConfirm(true);
    setTimeout(() => setShowConfirm(false), 3000);
  };

  return (
    <div className="space-y-8 animate-in duration-500 pb-24">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Pelaksanaan Observasi Kelas</h2>
          <p className="text-slate-500 text-sm font-medium">Berdasarkan Standar Proses (Permendikdasmen No. 1 Tahun 2026)</p>
        </div>
        
        <div className="flex items-center space-x-3">
           <select 
            value={teacherId}
            onChange={(e) => setTeacherId(e.target.value)}
            className="bg-white border border-slate-200 px-4 py-3 rounded-xl focus:ring-2 focus:ring-blue-500 font-bold text-blue-600 outline-none shadow-sm"
          >
            <option value="">-- Sedang Diobservasi --</option>
            {TEACHERS.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
          <button className="bg-slate-100 p-3 rounded-xl text-slate-600 hover:bg-slate-200 transition-all shadow-sm">
            <Camera size={20} />
          </button>
        </div>
      </div>

      {!teacherId ? (
        <div className="bg-white border-2 border-dashed border-slate-200 rounded-[2.5rem] py-24 flex flex-col items-center justify-center text-center px-6">
          <div className="bg-blue-50 text-blue-500 p-8 rounded-full mb-6">
            <MousePointer2 size={48} />
          </div>
          <h3 className="text-xl font-bold text-slate-900">Pilih Guru untuk Memulai</h3>
          <p className="text-slate-500 text-sm max-w-xs mt-2">Silakan pilih nama guru yang sedang Anda observasi di pojok kanan atas untuk mengisi instrumen.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8">
          {OBSERVATION_INDICATORS.map((indicator) => (
            <div key={indicator.id} className={`bg-white p-8 rounded-3xl border transition-all duration-300 ${indicators[indicator.id]?.checked ? 'border-blue-200 bg-blue-50/20 ring-4 ring-blue-50/50' : 'border-slate-200 shadow-sm'}`}>
              <div className="flex flex-col xl:flex-row gap-8">
                <div className="flex-1 space-y-4">
                  <div className="flex items-center space-x-3">
                    <h4 className="font-bold text-lg text-slate-900">{indicator.label}</h4>
                    <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">Standar 2026</span>
                  </div>
                  <p className="text-sm text-slate-600 italic leading-relaxed">"{indicator.desc}"</p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-2">
                    <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100">
                      <div className="flex items-center text-emerald-700 font-black text-[10px] mb-2 uppercase tracking-widest">
                        <CheckCircle2 size={12} className="mr-1" /> Dianjurkan
                      </div>
                      <p className="text-[11px] text-emerald-800 leading-relaxed font-medium">{indicator.dianjurkan}</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-rose-50 border border-rose-100">
                      <div className="flex items-center text-rose-700 font-black text-[10px] mb-2 uppercase tracking-widest">
                        <XCircle size={12} className="mr-1" /> Dihindari
                      </div>
                      <p className="text-[11px] text-rose-800 leading-relaxed font-medium">{indicator.dihindari}</p>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button 
                      onClick={() => toggleIndicator(indicator.id)}
                      className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-bold text-sm transition-all ${
                        indicators[indicator.id]?.checked 
                          ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' 
                          : 'bg-white border border-slate-300 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {indicators[indicator.id]?.checked ? <><CheckCircle2 size={18} /> <span>Berhasil Muncul</span></> : 'Belum Terlihat'}
                    </button>
                  </div>
                </div>

                <div className="flex-1 space-y-4">
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 flex items-center">
                      <MousePointer2 size={12} className="mr-2 text-blue-500" /> Pilih Temuan Cepat:
                    </label>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {indicator.evidenceSuggestions.map((suggestion, idx) => (
                        <button
                          key={idx}
                          onClick={() => addSuggestion(indicator.id, suggestion)}
                          className="text-[10px] bg-slate-50 hover:bg-blue-600 hover:text-white text-slate-600 font-bold px-3 py-2 rounded-xl border border-slate-200 text-left transition-all active:scale-95"
                        >
                          + {suggestion}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="relative">
                    <textarea 
                      value={indicators[indicator.id]?.note || ''}
                      onChange={(e) => updateNote(indicator.id, e.target.value)}
                      placeholder="Klik saran di atas atau tuliskan catatan tambahan Anda di sini..."
                      className="w-full bg-slate-50 border border-slate-200 p-5 rounded-2xl min-h-[140px] text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none transition-all shadow-inner"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {teacherId && (
        <div className="fixed bottom-8 left-8 right-8 max-w-6xl mx-auto bg-white/95 backdrop-blur-md border border-slate-200 p-6 rounded-[2.5rem] shadow-2xl flex items-center justify-between z-50 animate-in slide-in-from-bottom-8">
          <div className="hidden md:flex items-center space-x-4">
            <div className="bg-amber-100 p-3 rounded-full text-amber-600">
              <AlertCircle size={24} />
            </div>
            <div className="max-w-xs">
              <p className="text-xs text-slate-800 font-black leading-tight">
                Simpan & Kirim ke Spreadsheet
              </p>
              <p className="text-[10px] text-slate-500 font-medium">
                Data akan tersimpan secara lokal dan otomatis dikirim ke cloud.
              </p>
            </div>
          </div>
          <button 
            onClick={handleSave}
            className="bg-blue-600 text-white px-12 py-5 rounded-2xl font-bold flex items-center space-x-3 hover:bg-blue-700 shadow-xl shadow-blue-200 transition-all active:scale-95 w-full md:w-auto justify-center"
          >
            {showConfirm ? (
              <><span>Data Terkirim!</span></>
            ) : (
              <><CloudUpload size={20} /> <span>Simpan & Kirim</span></>
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default ObservationForm;
