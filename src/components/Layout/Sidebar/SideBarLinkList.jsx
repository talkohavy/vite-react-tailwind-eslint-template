import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import SideBarLinkItem from './SideBarLinkItem';

const routesRaw = [
  {
    to: '/',
    text: 'Home',
  },
  {
    to: '/books',
    text: 'Books',
  },
  {
    to: '/about',
    text: 'About',
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

  return routes.map(({ to, text, isActive }) => <SideBarLinkItem key={text} to={to} text={text} isActive={isActive} />);
}
