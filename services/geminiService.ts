import { GoogleGenAI } from "@google/genai";

/**
 * Fungsi untuk membersihkan teks dari simbol Markdown agar terlihat seperti ketikan formal
 */
const cleanMarkdown = (text: string) => {
  if (!text) return "";
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
    // Selalu inisialisasi instance baru dengan process.env.API_KEY sesuai panduan
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const focusMap: Record<string, string> = {
      'instruksi': 'Kualitas Instruksi (Penjelasan terstruktur & pengaktifan kognitif)',
      'disiplin': 'Pengelolaan Kelas (Disiplin positif & restitusi)',
      'umpan_balik': 'Umpan Balik Konstruktif (Harapan tinggi & tantangan bermakna)',
      'perhatian_kepedulian': 'Perhatian dan Kepedulian (Dukungan emosional & kebutuhan murid)'
    };

    const prompt = `
      Anda adalah Desainer Pembelajaran Mendalam (Deep Learning Designer) yang berperan sebagai Kepala Sekolah profesional yang sangat suportif. 
      Berikan umpan balik coaching dengan alur TIRTA (Tujuan, Identifikasi, Rencana, Tindak Lanjut) berdasarkan data observasi berikut:
      
      DATA TEMUAN OBSERVASI: "${notes}"
      FOKUS PENGEMBANGAN: "${focusMap[focusId] || 'Umum'}"
      
      ATURAN FORMAT (WAJIB):
      1. DILARANG KERAS menggunakan simbol markdown seperti bintang (* atau **), pagar (#), atau bullet point strip (-).
      2. Gunakan Bahasa Indonesia formal yang menyentuh hati dan memotivasi.
      3. Sajikan dalam bentuk paragraf bersih yang mengalir. Gunakan penomoran angka biasa (1. 2. 3.) jika sangat diperlukan.
      4. Sapa guru dengan hangat. Teks harus terasa seperti percakapan coaching langsung yang memberdayakan.
      5. DILARANG menggunakan istilah "Profil Pelajar Pancasila". GANTI dengan istilah "8 Dimensi Profil Lulusan".
    `;

    // Menggunakan format contents sebagai string sederhana sesuai dokumentasi terbaru
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt.trim(),
      config: {
        thinkingConfig: { thinkingBudget: 0 },
        temperature: 0.7,
        topP: 0.95,
      },
    });

    // Mengambil teks secara langsung dari property .text (bukan method)
    const rawText = response.text || "";
    if (!rawText) throw new Error("Respon AI kosong.");
    
    return cleanMarkdown(rawText);
  } catch (error: any) {
    console.error("Gemini API Error Detail:", error);
    // Mengembalikan pesan error yang ramah jika terjadi kegagalan
    return "Maaf, sistem AI sedang sibuk atau terdapat kendala pada konfigurasi API. Silakan coba klik tombol 'Saran AI' sekali lagi atau masukkan umpan balik secara manual berdasarkan hasil refleksi.";
  }
};
