
import { ObservationFocus, Teacher } from './types';

export interface PerformanceTarget {
  id: string;
  label: string;
  dianjurkan: string[];
  dihindari: string[];
}

export interface PerformanceRubric {
  id: string;
  label: string;
  description: string;
  targets: PerformanceTarget[];
}

export const PERFORMANCE_RUBRICS: PerformanceRubric[] = [
  {
    id: 'instruksi',
    label: 'Instruksi Pembelajaran',
    description: 'Penjelasan terstruktur yang memandu murid memahami, mengaplikasi dan merefleksikan pembelajaran sebagai implementasi pembelajaran mendalam.',
    targets: [
      {
        id: 'ins_1',
        label: 'Guru mengajukan pertanyaan yang menstimulasi proses diskusi dan berpikir kritis',
        dianjurkan: [
          'Guru mengajukan pertanyaan terbuka untuk memancing proses diskusi dan berpikir kritis',
          'Guru mengajukan pertanyaan yang mengaitkan konsep yang dipelajari dengan konsep sebelumnya',
          'Guru mengajukan yang meminta peserta didik membandingkan dua konsep yang berbeda'
        ],
        dihindari: [
          'Guru mengajukan pertanyaan hanya untuk menguji pemahaman peserta didik',
          'Guru mengajukan pertanyaan yang meminta peserta didik mengulang konsep yang disampaikan',
          'Guru menghakimi jawaban peserta didik sehingga membuat peserta didik yang lain ragu buat menjawab'
        ]
      },
      {
        id: 'ins_2',
        label: 'Guru memfasilitasi kegiatan pembelajaran yang memberi peran pada semua peserta didik',
        dianjurkan: [
          'Guru memotivasi semua peserta didik untuk berperan aktif dalam proses pembelajaran',
          'Guru menyediakan peran dalam kelompok untuk memastikan semua anggota mendapat peran',
          'Guru memberi dukungan dan kesempatan pada peserta didik yang pasif untuk berperan'
        ],
        dihindari: [
          'Guru membiarkan peserta didik membuat dan membagikan peran dalam kelompok',
          'Guru menyediakan peran yang terbatas sehingga peserta didik tertentu tidak mendapat peran',
          'Guru membiarkan sebagian peserta didik bersikap dominan dalam proses pembelajaran'
        ]
      },
      {
        id: 'ins_3',
        label: 'Guru memfasilitasi terjadinya diskusi kelompok yang interaktif, kritis dan inklusif',
        dianjurkan: [
          'Guru memotivasi peserta didik untuk menyampaikan pendapat secara terbuka',
          'Guru membentuk kelompok dengan beragam kemampuan dan minat',
          'Guru berkeliling kelas untuk memberikan bimbingan pada kelompok dalam berdiskusi'
        ],
        dihindari: [
          'Guru hanya duduk di depan dan membiarkan kelompok berdiskusi sendiri',
          'Guru membiarkan peserta didik membentuk kelompok sendiri sesuka hatinya',
          'Guru mengabaikan atau melarang perbedaan pendapat'
        ]
      }
    ]
  },
  {
    id: 'disiplin',
    label: 'Penerapan Disiplin Positif',
    description: 'Penerapan prinsip disiplin positif untuk mengelola perilaku dan kebiasaan kelas yang disepakati bersama agar kualitas lingkungan pembelajaran semakin meningkat.',
    targets: [
      {
        id: 'dis_1',
        label: 'Guru melakukan refleksi dinamika kelas untuk menerapkan kesepakatan kelas',
        dianjurkan: [
          'Guru mengajak peserta didik melakukan refleksi dinamika kelas secara terbuka',
          'Guru menunjukkan kesediaan mendengarkan pandangan peserta didik tentang dinamika kelas',
          'Guru bersikap adaptif dalam menyesuaikan pendekatan dalam menjalankan kedisiplinan'
        ],
        dihindari: [
          'Guru mengabaikan pendapat peserta didik tentang apa yang terjadi di kelas',
          'Guru bersikap defensive dalam menyikapi umpan balik dari peserta didik terkait kedisiplinan',
          'Guru menerapkan hukuman fisik terhadap peserta didik yang melakukan pelanggaran kedisiplinan'
        ]
      },
      {
        id: 'dis_2',
        label: 'Guru melakukan penguatan positif terhadap perilaku yang sesuai atau mendukung kesepakatan kelas',
        dianjurkan: [
          'Guru segera beri pengakuan terhadap perilaku peserta didik yang sesuai kesepakatan kelas',
          'Guru beri penguatan positif dengan berbagai cara yang beragam',
          'Guru mengakui suatu perilaku positif secara spesifik dan menjelaskan alasannya'
        ],
        dihindari: [
          'Guru tidak konsisten dalam memberikan penguatan positif, hanya pada peserta didik tertentu',
          'Guru mengabaikan perilaku positif karena terlalu fokus pada perilaku negatif atau hal lain',
          'Guru melakukan penguatan perilaku yang tidak bermanfaat bagi peserta didik dan kelas secara keseluruhan'
        ]
      },
      {
        id: 'dis_3',
        label: 'Guru melakukan restitusi untuk membantu peserta didik menyadari konsekuensi dan memperbaiki perilaku melanggarnya',
        dianjurkan: [
          'Guru dengan sabar membantu peserta didik menyadari konsekuensi dari perilaku melanggarnya',
          'Guru mendengarkan sudut pandang peserta didik terhadap perilaku melanggarnya',
          'Guru memberikan dukungan pada peserta didik dalam melakukan perbaikan perilakunya'
        ],
        dihindari: [
          'Guru langsung memberikan hukuman, bukan membangun upaya perbaikan perilaku',
          'Guru kehilangan kesabaran dalam membantu peserta didik menyadari konsekuensi perilakunya',
          'Guru meminta peserta didik untuk tenang tanpa melakukan restitusi terhadap perilaku melanggar'
        ]
      }
    ]
  },
  {
    id: 'umpan_balik',
    label: 'Umpan Balik Konstruktif',
    description: 'Praktik pedagogis berupa penyampaian kemajuan proses dan capaian murid sehingga murid dapat melakukan perbaikan cara belajar dalam pembelajaran mendalam.',
    targets: [
      {
        id: 'ub_1',
        label: 'Guru mengkomunikasikan harapannya yang tinggi terhadap masa depan seluruh peserta didiknya',
        dianjurkan: [
          'Guru menyampaikan masa depan idaman yang bermakna bagi peserta didik.',
          'Guru mendiskusikan harapan positif peserta didik tentang masa depannya.',
          'Guru menyebutkan potensi peserta didik disertai kemungkinan positif di masa depan.'
        ],
        dihindari: [
          'Guru menyebutkan perilaku-perilaku negatif peserta didiknya.',
          'Guru menjelaskan harapan-harapan yang tidak relevan dengan peserta didik.',
          'Guru mengabaikan potensi peserta didik karena lebih fokus pada kelemahannya.'
        ]
      },
      {
        id: 'ub_2',
        label: 'Guru mengkomunikasikan harapan positif terhadap semua peserta didik secara setara dan tanpa diskriminasi',
        dianjurkan: [
          'Guru menyampaikan harapan positifnya secara terbuka dan berlaku bagi semua peserta didik.',
          'Guru menyatakan secara eksplisit adanya keragaman potensi peserta didik.',
          'Guru menyebutkan potensi peserta didik meski peserta didik sendiri tidak menyadarinya.'
        ],
        dihindari: [
          'Guru menyampaikan harapan positif hanya pada peserta didik tertentu saja.',
          'Guru mengulang harapan-harapan positif tertentu yang hanya relevan dengan sebagian peserta didik.',
          'Guru menyebutkan potensi peserta didik yang terlihat menonjol saja.'
        ]
      },
      {
        id: 'ub_3',
        label: 'Guru memberikan tantangan yang bermakna disertai motivasi untuk mencapainya',
        dianjurkan: [
          'Menyediakan tantangan belajar yang relevan dengan pembelajaran dan bermakna bagi peserta didik.',
          'Menunjukkan keyakinan berulang kali bahwa peserta didiknya mampu mengatasi tantangan belajar.',
          'Memberikan umpan balik dan dukungan agar peserta didiknya berhasil.'
        ],
        dihindari: [
          'Memberikan tantangan belajar tapi tidak memberikan motivasi.',
          'Menggunakan hadiah dan hukuman untuk memotivasi murid.',
          'Mengkomunikasikan kompetisi dalam kelas secara berlebihan.'
        ]
      }
    ]
  },
  {
    id: 'perhatian_kepedulian',
    label: 'Perhatian dan Kepedulian',
    description: 'Praktik pedagogis berupa pemberian perhatian dan dukungan sesuai dengan kebutuhan belajar setiap murid agar semua murid siap melakukan pembelajaran mendalam.',
    targets: [
      {
        id: 'pk_1',
        label: 'Guru menunjukkan empati untuk mendapatkan pemahaman utuh tentang peserta didik',
        dianjurkan: [
          'Guru memberikan perhatian penuh ketika peserta didik berbicara',
          'Guru mengajukan pertanyaan lanjutan untuk mendapatkan pemahaman',
          'Guru menunjukkan pengertian terhadap sudut pandang peserta didik'
        ],
        dihindari: [
          'Guru mengabaikan pendapat atau perasaan peserta didik',
          'Guru memberikan penilaian negatif terhadap pendapat peserta didik',
          'Guru tidak memberikan kesempatan pada peserta didik menyampaikan pendapat'
        ]
      },
      {
        id: 'pk_2',
        label: 'Guru menunjukkan pemahaman terhadap kebutuhan, kondisi dan karakteristik peserta didik',
        dianjurkan: [
          'Guru melakukan pengamatan terhadap dinamika kelas untuk memahami peserta didik',
          'Guru melakukan interaksi positif yang menghargai keunikan peserta didik',
          'Guru meminta pendapat dan umpan balik dari peserta didik'
        ],
        dihindari: [
          'Guru bertindak berdasarkan asumsi tanpa menggali fakta terkait peserta didik',
          'Guru bersikap kaku dalam pembelajaran yang mengabaikan kebutuhan peserta didik',
          'Guru menghindari masukan atau umpan balik dari peserta didik'
        ]
      },
      {
        id: 'pk_3',
        label: 'Guru mengakui dan menghargai usaha yang ditunjukkan peserta didik',
        dianjurkan: [
          'Guru menunjukkan minat/keingintahuan terhadap aktivitas yang dilakukan murid',
          'Guru memberikan pujian terhadap usaha, bukan hasil akhir, yang ditunjukkan peserta didik',
          'Guru menyampaikan dukungan terhadap usaha peserta didik di depan kelas'
        ],
        dihindari: [
          'Guru meremehkan usaha-usaha yang dilakukan peserta didik',
          'Guru memberikan pujian yang terlalu umum atau berlebihan/bombastis',
          'Guru bersikap terlalu kritis terhadap usaha yang dilakukan peserta didik'
        ]
      }
    ]
  }
];

// Menurunkan OBSERVATION_INDICATORS dari target rubrik untuk konsistensi data di laporan
export const OBSERVATION_INDICATORS = PERFORMANCE_RUBRICS.flatMap(rubric => 
  rubric.targets.map(target => ({
    id: target.id,
    label: target.label
  }))
);

export const TEACHERS: Teacher[] = [
  { id: '1', name: 'Mariati,S.Ag', nip: '197503122005012008', subject: 'Pendidikan Agama Islam', phase: 'Fase D' },
  { id: '2', name: 'Selviyani,S.PDH', nip: '198205152010012015', subject: 'Pendidikan Agama Hindu', phase: 'Fase D' },
  { id: '3', name: 'Nur Izzah,S.Pd', nip: '198808202015032002', subject: 'PKn', phase: 'Fase D' },
  { id: '4', name: 'N.Rahmat,S.Pd', nip: '197001011995121001', subject: 'Bahasa Indonesia', phase: 'Fase D' },
  { id: '5', name: 'Nurbaya,S.Pd', nip: '197204051998032004', subject: 'Matematika', phase: 'Fase D' },
  { id: '6', name: 'Jannatul Makwah Abuhair,S.Pd', nip: '199011122019032011', subject: 'IPA', phase: 'Fase D' },
  { id: '7', name: 'Hasan Pasanjeran,S.Pd', nip: '197806142006041009', subject: 'IPS', phase: 'Fase D' },
  { id: '8', name: 'Rini Verawati,S.Pd', nip: '198502282009022003', subject: 'Bahasa Inggris', phase: 'Fase D' },
  { id: '9', name: 'Lapado,S.Pd', nip: '196809101992031005', subject: 'Bahasa Inggris', phase: 'Fase E' },
  { id: '10', name: 'Sudrajat R,S.Pd', nip: '198001012005011002', subject: 'PJOK', phase: 'Fase D' },
  { id: '11', name: 'Kevin,S.Pd', nip: '199505052022031001', subject: 'Informatika', phase: 'Fase D' },
  { id: '12', name: 'Darmawati,S.Pd', nip: '197607072007012006', subject: 'Ekonomi', phase: 'Fase D' },
  { id: '13', name: 'RINI,S.Pd', nip: '198812122015032005', subject: 'Bahasa Indonesia', phase: 'Fase D' },
  { id: '14', name: 'Jamiluddin,SE', nip: '197403032006041007', subject: 'IPS', phase: 'Fase D' },
  { id: '15', name: 'Kartini Apriani,S.Pd', nip: '199204042019032008', subject: 'Matematika', phase: 'Fase D' },
];

export const FOCUS_OPTIONS: ObservationFocus[] = [
  { id: 'instruksi', title: 'Instruksi Pembelajaran', description: 'Fokus pada penjelasan terstruktur dan implementasi pembelajaran mendalam.' },
  { id: 'disiplin', title: 'Penerapan Disiplin Positif', description: 'Fokus pada pengelolaan perilaku melalui prinsip disiplin positif.' },
  { id: 'umpan_balik', title: 'Umpan Balik Konstruktif', description: 'Fokus pada penyampaian kemajuan proses dan harapan tinggi masa depan murid.' },
  { id: 'perhatian_kepedulian', title: 'Perhatian dan Kepedulian', description: 'Fokus pada pemberian perhatian dan dukungan sesuai kebutuhan belajar murid.' },
];
