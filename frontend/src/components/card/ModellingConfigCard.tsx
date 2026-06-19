interface ModellingConfigCardProps {
  numTopics: number;
  setNumTopics: (val: number) => void;
  iterations: number;
  setIterations: (val: number) => void;
  loading: boolean;
  nlpStatsReady: boolean;
  onRunLDA: () => void;
}

export default function ModellingConfigCard({
  numTopics,
  setNumTopics,
  iterations,
  setIterations,
  loading,
  nlpStatsReady,
  onRunLDA
}: ModellingConfigCardProps) {
  return (
    <div className="bg-orange-50/40 border border-orange-100 p-6 rounded-2xl text-stone-800">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">

        <div className="space-y-2">
          <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Metode</label>
          <div className="bg-white border border-stone-200 px-4 py-3 rounded-xl text-stone-900 font-bold text-sm">
            Latent Dirichlet Allocation
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Input Data</label>
          <div className="bg-white border border-stone-200 px-4 py-3 rounded-xl text-emerald-700 font-bold text-sm">
            Bag-of-Words Matrix
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black text-orange-600 uppercase tracking-widest">Jumlah Topik (K)</label>
          <input
            type="number"
            value={numTopics}
            onChange={(e) => setNumTopics(parseInt(e.target.value) || 0)}
            className="w-full bg-white border border-stone-200 px-4 py-3 rounded-xl text-stone-900 font-bold focus:ring-2 ring-orange-500/20 focus:outline-none transition-all focus:border-orange-500"
          />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black text-orange-600 uppercase tracking-widest">Jumlah Iterasi</label>
          <input
            type="number"
            value={iterations}
            onChange={(e) => setIterations(parseInt(e.target.value) || 0)}
            className="w-full bg-white border border-stone-200 px-4 py-3 rounded-xl text-stone-900 font-bold focus:ring-2 ring-orange-500/20 focus:outline-none transition-all focus:border-orange-500"
          />
        </div>

      </div>

      <div className="pt-8 flex justify-start">
        <button
          onClick={onRunLDA}
          disabled={loading || !nlpStatsReady}
          className={`px-8 py-3.5 rounded-2xl text-[12px] font-black uppercase tracking-widest transition-all ${loading || !nlpStatsReady
              ? 'bg-stone-100 text-stone-400 cursor-not-allowed border border-stone-200'
              : 'bg-orange-500 hover:bg-orange-600 text-white shadow-[0_4px_15px_rgba(249,115,22,0.15)] hover:scale-105 active:scale-95'
            }`}
        >
          {loading ? 'Processing Model...' : 'Jalankan Pemodelan'}
        </button>
      </div>
    </div>
  );
}
