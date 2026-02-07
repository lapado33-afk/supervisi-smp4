
import { ObservationData } from '../types';

/**
 * Penyimpanan Terintegrasi (Cloud + Local Fallback).
 * 1. Deploy Code.gs di Apps Script sebagai Web App.
 * 2. Masukkan URL hasil deploy (Web App URL) ke variabel di bawah ini.
 */
const WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbx8Pl4ex3PEr0byzG8x9H4wQ3y4CIiKK4Ew5ynI9M5KN6uU1A4p6Oufs-MIBkSJwUZp/exec'; 

export const cloudStorage = {
  async fetchAll(): Promise<ObservationData[]> {
    // 1. Coba ambil dari Cloud Spreadsheet jika URL tersedia
    if (WEB_APP_URL) {
      try {
        const response = await fetch(`${WEB_APP_URL}?action=getObservations`);
        if (response.ok) {
          const data = await response.json();
          // Sync ke Local Storage sebagai backup/cache
          localStorage.setItem('supervision_data', JSON.stringify(data));
          return Array.isArray(data) ? data : [];
        }
      } catch (err) {
        console.warn("Koneksi Cloud gagal atau URL salah, menggunakan data lokal:", err);
      }
    }

    // 2. Fallback ke Local Storage jika cloud gagal atau URL kosong
    try {
      const saved = localStorage.getItem('supervision_data');
      const data = saved ? JSON.parse(saved) : [];
      return Array.isArray(data) ? data : [];
    } catch (err) {
      console.error("Gagal memuat data lokal:", err);
      return [];
    }
  },

  async save(data: ObservationData): Promise<void> {
    // 1. Simpan di Local Storage (Penyimpanan Utama Cepat)
    try {
      const saved = localStorage.getItem('supervision_data');
      const observations = saved ? JSON.parse(saved) : [];
      const updated = [
        ...observations.filter((o: any) => o.teacherId !== data.teacherId),
        data
      ];
      localStorage.setItem('supervision_data', JSON.stringify(updated));
    } catch (err) {
      console.error("Gagal menyimpan data lokal:", err);
    }

    // 2. Kirim ke Google Spreadsheet jika URL tersedia
    if (WEB_APP_URL) {
      try {
        // Menggunakan mode no-cors jika perlu, tapi apps script biasanya butuh redirect
        // Fetch standar biasanya cukup jika Apps Script dideploy "Anyone"
        await fetch(WEB_APP_URL, {
          method: 'POST',
          mode: 'no-cors', // Apps script POST seringkali butuh ini karena redirect
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data)
        });
        console.log("Data dikirim ke antrean sinkronisasi Spreadsheet.");
      } catch (err) {
        console.warn("Gagal sinkronisasi ke Spreadsheet:", err);
      }
    }
  }
};
