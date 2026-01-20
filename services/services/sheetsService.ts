
import { ObservationData } from '../types';

/**
 * GANTI DENGAN URL WEB APP ANDA SETELAH DEPLOY DI GOOGLE APPS SCRIPT
 * Contoh: https://script.google.com/macros/s/AKfycb.../exec
 */
const GAS_WEB_APP_URL = 'MOHON_ISI_URL_WEB_APP_GAS_DI_SINI';

export const cloudStorage = {
  /**
   * Mengambil data dari Google Sheets melalui API
   */
  async fetchAll(): Promise<ObservationData[]> {
    if (GAS_WEB_APP_URL === 'MOHON_ISI_URL_WEB_APP_GAS_DI_SINI') {
      console.warn("GAS_WEB_APP_URL belum diisi. Menggunakan localStorage.");
      const saved = localStorage.getItem('supervision_data');
      return saved ? JSON.parse(saved) : [];
    }

    try {
      const response = await fetch(`${GAS_WEB_APP_URL}?action=getObservations`);
      const data = await response.json();
      return data;
    } catch (err) {
      console.error("Gagal fetch dari Cloud API:", err);
      const saved = localStorage.getItem('supervision_data');
      return saved ? JSON.parse(saved) : [];
    }
  },

  /**
   * Menyimpan data ke Google Sheets melalui API
   */
  async save(data: ObservationData): Promise<void> {
    // Simpan ke local sebagai backup
    const saved = localStorage.getItem('supervision_data');
    const observations = saved ? JSON.parse(saved) : [];
    const newObs = [...observations.filter((o: any) => o.teacherId !== data.teacherId), data];
    localStorage.setItem('supervision_data', JSON.stringify(newObs));

    if (GAS_WEB_APP_URL === 'MOHON_ISI_URL_WEB_APP_GAS_DI_SINI') return;

    try {
      await fetch(GAS_WEB_APP_URL, {
        method: 'POST',
        mode: 'no-cors', // Penting untuk Google Apps Script
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
    } catch (err) {
      console.error("Gagal kirim ke Cloud API:", err);
      throw err;
    }
  }
};
