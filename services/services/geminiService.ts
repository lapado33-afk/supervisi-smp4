import { GoogleGenAI } from "@google/genai";

export const generateCoachingAdvice = async (notes: string, focusId: string) => {
  try {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      return "Error: API Key Gemini belum dikonfigurasi di Environment Variables Vercel.";
    }

    const ai = new GoogleGenAI({ apiKey });
    
    // Mapping focusId ke teks deskriptif
    const focusMap: Record<string, string> = {
      '1': 'Manajemen Kelas (Suasana interaktif & menyenangkan)',
      '2': 'Kualitas Instruksi (Pengalaman memahami & mengaplikasi)',
      '3': 'Refleksi Pembelajaran (Evaluasi hasil belajar)'
    };

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `
        Bertindaklah sebagai Kepala Sekolah yang profesional. Berikan umpan balik coaching alur TIRTA.
        DATA OBSERVASI:
        - Catatan Fakta: "${notes}"
        - Fokus Utama: "${focusMap[focusId] || 'Umum'}"
        
        Gunakan Bahasa Indonesia yang hangat dan motivatif. Berikan langkah konkret untuk perbaikan.
      `,
    });

    return response.text || "Gagal mendapatkan saran dari AI.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Maaf, terjadi kendala saat menghubungi AI. Silakan gunakan umpan balik manual berdasarkan catatan observasi.";
  }
};
