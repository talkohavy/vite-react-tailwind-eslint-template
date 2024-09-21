import { lazy } from 'react';

const HomePage = lazy(() => import('./pages/Home'));
const ReduxExamplePage = lazy(() => import('./pages/ReduxExample'));

export const routes = [
  {
    to: '/',
    text: 'Home',
    activeNames: ['/home', '/'],
    Component: HomePage,
  },
  {
    to: '/redux',
    text: 'Redux Example',
    activeNames: ['/redux'],
    Component: ReduxExamplePage,
  },
];
