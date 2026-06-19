import { useState, useEffect } from 'react';
import axios from 'axios';
import { useDashboard } from '../hooks/useDashboard';
import DashboardKpiCard from '../components/card/DashboardKpiCard';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';

const COLORS = ['#f97316', '#fbbf24', '#b45309', '#7c2d12', '#ea580c'];

export default function HomeView() {
  const { nlpStats, totalData } = useDashboard();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await axios.get('http://127.0.0.1:8000/api/dashboard-summary');
        setData(res.data);
      } catch (e) {
        console.error(e);
      }
      setLoading(false);
    };
    fetchDashboard();
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-[60vh] text-orange-600 font-syne font-black animate-pulse text-xl">
      Initializing Dashboard...
    </div>
  );

  return (
    <div className="w-full max-w-6xl flex flex-col gap-8 animate-in fade-in zoom-in-95 duration-500 mx-auto pb-12 text-stone-850">

      {/* Header Area */}
      <div className="flex flex-col gap-1 border-b border-stone-200 pb-5">
        <h1 className="text-4xl font-syne font-black text-stone-950 tracking-tight">Main Dashboard</h1>
        <p className="text-stone-400 text-xs sm:text-sm font-semibold">Visualizing NLP research outcomes and dataset patterns.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { 
            label: 'Total Reviews', 
            value: totalData, 
            icon: (
              <svg className="w-5 h-5 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            ), 
            color: 'border-orange-200' 
          },
          { 
            label: 'Coffeeshops', 
            value: nlpStats.jumlah_dokumen, 
            icon: (
              <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            ), 
            color: 'border-emerald-200' 
          },
          { 
            label: 'Unique Vocabulary', 
            value: nlpStats.vocabulary, 
            icon: (
              <svg className="w-5 h-5 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            ), 
            color: 'border-purple-200' 
          },
          { 
            label: 'Total Tokens', 
            value: nlpStats.total_token, 
            icon: (
              <svg className="w-5 h-5 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
              </svg>
            ), 
            color: 'border-pink-200' 
          },
        ].map((kpi, i) => (
          <DashboardKpiCard
            key={i}
            label={kpi.label}
            value={kpi.value}
            icon={kpi.icon}
            color={kpi.color}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* Chart 1: Rating Distribution */}
        <div className="bg-white border border-stone-200/80 p-8 rounded-[2rem] shadow-[0_4px_25px_rgba(0,0,0,0.01)]">
          <h3 className="text-stone-950 font-syne font-black mb-8 text-lg flex items-center gap-2">
            <span className="w-1.5 h-6 bg-orange-500 rounded-full"></span>
            Sentiment Distribution (Ratings)
          </h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data?.ratings}
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {data?.ratings.map((_entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px' }}
                  itemStyle={{ color: '#111' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Top Word Frequency */}
        <div className="bg-white border border-stone-200/80 p-8 rounded-[2rem] shadow-[0_4px_25px_rgba(0,0,0,0.01)]">
          <h3 className="text-stone-950 font-syne font-black mb-8 text-lg flex items-center gap-2">
            <span className="w-1.5 h-6 bg-emerald-500 rounded-full"></span>
            Top Word Frequencies
          </h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data?.top_words}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="name" stroke="#78716c" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#78716c" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip
                  cursor={{ fill: 'rgba(0,0,0,0.02)' }}
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px' }}
                  itemStyle={{ color: '#111' }}
                />
                <Bar dataKey="count" fill="url(#colorBar)" radius={[6, 6, 0, 0]} barSize={30} />
                <defs>
                  <linearGradient id="colorBar" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" />
                    <stop offset="100%" stopColor="#059669" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: Bigram Shortlist */}
        <div className="lg:col-span-2 bg-white border border-stone-200/80 p-8 rounded-[2rem] shadow-[0_4px_25px_rgba(0,0,0,0.01)]">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 border-b border-stone-100 pb-4">
            <h3 className="text-stone-950 font-syne font-black text-lg flex items-center gap-2">
              <span className="w-1.5 h-6 bg-purple-500 rounded-full"></span>
              Dominant Bigram Patterns
            </h3>
            <div className="bg-stone-50 px-3 py-1 rounded-full border border-stone-200 text-[10px] font-black text-stone-500 uppercase tracking-widest">
              Contextual Insights
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {data?.top_bigrams.map((b: any, i: number) => (
              <div key={i} className="bg-stone-50 border border-stone-200/60 p-5 rounded-2xl group hover:border-purple-500/40 transition-all shadow-sm">
                <p className="text-[10px] text-stone-400 font-bold mb-2">PATTERN #{i + 1}</p>
                <p className="text-stone-800 font-black text-sm mb-3 group-hover:text-purple-600 transition-colors uppercase tracking-tight">{b.pair}</p>
                <div className="flex items-end gap-2">
                  <span className="text-2xl font-syne font-black text-stone-950 leading-none">{b.count}</span>
                  <span className="text-[9px] text-stone-400 font-bold tracking-wider">MATCHES</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Row 4: Trained LDA model summary */}
        <div className="lg:col-span-2 bg-white border border-stone-200/80 p-8 rounded-[2rem] shadow-[0_4px_25px_rgba(0,0,0,0.01)] relative overflow-hidden group">
          
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-orange-500/5 blur-[100px] rounded-full group-hover:bg-orange-500/10 transition-all"></div>

          <div className="flex justify-between items-center mb-8 relative z-10 border-b border-stone-100 pb-4">
            <h3 className="text-stone-950 font-syne font-black text-lg flex items-center gap-2">
              <span className="w-1.5 h-6 bg-orange-500 rounded-full"></span>
              Trained LDA Model Summary
            </h3>
            <div className={`px-4 py-1.5 rounded-full border text-[10px] font-black uppercase tracking-widest ${data?.lda_stats?.status === 'Model Siap' ? 'border-emerald-200 text-emerald-600 bg-emerald-50' : 'border-stone-200 text-stone-500 bg-stone-50'}`}>
              {data?.lda_stats?.status || "Status Unknown"}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
            <div className="flex flex-col gap-2">
              <p className="text-stone-400 text-xs font-black uppercase tracking-widest">Coherence Score (C_V)</p>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-syne font-black text-stone-950">{data?.lda_stats?.coherence_score ? data.lda_stats.coherence_score.toFixed(4) : "0.0000"}</span>
                <span className="text-emerald-600 text-xs font-bold">Accuracy</span>
              </div>
              <p className="text-stone-400 text-[10px] font-medium leading-relaxed">Mengukur seberapa nyambung kata-kata dalam satu topik.</p>
            </div>

            <div className="flex flex-col gap-2">
              <p className="text-stone-400 text-xs font-black uppercase tracking-widest">Optimal Topics (K)</p>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-syne font-black text-stone-950">{data?.lda_stats?.num_topics || 0}</span>
                <span className="text-orange-600 text-xs font-bold">Topic Groups</span>
              </div>
              <p className="text-stone-400 text-[10px] font-medium leading-relaxed">Jumlah kelompok informasi yang berhasil diekstrak.</p>
            </div>

            <div className="flex flex-col gap-2 justify-center">
              <button
                onClick={() => window.location.href = '/pemodelan-topik'}
                className="bg-[#000000] hover:bg-stone-800 text-white font-extrabold py-4 px-6 rounded-2xl transition-all shadow-[0_4px_20px_rgba(0,0,0,0.15)] active:scale-95 text-xs uppercase tracking-wider"
              >
                RETRAIN MODEL
              </button>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
