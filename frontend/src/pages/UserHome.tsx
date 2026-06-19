interface UserHomeProps {
  setUserTab: (tab: string) => void;
}

export default function UserHome({ setUserTab }: UserHomeProps) {
  return (
    <div className="w-full relative bg-white text-stone-900 rounded-2xl sm:rounded-3xl border border-stone-100 shadow-[0_10px_50px_rgba(0,0,0,0.03)] overflow-hidden" style={{ minHeight: 'calc(100vh - 10rem)' }}>

      {/* ── Top Section ── */}
      <div className="relative pt-8 px-6 sm:px-10 md:px-20 z-10">
        {/* Star + Subheading */}
        <div className="flex items-center gap-3 mb-3">
          <span className="text-stone-800 text-lg select-none">✦</span>
          <span className="text-orange-500 font-extrabold uppercase tracking-widest text-[9px] sm:text-xs">
            Pure Recommendation Nothing Extra
          </span>
        </div>

        {/* Giant title */}
        <h1
          className="font-syne font-black text-[#0a0a0a] leading-[0.88] tracking-tight select-none"
          style={{ fontSize: 'clamp(2.8rem, 10vw, 8rem)' }}
        >
          ColdBrew
        </h1>
        <p className="font-syne font-bold text-stone-300 text-xs sm:text-lg tracking-widest uppercase mt-2 pl-0.5">
          Malang Coffee Finder
        </p>
      </div>

      {/* ── Image section ── */}
      <div className="relative" style={{ height: 'clamp(200px, 35vw, 380px)' }}>
        {/* Warm glow */}
        <div
          className="absolute left-1/2 -translate-x-1/2 bottom-0 w-[200px] sm:w-[300px] h-[200px] sm:h-[300px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(ellipse, rgba(251,191,36,0.25) 0%, rgba(249,115,22,0.12) 50%, transparent 75%)', filter: 'blur(40px)' }}
        />
        <img
          src="/cold_brew_hero1.png"
          alt="Cold Brew"
          className="absolute left-1/2 -translate-x-1/2 bottom-0 object-contain pointer-events-none select-none"
          style={{ height: 'clamp(260px, 50vw, 540px)', zIndex: 5, mixBlendMode: 'multiply' }}
          onError={(e) => { e.currentTarget.style.display = 'none'; }}
        />
      </div>

      {/* ── Bottom Row ── */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-5 px-6 sm:px-10 md:px-20 pb-8 pt-4">

        {/* Left: description + CTA */}
        <div className="lg:col-span-1 flex flex-col justify-end space-y-4">
          <p className="text-stone-500 text-xs sm:text-[13px] leading-relaxed font-medium max-w-xs">
            Malang CoffeeFinder — coffee recommendation steeped in real user opinions, mapped into distinct topics, and measured with cosine similarity.
          </p>
          <button
            onClick={() => setUserTab('rekomendasi')}
            className="w-full sm:w-fit px-8 py-3.5 rounded-lg bg-[#0a0a0a] hover:bg-stone-700 text-white font-extrabold text-xs uppercase tracking-widest transition-all shadow-[0_4px_25px_rgba(0,0,0,0.15)] hover:scale-105 active:scale-95"
          >
            Search Now
          </button>
        </div>

        {/* Center spacer */}
        <div className="hidden lg:block lg:col-span-1" />

        {/* Right: feature pills */}
        <div className="lg:col-span-1 flex flex-col space-y-3 justify-end">
          {[
            {
              icon: (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              ),
              title: '6-Topic Focus',
              desc: 'Cozy, Price, Cleanliness',
            },
            {
              icon: (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              ),
              title: 'NLP Clean',
              desc: 'Stopwords & Stemmed',
            },
            {
              icon: (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              ),
              title: 'Match Scoring',
              desc: 'Cosine Similarity',
            },
          ].map((f) => (
            <div key={f.title} className="flex items-center gap-3 p-3 rounded-xl bg-stone-50 border border-stone-100/80">
              <div className="w-8 h-8 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center shrink-0 border border-orange-100/50">
                {f.icon}
              </div>
              <div>
                <h5 className="text-[12px] font-black text-stone-900">{f.title}</h5>
                <p className="text-[10px] text-stone-400 font-semibold">{f.desc}</p>
              </div>
            </div>
          ))}

          <div className="pt-2 border-t border-stone-100 flex items-baseline justify-between select-none">
            <span className="text-[9px] text-stone-400 uppercase font-black tracking-widest">Similarity Match</span>
            <span className="text-xl font-syne font-black text-stone-950">100%</span>
          </div>
        </div>
      </div>

      {/* Decorative background text */}
      <div className="absolute right-0 bottom-0 font-syne text-[5rem] sm:text-[10rem] text-stone-100/40 uppercase font-black tracking-tight select-none pointer-events-none z-0 leading-none">
        BoldBrew
      </div>

    </div>
  );
}
