export default function BigramListCard({ bigrams }: { bigrams: any[] }) {
  return (
    <div className="bg-white border border-stone-200/80 p-6 rounded-3xl shadow-[0_4px_25px_rgba(0,0,0,0.01)] text-stone-800">
      <h3 className="text-stone-950 font-syne font-black mb-6 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-orange-500 shadow-[0_0_6px_#f97316]"></span>
        Top 15 Bigrams
      </h3>
      <div className="space-y-3">
        {bigrams.map((item, index) => (
          <div key={index} className="flex items-center justify-between p-3 rounded-xl bg-stone-50 border border-stone-100 hover:border-orange-500/20 hover:bg-white transition-all group">
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-black text-stone-500 bg-stone-200/60 w-5 h-5 flex items-center justify-center rounded-md">
                {index + 1}
              </span>
              <span className="text-stone-700 font-bold group-hover:text-orange-600 transition-colors">
                {item.word}
              </span>
            </div>
            <span className="text-xs font-black text-orange-600 bg-orange-50 px-2.5 py-0.5 border border-orange-100 rounded-md">
              {item.count} <span className="text-[10px] opacity-60">x</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
