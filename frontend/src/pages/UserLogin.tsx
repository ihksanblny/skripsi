import { useState } from 'react';
import axios from 'axios';

interface UserLoginProps {
  setUserTab: (tab: string) => void;
}

export default function UserLogin({ setUserTab }: UserLoginProps) {
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!usernameOrEmail.trim() || !password.trim()) {
      setError('Harap isi semua kolom!');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await axios.post('http://127.0.0.1:8000/api/login', {
        username_or_email: usernameOrEmail,
        password: password
      });

      if (res.data.error) {
        setError(res.data.error);
      } else {
        setSuccess('Login Berhasil! Mengalihkan ke Beranda...');
        localStorage.setItem('user_username', res.data.username);
        localStorage.setItem('user_email', res.data.email);
        localStorage.setItem('user_role_v2', res.data.role || 'user');
        
        setTimeout(() => {
          setUserTab('home');
        }, 1200);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.detail || 'Gagal terhubung ke backend server.');
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
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h3 className="font-syne font-black text-2xl text-stone-950 tracking-tight">Masuk Akun</h3>
          <p className="text-stone-400 text-xs font-semibold">Gunakan akun Anda untuk mengakses rekomendasi penuh</p>
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
            <svg className="w-4 h-4 shrink-0 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-stone-700 text-xs font-bold block">Username atau Email</label>
            <input
              type="text"
              className="w-full bg-stone-50 border border-stone-200 focus:border-orange-500/50 rounded-xl px-4 py-3 text-stone-900 placeholder-stone-400 text-xs focus:outline-none focus:ring-1 focus:ring-orange-500/10 transition-all font-medium"
              placeholder="Ketik username atau email"
              value={usernameOrEmail}
              onChange={(e) => setUsernameOrEmail(e.target.value)}
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
            {isLoading ? 'Memproses Masuk...' : 'Masuk Sekarang'}
          </button>
        </form>

        <div className="text-center pt-6 text-[11px] text-stone-500 font-medium">
          Belum punya akun?{' '}
          <span 
            onClick={() => setUserTab('register')}
            className="text-orange-600 font-extrabold hover:underline cursor-pointer"
          >
            Daftar Sekarang
          </span>
        </div>

      </div>
    </div>
  );
}
