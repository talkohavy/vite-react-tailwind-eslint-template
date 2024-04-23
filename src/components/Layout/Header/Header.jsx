import DarkModeToggle from '../../DarkModeToggle';

export default function Header() {
  return (
    // z-index of Header needs to be 1 more than that of SideBar, in order for Header to cast shadow on it.
    <header className='relative z-10 flex h-15 w-full items-center justify-start bg-pink-200 shadow-sm dark:bg-gray-800 dark:shadow-dark-sm'>
      <DarkModeToggle size={20} />
    </header>
  );
}
