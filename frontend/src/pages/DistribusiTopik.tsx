import { useState, useEffect } from 'react';
import axios from 'axios';
import { useDashboard } from '../hooks/useDashboard';

export default function DistribusiTopikView() {
  const { nlpStats, ldaDistribution } = useDashboard();
  
  const [distributionData, setDistributionData] = useState<any[]>([]);
  const [selectedShop, setSelectedShop] = useState<any>(null);
  const [numTopics, setNumTopics] = useState(5);
  const [topicLabels, setTopicLabels] = useState<Record<string, string>>({
    T1: "Suasana Kafe & Kualitas Penyajian",
    T2: "Konsep Keunikan & Menu Minuman",
    T3: "Fasilitas Kerja (WFC) & Kenyamanan Tempat",
    T4: "Fasilitas Pendukung & Area Berkumpul",
    T5: "Daya Tarik Ambience & Menu Dessert",
    T6: "Sistem Pemesanan & Menu Makanan Berat"
  });

  useEffect(() => {
     const fetchInitial = async () => {
          try {
             // Selalu prioritaskan hasil training terakhir, jika tidak ada baru ambil default data pertama
             const targetTopics = ldaDistribution?.num_topics || 5;
             const res = await axios.get(`http://127.0.0.1:8000/api/lda-distribution?num_topics=${targetTopics}`);
             
             setNumTopics(res.data.num_topics);
             setDistributionData(res.data.distribution);
             
             if (res.data.hasil_topik) {
                 const labels: Record<string, string> = {};
                 res.data.hasil_topik.forEach((item: any) => {
                     labels[`T${item.id}`] = item.label;
                 });
                 setTopicLabels(labels);
             }
             
             if (res.data.distribution.length > 0) setSelectedShop(res.data.distribution[0]);
          } catch (e) {
             console.error("Gagal ambil data awal:", e);
          }
     }

     // Jika ada update dari global state (habis klik Train), langsung pakai itu saja tanpa fetch lagi
     if (ldaDistribution) {
          setNumTopics(ldaDistribution.num_topics);
          setDistributionData(ldaDistribution.distribution);
          
          if (ldaDistribution.hasil_topik) {
              const labels: Record<string, string> = {};
              ldaDistribution.hasil_topik.forEach((item: any) => {
                  labels[`T${item.id}`] = item.label;
              });
              setTopicLabels(labels);
          }
          
          if (ldaDistribution.distribution.length > 0) {
              setSelectedShop(ldaDistribution.distribution[0]);
          }
     } else {
          // Hanya dijalankan sekali saat pertama kali buka page jika belum pernah klik Train
          fetchInitial();
     }
  }, [ldaDistribution]);

  return (
    <div className="w-full max-w-5xl flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700 mx-auto pb-24 text-stone-800">
      
      {/* Welcome Banner */}
      <div className="bg-white border border-stone-200 py-5 rounded-[2rem] shadow-[0_4px_25px_rgba(0,0,0,0.01)] text-center relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 via-transparent to-amber-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
        <h2 className="text-orange-600 font-syne font-black tracking-[0.3em] uppercase text-[11px] relative z-10">
          Admin Command Center
        </h2>
      </div>

      {/* Main Container */}
      <div className="bg-white border border-stone-200/80 rounded-[2.5rem] overflow-hidden shadow-[0_10px_50px_rgba(0,0,0,0.02)] p-8 sm:p-10">
        
        {/* Header Title */}
        <div className="border-b border-stone-100 pb-6 mb-8">
           <h3 className="text-stone-950 font-syne font-black tracking-tight text-2xl mb-1">Distribusi Topik Kafe</h3>
           <p className="text-stone-400 text-xs font-semibold">Analisis probabilitas topik untuk setiap dokumen (coffeeshop)</p>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
            
            {/* Kiri: Informasi Model */}
            <div className="md:w-1/3">
                <div className="bg-orange-50/50 border border-orange-100 rounded-2xl p-6 h-full">
                    <h4 className="text-orange-600 font-syne font-black tracking-widest uppercase text-[11px] mb-4 border-b border-orange-100 pb-2">Informasi Model</h4>
                    <div className="space-y-4 text-xs font-bold">
                        <div className="flex justify-between items-center">
                            <span className="text-stone-500">Model:</span>
                            <span className="text-stone-900 bg-white px-2 py-1 rounded-lg border border-stone-200/60">LDA</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-stone-500">Topik Terbentuk:</span>
                            <span className="text-stone-900 bg-white px-2 py-1 rounded-lg border border-stone-200/60">{numTopics} Topik</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-stone-500">Total Dokumen:</span>
                            <span className="text-stone-900 bg-white px-2 py-1 rounded-lg border border-stone-200/60">{distributionData.length > 0 ? distributionData.length : nlpStats.jumlah_dokumen} Kafe</span>
                        </div>
                    </div>

                    <div className="mt-8">
                        <h4 className="text-stone-800 font-syne font-black tracking-widest uppercase text-[10px] mb-3">Legenda Label Topik:</h4>
                        <div className="space-y-2">
                             {Object.entries(topicLabels).map(([key, value]) => (
                                 <div key={key} className="flex items-center gap-2.5 text-xs font-medium">
                                     <span className="bg-stone-100 text-stone-700 px-2 py-0.5 rounded font-mono text-[10px] font-black">{key}</span>
                                     <span className="text-stone-500 italic">{value}</span>
                                 </div>
                             ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Kanan: Tabel Distribusi */}
            <div className="md:w-2/3 flex flex-col gap-6">
                
                {/* Table Section */}
                <div className="bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-sm relative">
                    <div className="overflow-x-auto overflow-y-auto max-h-[320px] scrollbar-thin scrollbar-thumb-stone-200 scrollbar-track-stone-50">
                        <table className="w-full text-left text-xs sm:text-sm">
                            <thead className="bg-stone-50 text-stone-600 font-black text-[11px] uppercase tracking-wider sticky top-0 z-10 border-b border-stone-200">
                                <tr>
                                    <th className="px-6 py-4 whitespace-nowrap">Coffeeshop</th>
                                    {distributionData.length > 0 && 
                                        Object.keys(distributionData[0].scores).sort((a,b) => {
                                            const numA = parseInt(a.replace('T', ''));
                                            const numB = parseInt(b.replace('T', ''));
                                            return numA - numB;
                                        }).map((topicKey) => (
                                            <th key={topicKey} className="px-4 py-4 text-center">{topicKey}</th>
                                        ))
                                    }
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-stone-100 text-stone-600 font-medium">
                                {distributionData.map((item) => {
                                    const sortedTopicKeys = Object.keys(item.scores).sort((a,b) => {
                                        const numA = parseInt(a.replace('T', ''));
                                        const numB = parseInt(b.replace('T', ''));
                                        return numA - numB;
                                    });

                                    const isSelected = selectedShop?.id === item.id;

                                    return (
                                        <tr 
                                            key={item.id} 
                                            onClick={() => setSelectedShop(item)}
                                            className={`cursor-pointer transition-all duration-300 ${isSelected ? 'bg-orange-50/50 border-l-2 border-l-orange-500' : 'hover:bg-stone-50 border-l-2 border-l-transparent'}`}
                                        >
                                            <td className="px-6 py-4 font-bold flex items-center gap-3 whitespace-nowrap">
                                                {isSelected ? (
                                                    <div className="w-2 h-2 rounded-full bg-orange-500 shadow-[0_0_6px_rgba(249,115,22,0.5)] animate-pulse"></div>
                                                ) : (
                                                    <div className="w-2 h-2 rounded-full bg-stone-300"></div>
                                                )}
                                                <span className={isSelected ? 'text-stone-900' : ''}>{item.shop}</span>
                                            </td>
                                            {sortedTopicKeys.map((topicKey) => (
                                                <td key={`${item.id}-${topicKey}`} className={`px-4 py-4 text-center font-mono text-xs ${isSelected ? 'text-orange-600 font-bold' : ''}`}>
                                                    {item.scores[topicKey]}
                                                </td>
                                            ))}
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Profil Topik Bar Chart */}
                {selectedShop && (
                <div className="bg-stone-50/50 border border-stone-200 rounded-2xl p-6 shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-500">
                    <h4 className="text-stone-950 font-syne font-black mb-6 flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-stone-200/60 pb-4 text-sm">
                        <span>Detail Profil: <span className="text-orange-600">{selectedShop.shop}</span></span>
                        <span className="text-[10px] bg-white border border-stone-200/60 px-2 py-1 rounded-md text-stone-500 font-mono tracking-widest uppercase font-black">
                            Distribusi Probabilitas Dokumen
                        </span>
                    </h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                       {Array.from({length: numTopics}, (_, i) => `T${i+1}`).map((t) => {
                           const score = selectedShop.scores?.[t] || 0;
                           const percentage = Math.round(score * 100);
                           const label = topicLabels[t] || "Topik General";
                           
                           return (
                               <div key={t} className="space-y-1.5 group">
                                   <div className="flex justify-between text-xs">
                                       <span className="text-stone-600 font-bold group-hover:text-stone-950 transition-colors">
                                           <span className="text-orange-500 mr-2 font-black">{t}</span> 
                                           {label}
                                       </span>
                                       <span className="text-stone-950 font-mono font-bold">{percentage}%</span>
                                   </div>
                                   <div className="w-full bg-stone-200/60 rounded-full h-2 overflow-hidden">
                                       <div 
                                          className="bg-gradient-to-r from-orange-500 via-orange-400 to-amber-400 h-full rounded-full transition-all duration-1000 ease-out"
                                          style={{ width: `${percentage}%` }}
                                       ></div>
                                   </div>
                               </div>
                           );
                       })}
                    </div>
                </div>
                )}

            </div>

        </div>

        {/* Footer Status */}
        <div className="mt-10 pt-6 border-t border-stone-100 flex items-center gap-3">
             <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]"></div>
             <p className="text-stone-500 text-sm font-semibold">
                 Status : <span className="text-stone-900 font-black">Distribusi topik siap digunakan untuk sistem rekomendasi</span>
             </p>
        </div>

      </div>
    </div>
  );
}
