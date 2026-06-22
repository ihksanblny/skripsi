import { useState, useEffect } from 'react' // TAMBAHAN PENTING
import Sidebar from './components/Sidebar'

import UploadDatasetView from './pages/UploadDataset'
import PreprocessingView from './pages/Preprocessing'
import BigramView from './pages/Bigram'
import BagOfWordsView from './pages/BagOfWords'
import HomeView from './pages/Home'
import PemodelanTopikView from './pages/PemodelanTopik'
import DistribusiTopikView from './pages/DistribusiTopik'
import RekomendasiView from './pages/Rekomendasi'
import DaftarKafeView from './pages/DaftarKafe'

// KOMPONEN & HALAMAN KHUSUS USER
import UserNavbar from './components/UserNavbar'
import UserHome from './pages/UserHome'
import UserLogin from './pages/UserLogin'
import UserRegister from './pages/UserRegister'

export default function App() {
  
  // Mode tampilan utama: 'user' (Situs Publik/User) atau 'admin' (Dashboard Skripsi)
  const [viewMode, setViewMode] = useState<'user' | 'admin'>(() => {
    return (localStorage.getItem('active_view_mode') as 'user' | 'admin') || 'user'
  })

  // Tab di sisi user publik
  const [userTab, setUserTab] = useState(() => {
    return localStorage.getItem('active_user_tab') || 'home'
  })

  // Tab di sisi admin dashboard
  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem('active_admin_tab') || 'home'
  })

  // Efek untuk menyimpan state ke localStorage agar tidak ter-reset saat reload
  useEffect(() => {
    localStorage.setItem('active_view_mode', viewMode)
  }, [viewMode])

  useEffect(() => {
    localStorage.setItem('active_user_tab', userTab)
  }, [userTab])

  useEffect(() => {
    localStorage.setItem('active_admin_tab', activeTab)
  }, [activeTab])

  // Proteksi Halaman Admin Dashboard
  if (viewMode === 'admin') {
    const isUserAdmin = localStorage.getItem('user_role_v2') === 'admin';
    if (!isUserAdmin) {
      // Menunda set state agar tidak mengganggu siklus render React
      setTimeout(() => {
        setViewMode('user');
        setUserTab('login');
        alert('Akses ditolak! Anda harus masuk sebagai Administrator untuk mengakses Dashboard Admin.');
      }, 50);
      return null;
    }
  }

  // Jika di mode USER (Homepage Publik)
  if (viewMode === 'user') {
    return (
      <div className="min-h-screen bg-[#fcfbf9] text-stone-800 font-sans flex flex-col selection:bg-orange-500/20 overflow-x-hidden">
        
        {/* Navbar khusus User */}
        <UserNavbar userTab={userTab} setUserTab={setUserTab} setViewMode={setViewMode} />
        
        <main className="flex-1 flex flex-col justify-start">
          <div className="px-3 py-4 sm:px-6 sm:py-8 w-full max-w-7xl mx-auto flex-1 flex flex-col">
            
            {userTab === 'home' && <UserHome setUserTab={setUserTab} />}

            {userTab === 'rekomendasi' && <RekomendasiView />}

            {userTab === 'daftar-kafe' && <DaftarKafeView />}

            {userTab === 'login' && <UserLogin setUserTab={setUserTab} />}

            {userTab === 'register' && <UserRegister setUserTab={setUserTab} />}

          </div>
        </main>
      </div>
    )
  }

  // Jika di mode ADMIN (Dashboard Lama)
  return (
    <div className="flex h-screen bg-[#fcfbf9] text-stone-800 font-sans overflow-hidden selection:bg-orange-500/20">
      
      {/* Mengumpan State ke Sidebar */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} setViewMode={setViewMode} />
      <main className="flex-1 flex flex-col h-full overflow-y-auto">
        <div className="px-8 py-12 w-full max-w-6xl mx-auto flex-1 flex flex-col justify-start">
          
          {/* LOGIKA PERGANTIAN HALAMAN BERDASARKAN SIDEBAR */}
          
          {activeTab === 'home' && <HomeView />}

          {activeTab === 'upload' && <UploadDatasetView />}
          
          {activeTab === 'preprocessing' && <PreprocessingView />}

          {activeTab === 'bigram' && <BigramView />}

          {activeTab === 'bow' && <BagOfWordsView />}

          {activeTab === 'pemodelan' && <PemodelanTopikView />}

          {activeTab === 'distribusi' && <DistribusiTopikView />}

          {activeTab === 'rekomendasi' && <RekomendasiView />}

        </div>
      </main>
    </div>
  )
}