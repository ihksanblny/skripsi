import { useState, useEffect } from 'react';
import axios from 'axios';

interface KafeProfile {
  nama: string;
  total_ulasan: number;
  avg_rating: number;
  gmaps_url: string;
  foto_url: string;
}

// Emoji ikon kafe berdasarkan urutan — supaya tiap kartu punya "warna" berbeda
const CARD_ACCENTS = [
  'bg-orange-50 border-orange-200 text-orange-600',
  'bg-amber-50 border-amber-200 text-amber-600',
  'bg-stone-50 border-stone-200 text-stone-600',
  'bg-yellow-50 border-yellow-200 text-yellow-600',
  'bg-lime-50 border-lime-200 text-lime-700',
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`w-3 h-3 ${star <= Math.round(rating) ? 'text-orange-400' : 'text-stone-200'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export default function DaftarKafeView() {
  const [kafeList, setKafeList] = useState<KafeProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/daftar-kafe')
      .then(res => {
        setKafeList(res.data);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, []);

  const filtered = kafeList.filter(k =>
    k.nama.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-12">

      {/* Header Section */}
      <div className="text-center space-y-3 pt-4">
        <span className="inline-block text-[10px] font-black uppercase tracking-widest text-orange-500 bg-orange-50 border border-orange-200 px-3 py-1 rounded-full">
          Direktori Coffeeshop
        </span>
        <h1 className="font-syne font-black text-2xl sm:text-3xl text-stone-950">
          Daftar Coffeeshop Malang
        </h1>
        <p className="text-stone-500 text-sm max-w-xl mx-auto leading-relaxed">
          Berikut adalah <strong className="text-stone-700">{kafeList.length} coffeeshop</strong> di Kota Malang yang menjadi basis data rekomendasi kami.
          Setiap profil dibangun dari <strong className="text-stone-700">200 ulasan nyata</strong> pelanggan Google Maps.
        </p>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-3 gap-3 max-w-lg mx-auto">
        {[
          { label: 'Total Kedai', value: kafeList.length, icon: '☕' },
          { label: 'Total Ulasan', value: (kafeList.length * 200).toLocaleString(), icon: '💬' },
          { label: 'Kota', value: 'Malang', icon: '📍' },
        ].map(s => (
          <div key={s.label} className="bg-white border border-stone-200 rounded-xl sm:rounded-2xl p-3 sm:p-4 text-center shadow-sm">
            <div className="text-lg sm:text-xl mb-1">{s.icon}</div>
            <div className="font-syne font-black text-stone-950 text-sm sm:text-lg">{s.value}</div>
            <div className="text-[9px] sm:text-[10px] text-stone-400 font-bold uppercase tracking-wider">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Search Bar */}
      <div className="max-w-md mx-auto">
        <div className="relative">
          <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Cari nama kedai kopi..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white border border-stone-200 rounded-2xl text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all"
          />
        </div>
      </div>

      {/* Kafe Grid */}
      {isLoading ? (
        <div className="text-center py-20 text-stone-400 text-sm">
          <div className="text-2xl mb-2 animate-spin inline-block">⟳</div>
          <p>Memuat data kedai kopi...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-stone-400 text-sm">
          <div className="text-3xl mb-3">🔍</div>
          <p>Tidak ditemukan kedai kopi dengan nama "<strong>{searchQuery}</strong>"</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {filtered.map((kafe, index) => {
            const accentClass = CARD_ACCENTS[index % CARD_ACCENTS.length];
            return (
              <div
                key={kafe.nama}
                className="bg-white border border-stone-200/80 hover:border-orange-400/50 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 group flex flex-col overflow-hidden active:scale-[0.98]"
              >
                {/* Foto kafe */}
                <div className="h-36 relative overflow-hidden bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center">
                  {kafe.foto_url ? (
                    <img
                      src={kafe.foto_url}
                      alt={kafe.nama}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        const img = e.target as HTMLImageElement;
                        img.style.display = 'none';
                        img.parentElement!.querySelector('.foto-fallback')?.classList.remove('hidden');
                      }}
                    />
                  ) : null}
                  <div className={`foto-fallback ${kafe.foto_url ? 'hidden' : ''} absolute inset-0 flex items-center justify-center text-5xl`}>
                    ☕
                  </div>
                  {/* Badge nomor */}
                  <span className={`absolute top-2 left-2 text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border backdrop-blur-sm bg-white/80 ${accentClass}`}>
                    #{index + 1}
                  </span>
                </div>

                {/* Body kartu */}
                <div className="p-4 flex flex-col gap-3 flex-1">
                  <h3 className="font-syne font-black text-stone-950 text-sm leading-tight group-hover:text-orange-600 transition-colors line-clamp-2">
                    {kafe.nama}
                  </h3>

                  {/* Info row */}
                  <div className="space-y-2">
                  {/* Rating */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <StarRating rating={kafe.avg_rating} />
                      <span className="font-black text-stone-800 text-xs">{kafe.avg_rating.toFixed(1)}</span>
                    </div>
                    <span className="text-[10px] text-stone-400 font-mono">Google Maps</span>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-3 pt-1 border-t border-stone-100">
                    <div className="flex items-center gap-1.5 text-[11px] text-stone-500 font-bold">
                      <span className="text-orange-500">💬</span>
                      {kafe.total_ulasan.toLocaleString()} ulasan
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px] text-stone-500 font-bold">
                      <span>📍</span>
                      Kota Malang
                    </div>
                  </div>
                  </div>

                  {/* Footer: link GMaps */}
                  <a
                    href={kafe.gmaps_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-auto flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-stone-600 text-xs font-black hover:bg-orange-500 hover:text-white hover:border-orange-500 transition-all active:scale-95"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Lihat di Google Maps
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Footer note */}
      <p className="text-center text-[11px] text-stone-400 font-mono">
        Data diperbarui berdasarkan ulasan Google Maps yang dikumpulkan pada periode penelitian skripsi 2025–2026
      </p>
    </div>
  );
}