import DarkModeToggle from '../../DarkModeToggle';

export default function Header() {
  return (
    <div className='flex h-15 items-center justify-start bg-slate-400 shadow-sm dark:bg-gray-800 dark:shadow-dark-sm'>
      <DarkModeToggle size={20} />
    </div>
  );
}
