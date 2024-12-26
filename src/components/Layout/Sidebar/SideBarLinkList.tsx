import { useMemo } from 'react';
import { useLocation } from 'react-router';
import { routes as routesRaw } from '@src/routes';
import SideBarLinkItem from './SideBarLinkItem';

export default function SideBarLinkList() {
  const { pathname } = useLocation();

  const routes = useMemo(
    () =>
      routesRaw
        .filter((route) => !route.hideFromSidebar)
        .map(({ to, text, activeNames }) => ({
          to,
          text,
          isActive: activeNames.some((name) => name === pathname),
        })),
    [pathname],
  );

  return (
    <div className='flex animate-appear flex-col items-start justify-start text-sm font-thin'>
      {routes.map(({ to, text, isActive }) => (
        <SideBarLinkItem key={text} to={to} text={text} isActive={isActive} />
      ))}
    </div>
  );
}
