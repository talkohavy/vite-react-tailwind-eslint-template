import { useDarkTheme } from '../providers/DarkThemeProvider/DarkThemeContext';
import ToggleButton from './ToggleButton';

/**
 * @param {{size?: number, className?: string}} props
 * @returns {any}
 */
export default function DarkModeToggle({ size, className }) {
  const { isDarkMode, toggleDarkMode } = useDarkTheme();

  return <ToggleButton value={isDarkMode} setValue={toggleDarkMode} size={size} className={className} />;
}
