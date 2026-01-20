
export enum SupervisionStatus {
  PLANNED = 'Terjadwal',
  OBSERVED = 'Sudah Diobservasi',
  FOLLOWED_UP = 'Selesai Tindak Lanjut',
}

export interface Teacher {
  id: string;
  name: string;
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
  date: string;
  subject: string; // Tambahan baru
  conversationTime: string; // Tambahan baru
  learningGoals: string; // Tambahan baru
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
