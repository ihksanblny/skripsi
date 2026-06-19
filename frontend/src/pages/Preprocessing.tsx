import { useDashboard } from '../hooks/useDashboard';
import Alert from '../components/Alert';
import PreprocessingCard from '../components/card/PreprocessingCard';

export default function PreprocessingView() {
  const { loadingProcess, notification, fileName, totalData, nlpStats, handlePreprocess } = useDashboard();

  return (
    <div className="w-full max-w-4xl flex flex-col gap-6 animate-in fade-in zoom-in-95 duration-300 mx-auto text-stone-800">

      {/* Jika ada alert (sukses/gagal) dari API */}
      <Alert message={notification} />

      {/* Welcome Banner */}
      <div className="bg-white border border-stone-200 text-center py-4 rounded-[2rem] shadow-[0_4px_25px_rgba(0,0,0,0.01)]">
        <h2 className="text-orange-600 font-syne font-black tracking-[0.3em] uppercase text-[11px]">Welcome Admin</h2>
      </div>

      {/* Judul Halaman */}
      <div className="bg-white border border-stone-200/80 px-6 py-4 rounded-3xl shadow-sm">
        <h3 className="text-stone-950 font-syne font-black text-lg tracking-tight">Preprocessing Teks untuk Pemodelan Topik</h3>
      </div>

      {/* Komponen Utama */}
      <PreprocessingCard
        loadingProcess={loadingProcess}
        fileName={fileName}
        totalData={totalData}
        nlpStats={nlpStats}
        handlePreprocess={handlePreprocess}
      />

    </div>
  );
}
