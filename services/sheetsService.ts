import { ObservationData } from '../types';

/**
 * PENTING: Ganti URL di bawah ini dengan URL Web App yang Anda dapatkan 
 * setelah melakukan 'Deploy' di Google Apps Script (Code.gs).
 */
const GAS_WEB_APP_URL = 'MOHON_ISI_URL_WEB_APP_GAS_DI_SINI';

export const cloudStorage = {
  /**
   * Mengambil data dari Google Sheets melalui API Apps Script
   */
  async fetchAll(): Promise<ObservationData[]> {
    const localData = (): ObservationData[] => {
      const saved = localStorage.getItem('supervision_data');
      return saved ? JSON.parse(saved) : [];
    };

    if (!GAS_WEB_APP_URL || GAS_WEB_APP_URL === 'MOHON_ISI_URL_WEB_APP_GAS_DI_SINI') {
      console.warn("Konfigurasi Cloud belum lengkap. Berjalan dalam mode Lokal.");
      return localData();
    }

    try {
      const response = await fetch(`${GAS_WEB_APP_URL}?action=getObservations`);
      if (!response.ok) throw new Error('Gagal menghubungi server Google.');
      const data = await response.json();
      return Array.isArray(data) ? data : localData();
    } catch (err) {
      console.error("Gagal mengambil data dari Google Sheets:", err);
      return localData();
    }
  },

  /**
   * Menyimpan atau memperbarui data observasi ke Google Sheets
   */
  async save(data: ObservationData): Promise<void> {
    // Selalu simpan ke localStorage sebagai cadangan (Offline First)
    const saved = localStorage.getItem('supervision_data');
    const observations = saved ? JSON.parse(saved) : [];
    const updatedObservations = [...observations.filter((o: any) => o.teacherId !== data.teacherId), data];
    localStorage.setItem('supervision_data', JSON.stringify(updatedObservations));

    if (!GAS_WEB_APP_URL || GAS_WEB_APP_URL === 'MOHON_ISI_URL_WEB_APP_GAS_DI_SINI') return;

    try {
      // Menggunakan mode 'no-cors' karena Apps Script sering bermasalah dengan CORS redirect
      await fetch(GAS_WEB_APP_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
    } catch (err) {
      console.error("Gagal mengirim data ke Google Sheets:", err);
      // Tidak throw error agar UI tidak macet, data sudah aman di localStorage
    }
  }
};
