import { createContext, useContext } from 'react';

export type DarkThemeContextValue = {
  isDarkMode: boolean;
  /**
   * @returns The new state it toggles to.
   */
  toggleDarkMode: () => boolean;
};

const INITIAL_STATE = {} as DarkThemeContextValue;

export const DarkThemeContext = createContext<DarkThemeContextValue>(INITIAL_STATE);
export const useDarkTheme = () => useContext(DarkThemeContext);
