import { ObservationData } from '../types';

/**
 * PENTING:
 * 1. Salin URL Web App dari Google Apps Script (Deploy > New Deployment).
 * 2. Pastikan 'Who has access' diset ke 'Anyone'.
 */
const GAS_WEB_APP_URL = 'MOHON_ISI_URL_WEB_APP_GAS_DI_SINI';

export const cloudStorage = {
  async fetchAll(): Promise<ObservationData[]> {
    const localData = (): ObservationData[] => {
      const saved = localStorage.getItem('supervision_data');
      return saved ? JSON.parse(saved) : [];
    };

    if (!GAS_WEB_APP_URL || GAS_WEB_APP_URL.includes('MOHON_ISI_URL')) {
      return localData();
    }

    try {
      const response = await fetch(`${GAS_WEB_APP_URL}?action=getObservations`);
      const data = await response.json();
      return Array.isArray(data) ? data : localData();
    } catch (err) {
      console.error("Gagal sinkronisasi cloud:", err);
      return localData();
    }
  },

  async save(data: ObservationData): Promise<void> {
    // Simpan lokal dulu
    const saved = localStorage.getItem('supervision_data');
    const observations = saved ? JSON.parse(saved) : [];
    const updated = [...observations.filter((o: any) => o.teacherId !== data.teacherId), data];
    localStorage.setItem('supervision_data', JSON.stringify(updated));

    if (!GAS_WEB_APP_URL || GAS_WEB_APP_URL.includes('MOHON_ISI_URL')) return;

    try {
      // Mengirim sebagai text/plain no-cors adalah cara paling stabil untuk Apps Script
      await fetch(GAS_WEB_APP_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify(data),
      });
      console.log("Sinkronisasi cloud berjalan...");
    } catch (err) {
      console.error("Kesalahan koneksi cloud:", err);
    }
  }
};
