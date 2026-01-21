import { GoogleGenAI } from "@google/genai";

/**
 * Fungsi untuk membersihkan teks dari simbol Markdown agar terlihat seperti ketikan formal
 */
const cleanMarkdown = (text: string) => {
  return text
    .replace(/\*\*/g, "") // Hapus bold (**)
    .replace(/\*/g, "")  // Hapus italic/bullet (*)
    .replace(/#/g, "")   // Hapus header (#)
    .replace(/__/g, "")  // Hapus underline (__)
    .replace(/`/g, "")   // Hapus backtick (`)
    .trim();
};

export const generateCoachingAdvice = async (notes: string, focusId: string) => {
  try {
    const apiKey = process.env.API_KEY || "";
    
    if (!apiKey) {
      console.warn("API Key Gemini tidak ditemukan.");
      return "Catatan: API Key belum dikonfigurasi.";
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
        Bertindaklah sebagai Kepala Sekolah profesional. 
        Berikan umpan balik coaching dengan alur TIRTA berdasarkan data ini:
        
        DATA OBSERVASI:
        - Temuan: "${notes}"
        - Fokus: "${focusMap[focusId] || 'Umum'}"
        
        ATURAN FORMAT (PENTING):
        1. JANGAN GUNAKAN simbol markdown seperti bintang (* atau **), pagar (#), atau bullet point strip (-).
        2. Gunakan Bahasa Indonesia formal dan hangat.
        3. Sajikan dalam paragraf bersih. Jika butuh penomoran, gunakan angka biasa (1. 2. 3.) tanpa simbol tambahan.
        4. Pastikan teks terlihat seperti isi surat resmi.
      `,
    });

    const rawText = response.text || "";
    return cleanMarkdown(rawText);
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Terjadi kendala teknis saat menghubungi AI.";
  }
};
