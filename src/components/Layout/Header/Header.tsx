import { ReactComponent as ViteIcon } from '../../../assets/vite2.svg';
import DarkModeToggle from './DarkModeToggle';

export default function Header() {
  return (
    <header className='relative flex h-15 gap-4 px-3 w-full items-center justify-start bg-pink-200 shadow-sm dark:bg-gray-800 dark:shadow-dark-sm'>
      <ViteIcon />

      <DarkModeToggle />
    </header>
  );
}
