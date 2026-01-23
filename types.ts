export enum SupervisionStatus {
  PLANNED = 'Terjadwal',
  OBSERVED = 'Sudah Diobservasi',
  FOLLOWED_UP = 'Selesai Tindak Lanjut',
}

export interface Teacher {
  id: string;
  name: string;
  nip?: string;
  subject: string;
  phase: string;
}

export interface ObservationFocus {
  id: string;
  title: string;
  description: string;
}

export interface ObservationData {
  teacherId: string;
  teacherName: string;
  teacherNip: string; // Tambahan NIP Guru
  principalNip: string; // Tambahan NIP Kepala Sekolah
  date: string;
  subject: string;
  conversationTime: string;
  learningGoals: string;
  focusId: string;
  indicators: {
    [key: string]: {
      checked: boolean;
      note: string;
    }
  };
  reflection: string;
  coachingFeedback: string;
  rtl: string;
  status: SupervisionStatus;
}
