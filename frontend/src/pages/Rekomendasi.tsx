import { useState, useEffect } from 'react';
import axios from 'axios';
import { useDashboard } from '../hooks/useDashboard';

export default function RekomendasiView() {
  const { ldaDistribution } = useDashboard();
  
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // States untuk menampung hasil rekomendasi dari API
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [queryDistribution, setQueryDistribution] = useState<Record<string, number>>({});
  const [cleanQuery, setCleanQuery] = useState('');
  const [topicLabels, setTopicLabels] = useState<Record<string, string>>({
    T1: "Suasana Kafe & Kualitas Penyajian",
    T2: "Konsep Keunikan & Menu Minuman",
    T3: "Fasilitas Kerja (WFC) & Kenyamanan Tempat",
    T4: "Fasilitas Pendukung & Area Berkumpul",
    T5: "Daya Tarik Ambience & Menu Dessert",
    T6: "Sistem Pemesanan & Menu Makanan Berat"
  });

  // Sync nama-nama topik dinamis dari model terakhir jika sudah di-train
  useEffect(() => {
    if (ldaDistribution?.hasil_topik) {
      const labels: Record<string, string> = {};
      ldaDistribution.hasil_topik.forEach((item: any) => {
        labels[`T${item.id}`] = item.label;
      });
      setTopicLabels(labels);
    } else {
      // Coba fetch nama topik dari model tersimpan secara background saat load pertama kali
      const loadSavedLabels = async () => {
        try {
          const res = await axios.get('http://127.0.0.1:8000/api/lda-distribution');
          if (res.data.hasil_topik) {
            const labels: Record<string, string> = {};
            res.data.hasil_topik.forEach((item: any) => {
              labels[`T${item.id}`] = item.label;
            });
            setTopicLabels(labels);
          }
        } catch (e) {
          console.error("Gagal load label tersimpan:", e);
        }
      };
      loadSavedLabels();
    }
  }, [ldaDistribution]);

  const handleRecommend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const res = await axios.get(`http://127.0.0.1:8000/api/recommend`, {
        params: {
          query: query,
          top_n: 5
        }
      });

      if (res.data.error) {
        setError(res.data.error);
        setRecommendations([]);
        setQueryDistribution({});
      } else {
        setRecommendations(res.data.recommendations || []);
        setQueryDistribution(res.data.query_distribution || {});
        setCleanQuery(res.data.clean_query || '');
        
        // Update label topik dari hasil response recommend jika ada
        if (res.data.hasil_topik && res.data.hasil_topik.length > 0) {
          const labels: Record<string, string> = {};
          res.data.hasil_topik.forEach((item: any) => {
            labels[`T${item.id}`] = item.label;
          });
          setTopicLabels(labels);
        }
      }
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.error || 'Gagal memproses rekomendasi. Pastikan model LDA sudah dilatih.');
      setRecommendations([]);
      setQueryDistribution({});
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full relative min-h-[calc(100vh-10rem)] bg-white text-stone-900 rounded-2xl sm:rounded-3xl border border-stone-100 shadow-[0_10px_50px_rgba(0,0,0,0.03)] px-4 sm:px-8 md:px-12 py-6 sm:py-10 overflow-hidden">
      {/* Background warm soft glowing accent */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] sm:w-[500px] h-[350px] sm:h-[500px] bg-gradient-to-tr from-orange-500/5 to-amber-400/10 blur-[100px] rounded-full pointer-events-none z-0"></div>

      <div className="relative z-10 space-y-8">
        
        {/* Header Section */}
        <div className="border-b border-stone-100 pb-5">
          <h3 className="font-syne font-black text-xl sm:text-3xl text-stone-950 tracking-tight flex flex-col sm:flex-row sm:items-center gap-2">
             <span>Cari Rekomendasi Kedai Kopi</span>
             <span className="w-fit text-[10px] font-black uppercase tracking-widest bg-orange-100 text-orange-600 px-3 py-1 rounded-full border border-orange-200">
               Pencarian Cerdas
             </span>
          </h3>
          <p className="text-stone-400 text-xs sm:text-[13px] font-medium mt-1">Temukan coffeeshop terbaik di Malang berdasarkan preferensi ulasan teks kebutuhan Anda</p>
        </div>

        {/* Input Kebutuhan */}
        <div className="bg-stone-50 border border-stone-200/80 rounded-2xl p-4 sm:p-6 md:p-8 shadow-sm">
          <form onSubmit={handleRecommend} className="space-y-4">
            <div className="flex flex-col gap-2.5">
              <label htmlFor="queryInput" className="text-stone-800 text-xs sm:text-sm font-bold flex items-center gap-2">
                <svg className="w-5 h-5 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                Tulis ulasan impian atau kebutuhan tempat kopi Anda
              </label>
              <textarea
                id="queryInput"
                className="w-full bg-white border border-stone-200 focus:border-orange-500/50 rounded-xl px-4 py-3.5 text-stone-900 placeholder-stone-400 text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-orange-500/10 transition-all resize-none h-24 font-medium"
                placeholder="Contoh: mau ngerjain tugas kuliah yang sepi tenang wifi kenceng banget sama banyak colokan buat ngecas terus kopinya enak manis ramah di kantong..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>

            <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-2">
              <p className="text-stone-400 text-[11px] font-medium leading-relaxed max-w-lg text-left">
                💡 <span className="text-stone-500 font-extrabold">Tips ulasan:</span> Anda bebas menceritakan preferensi seperti ketenangan tempat, keramahan pelayan, rasa latte manis, kisaran harga murah, atau akses parkir luas.
              </p>
              
              <button
                type="submit"
                disabled={isLoading || !query.trim()}
                className="w-full md:w-auto bg-[#000000] hover:bg-stone-800 text-white font-extrabold text-xs uppercase tracking-widest px-8 py-4 rounded-xl transition-all shadow-[0_4px_20px_rgba(0,0,0,0.1)] flex items-center justify-center gap-2.5 disabled:opacity-50 disabled:cursor-not-allowed group active:scale-95 shrink-0"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Menganalisis...
                  </>
                ) : (
                  <>
                    <svg className="w-3.5 h-3.5 transition-transform group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    Temukan Tempat Kopi
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Error Notification */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-600 rounded-2xl p-4 text-xs font-bold shadow-sm flex items-center gap-3 animate-in fade-in zoom-in-95 duration-300">
            <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {/* Results Block */}
        {Object.keys(queryDistribution).length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-left animate-in fade-in slide-in-from-bottom-4 duration-700">
            
            {/* Kiri: Hasil Ekstraksi Query */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* Hasil Parsing Teks */}
              <div className="bg-stone-50 border border-stone-200/80 rounded-2xl p-6 shadow-sm">
                <h4 className="font-syne font-black text-stone-900 text-sm mb-4 flex items-center gap-2 border-b border-stone-200/50 pb-2.5">
                  <span className="text-orange-500">✦</span>
                  Penyaringan Kata Kunci
                </h4>
                <div className="space-y-4">
                  <div>
                    <span className="text-stone-400 text-[9px] uppercase font-black tracking-widest block mb-1.5">Kata Ulasan yang Dipakai</span>
                    <p className="text-stone-700 text-xs leading-relaxed font-mono bg-white p-3.5 rounded-xl border border-stone-200">
                      {cleanQuery || "Tidak ada kata ulasan valid."}
                    </p>
                  </div>
                </div>
              </div>

              {/* Distribusi Topik Query */}
              <div className="bg-stone-50 border border-stone-200/80 rounded-2xl p-6 shadow-sm">
                <h4 className="font-syne font-black text-stone-900 text-sm mb-4 flex items-center gap-2 border-b border-stone-200/50 pb-2.5">
                  <span className="text-orange-500">✦</span>
                  Kecocokan Kebutuhan
                </h4>
                
                <div className="space-y-4">
                  {Object.entries(queryDistribution).map(([topicId, score]) => {
                    const percentage = Math.round(score * 100);
                    const label = topicLabels[topicId] || "Topik General";

                    return (
                      <div key={topicId} className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="text-stone-600 font-bold">
                            <span className="text-orange-500 font-black mr-1">{topicId}</span> {label}
                          </span>
                          <span className="text-stone-900 font-mono font-bold">{percentage}%</span>
                        </div>
                        <div className="w-full bg-stone-200 rounded-full h-1.5 overflow-hidden">
                          <div 
                            className="bg-orange-500 h-full rounded-full transition-all duration-1000 ease-out"
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* Kanan: Rekomendasi Top 5 Coffeeshop */}
            <div className="lg:col-span-8 space-y-6">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-stone-100 pb-3 gap-1">
                <h4 className="font-syne font-black text-stone-900 text-sm sm:text-base flex items-center gap-2">
                  <span>📍</span>
                  Rekomendasi Kedai Kopi Paling Cocok
                </h4>
                <span className="text-[10px] text-stone-400 font-mono tracking-wider uppercase font-black">Method: Cosine Similarity</span>
              </div>

              {/* Info Note: Cara kerja skor */}
              {recommendations.length > 0 && (
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex gap-3">
                  <span className="text-amber-500 text-lg shrink-0 mt-0.5">💡</span>
                  <div className="space-y-1.5">
                    <p className="text-amber-800 font-black text-xs">Cara Membaca Skor Kecocokan</p>
                    <p className="text-amber-700 text-[11px] leading-relaxed">
                      Skor ini dihitung dari <strong>kemiripan semantik</strong> antara kebutuhan kamu dengan profil ulasan asli tiap kedai (menggunakan metode LDA + Cosine Similarity). 
                      Skor tidak selalu mendekati 100% — justru skor yang <strong>lebih tinggi dari kedai lain</strong> menunjukkan kedai tersebut <strong>paling relevan</strong> dengan kebutuhanmu.
                    </p>
                    <p className="text-amber-600 text-[10px] leading-relaxed font-mono">
                      ✦ Query spesifik (1 aspek) → skor tinggi &nbsp;|&nbsp; Query luas (banyak aspek) → skor lebih merata dan rendah — ini wajar &amp; normal.
                    </p>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                {recommendations.length === 0 ? (
                  <div className="bg-stone-50 border border-stone-200 rounded-2xl p-8 text-center text-stone-400 text-xs">
                    Tidak ditemukan kecocokan coffeeshop yang sesuai.
                  </div>
                ) : (
                  recommendations.map((rec, index) => {
                    const matchPercent = (rec.similarity * 100).toFixed(2);
                    
                    return (
                      <div 
                        key={rec.shop}
                        className="bg-white border border-stone-200/80 hover:border-orange-500/40 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden group"
                      >
                        {/* Orange marker line on hover */}
                        <div className="absolute top-0 bottom-0 left-0 w-1 bg-orange-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2.5">
                              <span className="w-6 h-6 rounded-lg bg-orange-50 text-orange-600 font-black text-xs flex items-center justify-center border border-orange-100">
                                {index + 1}
                              </span>
                              <h5 className="text-stone-950 font-syne font-black group-hover:text-orange-600 transition-colors text-base">{rec.shop}</h5>
                            </div>
                            <p className="text-stone-400 text-[11px] font-semibold pl-8">Kota Malang, Jawa Timur</p>
                          </div>

                          <div className="sm:text-right shrink-0">
                            <span className="inline-flex items-center gap-1.5 bg-orange-100 text-orange-600 text-xs px-3 py-1.5 rounded-full border border-orange-200 font-black">
                               {matchPercent}% Skor Kecocokan
                            </span>
                          </div>
                        </div>

                        {/* Detail distribusi topik kafe yang direkomendasikan */}
                        <div className="mt-4 pt-4 border-t border-stone-100 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 pl-0 sm:pl-8">
                          {Object.entries(rec.scores).map(([topicId, score]: any) => {
                            const percent = Math.round(score * 100);
                            const label = topicLabels[topicId] || "Topik General";
                            
                            return (
                              <div key={topicId} className="space-y-1">
                                <span className="text-stone-400 text-[9px] font-black uppercase tracking-wider block truncate" title={label}>
                                  {label}
                                </span>
                                <div className="flex items-center gap-2">
                                  <div className="flex-1 bg-stone-100 rounded-full h-1 overflow-hidden">
                                    <div 
                                      className="bg-orange-500 h-full rounded-full"
                                      style={{ width: `${percent}%` }}
                                    ></div>
                                  </div>
                                  <span className="text-stone-500 font-mono text-[9px] font-bold shrink-0">{percent}%</span>
                                </div>
                              </div>
                            );
                          })}
                        </div>

                      </div>
                    );
                  })
                )}
              </div>

            </div>

          </div>
        )}

        {/* Empty/Instruction State */}
        {Object.keys(queryDistribution).length === 0 && !isLoading && !error && (
          <div className="bg-stone-50 border border-stone-200/80 rounded-2xl p-12 text-center text-stone-400 space-y-4 shadow-inner">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center border border-stone-200 mx-auto text-stone-400 shadow-sm">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <div className="space-y-2 max-w-md mx-auto">
              <h4 className="text-stone-800 font-syne font-black text-sm">Belum Ada Pencarian</h4>
              <p className="text-stone-400 text-xs leading-relaxed font-medium">
                Tuliskan preferensi Anda di kolom pencarian di atas untuk memetakan ulasan real-time kami ke kedai kopi Malang pilihan Anda.
              </p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
