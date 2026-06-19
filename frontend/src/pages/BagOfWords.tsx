import { useDashboard } from '../hooks/useDashboard';
import { useState } from 'react';
import axios from 'axios';

export default function BagOfWordsView() {
  const { nlpStats } = useDashboard();
  const [bowData, setBowData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const fetchBow = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://127.0.0.1:8000/api/bow');
      setBowData(res.data);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  return (
    <div className="w-full max-w-4xl flex flex-col gap-6 animate-in fade-in zoom-in-95 duration-300 mx-auto text-stone-800">
      
      {/* Welcome Banner */}
      <div className="bg-white border border-stone-200 text-center py-4 rounded-[2rem] shadow-[0_4px_25px_rgba(0,0,0,0.01)]">
        <h2 className="text-orange-600 font-syne font-black tracking-[0.3em] uppercase text-[11px]">Welcome Admin</h2>
      </div>

      <div className="bg-white border border-stone-200/80 px-6 py-4 rounded-3xl shadow-sm text-center">
        <h3 className="text-stone-950 font-syne font-black text-lg">Bag-of-Words Representation</h3>
      </div>

      {/* Info Stats */}
      <div className="bg-white border border-stone-200/80 p-8 rounded-[2rem] shadow-sm">
        <h4 className="text-orange-600 font-syne font-black mb-6 text-xs uppercase tracking-widest">Informasi setelah preprocessing</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3 font-semibold">
            <p className="text-stone-500 text-sm flex justify-between">
               <span>Jumlah Dokumen :</span>
               <span className="text-stone-900 font-black">{nlpStats.jumlah_dokumen} Coffeeshop</span>
            </p>
            <p className="text-stone-500 text-sm flex justify-between">
               <span>Total Vocabulary :</span>
               <span className="text-stone-900 font-black">{nlpStats.vocabulary.toLocaleString()} kata unik</span>
            </p>
          </div>
          <div className="space-y-3 font-semibold">
            <p className="text-stone-500 text-sm flex justify-between">
               <span>Total Token :</span>
               <span className="text-stone-900 font-black">{nlpStats.total_token.toLocaleString()} kata</span>
            </p>
            <p className="text-stone-500 text-sm flex justify-between">
               <span>Metode Representasi :</span>
               <span className="text-emerald-600 font-black">Bag-of-Words (TF)</span>
            </p>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-stone-200">
          <button 
            onClick={fetchBow}
            disabled={loading || !nlpStats.is_ready}
            className={`px-8 py-3 rounded-xl font-bold transition-all text-xs uppercase tracking-wider ${
              loading || !nlpStats.is_ready
              ? 'bg-stone-100 text-stone-400 cursor-not-allowed border border-stone-200'
              : 'bg-orange-500 hover:bg-orange-600 text-white shadow-[0_4px_15px_rgba(249,115,22,0.15)]'
            }`}
          >
            {loading ? 'Building Matrix...' : 'Bangun Bag-of-Words'}
          </button>
        </div>
      </div>

      {/* Preview Matrix */}
      {bowData && (
        <div className="bg-white border border-stone-200/80 p-8 rounded-[2rem] shadow-sm animate-in slide-in-from-bottom-4 duration-500">
          <h4 className="text-stone-950 font-syne font-black mb-6 text-sm">
            Preview Document-Term-Matrix
          </h4>
          
          <div className="overflow-x-auto rounded-2xl border border-stone-200 shadow-inner">
            <table className="w-full text-left text-xs sm:text-sm text-stone-600">
              <thead className="bg-stone-50 text-stone-700 font-bold border-b border-stone-200">
                <tr>
                  <th className="p-4">Dokumen</th>
                  {bowData.headers.map((h: string) => (
                    <th key={h} className="p-4 font-mono text-orange-600 font-bold">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 font-medium">
                {bowData.data.map((row: any, i: number) => (
                  <tr key={i} className="hover:bg-stone-50 transition-colors">
                    <td className="p-4 text-stone-850 font-bold">{row.shop}</td>
                    {bowData.headers.map((h: string) => (
                      <td key={h} className="p-4 text-center">
                        {row[h] > 0 ? (
                          <span className="bg-emerald-50 text-emerald-600 border border-emerald-100 px-2 py-0.5 rounded-md text-xs font-bold">
                             {row[h]}
                          </span>
                        ) : (
                          <span className="text-stone-300">0</span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="mt-8 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl">
             <p className="text-emerald-700 text-xs font-bold mb-1">Status: Matriks Bag-of-Words berhasil dibentuk</p>
             <p className="text-stone-400 text-[10px] font-semibold">Data siap untuk pemodelan topik menggunakan algoritma Latent Dirichlet Allocation (LDA).</p>
          </div>
        </div>
      )}

    </div>
  );
}
