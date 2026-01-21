import { ObservationData } from '../types';

/**
 * PENTING: Ganti URL di bawah ini dengan URL Web App yang Anda dapatkan 
 * setelah melakukan 'Deploy' di Google Apps Script (Code.gs).
 * Pastikan saat Deploy: "Execute as: Me" dan "Who has access: Anyone".
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
      console.warn("Konfigurasi Cloud belum lengkap. Silakan isi GAS_WEB_APP_URL di services/sheetsService.ts");
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

    if (!GAS_WEB_APP_URL || GAS_WEB_APP_URL === 'MOHON_ISI_URL_WEB_APP_GAS_DI_SINI') {
      console.error("Data tersimpan lokal, tapi Gagal kirim ke Cloud: URL Web App belum diisi.");
      return;
    }

    try {
      /**
       * MENGAPA MENGGUNAKAN text/plain? 
       * Google Apps Script tidak mendukung Preflight Request (OPTIONS) yang dipicu oleh application/json.
       * Dengan menggunakan text/plain dan mode no-cors, permintaan dikirim sebagai "Simple Request"
       * yang diizinkan oleh browser untuk lintas domain tanpa blokir CORS.
       */
      await fetch(GAS_WEB_APP_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'text/plain',
        },
        body: JSON.stringify(data),
      });
      console.log("Data berhasil dikirim ke antrean Cloud.");
    } catch (err) {
      console.error("Gagal mengirim data ke Google Sheets:", err);
    }
  }
};
