
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateCoachingAdvice = async (notes: string, focus: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `
        Bertindaklah sebagai Kepala Sekolah yang profesional dan suportif sesuai Panduan Pengelolaan Kinerja 2025.
        Tugas Anda adalah memberikan umpan balik coaching untuk guru berdasarkan hasil observasi kelas.
        
        DATA OBSERVASI:
        - Catatan Fakta: "${notes}"
        - Fokus Utama: "${focus}"
        
        PRINSIP UTAMA (Sesuai Standar Proses 2026):
        1. Berkesadaran (Motivasi & Mandiri)
        2. Bermakna (Konteks Nyata)
        3. Menggembirakan (Positif & Menyenangkan)
        
        INSTRUKSI OUTPUT:
        - Gunakan Alur TIRTA (Tujuan, Identifikasi, Rencana Aksi, Tanggung Jawab).
        - Nada bicara harus "Coaching" (menggali potensi), bukan "Supervisi" (menghukum).
        - Berikan apresiasi pada apa yang sudah berjalan baik.
        - Jika ada catatan perilaku negatif, ubah menjadi tantangan belajar untuk guru tersebut.
        - Gunakan Bahasa Indonesia yang formal, hangat, dan menginspirasi.
      `,
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Maaf, sistem AI sedang padat. Silakan berikan umpan balik manual berdasarkan prinsip Standar Proses: Berkesadaran, Bermakna, dan Menggembirakan.";
  }
};
