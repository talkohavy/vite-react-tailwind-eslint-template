import { useDarkTheme } from '../../providers/DarkThemeProvider/DarkThemeContext';
import Toggle from '../controls/Toggle';

type DarkModeToggleProps = {
  className?: string;
};

export default function DarkModeToggle(props: DarkModeToggleProps) {
  const { className } = props;

  const { isDarkMode, toggleDarkMode } = useDarkTheme();

  return <Toggle isChecked={isDarkMode} setIsChecked={toggleDarkMode} className={className} />;
}
