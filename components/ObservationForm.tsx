import React, { useState, useEffect } from 'react';
import { Save, Camera, Check, XCircle, MousePointer2, ChevronDown, ListChecks, MessageSquareText, Plus } from 'lucide-react';
import { PERFORMANCE_RUBRICS, TEACHERS } from '../constants';
import { ObservationData, SupervisionStatus } from '../types';

// Mapping saran temuan spesifik berdasarkan ID Target Perilaku
const OBSERVATION_SUGGESTIONS: Record<string, string[]> = {
  // Instruksi Pembelajaran
  'ins_1': [
    "Guru menanyakan 'mengapa' untuk menggali alasan jawaban murid",
    "Pertanyaan dikaitkan dengan pengalaman sehari-hari murid",
    "Murid aktif berebut menjawab pertanyaan pemantik",
    "Guru memberi waktu tunggu (wait time) bagi murid berpikir",
    "Pertanyaan memancing murid membandingkan dua konsep berbeda"
  ],
  'ins_2': [
    "Setiap anggota kelompok memiliki peran (ketua/notulis/penyaji)",
    "Guru mendekati murid yang pasif dan memberi dorongan",
    "Pembagian tugas dalam kelompok terlihat sangat adil",
    "Murid yang biasanya diam mulai berani bicara",
    "Seluruh murid terlibat dalam menyelesaikan LKPD"
  ],
  'ins_3': [
    "Guru berkeliling memastikan diskusi berjalan di setiap meja",
    "Interaksi antar murid menunjukkan sikap saling menghargai",
    "Terjadi debat argumen yang sehat antar kelompok",
    "Guru menggunakan teknik 'Think-Pair-Share' dengan baik",
    "Kelompok dibentuk secara heterogen (minat/kemampuan)"
  ],
  // Disiplin Positif
  'dis_1': [
    "Guru mengajak murid meninjau kembali kesepakatan kelas",
    "Murid secara mandiri menyadari jika kelas mulai berisik",
    "Refleksi dinamika kelas dilakukan dengan santai dan terbuka",
    "Guru mendengarkan keberatan murid tentang aturan tertentu",
    "Suasana kelas terlihat kondusif tanpa ada paksaan/teriakan"
  ],
  'dis_2': [
    "Guru memberikan jempol/pujian saat murid merapikan buku",
    "Penguatan positif dilakukan secara spesifik pada perilaku",
    "Terdapat apresiasi kelompok terbaik di akhir sesi",
    "Guru menggunakan stiker/poin sebagai penguatan positif",
    "Pujian diberikan secara tulus dan merata ke semua murid"
  ],
  'dis_3': [
    "Guru melakukan segitiga restitusi pada murid yang terlambat",
    "Murid menawarkan solusi untuk memperbaiki kesalahannya",
    "Guru berbicara dengan nada rendah saat menangani konflik",
    "Fokus pada perbaikan perilaku, bukan pada pemberian sanksi",
    "Murid merasa aman dan tidak terpojok saat ditegur"
  ],
  // Umpan Balik
  'ub_1': [
    "Guru menyebut murid sebagai 'calon pemimpin masa depan'",
    "Penyampaian motivasi terasa personal dan menyentuh",
    "Guru yakin murid mampu menyelesaikan tantangan sulit",
    "Murid terlihat bangga saat potensinya disebut guru",
    "Harapan tinggi disampaikan dengan bahasa yang optimis"
  ],
  'ub_2': [
    "Guru memuji murid yang biasanya lamban saat ia berhasil",
    "Tidak ada perbedaan perlakuan antara murid pintar dan lainnya",
    "Guru menyebutkan potensi unik setiap murid secara spesifik",
    "Seluruh murid merasa dihargai tanpa kecuali",
    "Guru memberikan perhatian yang sama ke meja baris belakang"
  ],
  'ub_3': [
    "Soal tantangan level HOTS diberikan dengan bimbingan tepat",
    "Guru memberikan scaffolding (bantuan) saat murid kesulitan",
    "Tugas yang diberikan sangat relevan dengan minat murid",
    "Murid termotivasi mencoba tugas yang lebih sulit",
    "Umpan balik fokus pada proses usaha murid, bukan hasil"
  ],
  // Perhatian & Kepedulian
  'pk_1': [
    "Guru menatap mata dan menyimak saat murid bercerita",
    "Terjadi kontak batin yang hangat antara guru dan murid",
    "Guru bertanya kabar murid yang terlihat kurang bersemangat",
    "Pendapat murid dihargai sepenuhnya tanpa interupsi",
    "Guru menunjukkan ekspresi empati saat murid curhat"
  ],
  'pk_2': [
    "Guru menyesuaikan penjelasan saat melihat murid bingung",
    "Pembelajaran dimodifikasi sesuai gaya belajar murid",
    "Guru hafal karakteristik unik masing-masing murid",
    "Instruksi diulang dengan cara berbeda agar mudah dipahami",
    "Guru memperhatikan kenyamanan posisi duduk murid"
  ],
  'pk_3': [
    "Guru memberikan tepuk tangan atas usaha kecil murid",
    "Minat guru pada karya murid terlihat sangat besar",
    "Dukungan moral diberikan saat murid gagal menjawab",
    "Guru mengapresiasi keberanian murid untuk maju ke depan",
    "Setiap progres kecil murid didokumentasikan guru"
  ]
};

// Fix for "Cannot find name 'Props'" error on line 99
interface Props {
  observations: ObservationData[];
  onSave: (data: ObservationData) => void;
}

const ObservationForm: React.FC<Props> = ({ observations, onSave }) => {
  const [teacherId, setTeacherId] = useState('');
  const [rubricId, setRubricId] = useState('instruksi');
  const [indicators, setIndicators] = useState<{[key: string]: {checked: boolean, note: string}}>({});
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  // Ambil rubrik yang sedang aktif
  const activeRubric = PERFORMANCE_RUBRICS.find(r => r.id === rubricId) || PERFORMANCE_RUBRICS[0];

  useEffect(() => {
    if (teacherId) {
      const existing = observations.find(o => String(o.teacherId) === String(teacherId));
      if (existing) {
        if (existing.indicators) setIndicators(existing.indicators);
        if (existing.additionalNotes) setAdditionalNotes(existing.additionalNotes);
        
        // Jika data lama ada, coba sesuaikan rubricId berdasarkan prefix ID indikator
        const firstKey = Object.keys(existing.indicators || {})[0];
        if (firstKey?.startsWith('dis_')) setRubricId('disiplin');
        else if (firstKey?.startsWith('ins_')) setRubricId('instruksi');
        else if (firstKey?.startsWith('ub_')) setRubricId('umpan_balik');
        else if (firstKey?.startsWith('pk_')) setRubricId('perhatian_kepedulian');
      } else {
        setIndicators({});
        setAdditionalNotes('');
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

  const appendSuggestion = (id: string, suggestion: string) => {
    const currentNote = indicators[id]?.note || '';
    const newNote = currentNote ? `${currentNote}. ${suggestion}` : suggestion;
    updateNote(id, newNote);
    // Otomatis centang teramati jika kita menambahkan catatan
    if (!indicators[id]?.checked) {
      setIndicators(prev => ({
        ...prev,
        [id]: { ...prev[id], checked: true }
      }));
    }
  };

  const handleSave = () => {
    if (!teacherId) return alert('Pilih guru terlebih dahulu!');
    
    const teacherRef = TEACHERS.find(t => String(t.id) === String(teacherId));
    const existingData = observations.find(o => String(o.teacherId) === String(teacherId));

    const data: ObservationData = {
      teacherId,
      teacherName: teacherRef?.name || existingData?.teacherName || 'Guru',
      teacherNip: existingData?.teacherNip || teacherRef?.nip || '',
      principalNip: existingData?.principalNip || '',
      date: existingData?.date || new Date().toISOString(),
      subject: existingData?.subject || teacherRef?.subject || '',
      conversationTime: existingData?.conversationTime || '',
      learningGoals: existingData?.learningGoals || '',
      developmentArea: existingData?.developmentArea || '',
      strategy: existingData?.strategy || '',
      supervisorNotes: existingData?.supervisorNotes || '',
      additionalNotes: additionalNotes,
      focusId: rubricId,
      indicators,
      reflection: existingData?.reflection || '',
      coachingFeedback: existingData?.coachingFeedback || '',
      rtl: existingData?.rtl || '',
      status: SupervisionStatus.OBSERVED
    };

    onSave(data);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="space-y-8 animate-in duration-500 pb-12">
      {/* Header & Seleksi */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 uppercase tracking-tight">Pelaksanaan Observasi</h2>
          <p className="text-slate-500 text-sm font-medium">Isi instrumen berdasarkan rubrik kinerja target perilaku.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative w-full sm:w-64">
             <select 
              value={teacherId}
              onChange={(e) => setTeacherId(e.target.value)}
              className="w-full appearance-none bg-slate-50 border border-slate-200 px-5 py-3.5 rounded-2xl focus:ring-2 focus:ring-blue-500 font-bold text-slate-900 outline-none shadow-inner pr-10"
            >
              <option value="">-- Pilih Guru --</option>
              {TEACHERS.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
            <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>

          <div className="relative w-full sm:w-72">
             <select 
              value={rubricId}
              onChange={(e) => setRubricId(e.target.value)}
              className="w-full appearance-none bg-blue-600 border border-blue-700 px-5 py-3.5 rounded-2xl focus:ring-2 focus:ring-blue-400 font-bold text-white outline-none shadow-lg pr-10"
            >
              {PERFORMANCE_RUBRICS.map(r => <option key={r.id} value={r.id}>{r.label}</option>)}
            </select>
            <ListChecks size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 pointer-events-none" />
          </div>
          
          <button className="bg-slate-100 p-3.5 rounded-2xl text-slate-600 hover:bg-slate-200 transition-all shadow-sm">
            <Camera size={20} />
          </button>
        </div>
      </div>

      {!teacherId ? (
        <div className="bg-white border-2 border-dashed border-slate-200 rounded-[3rem] py-32 flex flex-col items-center justify-center text-center px-6">
          <div className="bg-blue-50 text-blue-500 p-10 rounded-full mb-6">
            <MousePointer2 size={64} strokeWidth={1.5} />
          </div>
          <h3 className="text-2xl font-black text-slate-900 uppercase">Pilih Guru & Indikator</h3>
          <p className="text-slate-500 text-sm max-w-sm mt-3 leading-relaxed font-medium">Pilih nama guru dan indikator kinerja di atas untuk memunculkan instrumen pengamatan sesuai rubrik terbaru.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Info Rubrik Aktif */}
          <div className="bg-slate-900 text-white p-8 rounded-[2.5rem] shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <ListChecks size={120} />
            </div>
            <span className="bg-blue-500 text-white text-[10px] font-black px-4 py-1 rounded-full uppercase tracking-[0.2em] mb-4 inline-block">Fokus Observasi</span>
            <h3 className="text-2xl font-black mb-2 uppercase tracking-tight">{activeRubric.label}</h3>
            <p className="text-slate-300 text-sm max-w-2xl leading-relaxed italic font-medium">{activeRubric.description}</p>
          </div>

          {/* Daftar Target Perilaku */}
          <div className="grid grid-cols-1 gap-8">
            {activeRubric.targets.map((target) => (
              <div key={target.id} className={`bg-white p-8 rounded-[2.5rem] border transition-all duration-300 ${indicators[target.id]?.checked ? 'border-blue-300 ring-4 ring-blue-50 shadow-md' : 'border-slate-200 shadow-sm'}`}>
                <div className="flex flex-col xl:flex-row gap-10">
                  <div className="flex-1 space-y-6">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Target Perilaku</span>
                        <h4 className="font-black text-xl text-slate-900 leading-tight">{target.label}</h4>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="p-6 rounded-[2rem] bg-emerald-50 border border-emerald-100/50">
                        <div className="flex items-center text-emerald-700 font-black text-[10px] mb-4 uppercase tracking-[0.2em]">
                          <Check size={14} className="mr-2" /> Perilaku Dianjurkan
                        </div>
                        <ul className="space-y-3">
                          {target.dianjurkan.map((item, idx) => (
                            <li key={idx} className="flex items-start text-[11px] text-emerald-900 font-medium leading-relaxed">
                              <span className="mr-2 text-emerald-500">•</span> {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="p-6 rounded-[2rem] bg-rose-50 border border-rose-100/50">
                        <div className="flex items-center text-rose-700 font-black text-[10px] mb-4 uppercase tracking-[0.2em]">
                          <XCircle size={14} className="mr-2" /> Perilaku Dihindari
                        </div>
                        <ul className="space-y-3">
                          {target.dihindari.map((item, idx) => (
                            <li key={idx} className="flex items-start text-[11px] text-rose-900 font-medium leading-relaxed">
                              <span className="mr-2 text-rose-500">•</span> {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="pt-2">
                      <button 
                        onClick={() => toggleIndicator(target.id)}
                        className={`flex items-center space-x-3 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${
                          indicators[target.id]?.checked 
                            ? 'bg-blue-600 text-white shadow-xl shadow-blue-200' 
                            : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                        }`}
                      >
                        {indicators[target.id]?.checked ? <><Check size={18} /> <span>Teramati</span></> : 'Belum Teramati'}
                      </button>
                    </div>
                  </div>

                  <div className="flex-1 flex flex-col space-y-4">
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Catatan Temuan Lapangan:</label>
                      <textarea 
                        value={indicators[target.id]?.note || ''}
                        onChange={(e) => updateNote(target.id, e.target.value)}
                        placeholder="Contoh: Guru menggunakan pertanyaan terbuka 'Bagaimana pendapatmu...' yang memicu 3 murid merespon..."
                        className="w-full bg-slate-50 border border-slate-200 p-6 rounded-[2rem] text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none resize-none transition-all shadow-inner min-h-[160px]"
                      />
                    </div>
                    
                    {/* Suggestion Chips */}
                    <div className="space-y-2">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-2">Pilihan Cepat (Klik untuk menambah):</p>
                      <div className="flex flex-wrap gap-2">
                        {(OBSERVATION_SUGGESTIONS[target.id] || []).map((suggestion, sIdx) => (
                          <button
                            key={sIdx}
                            type="button"
                            onClick={() => appendSuggestion(target.id, suggestion)}
                            className="flex items-center space-x-1 px-3 py-2 bg-white border border-slate-200 rounded-xl text-[10px] font-bold text-slate-600 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50 transition-all active:scale-95 text-left"
                          >
                            <Plus size={10} className="shrink-0" />
                            <span>{suggestion}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Kolom Catatan Tambahan */}
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center space-x-2 text-slate-900">
              <MessageSquareText size={20} className="text-blue-600" />
              <h3 className="text-lg font-bold">Catatan Tambahan Pelaksanaan</h3>
            </div>
            <textarea 
              value={additionalNotes}
              onChange={(e) => setAdditionalNotes(e.target.value)}
              placeholder="Tambahkan catatan umum lainnya selama observasi berlangsung (opsional)..."
              className="w-full bg-slate-50 border border-slate-200 p-6 rounded-[2rem] text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none resize-none transition-all shadow-inner min-h-[120px]"
            />
          </div>

          <div className="flex justify-end pt-8">
            <button 
              onClick={handleSave}
              className="bg-emerald-600 text-white px-14 py-5 rounded-[2rem] font-black text-xs uppercase tracking-widest flex items-center space-x-3 hover:bg-emerald-700 shadow-2xl shadow-emerald-200 transition-all active:scale-95"
            >
              {isSaved ? (
                <><Check size={20} /> <span>Data Tersimpan</span></>
              ) : (
                <><Save size={20} /> <span>Simpan Hasil Observasi</span></>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ObservationForm;
