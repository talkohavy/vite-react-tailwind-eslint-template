import { createContext, useContext } from 'react';

type DarkThemeContextProps = {
  isDarkMode: boolean;
  toggleDarkMode: (value: any) => void;
};

const INITIAL_STATE = {} as DarkThemeContextProps;

export const DarkThemeContext = createContext<DarkThemeContextProps>(INITIAL_STATE);
export const useDarkTheme = () => useContext(DarkThemeContext);
