import DarkModeToggle from '../../DarkModeToggle';

export default function Header() {
  return (
    <header className='relative flex h-15 w-full items-center justify-start bg-pink-200 shadow-sm dark:bg-gray-800 dark:shadow-dark-sm'>
      <DarkModeToggle size={20} />
    </header>
  );
}
