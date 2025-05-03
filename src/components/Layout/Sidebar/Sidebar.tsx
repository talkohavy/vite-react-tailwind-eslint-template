import { useState } from 'react';
import clsx from 'clsx';
import DownArrow from '../../svgs/DownArrow';
import SideBarLinkList from './SideBarLinkList';

export default function Sidebar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <nav
      className={clsx(
        'relative flex h-full shrink-0 flex-col items-start justify-start bg-amber-50 p-10 shadow-md transition-all duration-300 dark:bg-slate-500',
        isSidebarOpen ? 'w-72' : 'w-4',
      )}
    >
      <button
        type='button'
        onClick={() => setIsSidebarOpen((prev) => !prev)}
        className='absolute right-0 top-1/2 size-8 translate-x-1/2 rounded-full bg-blue-400 p-2 opacity-20 hover:opacity-100'
      >
        <DownArrow className={clsx('stroke-black', isSidebarOpen ? 'rotate-90' : 'rotate-270')} />
      </button>

      <div
        className={clsx('w-full opacity-0 transition-opacity duration-300 delay-300', isSidebarOpen && 'opacity-100')}
      >
        {isSidebarOpen && <SideBarLinkList />}
      </div>
    </nav>
  );
}
