import { GoogleGenAI } from "@google/genai";

export const generateCoachingAdvice = async (notes: string, focusId: string) => {
  try {
    // Di Vite/Vercel, kita mengambil dari process.env yang sudah didefinisikan di vite.config.ts
    const apiKey = process.env.API_KEY || "";
    
    if (!apiKey) {
      console.warn("API Key Gemini tidak ditemukan di Environment Variables.");
      return "Catatan: API Key belum dikonfigurasi di Vercel. Pastikan Anda sudah menambahkannya di Settings > Environment Variables.";
    }

    const ai = new GoogleGenAI({ apiKey });
    
    const focusMap: Record<string, string> = {
      '1': 'Manajemen Kelas (Suasana interaktif & menyenangkan)',
      '2': 'Kualitas Instruksi (Pengalaman memahami & mengaplikasi)',
      '3': 'Refleksi Pembelajaran (Evaluasi hasil belajar)'
    };

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `
        Bertindaklah sebagai Kepala Sekolah yang profesional dan suportif. 
        Berikan umpan balik coaching dengan alur TIRTA berdasarkan data berikut:
        
        DATA OBSERVASI:
        - Temuan di Kelas: "${notes}"
        - Fokus Kompetensi: "${focusMap[focusId] || 'Umum'}"
        
        Instruksi:
        1. Gunakan Bahasa Indonesia yang hangat, formal, dan motivatif.
        2. Berikan 3 langkah konkret yang bisa segera dipraktikkan guru.
        3. Pastikan saran relevan dengan paradigma Kurikulum Merdeka.
      `,
    });

    return response.text || "AI tidak memberikan respon. Silakan coba lagi.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Terjadi kendala teknis saat menghubungi AI. Gunakan catatan observasi manual untuk sesi coaching.";
  }
};
