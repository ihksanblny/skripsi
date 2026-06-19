import { useState } from 'react';
import axios from 'axios';

interface UserRegisterProps {
  setUserTab: (tab: string) => void;
}

export default function UserRegister({ setUserTab }: UserRegisterProps) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !email.trim() || !password.trim()) {
      setError('Harap lengkapi semua kolom!');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await axios.post('http://127.0.0.1:8000/api/register', {
        username: username.trim(),
        email: email.trim(),
        password: password
      });

      if (res.data.error) {
        setError(res.data.error);
      } else {
        setSuccess('Registrasi Berhasil! Silakan masuk dengan akun baru Anda...');
        setUsername('');
        setEmail('');
        setPassword('');
        
        setTimeout(() => {
          setUserTab('login');
        }, 1500);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.detail || 'Gagal membuat akun. Coba beberapa saat lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full relative min-h-[calc(100vh-14rem)] flex items-center justify-center py-6">
      {/* Background Soft Orange Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-orange-500/5 blur-[100px] rounded-full pointer-events-none"></div>

      <div className="bg-white border border-stone-200 rounded-3xl p-8 shadow-[0_10px_50px_rgba(0,0,0,0.04)] w-full max-w-md relative z-10 animate-in fade-in zoom-in-95 duration-500 text-stone-900">
        
        <div className="text-center space-y-2 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-600 border border-orange-100 flex items-center justify-center text-xl font-bold mx-auto">
            <svg className="w-5 h-5 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <h3 className="font-syne font-black text-2xl text-stone-950 tracking-tight">Daftar Baru</h3>
          <p className="text-stone-400 text-xs font-semibold">Buat akun untuk mulai mencari tempat ngopi terbaik</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/25 text-red-600 rounded-xl p-3.5 text-xs font-bold mb-5 flex items-center gap-2.5">
            <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="bg-emerald-500/10 border border-emerald-500/25 text-emerald-600 rounded-xl p-3.5 text-xs font-bold mb-5 flex items-center gap-2.5">
            <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-stone-700 text-xs font-bold block">Username</label>
            <input
              type="text"
              className="w-full bg-stone-50 border border-stone-200 focus:border-orange-500/50 rounded-xl px-4 py-3 text-stone-900 placeholder-stone-400 text-xs focus:outline-none focus:ring-1 focus:ring-orange-500/10 transition-all font-medium"
              placeholder="Username unik"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-stone-700 text-xs font-bold block">Alamat Email</label>
            <input
              type="email"
              className="w-full bg-stone-50 border border-stone-200 focus:border-orange-500/50 rounded-xl px-4 py-3 text-stone-900 placeholder-stone-400 text-xs focus:outline-none focus:ring-1 focus:ring-orange-500/10 transition-all font-medium"
              placeholder="nama@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-stone-700 text-xs font-bold block">Password</label>
            <input
              type="password"
              className="w-full bg-stone-50 border border-stone-200 focus:border-orange-500/50 rounded-xl px-4 py-3 text-stone-900 placeholder-stone-400 text-xs focus:outline-none focus:ring-1 focus:ring-orange-500/10 transition-all font-medium"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#000000] hover:bg-stone-800 text-white font-extrabold text-xs py-3.5 rounded-xl transition-all shadow-[0_4px_15px_rgba(0,0,0,0.1)] disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isLoading ? 'Membuat Akun...' : 'Daftar Sekarang'}
          </button>
        </form>

        <div className="text-center pt-6 text-[11px] text-stone-500 font-medium">
          Sudah punya akun?{' '}
          <span 
            onClick={() => setUserTab('login')}
            className="text-orange-600 font-extrabold hover:underline cursor-pointer"
          >
            Masuk Saja
          </span>
        </div>

      </div>
    </div>
  );
}
