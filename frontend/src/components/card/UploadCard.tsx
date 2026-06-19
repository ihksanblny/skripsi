import React, { useRef, useState } from 'react';

interface UploadCardProps {
  loadingImport: boolean;
  handleImport: (file: File) => void;
}

export default function UploadCard({ loadingImport, handleImport }: UploadCardProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const onUploadClick = () => {
    if (selectedFile) {
      handleImport(selectedFile);
    } else {
      alert("Pilih file CSV dulu!");
    }
  };

  return (
    <div className="bg-white border border-stone-200/80 p-6 rounded-3xl shadow-[0_4px_25px_rgba(0,0,0,0.01)] text-stone-800">
      <div className="bg-stone-50 p-5 rounded-2xl flex flex-col gap-5 border border-stone-200/60">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="w-12 h-12 bg-white border border-stone-200 text-orange-500 rounded-xl flex items-center justify-center text-xl shadow-sm">
            📄
          </div>
          
          <input 
            type="file" 
            accept=".csv"
            ref={fileInputRef}
            onChange={onFileChange}
            className="hidden"
          />
          
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="bg-white hover:bg-stone-100 text-stone-800 font-bold px-6 py-2.5 rounded-xl border border-stone-200 shadow-sm transition text-xs uppercase tracking-wider">
            {selectedFile ? selectedFile.name : 'Choose File'}
          </button>
          <span className="text-[10px] font-black text-stone-400 tracking-widest">HARUS BERFORMAT .CSV</span>
        </div>
        
        <div className="mt-2">
           <button 
             onClick={onUploadClick}
             disabled={loadingImport || !selectedFile}
             className={`${loadingImport ? 'bg-stone-400 cursor-not-allowed' : 'bg-orange-500 hover:bg-orange-600'} text-white text-xs font-black uppercase tracking-widest px-6 py-3 rounded-xl shadow-[0_4px_15px_rgba(249,115,22,0.15)] transition`}
           >
             {loadingImport ? '⏳ Mengunggah...' : 'Upload Dataset'}
           </button>
        </div>
      </div>
    </div>
  );
}
