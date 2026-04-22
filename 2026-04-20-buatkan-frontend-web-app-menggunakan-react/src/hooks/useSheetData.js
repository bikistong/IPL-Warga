import { useState, useEffect } from 'react';

export const useSheetData = (action) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const url = import.meta.env.VITE_APPS_SCRIPT_URL + `?action=${action}`;
        console.log('Fetching from:', url);
        
        const response = await fetch(url, { method: 'GET', mode: 'cors' });
        
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        
        const result = await response.json();
        setData(result);
        setLoading(false);
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err.message);
        setLoading(false);
      }
    };
    
    fetchData();
  }, [action]);

  return { data, loading, error };
};
