import React, { useCallback, useMemo, useState } from 'react';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { LSKEY_THEME } from '../../utils/globalConstants';
import { DarkThemeContext } from './DarkThemeContext';

export const THEME_OPTIONS = { dark: 'dark', light: 'light' };

export default function DarkThemeProvider({ children }) {
  const { value: localStorageTheme, setValue: setLocalStorageTheme } = useLocalStorage(LSKEY_THEME);

  // all useStates:
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const deviceTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
      ? THEME_OPTIONS.dark
      : THEME_OPTIONS.light;

    const currentTheme = localStorageTheme || deviceTheme;

    // @ts-ignore
    const [htmlElement] = document.getElementsByTagName('html');
    htmlElement.setAttribute('data-theme', currentTheme);
    document.body.setAttribute('class', currentTheme);

    return currentTheme === THEME_OPTIONS.dark;
  });

  // all functions:
  const toggleDarkMode = useCallback(() => {
    const themeToBe = isDarkMode ? THEME_OPTIONS.light : THEME_OPTIONS.dark;
    setLocalStorageTheme(themeToBe);

    // @ts-ignore
    const [htmlElement] = document.getElementsByTagName('html');
    htmlElement.setAttribute('data-theme', themeToBe);
    document.body.setAttribute('class', themeToBe);

    setIsDarkMode(!isDarkMode);
  }, [isDarkMode, setIsDarkMode, setLocalStorageTheme]);

  const value = useMemo(() => ({ isDarkMode, toggleDarkMode }), [isDarkMode, toggleDarkMode]);

  return <DarkThemeContext.Provider value={value}>{children}</DarkThemeContext.Provider>;
}
