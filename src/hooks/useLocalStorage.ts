import { useCallback, useEffect, useState } from 'react';

export function useLocalStorage(key: string) {
  const [value, setValue] = useState(() => {
    const value = localStorage.getItem(key);
    if (value) return JSON.parse(value);
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  const deleteValue = useCallback(() => localStorage.removeItem(key), [key]);

  return [value, setValue, deleteValue];
}
