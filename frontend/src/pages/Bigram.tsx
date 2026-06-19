import { useDashboard } from '../hooks/useDashboard';
import { useBigram } from '../hooks/useBigram';
import BigramListCard from '../components/card/BigramListCard';
import BigramChartCard from '../components/card/BigramChartCard';

export default function BigramView() {
  const { nlpStats } = useDashboard();
  const { bigrams, loading, fetchBigrams } = useBigram(nlpStats.is_ready);

  return (
    <div className="w-full max-w-5xl flex flex-col gap-6 animate-in fade-in zoom-in-95 duration-300 mx-auto text-stone-850">

      {/* Welcome Banner */}
      <div className="bg-white border border-stone-200 text-center py-4 rounded-[2rem] shadow-[0_4px_25px_rgba(0,0,0,0.01)]">
        <h2 className="text-orange-600 font-syne font-black tracking-[0.3em] uppercase text-[11px]">Welcome Admin</h2>
      </div>

      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-4 p-2">
        <div>
          <h2 className="text-3xl font-syne font-black text-stone-950 tracking-tight">Bigram Analysis</h2>
          <p className="text-stone-400 text-xs sm:text-sm font-semibold mt-1">Gaining insights from most frequent word pairs.</p>
        </div>
        <div className="bg-white border border-stone-200/80 px-4 py-2 rounded-2xl flex items-center gap-4 shadow-sm">
           <div className="text-right">
              <p className="text-[10px] text-stone-400 uppercase font-bold tracking-wider">Vocabulary</p>
              <p className="text-sm font-black text-orange-600">{nlpStats.vocabulary.toLocaleString()} Unique</p>
           </div>
           <div className="w-px h-8 bg-stone-200"></div>
           <button 
             onClick={fetchBigrams}
             disabled={loading}
             className="text-xs bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-xl font-bold transition-all shadow-[0_4px_15px_rgba(249,115,22,0.15)]"
           >
             {loading ? 'Refreshing...' : 'Refresh Bigrams'}
           </button>
        </div>
      </div>

      {!nlpStats.is_ready ? (
        <div className="bg-white border border-stone-200/80 p-12 rounded-[2rem] text-center shadow-sm">
           <span className="text-4xl mb-4 block">⏳</span>
           <h3 className="text-stone-950 font-syne font-black text-xl">Dataset Belum Siap</h3>
           <p className="text-stone-400 font-semibold mt-2 max-w-sm mx-auto text-sm">Silakan lakukan Pre-processing terlebih dahulu untuk melihat hasil analisis Bigram.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* List Visualization */}
          <div className="lg:col-span-1 flex flex-col gap-6">
             <BigramListCard bigrams={bigrams} />
          </div>

          {/* Chart/Visual Mock */}
          <BigramChartCard bigrams={bigrams} />
          
        </div>
      )}

    </div>
  );
}