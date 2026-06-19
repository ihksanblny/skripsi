export default function TopicResultCard({ topik }: { topik: { id: number, label: string, words: string } }) {
  return (
    <div className="flex flex-col gap-1 group relative">
      <div className="flex justify-between items-end mb-1 px-1">
        <p className="text-orange-600 font-bold text-[10px] uppercase tracking-widest">Topik {topik.id}</p>
        <p className="text-emerald-700 font-black text-[10px] uppercase tracking-tighter bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
            Label: {topik.label}
        </p>
      </div>
      <div className="bg-stone-50 border border-stone-200 px-5 py-4 rounded-xl group-hover:border-orange-500/20 group-hover:bg-white transition-all shadow-sm">
        <p className="text-stone-600 font-mono text-xs leading-relaxed tracking-wide italic font-medium">
          {topik.words}
        </p>
      </div>
    </div>
  );
}
