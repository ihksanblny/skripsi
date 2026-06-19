import { useState } from 'react';
import axios from 'axios';

export function useLdaModel(setLdaDistribution: (data: any) => void) {
  const [loading, setLoading] = useState(false);
  const [ldaResult, setLdaResult] = useState<any>(null);
  const [numTopics, setNumTopics] = useState(8);
  const [iterations, setIterations] = useState(1000);

  const handleRunLDA = async () => {
    setLoading(true);
    try {
      const res = await axios.post('http://127.0.0.1:8000/api/lda-run', {
        num_topics: numTopics,
        iterations: iterations
      });
      setLdaResult(res.data);

      // Sinkronisasi: Ambil distribusi baru untuk halaman Distribusi Topik
      const distRes = await axios.get(`http://127.0.0.1:8000/api/lda-distribution?num_topics=${numTopics}`);
      setLdaDistribution(distRes.data);

    } catch (e) {
      console.error(e);
      alert("Gagal menjalankan model. Pastikan server backend sudah menyala.");
    }
    setLoading(false);
  };

  return {
    loading,
    ldaResult,
    numTopics,
    setNumTopics,
    iterations,
    setIterations,
    handleRunLDA
  };
}
