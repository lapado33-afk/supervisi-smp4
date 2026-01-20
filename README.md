
# Sistem Supervisi Akademik Digital - UPT SMPN 4 MAPPEDECENG

Aplikasi berbasis React & Google Gemini AI untuk mendigitalisasi siklus supervisi akademik di sekolah sesuai Kurikulum Merdeka.

## Cara Deploy ke Vercel:
1. Unggah kode ini ke Repository GitHub Anda.
2. Hubungkan GitHub ke Vercel.
3. Di Vercel Settings, tambahkan **Environment Variable**:
   - `API_KEY`: (Isi dengan API Key Gemini Anda)
4. Pastikan URL Web App di `services/sheetsService.ts` sudah sesuai dengan hasil Deploy Google Apps Script.

## Fitur:
- Pra-Observasi (Perencanaan)
- Observasi Kelas (Real-time Checklist)
- Pasca-Observasi (Coaching Alur TIRTA)
- Analisis AI (Saran perbaikan mengajar)
- Cetak Laporan (Format PDF Resmi)
