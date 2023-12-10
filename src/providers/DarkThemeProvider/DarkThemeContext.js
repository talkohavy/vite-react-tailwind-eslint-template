import { createContext, useContext } from 'react';

/** @type {{ isDarkMode?: boolean, toggleDarkMode?: () => void }} */
const INITIAL_STATE = {};
const DarkThemeContext = createContext(INITIAL_STATE);
const useDarkTheme = () => useContext(DarkThemeContext);

export { DarkThemeContext, useDarkTheme };
