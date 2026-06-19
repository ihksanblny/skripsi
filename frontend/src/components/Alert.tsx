export default function Alert({ message }: { message: string }) {
  if (!message) return null;
  
  return (
    <div className="mb-8 p-4 bg-slate-800/50 border border-slate-700 rounded-xl text-center text-indigo-200 animate-in fade-in flex items-center justify-center backdrop-blur-md">
      {message}
    </div>
  )
}