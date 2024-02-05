import SideBarLinkList from './SideBarLinkList';

export default function Sidebar() {
  return (
    <nav className='flex h-full w-80 flex-col items-start justify-start bg-green-500 p-10 shadow-md dark:bg-slate-500'>
      <SideBarLinkList />
    </nav>
  );
}
