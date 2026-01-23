
import { ObservationData } from '../types';

/**
 * PASTE URL BARU ANDA DI SINI
 */
const GAS_WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbwsPQMQp2QHdCijPQZO7roynGVxdJVuQV0TV9_n8WYzpW3pFIZpKLJNXu1yyLQpIkZGrA/exec'; 

export const cloudStorage = {
  async fetchAll(): Promise<ObservationData[]> {
    if (!GAS_WEB_APP_URL || GAS_WEB_APP_URL.includes('NEW-URL-ID')) {
      const saved = localStorage.getItem('supervision_data');
      return saved ? JSON.parse(saved) : [];
    }

    try {
      const response = await fetch(`${GAS_WEB_APP_URL}?action=getObservations`);
      const data = await response.json();
      if (Array.isArray(data)) {
        localStorage.setItem('supervision_data', JSON.stringify(data));
        return data;
      }
    } catch (err) {
      console.error("Gagal fetch cloud:", err);
    }
    const saved = localStorage.getItem('supervision_data');
    return saved ? JSON.parse(saved) : [];
  },

  async save(data: ObservationData): Promise<void> {
    // 1. Simpan Lokal
    const saved = localStorage.getItem('supervision_data');
    let observations: ObservationData[] = saved ? JSON.parse(saved) : [];
    const index = observations.findIndex(o => String(o.teacherId) === String(data.teacherId));
    if (index > -1) {
      observations[index] = data;
    } else {
      observations.push(data);
    }
    localStorage.setItem('supervision_data', JSON.stringify(observations));

    // 2. Kirim ke Cloud
    if (!GAS_WEB_APP_URL || GAS_WEB_APP_URL.includes('NEW-URL-ID')) return;

    try {
      // Gunakan mode no-cors untuk menghindari isu preflight
      await fetch(GAS_WEB_APP_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify(data),
      });
      console.log("Berhasil mengirim data ke antrean cloud.");
    } catch (err) {
      console.error("Gagal kirim ke cloud:", err);
    }
  }
};
