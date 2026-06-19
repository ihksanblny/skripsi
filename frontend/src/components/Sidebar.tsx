interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  setViewMode?: (mode: 'user' | 'admin') => void;
}

export default function Sidebar({ activeTab, setActiveTab, setViewMode }: SidebarProps) {
  // Ultra-Premium Minimalist Light Theme menu styling with warm orange/amber accents
  const getMenuClass = (tabName: string) => {
    return activeTab === tabName
      ? "flex items-center gap-3 px-3.5 py-2.5 bg-orange-50/50 text-orange-600 shadow-[inset_3px_0_0_#f97316] rounded-lg text-[13px] font-black transition-all relative cursor-pointer"
      : "flex items-center gap-3 px-3.5 py-2.5 text-stone-500 hover:bg-stone-50 hover:text-stone-900 rounded-lg text-[13px] font-bold transition-all cursor-pointer border border-transparent"
  }

  return (
    <aside className="w-[260px] bg-white border-r border-stone-200/80 hidden md:flex flex-col h-full shrink-0 relative z-20 shadow-[4px_0_25px_rgba(0,0,0,0.01)] overflow-hidden text-stone-800">

      {/* Ambient Soft Gold Glow */}
      <div className="absolute top-0 left-0 w-full h-32 bg-orange-500/[0.02] blur-[80px] pointer-events-none"></div>

      <div className="p-6 border-b border-stone-100 mb-4 relative z-10 flex flex-col gap-2">
        <h2 className="text-[1.1rem] font-syne font-black tracking-tight text-stone-950">
          Dashboard Admin
        </h2>
        {setViewMode && (
          <button
            onClick={() => setViewMode('user')}
            className="mt-2 w-full flex items-center justify-center gap-2 py-2 rounded-xl text-[11px] font-black uppercase tracking-wider bg-stone-900 text-white hover:bg-orange-500 hover:text-white transition-all shadow-sm"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Kembali ke Home
          </button>
        )}
      </div>

      <nav className="flex-1 px-4 py-2 flex flex-col gap-1 relative z-10 overflow-y-auto">

        {/* Menu 0: Dashboard Home */}
        <div onClick={() => setActiveTab('home')} className={getMenuClass('home')}>
          <svg className={`w-4 h-4 ${activeTab === 'home' ? 'text-orange-500' : 'text-stone-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
          Dashboard Home
        </div>

        {/* Menu 1 */}
        <div onClick={() => setActiveTab('upload')} className={getMenuClass('upload')}>
          <svg className={`w-4 h-4 ${activeTab === 'upload' ? 'text-orange-500' : 'text-stone-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
          Upload Dataset
        </div>

        {/* Menu 2 */}
        <div onClick={() => setActiveTab('preprocessing')} className={getMenuClass('preprocessing')}>
          <svg className={`w-4 h-4 ${activeTab === 'preprocessing' ? 'text-orange-500' : 'text-stone-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
          Pre-Processing
        </div>

        {/* Menu 3 (Bigram) */}
        <div onClick={() => setActiveTab('bigram')} className={getMenuClass('bigram')}>
          <svg className={`w-4 h-4 ${activeTab === 'bigram' ? 'text-orange-500' : 'text-stone-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" /></svg>
          Bigram
        </div>

        {/* Menu 4 */}
        <div onClick={() => setActiveTab('bow')} className={getMenuClass('bow')}>
          <svg className={`w-4 h-4 ${activeTab === 'bow' ? 'text-orange-500' : 'text-stone-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" /></svg>
          Bag-of-Words
        </div>

        {/* Menu 5 */}
        <div onClick={() => setActiveTab('pemodelan')} className={getMenuClass('pemodelan')}>
          <svg className={`w-4 h-4 ${activeTab === 'pemodelan' ? 'text-orange-500' : 'text-stone-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
          Pemodelan Topik
        </div>

        {/* Menu 6 */}
        <div onClick={() => setActiveTab('distribusi')} className={getMenuClass('distribusi')}>
          <svg className={`w-4 h-4 ${activeTab === 'distribusi' ? 'text-orange-500' : 'text-stone-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" /></svg>
          Distribusi Topik
        </div>

        {/* Menu 7 */}
        <div onClick={() => setActiveTab('rekomendasi')} className={getMenuClass('rekomendasi')}>
          <svg className={`w-4 h-4 ${activeTab === 'rekomendasi' ? 'text-orange-500' : 'text-stone-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          Sistem Rekomendasi
        </div>
      </nav>

      {/* Profil/Versi */}
      <div className="p-4 border-t border-stone-100 bg-stone-50/80 relative z-10 w-full mb-2">
        <div className="flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-stone-100 transition-colors cursor-pointer">
          <div className="w-9 h-9 rounded-full bg-stone-900 text-white flex items-center justify-center text-xs font-black shadow-sm ring-1 ring-stone-250">IH</div>
          <div className="flex-1">
            <p className="text-[13px] font-black text-stone-900 leading-tight">Admin</p>
          </div>
        </div>
      </div>
    </aside>
  );
}