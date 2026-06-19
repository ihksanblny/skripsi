interface PreprocessingCardProps {
  loadingProcess: boolean;
  fileName: string;
  totalData: number;
  nlpStats: {
    jumlah_dokumen: number;
    total_token: number;
    vocabulary: number;
    is_ready: boolean;
  };
  handlePreprocess: (mode: 'fast' | 'full') => void;
}

export default function PreprocessingCard({ loadingProcess, fileName, totalData, nlpStats, handlePreprocess }: PreprocessingCardProps) {
  return (
    <div className="flex flex-col gap-6 text-stone-800">

      {/* PANEL 1: DATASET INFO & ACTION */}
      <div className="bg-white border border-stone-200/80 p-8 rounded-[2rem] shadow-[0_4px_25px_rgba(0,0,0,0.01)] relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
          <span className="text-6xl">📊</span>
        </div>

        <div className="space-y-4 mb-8">
          <div className="flex items-center gap-3 text-sm">
            <span className="text-stone-500 font-bold">Dataset :</span>
            <span className="text-orange-700 font-black tracking-wide font-mono bg-orange-50 px-3 py-1 rounded-lg border border-orange-100">
              {fileName}
            </span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <span className="text-stone-500 font-bold">Jumlah :</span>
            <span className="text-stone-950 font-black tracking-tight">
              {totalData.toLocaleString()} <span className="text-stone-400 text-xs font-semibold ml-1">ulasan</span>
            </span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 max-w-xl">
          <button
            onClick={() => handlePreprocess('fast')}
            disabled={loadingProcess}
            className={`flex-1 py-3.5 rounded-xl font-bold flex items-center justify-center gap-3 transition-all ${loadingProcess
              ? 'bg-stone-100 text-stone-400 cursor-not-allowed'
              : 'bg-stone-100 hover:bg-stone-200 text-stone-800'
              }`}
          >
            {loadingProcess ? (
              <><span className="animate-spin text-lg">⚙️</span> Processing...</>
            ) : (
              <><span className="text-lg">⚡</span> Testing(Fast)</>
            )}
          </button>

          <button
            onClick={() => handlePreprocess('full')}
            disabled={loadingProcess}
            className={`flex-1 py-3.5 rounded-xl font-bold flex items-center justify-center gap-3 transition-all ${loadingProcess
              ? 'bg-stone-100 text-stone-400 cursor-not-allowed'
              : 'bg-orange-500 hover:bg-orange-600 text-white shadow-[0_4px_15px_rgba(249,115,22,0.15)]'
              }`}
          >
            {loadingProcess ? (
              <><span className="animate-spin text-lg">⚙️</span> Multi-Threading...</>
            ) : (
              <><span className="text-lg">🚀</span> Jalankan Sastrawi</>
            )}
          </button>
        </div>
      </div>

      {/* PANEL 2: PIPELINE DETAILS */}
      <div className="bg-white border border-stone-200/80 p-8 rounded-[2rem] shadow-[0_4px_25px_rgba(0,0,0,0.01)]">
        <h3 className="text-stone-950 font-syne font-black text-lg mb-6 flex items-center gap-2 border-b border-stone-100 pb-4">
          Tahapan Proses:
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
          <ul className="space-y-4">
            {[
              { id: 1, name: "Case Folding" },
              { id: 2, name: "Text Cleaning" },
              { id: 3, name: "Tokenization" },
              { id: 4, name: "Stopword Removal" },
              { id: 5, name: "Normalization" },
              { id: 6, name: "Stemming" },
            ].map(step => (
              <li key={step.id} className="flex items-center gap-3 text-stone-600 font-bold group">
                <span className={`flex items-center justify-center w-5 h-5 rounded-full ${nlpStats.is_ready ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 'bg-stone-100 text-stone-400'} text-[10px] font-black group-hover:scale-110 transition-transform`}>
                  {nlpStats.is_ready ? '✓' : '•'}
                </span>
                {step.name}
              </li>
            ))}
          </ul>

          <div className="space-y-4 pt-2">
            <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200/60 space-y-3 shadow-inner">
              <p className="text-stone-500 text-xs font-bold flex justify-between">
                <span>Jumlah Dokumen :</span>
                <span className="text-stone-900 font-black">{nlpStats.jumlah_dokumen} <span className="font-semibold text-stone-400">coffeeshop</span></span>
              </p>
              <p className="text-stone-500 text-xs font-bold flex justify-between">
                <span>Total Token :</span>
                <span className="text-stone-900 font-black">{nlpStats.total_token.toLocaleString()} <span className="font-semibold text-stone-400">kata</span></span>
              </p>
              <p className="text-stone-500 text-xs font-bold flex justify-between border-b border-stone-200 pb-3">
                <span>Vocabulary :</span>
                <span className="text-stone-900 font-black">{nlpStats.vocabulary.toLocaleString()} <span className="font-semibold text-stone-400">kata unik</span></span>
              </p>
              <p className={`${nlpStats.is_ready ? 'text-orange-600' : 'text-stone-400'} text-xs font-black uppercase tracking-wider flex items-center gap-2 pt-1 transition-colors duration-500`}>
                <span className={`w-1.5 h-1.5 rounded-full ${nlpStats.is_ready ? 'bg-orange-500 animate-pulse' : 'bg-stone-400'}`}></span>
                {nlpStats.is_ready ? 'Dataset Siap untuk Pembentukan Bag-of-Words' : 'Menunggu Proses Sastrawi Selesai...'}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-stone-100">
          <p className="text-[11px] text-stone-400 leading-relaxed italic font-medium">
            Ulasan dari setiap coffeeshop digabung menjadi satu dokumen representatif
            untuk proses pemodelan topik melalui agregasi teks per-tempat.
          </p>
        </div>
      </div>

    </div>
  );
}
