import type { ReactNode } from 'react';

export default function DashboardKpiCard({ 
  label, 
  value, 
  icon, 
  color 
}: { 
  label: string; 
  value: string | number; 
  icon?: ReactNode; 
  color: string; 
}) {
  return (
    <div className={`bg-white border ${color || 'border-stone-200'} p-6 rounded-3xl shadow-[0_4px_25px_rgba(0,0,0,0.02)] hover:scale-[1.02] transition-transform`}>
      <div className="flex items-center justify-between mb-4">
        {icon ? <span className="flex items-center justify-center">{icon}</span> : <div />}
        <span className="text-[10px] font-black text-stone-400 uppercase tracking-widest">{label}</span>
      </div>
      <p className="text-3xl font-syne font-black text-stone-950">{typeof value === 'number' ? value.toLocaleString() : value}</p>
    </div>
  );
}
