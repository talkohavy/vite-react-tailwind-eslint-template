import { lazy } from 'react';
import type { Route } from './common/types';
import { BASE_URL } from './common/constants';
import RedirectToHome from './pages/RedirectToHome';

const HomePage = lazy(() => import('./pages/Home'));
const ReduxExamplePage = lazy(() => import('./pages/ReduxExample'));

export const routes: Array<Route> = [
  {
    to: '/',
    hideFromSidebar: true,
    Component: RedirectToHome,
  } as Route,
  {
    to: `${BASE_URL}/`,
    text: 'Home',
    activeNames: ['/home', '/'],
    Component: HomePage,
  },
  {
    to: `${BASE_URL}/redux`,
    text: 'Redux Example',
    activeNames: ['/redux'],
    Component: ReduxExamplePage,
  },
];
