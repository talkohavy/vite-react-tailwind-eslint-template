import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import SideBarLinkItem from './SideBarLinkItem';

const routesRaw = [
  {
    to: '/',
    text: 'Home',
  },
  {
    to: '/redux',
    text: 'Redux Example',
  },
  {
    to: '/some-url',
    text: 'Not Found Page',
  },
];

export default function SideBarLinkList() {
  const { pathname } = useLocation();

  const routes = useMemo(
    () =>
      routesRaw.map(({ to, text }) => ({
        to,
        text,
        isActive: to === pathname,
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
