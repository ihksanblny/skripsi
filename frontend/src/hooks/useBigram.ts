import { useState, useEffect } from 'react';
import axios from 'axios';

export function useBigram(isReady: boolean) {
  const [bigrams, setBigrams] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchBigrams = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://127.0.0.1:8000/api/bigrams');
      setBigrams(res.data);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (isReady) fetchBigrams();
  }, [isReady]);

  return { bigrams, loading, fetchBigrams };
}
