import { useState, useEffect } from 'react'
import axios from 'axios'

export default function DatabaseView() {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // Fungsi Tarik Data
  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/reviews?limit=100')
      .then(res => { setData(res.data); setLoading(false); })
      .catch(err => { console.error(err); setLoading(false); })
  }, [])

  // Fungsi Penghapus Massal
  const kosongkanDatabase = async () => {
    // Pop-up anti salah pencet
    if (!window.confirm("AWAS! Yakin ingin menghapus SEMUA tabel ulasan dari MySQL?")) return;
    
    setLoading(true);
    axios.delete('http://127.0.0.1:8000/api/reviews')
      .then(() => {
         alert("✅ Sempurna! Database kembali kosong.");
         setData([]); // Langsung ubah tabel jadi kosong melompong (real-time)
         setLoading(false);
      })
      .catch(() => {
         alert("❌ Gagal mereset database.");
         setLoading(false);
      })
  }

  return (
    <div className="bg-white border border-stone-200/80 p-6 sm:p-8 rounded-[2.5rem] w-full shadow-[0_10px_50px_rgba(0,0,0,0.02)] flex flex-col h-[600px] text-stone-800">
      
      {/* HEADER PENUH AKSI */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h2 className="text-xl font-syne font-black text-stone-950">Preview Data (MySQL Live)</h2>
          <p className="text-orange-600 text-xs mt-1 font-bold tracking-wider uppercase">100 Data Pertama</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button onClick={kosongkanDatabase} disabled={loading}
             className="text-xs font-bold px-4 py-2 bg-red-50 text-red-600 hover:bg-red-500 hover:text-white rounded-xl transition-colors border border-red-200 shadow-sm">
             🗑️ Reset Database
          </button>
          <div className="text-xs font-bold px-3 py-2 bg-emerald-50 text-emerald-600 border border-emerald-200 rounded-xl flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Connected
          </div>
        </div>
      </div>
      
      {/* TABEL INTI */}
      <div className="flex-1 overflow-auto rounded-2xl border border-stone-200 bg-stone-50/50 shadow-inner">
        <table className="w-full text-left text-xs sm:text-sm text-stone-600">
            <thead className="bg-stone-100 text-stone-700 font-bold sticky top-0 shadow-sm z-10 border-b border-stone-200">
              <tr>
                <th className="p-4 border-r border-stone-200/80">ID</th>
                <th className="p-4 border-r border-stone-200/80">Kafe</th>
                <th className="p-4 border-r border-stone-200/80 w-2/5">Teks Asli (Kotor)</th>
                <th className="p-4 w-2/5">Teks Bersih (Sastrawi)</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={4} className="p-8 text-center text-stone-400 font-semibold">⏳ Menarik baris data...</td></tr>
              ) : data.length === 0 ? (
                <tr><td colSpan={4} className="p-8 text-center text-stone-400 font-semibold">✅ Database bersih/kosong.</td></tr>
              ) : (
                data.map((row) => (
                  <tr key={row.id} className="border-b border-stone-100 hover:bg-stone-50 transition-colors group">
                    <td className="p-4 align-top font-mono text-stone-400 border-r border-stone-100">#{row.id}</td>
                    <td className="p-4 align-top font-bold text-stone-850 border-r border-stone-100">{row.nama_tempat}</td>
                    
                    <td className="p-4 align-top text-xs leading-relaxed text-stone-500 border-r border-stone-100 italic bg-red-500/[0.01]">
                      "{row.review_text}"
                    </td>
                    
                    <td className="p-4 align-top text-xs leading-relaxed font-mono bg-orange-500/[0.01]">
                       {row.clean_review ? (
                         <span className="text-orange-700 font-medium">{row.clean_review}</span>
                       ) : (
                         <span className="text-stone-400 italic">⏳ Belum di-preprocessing</span>
                       )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
        </table>
      </div>

    </div>
  )
}