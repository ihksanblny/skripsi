export default function BigramChartCard({ bigrams }: { bigrams: any[] }) {
  if (!bigrams || bigrams.length === 0) return null;

  return (
    <div className="lg:col-span-2 bg-white border border-stone-200/80 p-8 rounded-3xl shadow-[0_4px_25px_rgba(0,0,0,0.01)] flex flex-col text-stone-800">
      <h3 className="text-stone-950 font-syne font-black mb-8 text-lg">Frequency Distribution</h3>
      
      <div className="flex-1 flex flex-col justify-between gap-4">
        {bigrams.slice(0, 10).map((item, index) => (
          <div key={index} className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold mb-1">
                <span className="text-stone-500 truncate">{item.word.toUpperCase()}</span>
                <span className="text-orange-600">{item.count} Occurrences</span>
              </div>
              <div className="w-full h-2.5 bg-stone-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-orange-500 to-amber-400 rounded-full shadow-[0_0_10px_rgba(249,115,22,0.1)] transition-all duration-1000"
                  style={{ width: `${(item.count / bigrams[0].count) * 100}%` }}
                ></div>
              </div>
          </div>
        ))}
      </div>

      <div className="mt-8 p-4 bg-orange-50/50 border border-orange-100 rounded-2xl flex items-center gap-4">
        <span className="text-2xl">💡</span>
        <p className="text-[11px] text-stone-500 font-semibold leading-relaxed">
            Pasangan kata di atas merupakan kombinasi yang paling sering muncul setelah tahap normalisasi. 
            Ini akan membantu algoritma LDA menentukan korelasi antar-topik pada tahap pemodelan berikutnya.
        </p>
      </div>
    </div>
  );
}
