import { useState, useEffect } from 'react';

interface UserNavbarProps {
  userTab: string;
  setUserTab: (tab: string) => void;
  setViewMode: (mode: 'user' | 'admin') => void;
}

export default function UserNavbar({ userTab, setUserTab, setViewMode }: UserNavbarProps) {
  const [username, setUsername] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('user_username');
    setUsername(stored || null);
    const storedRole = localStorage.getItem('user_role');
    setRole(storedRole);
  }, [userTab]);

  const navigate = (tab: string) => {
    setUserTab(tab);
    setMobileMenuOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('user_username');
    localStorage.removeItem('user_email');
    localStorage.removeItem('user_role');
    setUsername(null);
    setRole(null);
    setUserTab('home');
    setMobileMenuOpen(false);
  };

  return (
    <>
      <header className="w-full bg-[#f9f9fb] border-b border-stone-200/60 sticky top-0 z-50 py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 flex items-center justify-between h-14">

          {/* Logo */}
          <div onClick={() => navigate('home')} className="flex items-center gap-2 cursor-pointer">
            <span className="font-syne font-black text-xl text-stone-950 tracking-tight">
              CoffeeFinder<span className="text-orange-500">.</span>
            </span>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-4 text-xs font-bold text-stone-600">
            {[
              { tab: 'home', label: 'Home' },
              { tab: 'daftar-kafe', label: 'Kedai Kopi' },
              { tab: 'rekomendasi', label: 'Rekomendasi' },
            ].map((item, i) => (
              <div key={item.tab} className="flex items-center gap-4">
                {i > 0 && <span className="text-stone-300 font-light">/</span>}
                <button
                  onClick={() => navigate(item.tab)}
                  className={`transition-colors hover:text-stone-950 ${
                    userTab === item.tab ? 'text-stone-950 underline underline-offset-4 decoration-2 decoration-orange-500' : ''
                  }`}
                >
                  {item.label}
                </button>
              </div>
            ))}
          </nav>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center gap-4">
            {username ? (
              <div className="flex items-center gap-3 bg-stone-100 border border-stone-200 px-3 py-1.5 rounded-full">
                <span className="text-xs text-stone-700 font-bold">
                  Hi, <span className="text-orange-600 font-black">{username}</span>
                </span>
                <button
                  onClick={handleLogout}
                  className="text-stone-400 hover:text-red-500 transition-colors text-[10px] font-black uppercase tracking-wider border-l border-stone-200 pl-3"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1 text-xs font-bold">
                <button
                  onClick={() => navigate('login')}
                  className="px-4 py-2 text-stone-600 hover:text-stone-950 transition-colors rounded-lg"
                >
                  Sign In
                </button>
                <button
                  onClick={() => navigate('register')}
                  className="px-4 py-2 bg-stone-950 hover:bg-stone-800 text-white rounded-lg transition-all active:scale-95"
                >
                  Register
                </button>
              </div>
            )}
            {role === 'admin' && (
              <button
                onClick={() => setViewMode('admin')}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold bg-stone-100 hover:bg-stone-200 border border-stone-200 text-stone-800 transition-all active:scale-95"
              >
                <svg className="w-3.5 h-3.5 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Dashboard Admin
              </button>
            )}
          </div>

          {/* Mobile: greeting + hamburger */}
          <div className="flex md:hidden items-center gap-3">
            {username && (
              <span className="text-[11px] text-orange-600 font-black">Hi, {username.split(' ')[0]}</span>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="w-9 h-9 flex flex-col items-center justify-center gap-1.5 rounded-xl bg-stone-100 border border-stone-200 active:scale-95 transition-all"
              aria-label="Toggle menu"
            >
              <span
                className="block h-0.5 bg-stone-700 rounded-full transition-all duration-300"
                style={{ width: '18px', transform: mobileMenuOpen ? 'rotate(45deg) translateY(8px)' : 'none' }}
              />
              <span
                className="block h-0.5 bg-stone-700 rounded-full transition-all duration-300"
                style={{ width: '18px', opacity: mobileMenuOpen ? 0 : 1 }}
              />
              <span
                className="block h-0.5 bg-stone-700 rounded-full transition-all duration-300"
                style={{ width: '18px', transform: mobileMenuOpen ? 'rotate(-45deg) translateY(-8px)' : 'none' }}
              />
            </button>
          </div>

        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm md:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="fixed top-0 right-0 bottom-0 z-50 w-72 bg-white shadow-2xl flex flex-col md:hidden">

            {/* Drawer Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-stone-100">
              <span className="font-syne font-black text-stone-950">
                CoffeeFinder<span className="text-orange-500">.</span>
              </span>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="w-8 h-8 rounded-lg bg-stone-100 flex items-center justify-center text-stone-500"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Nav Links */}
            <nav className="flex flex-col p-4 gap-1.5 flex-1">
              {[
                { tab: 'home', label: 'Home', icon: '🏠' },
                { tab: 'daftar-kafe', label: 'Kedai Kopi', icon: '☕' },
                { tab: 'rekomendasi', label: 'Rekomendasi', icon: '🔍' },
              ].map(item => (
                <button
                  key={item.tab}
                  onClick={() => navigate(item.tab)}
                  className={`flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-bold text-left transition-all ${
                    userTab === item.tab
                      ? 'bg-orange-50 text-orange-600 border border-orange-200'
                      : 'text-stone-700 hover:bg-stone-50 border border-transparent'
                  }`}
                >
                  <span>{item.icon}</span>
                  {item.label}
                  {userTab === item.tab && (
                    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-orange-500" />
                  )}
                </button>
              ))}

              {role === 'admin' && (
                <button
                  onClick={() => { setViewMode('admin'); setMobileMenuOpen(false); }}
                  className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-bold text-left text-stone-700 hover:bg-stone-50 border border-transparent transition-all mt-2"
                >
                  <span>⚙️</span>
                  Dashboard Admin
                </button>
              )}
            </nav>

            {/* Auth Section */}
            <div className="p-4 border-t border-stone-100">
              {username ? (
                <div className="space-y-3">
                  <div className="bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-black text-sm">
                      {username[0].toUpperCase()}
                    </div>
                    <div>
                      <p className="text-xs font-black text-stone-900">{username}</p>
                      <p className="text-[10px] text-stone-400 font-semibold capitalize">{role || 'user'}</p>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full py-3 rounded-xl text-xs font-black text-red-500 border border-red-200 bg-red-50 hover:bg-red-100 transition-all active:scale-95"
                  >
                    Keluar Akun
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <button
                    onClick={() => navigate('login')}
                    className="w-full py-3 rounded-xl text-xs font-bold text-stone-700 border border-stone-200 hover:bg-stone-50 transition-all active:scale-95"
                  >
                    Masuk (Sign In)
                  </button>
                  <button
                    onClick={() => navigate('register')}
                    className="w-full py-3 rounded-xl text-xs font-black text-white bg-stone-950 hover:bg-stone-800 transition-all active:scale-95"
                  >
                    Daftar Sekarang
                  </button>
                </div>
              )}
            </div>

          </div>
        </>
      )}
    </>
  );
}
