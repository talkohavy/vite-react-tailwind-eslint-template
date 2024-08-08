import { useCallback, useEffect, useState } from 'react';

export function useLocalStorage(key: string, defaultValue?: any) {
  const [value, setValue] = useState(() => {
    const item = localStorage.getItem(key);

    if (item) {
      try {
        return JSON.parse(item);
      } catch (_error) {
        return item;
      }
    }

    return defaultValue;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  const deleteValue = useCallback(() => localStorage.removeItem(key), [key]);

  return [value, setValue, deleteValue];
}
