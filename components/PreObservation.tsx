import React, { useState, useEffect } from 'react';
import { Upload, CheckCircle, Info, ChevronRight, FileText, BookOpen, Clock, Target, CreditCard } from 'lucide-react';
import { TEACHERS, FOCUS_OPTIONS } from '../constants';
import { ObservationData, SupervisionStatus } from '../types';

interface Props {
  onSave: (data: ObservationData) => void;
  principalNip: string;
}

const PreObservation: React.FC<Props> = ({ onSave, principalNip }) => {
  const [selectedTeacher, setSelectedTeacher] = useState('');
  const [teacherNip, setTeacherNip] = useState('');
  const [subject, setSubject] = useState('');
  const [obsDate, setObsDate] = useState('');
  const [convTime, setConvTime] = useState('');
  const [learningGoals, setLearningGoals] = useState('');
  const [selectedFocus, setSelectedFocus] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const teacher = TEACHERS.find(t => t.id === selectedTeacher);
    if (teacher) {
      setSubject(teacher.subject);
      setTeacherNip(teacher.nip || '');
    }
  }, [selectedTeacher]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTeacher || !selectedFocus || !learningGoals) {
      return alert('Mohon lengkapi semua field termasuk Tujuan Pembelajaran!');
    }

    const teacherObj = TEACHERS.find(t => t.id === selectedTeacher);

    const data: ObservationData = {
      teacherId: selectedTeacher,
      teacherName: teacherObj?.name || '',
      teacherNip: teacherNip,
      principalNip: principalNip,
      date: obsDate || new Date().toISOString(),
      subject: subject,
      conversationTime: convTime,
      learningGoals: learningGoals,
      focusId: selectedFocus,
      indicators: {},
      reflection: '',
      coachingFeedback: '',
      rtl: '',
      status: SupervisionStatus.PLANNED
    };

    onSave(data);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 text-center md:text-left uppercase tracking-tight">Catatan Percakapan Pra-Observasi Kelas</h2>
        <p className="text-slate-500 text-center md:text-left">UPT SMPN 4 MAPPEDECENG</p>
      </div>

      <div className="bg-blue-50 border border-blue-100 p-6 rounded-2xl flex items-start space-x-4">
        <div className="bg-blue-600 p-2 rounded-lg text-white mt-1 shadow-md">
          <Info size={20} />
        </div>
        <div>
          <h4 className="font-bold text-blue-900">Petunjuk Pengisian</h4>
          <p className="text-sm text-blue-800 leading-relaxed">
            Gunakan formulir ini untuk mendokumentasikan kesepakatan pra-observasi. Informasi ini akan menjadi acuan saat pelaksanaan observasi di kelas.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <label className="flex items-center text-sm font-bold text-slate-700">
              <BookOpen size={16} className="mr-2 text-blue-600" /> Nama Guru
            </label>
            <select 
              value={selectedTeacher}
              onChange={(e) => setSelectedTeacher(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 p-4 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-semibold"
            >
              <option value="">-- Pilih Guru --</option>
              {TEACHERS.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </div>

          <div className="space-y-2">
            <label className="flex items-center text-sm font-bold text-slate-700">
              <CreditCard size={16} className="mr-2 text-blue-600" /> NIP Guru
            </label>
            <input 
              type="text" 
              value={teacherNip}
              onChange={(e) => setTeacherNip(e.target.value)}
              placeholder="Masukkan NIP Guru"
              className="w-full bg-slate-50 border border-slate-200 p-4 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <label className="block text-sm font-bold text-slate-700">Mata Pelajaran</label>
            <input 
              type="text" 
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Masukkan Mata Pelajaran"
              className="w-full bg-slate-50 border border-slate-200 p-4 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium"
            />
          </div>
          
          <div className="space-y-2">
            <label className="flex items-center text-sm font-bold text-slate-700">
              NIP Kepala Sekolah (Pilih di Sidebar)
            </label>
            <input 
              type="text" 
              value={principalNip}
              disabled
              className="w-full bg-slate-100 border border-slate-200 p-4 rounded-xl text-slate-500 cursor-not-allowed"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <label className="block text-sm font-bold text-slate-700">Hari/Tanggal Observasi</label>
            <input 
              type="date" 
              value={obsDate}
              onChange={(e) => setObsDate(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 p-4 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div className="space-y-2">
            <label className="flex items-center text-sm font-bold text-slate-700">
              <Clock size={16} className="mr-2 text-blue-600" /> Waktu Percakapan
            </label>
            <input 
              type="time" 
              value={convTime}
              onChange={(e) => setConvTime(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 p-4 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="flex items-center text-sm font-bold text-slate-700">
            <Target size={16} className="mr-2 text-blue-600" /> Tujuan Pembelajaran
          </label>
          <textarea 
            value={learningGoals}
            onChange={(e) => setLearningGoals(e.target.value)}
            placeholder="Tuliskan tujuan pembelajaran yang ingin dicapai dalam sesi observasi..."
            className="w-full bg-slate-50 border border-slate-200 p-5 rounded-2xl h-32 focus:ring-2 focus:ring-blue-500 outline-none resize-none transition-all text-sm"
          />
        </div>

        <div className="space-y-4">
          <label className="block text-sm font-bold text-slate-700">Pilih Fokus Indikator (Prioritas Peningkatan)</label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {FOCUS_OPTIONS.map((focus) => (
              <button
                key={focus.id}
                type="button"
                onClick={() => setSelectedFocus(focus.id)}
                className={`p-6 rounded-2xl border text-left transition-all ${
                  selectedFocus === focus.id 
                    ? 'border-blue-600 bg-blue-50 ring-2 ring-blue-100 shadow-sm' 
                    : 'border-slate-200 hover:border-blue-300'
                }`}
              >
                <h5 className="font-bold text-slate-900 mb-2">{focus.title}</h5>
                <p className="text-xs text-slate-500 leading-relaxed">{focus.description}</p>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4 pt-4 border-t border-slate-100">
          <label className="block text-sm font-bold text-slate-700">Telaah Perangkat Ajar (Modul Ajar)</label>
          <div className="border-2 border-dashed border-slate-200 rounded-2xl p-10 flex flex-col items-center justify-center bg-slate-50 hover:bg-white transition-all cursor-pointer group">
            <Upload className="text-slate-400 group-hover:text-blue-600 transition-colors mb-4" size={32} />
            <p className="font-medium text-slate-700">Klik atau tarik file Modul Ajar di sini</p>
            <p className="text-xs text-slate-400 mt-2">Format: PDF, DOCX (Max 10MB)</p>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button 
            type="submit"
            className="bg-blue-600 text-white px-10 py-4 rounded-xl font-bold flex items-center space-x-2 hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all active:scale-95"
          >
            {isSaved ? (
              <><CheckCircle size={20} /> <span>Perencanaan Tersimpan!</span></>
            ) : (
              <><span>Simpan Perencanaan</span> <ChevronRight size={20} /></>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PreObservation;
