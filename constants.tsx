
import { ObservationFocus, Teacher } from './types';

export interface ObservationIndicator {
  id: string;
  label: string;
  desc: string;
  dianjurkan: string;
  dihindari: string;
  evidenceSuggestions: string[];
}

export const OBSERVATION_INDICATORS: ObservationIndicator[] = [
  { 
    id: 'interaktif', 
    label: 'Suasana Interaktif', 
    desc: 'Memfasilitasi komunikasi dua arah dan partisipasi aktif murid.',
    dianjurkan: 'Mendorong murid bertanya dan berdiskusi kelompok.',
    dihindari: 'Guru mendominasi pembicaraan tanpa memberi ruang respon.',
    evidenceSuggestions: [
      "Guru memberikan pertanyaan pemantik yang dijawab oleh lebih dari 5 murid berbeda.",
      "Terlihat diskusi kelompok kecil di mana guru berkeliling memfasilitasi komunikasi antar murid.",
      "Guru menggunakan teknik 'Think-Pair-Share' untuk memastikan semua murid berbicara.",
      "Guru merespon pendapat murid dengan kalimat penguatan (reinforcement) yang positif."
    ]
  },
  { 
    id: 'inspiratif', 
    label: 'Suasana Inspiratif', 
    desc: 'Memberikan ruang prakarsa, kreativitas, dan kemandirian.',
    dianjurkan: 'Memberi kesempatan murid mencoba ide baru.',
    dihindari: 'Mendikte langkah-langkah kerja secara kaku.',
    evidenceSuggestions: [
      "Murid diberikan kebebasan memilih media presentasi (poster, video, atau lisan).",
      "Guru memberikan tantangan terbuka (open-ended task) yang memicu beragam solusi dari murid.",
      "Terdapat sesi curah pendapat (brainstorming) di mana gagasan murid dihargai tanpa interupsi.",
      "Guru mengaitkan materi dengan tokoh inspiratif atau kejadian nyata yang menggugah emosi."
    ]
  },
  { 
    id: 'menyenangkan', 
    label: 'Suasana Menyenangkan', 
    desc: 'Menciptakan lingkungan belajar yang aman, nyaman, dan inklusif.',
    dianjurkan: 'Menggunakan ice breaking atau apresiasi positif.',
    dihindari: 'Memberikan tekanan atau hukuman yang mempermalukan murid.',
    evidenceSuggestions: [
      "Guru memulai kelas dengan aktivitas penyegaran (ice breaking) yang relevan dengan materi.",
      "Guru menyapa murid secara personal dan menunjukkan empati saat ada murid yang kesulitan.",
      "Pengaturan tempat duduk dibuat fleksibel dan mendukung interaksi sosial yang hangat.",
      "Guru menggunakan permainan (gamifikasi) dalam sesi penguatan konsep."
    ]
  },
  { 
    id: 'menantang', 
    label: 'Suasana Menantang', 
    desc: 'Mendorong daya kritis melalui tugas yang kompleks namun terjangkau.',
    dianjurkan: 'Memberikan pertanyaan pemantik "Mengapa" dan "Bagaimana".',
    dihindari: 'Hanya memberikan soal latihan hapalan yang monoton.',
    evidenceSuggestions: [
      "Guru memberikan soal berbasis studi kasus yang menuntut analisis tingkat tinggi (HOTS).",
      "Murid diminta untuk membandingkan dua sudut pandang berbeda mengenai satu topik.",
      "Tugas yang diberikan memiliki tingkat kesulitan yang bertahap (scaffolding).",
      "Guru menantang murid untuk membuktikan argumen mereka dengan data atau referensi."
    ]
  },
  { 
    id: 'motivasi', 
    label: 'Motivasi Belajar', 
    desc: 'Mendorong partisipasi sesuai bakat, minat, dan perkembangan fisik/psikologis.',
    dianjurkan: 'Mengaitkan materi dengan kegemaran atau cita-cita murid.',
    dihindari: 'Mengabaikan perbedaan minat antar murid di kelas.',
    evidenceSuggestions: [
      "Guru menjelaskan manfaat langsung materi pembelajaran dalam kehidupan sehari-hari.",
      "Guru memberikan pilihan tugas berdasarkan minat murid (diferensiasi produk).",
      "Terlihat murid sangat antusias dan fokus mengerjakan tugas tanpa perlu diingatkan berkali-kali.",
      "Guru memberikan 'reward' verbal yang spesifik atas usaha (effort) murid, bukan hanya hasil."
    ]
  },
  { 
    id: 'memahami', 
    label: 'Pengalaman Memahami', 
    desc: 'Membangun sikap, pengetahuan, dan keterampilan dari berbagai sumber.',
    dianjurkan: 'Memanfaatkan teknologi atau lingkungan sekitar sebagai sumber belajar.',
    dihindari: 'Hanya terpaku pada buku teks tunggal.',
    evidenceSuggestions: [
      "Murid mencari informasi menggunakan gawai atau referensi di luar buku paket.",
      "Guru membawa benda nyata atau mengundang narasumber luar ke dalam kelas.",
      "Murid melakukan observasi langsung di lingkungan sekolah untuk mengumpulkan data.",
      "Guru menggunakan simulasi digital/video untuk menjelaskan konsep yang abstrak."
    ]
  },
  { 
    id: 'mengaplikasi', 
    label: 'Pengalaman Mengaplikasi', 
    desc: 'Menggunakan pengetahuan dalam situasi nyata dan kontekstual.',
    dianjurkan: 'Proyek nyata atau simulasi masalah kehidupan sehari-hari.',
    dihindari: 'Materi berhenti pada konsep teoritis tanpa relevansi nyata.',
    evidenceSuggestions: [
      "Murid melakukan praktik langsung (misal: membuat laporan keuangan sederhana atau percobaan sains).",
      "Tugas akhir berupa produk yang bisa dimanfaatkan oleh masyarakat atau warga sekolah.",
      "Murid mensimulasikan dialog/peran sesuai dengan situasi dunia kerja nyata.",
      "Guru memberikan instruksi yang menghubungkan teori dengan masalah aktual di berita."
    ]
  },
  { 
    id: 'merefleksi', 
    label: 'Aktivitas Merefleksi', 
    desc: 'Aktivitas mengevaluasi dan memaknai proses serta hasil belajar.',
    dianjurkan: 'Menanyakan "Apa yang kamu pelajari hari ini?" di akhir sesi.',
    dihindari: 'Menutup kelas terburu-buru tanpa simpulan dari murid.',
    evidenceSuggestions: [
      "Guru menyediakan waktu khusus di akhir sesi bagi murid untuk mengisi jurnal refleksi.",
      "Beberapa murid menyampaikan hal baru yang mereka pahami dan apa yang masih membingungkan.",
      "Guru mengajak murid menilai efektivitas metode belajar yang digunakan hari ini.",
      "Terdapat simpulan bersama yang disusun oleh murid, bukan hanya oleh guru."
    ]
  },
];

export const TEACHERS: Teacher[] = [
  { id: '1', name: 'Mariati,S.Ag', subject: 'Pendidikan Agama Islam', phase: 'Fase D' },
  { id: '2', name: 'Selviyani,S.PDH', subject: 'Pendidikan Agama Hindu', phase: 'Fase D' },
  { id: '3', name: 'Nur Izzah,S.Pd', subject: 'PKn', phase: 'Fase D' },
  { id: '4', name: 'N.Rahmat,S.Pd', subject: 'Bahasa Indonesia', phase: 'Fase D' },
  { id: '5', name: 'Nurbaya,S.Pd', subject: 'Matematika', phase: 'Fase D' },
  { id: '6', name: 'Jannatul Makwah Abuhair,S.Pd', subject: 'IPA', phase: 'Fase D' },
  { id: '7', name: 'Hasan Pasanjeran,S.Pd', subject: 'IPS', phase: 'Fase D' },
  { id: '8', name: 'Rini Verawati,S.Pd', subject: 'Bahasa Inggris', phase: 'Fase D' },
  { id: '9', name: 'Lapado,S.Pd', subject: 'Bahasa Inggris', phase: 'Fase E' },
  { id: '10', name: 'Sudrajat R,S.Pd', subject: 'PJOK', phase: 'Fase D' },
  { id: '11', name: 'Kevin,S.Pd', subject: 'Informatika', phase: 'Fase D' },
  { id: '12', name: 'Darmawati,S.Pd', subject: 'Ekonomi', phase: 'Fase D' },
  { id: '13', name: 'RINI,S.Pd', subject: 'Bahasa Indonesia', phase: 'Fase D' },
  { id: '14', name: 'Jamiluddin,SE', subject: 'IPS', phase: 'Fase D' },
  { id: '15', name: 'Kartini Apriani,S.Pd', subject: 'Matematika', phase: 'Fase D' },
];

export const FOCUS_OPTIONS: ObservationFocus[] = [
  { id: '1', title: 'Manajemen Kelas (Standar Proses)', description: 'Fokus pada suasana interaktif dan menyenangkan.' },
  { id: '2', title: 'Kualitas Instruksi (Standar Proses)', description: 'Fokus pada pengalaman memahami dan mengaplikasi.' },
  { id: '3', title: 'Refleksi Pembelajaran', description: 'Fokus pada kemampuan murid mengevaluasi hasil belajarnya.' },
];
