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
    // Initializing with process.env.API_KEY as per hard requirement
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const focusMap: Record<string, string> = {
      'instruksi': 'Kualitas Instruksi (Penjelasan terstruktur & pengaktifan kognitif)',
      'disiplin': 'Pengelolaan Kelas (Disiplin positif & restitusi)',
      'umpan_balik': 'Umpan Balik Konstruktif (Harapan tinggi & tantangan bermakna)',
      'perhatian_kepedulian': 'Perhatian dan Kepedulian (Dukungan emosional & kebutuhan murid)'
    };

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `
        Bertindaklah sebagai Desainer Pembelajaran Mendalam (Deep Learning Designer) yang berperan sebagai Kepala Sekolah profesional yang hangat. 
        Berikan umpan balik coaching dengan alur TIRTA berdasarkan data observasi berikut:
        
        DATA TEMUAN: "${notes}"
        FOKUS PENGEMBANGAN: "${focusMap[focusId] || 'Umum'}"
        
        ATURAN FORMAT (WAJIB):
        1. JANGAN GUNAKAN simbol markdown seperti bintang (* atau **), pagar (#), atau bullet point strip (-).
        2. Gunakan Bahasa Indonesia formal tapi sangat memotivasi.
        3. Sajikan dalam paragraf bersih. Gunakan penomoran angka biasa (1. 2. 3.) jika diperlukan.
        4. Teks harus terasa personal, seolah-olah sedang berbicara langsung dalam sesi coaching yang nyaman.
        5. DILARANG menggunakan istilah "Profil Pelajar Pancasila". Jika relevan, gunakan istilah "8 Dimensi Profil Lulusan".
      `,
    });

    const rawText = response.text || "";
    return cleanMarkdown(rawText);
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Terjadi kendala teknis saat menghubungi AI. Silakan coba beberapa saat lagi.";
  }
};
