import { GoogleGenAI } from "@google/genai";

// Fungsi untuk inisialisasi AI secara aman
const getAIClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.warn("API_KEY tidak ditemukan di environment variables.");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const generateCoachingAdvice = async (notes: string, focus: string) => {
  try {
    const ai = getAIClient();
    if (!ai) {
      return "Konfigurasi AI belum lengkap (API Key kosong). Mohon hubungi admin.";
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `
        Bertindaklah sebagai Kepala Sekolah yang profesional dan suportif sesuai Panduan Pengelolaan Kinerja 2025.
        Tugas Anda adalah memberikan umpan balik coaching untuk guru berdasarkan hasil observasi kelas.
        
        DATA OBSERVASI:
        - Catatan Fakta: "${notes}"
        - Fokus Utama: "${focus}"
        
        PRINSIP UTAMA:
        1. Berkesadaran (Motivasi & Mandiri)
        2. Bermakna (Konteks Nyata)
        3. Menggembirakan (Positif & Menyenangkan)
        
        INSTRUKSI OUTPUT:
        - Gunakan Alur TIRTA.
        - Nada bicara harus "Coaching" (menggali potensi).
        - Gunakan Bahasa Indonesia yang formal dan hangat.
      `,
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Maaf, sistem AI sedang padat. Silakan berikan umpan balik manual berdasarkan prinsip Standar Proses: Berkesadaran, Bermakna, dan Menggembirakan.";
  }
};
