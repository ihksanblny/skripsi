import { useDashboard } from '../hooks/useDashboard';
import { useLdaModel } from '../hooks/useLdaModel';
import TopicResultCard from '../components/card/TopicResultCard';
import ModellingConfigCard from '../components/card/ModellingConfigCard';
import ModellingStatusCard from '../components/card/ModellingStatusCard';

export default function PemodelanTopikView() {
  const { nlpStats, setLdaDistribution } = useDashboard();
  
  const {
    loading,
    ldaResult,
    numTopics,
    setNumTopics,
    iterations,
    setIterations,
    handleRunLDA
  } = useLdaModel(setLdaDistribution);

  return (
    <div className="w-full max-w-5xl flex flex-col gap-10 animate-in fade-in slide-in-from-bottom-4 duration-700 mx-auto pb-24 text-stone-800">

      {/* Welcome Banner */}
      <div className="bg-white border border-stone-200 text-center py-4 rounded-[2rem] shadow-[0_4px_25px_rgba(0,0,0,0.01)]">
        <h2 className="text-orange-600 font-syne font-black tracking-[0.3em] uppercase text-[11px]">Welcome Admin</h2>
      </div>

      <div className="bg-white border border-stone-200/80 rounded-[2.5rem] overflow-hidden shadow-[0_10px_50px_rgba(0,0,0,0.02)]">

        {/* Header Section */}
        <div className="relative bg-gradient-to-b from-stone-50 to-transparent pt-10 pb-8 text-center">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-px bg-gradient-to-r from-transparent via-orange-500/20 to-transparent"></div>
          <h3 className="text-stone-950 font-syne font-black tracking-tight text-2xl mb-1">Konfigurasi Pemodelan</h3>
          <p className="text-stone-400 text-xs font-semibold">Setup your LDA hyperparameters for topic extraction</p>
        </div>

        <div className="px-6 sm:px-10 pb-12 space-y-10">

          {/* KONFIGURASI PANEL */}
          <ModellingConfigCard
            numTopics={numTopics}
            setNumTopics={setNumTopics}
            iterations={iterations}
            setIterations={setIterations}
            loading={loading}
            nlpStatsReady={nlpStats.is_ready}
            onRunLDA={handleRunLDA}
          />

          {/* STATUS PANEL */}
          {ldaResult && (
            <ModellingStatusCard
              status={ldaResult.status}
              jumlahTopik={ldaResult.jumlah_topik}
              coherenceScore={ldaResult.coherence_score}
            />
          )}

          {/* HASIL PANEL */}
          {ldaResult && (
            <div className="bg-stone-50/50 border border-stone-200/80 p-6 sm:p-8 rounded-[2rem] space-y-6 shadow-inner">
              <h4 className="text-stone-950 font-syne font-black text-lg border-b border-stone-100 pb-4 flex items-center gap-2">
                <span className="text-2xl">📝</span> Hasil Topik Teridentifikasi
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {ldaResult.hasil_topik.map((topik: any) => (
                  <TopicResultCard key={topik.id} topik={topik} />
                ))}
              </div>
            </div>
          )}

        </div>
      </div>

      <div className="px-4 text-center">
        <p className="text-[10px] text-stone-400 font-semibold italic">
          *Model LDA menggunakan algoritma distribusi Dirichlet untuk mengekstrak topik tersembunyi dari matriks Bag-of-Words.
        </p>
      </div>

      <div className="px-4 text-center mt-2">
        <p className="text-[10px] text-stone-400 font-semibold italic">
          *Hasil pemodelan di atas didasarkan pada distribusi probabilitas kata di seluruh korpus teks coffeeshop yang telah melalui tahap normalisasi.
        </p>
      </div>

    </div>
  );
}