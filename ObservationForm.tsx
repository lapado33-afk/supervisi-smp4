
import React, { useState } from 'react';
import { Save, AlertCircle, Camera, CheckCircle2, XCircle, MousePointer2 } from 'lucide-react';
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
    
    // Otomatis tandai sebagai tercapai jika bukti dipilih
    if (!indicators[id]?.checked) {
      toggleIndicator(id);
    }
  };

  // Fix error on line 50: Added missing subject, conversationTime, and learningGoals properties.
  // Merged with existing data from PreObservation stage to ensure continuity.
  const handleSave = () => {
    if (!teacherId) return alert('Pilih guru terlebih dahulu!');
    
    const existing = observations.find(o => o.teacherId === teacherId);
    const teacher = TEACHERS.find(t => t.id === teacherId);

    const data: ObservationData = {
      teacherId,
      date: new Date().toISOString(),
      subject: existing?.subject || teacher?.subject || '',
      conversationTime: existing?.conversationTime || '',
      learningGoals: existing?.learningGoals || '',
      focusId: existing?.focusId || '1', 
      indicators,
      reflection: existing?.reflection || '',
      coachingFeedback: existing?.coachingFeedback || '',
      rtl: existing?.rtl || '',
      status: SupervisionStatus.OBSERVED
    };

    onSave(data);
    setShowConfirm(true);
    setTimeout(() => setShowConfirm(false), 3000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-24">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Pelaksanaan Observasi Kelas</h2>
          <p className="text-slate-500">Berdasarkan Standar Proses (Permendikdasmen No. 1 Tahun 2026)</p>
        </div>
        
        <div className="flex items-center space-x-3">
           <select 
            value={teacherId}
            onChange={(e) => setTeacherId(e.target.value)}
            className="bg-white border border-slate-200 px-4 py-3 rounded-xl focus:ring-2 focus:ring-blue-500 font-bold text-blue-600"
          >
            <option value="">-- Sedang Diobservasi --</option>
            {TEACHERS.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
          <button className="bg-slate-100 p-3 rounded-xl text-slate-600 hover:bg-slate-200 transition-all">
            <Camera size={20} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {OBSERVATION_INDICATORS.map((indicator) => (
          <div key={indicator.id} className={`bg-white p-8 rounded-3xl border transition-all ${indicators[indicator.id]?.checked ? 'border-blue-200 bg-blue-50/10' : 'border-slate-200 shadow-sm'}`}>
            <div className="flex flex-col xl:flex-row gap-8">
              <div className="flex-1 space-y-4">
                <div className="flex items-center space-x-3">
                  <h4 className="font-bold text-lg text-slate-900">{indicator.label}</h4>
                  <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded uppercase">Standar Proses 2026</span>
                </div>
                <p className="text-sm text-slate-600 italic">"{indicator.desc}"</p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-2">
                  <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100">
                    <div className="flex items-center text-emerald-700 font-bold text-xs mb-2">
                      <CheckCircle2 size={14} className="mr-1" /> PERILAKU DIANJURKAN
                    </div>
                    <p className="text-[11px] text-emerald-800 leading-relaxed">{indicator.dianjurkan}</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-rose-50 border border-rose-100">
                    <div className="flex items-center text-rose-700 font-bold text-xs mb-2">
                      <XCircle size={14} className="mr-1" /> PERILAKU DIHINDARI
                    </div>
                    <p className="text-[11px] text-rose-800 leading-relaxed">{indicator.dihindari}</p>
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
                    {indicators[indicator.id]?.checked ? 'Tercapai' : 'Belum Muncul'}
                  </button>
                </div>
              </div>

              <div className="flex-1 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 flex items-center">
                    <MousePointer2 size={12} className="mr-2" /> Klik Temuan Fakta di Bawah ini:
                  </label>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {indicator.evidenceSuggestions.map((suggestion, idx) => (
                      <button
                        key={idx}
                        onClick={() => addSuggestion(indicator.id, suggestion)}
                        className="text-[10px] bg-slate-100 hover:bg-blue-100 hover:text-blue-700 text-slate-600 font-medium px-3 py-2 rounded-lg border border-slate-200 text-left transition-all max-w-full"
                      >
                        + {suggestion}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="relative">
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Catatan Akhir (Edit Manual Jika Perlu)</label>
                  <textarea 
                    value={indicators[indicator.id]?.note || ''}
                    onChange={(e) => updateNote(indicator.id, e.target.value)}
                    placeholder="Pilih saran di atas atau tuliskan bukti nyata lainnya di sini..."
                    className="w-full bg-slate-50 border border-slate-200 p-5 rounded-2xl min-h-[120px] text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none transition-all"
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="fixed bottom-8 left-8 right-8 max-w-6xl mx-auto bg-white/95 backdrop-blur-sm border border-slate-200 p-6 rounded-[2rem] shadow-2xl flex items-center justify-between z-20">
        <div className="hidden md:flex items-center space-x-4">
          <div className="bg-amber-50 p-3 rounded-full text-amber-600">
            <AlertCircle size={24} />
          </div>
          <div className="max-w-xs">
            <p className="text-xs text-slate-700 font-bold leading-tight">
              Observasi Cepat & Objektif
            </p>
            <p className="text-[10px] text-slate-500">
              Gunakan pilihan temuan fakta untuk mempercepat administrasi Anda.
            </p>
          </div>
        </div>
        <button 
          onClick={handleSave}
          className="bg-blue-600 text-white px-12 py-5 rounded-2xl font-bold flex items-center space-x-3 hover:bg-blue-700 shadow-xl shadow-blue-200 transition-all active:scale-95 w-full md:w-auto justify-center"
        >
          {showConfirm ? (
            <><span>Data Tersimpan di Sistem!</span></>
          ) : (
            <><Save size={20} /> <span>Selesaikan Observasi</span></>
          )}
        </button>
      </div>
    </div>
  );
};

export default ObservationForm;
