import { useState, useEffect } from 'react'
import axios from 'axios'

export function useDashboard() {
  const [loadingImport, setLoadingImport] = useState(false)
  const [loadingProcess, setLoadingProcess] = useState(false)
  const [notification, setNotification] = useState('')
  const [fileName, setFileName] = useState<string>(localStorage.getItem('uploaded_file_name') || 'No file uploaded')
  const [totalData, setTotalData] = useState<number>(0)
  const [nlpStats, setNlpStats] = useState({
    jumlah_dokumen: 0,
    total_token: 0,
    vocabulary: 0,
    is_ready: false
  })

  const BASE_URL = 'http://127.0.0.1:8000'

  // Fetch stats (total rows + NLP metrics)
  const refreshStats = async () => {
    try {
      const resNlp = await axios.get(`${BASE_URL}/api/nlp-stats`)
      setNlpStats(resNlp.data)
      // Kita gunakan hasil hitung cepat (count) langsung dari backend!
      setTotalData(resNlp.data.total_reviews || 0)
    } catch (e) { console.error("Failed to fetch stats", e) }
  }

  // Initial load
  useEffect(() => {
    refreshStats()
  }, [])

  const handleImport = async (file: File) => {
    setLoadingImport(true); setNotification('');
    
    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await axios.post(`${BASE_URL}/api/import-csv`, formData)
      
      if (res.data.error) {
         setNotification(`❌ Ditolak Sistem: ${res.data.error}`)
      } else {
         setNotification(`✅ ${res.data.message}`)
         setFileName(file.name)
         localStorage.setItem('uploaded_file_name', file.name)
         refreshStats()
      }

    } catch (err: any) {
      setNotification(`❌ Error Jaringan/Server: ${err.response?.data?.error || err.message}`)
    }
    setLoadingImport(false)
  }

  const handlePreprocess = async (mode: 'fast' | 'full' = 'fast') => {
    setLoadingProcess(true); setNotification('');
    try {
      const res = await axios.post(`${BASE_URL}/api/run-preprocess?mode=${mode}`)
      
      if (res.data.error) {
         setNotification(`❌ Gagal NLP: ${res.data.error}`)
      } else {
         setNotification(`✨ ${res.data.message}`)
         refreshStats()
      }

    } catch (err: any) {
      setNotification(`❌ Error menjangkau Sastrawi! Pastikan Server Python menyala.`)
    }
    setLoadingProcess(false)
  }

  // Global state untuk hasil LDA agar konsisten di semua page
  const [ldaDistribution, setLdaDistribution] = useState<any>(null);

  return { 
    loadingImport, 
    loadingProcess, 
    notification, 
    fileName, 
    totalData, 
    nlpStats, 
    handleImport, 
    handlePreprocess,
    ldaDistribution,
    setLdaDistribution
  }
}