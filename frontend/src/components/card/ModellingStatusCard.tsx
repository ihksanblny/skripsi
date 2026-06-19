interface ModellingStatusCardProps {
  status: string;
  jumlahTopik: number;
  coherenceScore: string | number;
}

export default function ModellingStatusCard({
  status,
  jumlahTopik,
  coherenceScore
}: ModellingStatusCardProps) {
  return (
    <div className="bg-orange-50/50 border border-orange-100 p-6 rounded-2xl animate-in slide-in-from-left-4 duration-500 text-stone-800">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-bold text-sm">
        <p className="text-stone-600 flex items-center gap-3">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          Status : <span className="text-emerald-700 font-black">{status}</span>
        </p>
        <p className="text-stone-600">
          Topik Terbentuk : <span className="text-stone-900 font-black">{jumlahTopik}</span>
        </p>
        <p className="text-stone-600 underline decoration-orange-300 underline-offset-4">
          Coherence : <span className="text-orange-600 font-syne font-black text-xl ml-1">{coherenceScore}</span>
        </p>
      </div>
    </div>
  );
}
