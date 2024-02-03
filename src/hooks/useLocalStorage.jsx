import React, { useCallback, useEffect, useState } from 'react';
import { THEME_OPTIONS } from '../providers/DarkThemeProvider/DarkThemeProvider';

/**
 * @description
 * If you want something a little bit more temporary, you could change localStorage into sessionStorage instead of localStorage.
 * It's the same idea of storing the data upon page refresh. However, sessionStorage is removed when the session ended,
 * so when you close the browser the session is gone when the user comes back.
 * @param { string } key - The key under which the value is stored inside the localStorage.
 * @returns {{
 *   value: any,
 *   setValue: React.Dispatch<any>,
 *   deleteValue: () => void
 * }}
 * @example
 * const key = 'theme';
 *
 * // Step 1: get the stored value, and its setter function
 * const { value, setValue, deleteValue } = useLocalStorage(key);
 *
 * // Step 2: use the value wherever you want
 * console.log('value is:', value);
 *
 * // Step 3: use the setter function to store new value into localStorage under that key
 * setValue('newValue');
 *
 * // Step 4: use the delete function to delete the stored value under `key` from your localStorage
 * deleteValue(key);
 */
export function useLocalStorage(key) {
  const [value, setValue] = useState(() => {
    const themeRaw = localStorage.getItem(key);

    return THEME_OPTIONS[themeRaw] ?? JSON.parse(themeRaw);
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  const deleteValue = useCallback(() => localStorage.removeItem(key), [key]);

  return { value, setValue, deleteValue };
}
