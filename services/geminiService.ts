import { GoogleGenAI } from "@google/genai";

/**
 * Fungsi untuk membersihkan teks dari simbol-simbol teknis, markdown, 
 * dan karakter sisa format JSON agar menjadi narasi yang benar-benar bersih.
 */
const cleanMarkdown = (text: string) => {
  if (!text) return "";
  return text
    // Hapus karakter kurung, tanda kutip, dan simbol teknis lainnya
    .replace(/[\{\}\[\]\"\'\\<>|_^]/g, "") 
    // Hapus simbol markdown (bintang, pagar, gelombang, backtick)
    .replace(/[*#~`]/g, "")
    // Hapus tanda hubung di awal baris yang sering jadi bullet point
    .replace(/^\s*[-+]\s+/gm, "")
    // Rapikan spasi berlebih
    .replace(/\s+/g, " ")
    .trim();
};

export const generateCoachingAdvice = async (notes: string, focusId: string) => {
  try {
    // Selalu inisialisasi instance baru dengan process.env.API_KEY
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const focusMap: Record<string, string> = {
      'instruksi': 'Kualitas Instruksi (Penjelasan terstruktur & pengaktifan kognitif)',
      'disiplin': 'Pengelolaan Kelas (Disiplin positif & restitusi)',
      'umpan_balik': 'Umpan Balik Konstruktif (Harapan tinggi & tantangan bermakna)',
      'perhatian_kepedulian': 'Perhatian dan Kepedulian (Dukungan emosional & kebutuhan murid)'
    };

    const prompt = `
      PERAN: 
      Anda adalah "Desainer Pembelajaran Mendalam" (Deep Learning Designer).
      
      TUGAS:
      Berikan narasi umpan balik coaching alur TIRTA yang sangat bersih dan manusiawi.
      
      DATA OBSERVASI:
      "${notes}"
      
      FOKUS: 
      "${focusMap[focusId] || 'Umum'}"
      
      KONTROL OUTPUT (SANGAT KETAT):
      1. DILARANG KERAS menggunakan simbol: { } [ ] " ' : \ / * # _ .
      2. Tuliskan dalam bentuk PARAGRAF NARASI yang mengalir saja.
      3. JANGAN berikan judul, JANGAN gunakan bullet points atau penomoran.
      4. Gunakan Bahasa Indonesia formal yang menyentuh hati.
      5. Ganti istilah "Profil Pelajar Pancasila" menjadi "8 Dimensi Profil Lulusan".
      6. Output harus 100% teks polos tanpa kode atau format apa pun.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt.trim(),
      config: {
        thinkingConfig: { thinkingBudget: 0 },
        temperature: 0.7,
        topP: 0.8,
      },
    });

    const rawText = response.text || "";
    if (!rawText) throw new Error("Respon AI kosong.");
    
    return cleanMarkdown(rawText);
  } catch (error: any) {
    console.error("Gemini API Error Detail:", error);
    return "Maaf, sistem AI sedang sibuk. Silakan coba klik 'Saran AI' kembali atau isi manual.";
  }
};
