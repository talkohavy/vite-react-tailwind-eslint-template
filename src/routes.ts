import { lazy } from 'react';
import type { Route } from './common/types';
import { BASE_URL } from './common/constants';
import RedirectToHome from './pages/RedirectToHome';

const HomePage = lazy(() => import('./pages/Home'));
const ReduxExamplePage = lazy(() => import('./pages/ReduxExample'));
const ShowcasePage = lazy(() => import('./pages/Showcase'));
const ServerCallPage = lazy(() => import('./pages/ServerCall'));
const ServerSentEventsPage = lazy(() => import('./pages/ServerSentEvent'));

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
    to: `${BASE_URL}/showcase`,
    text: 'Showcase',
    activeNames: ['/showcase'],
    Component: ShowcasePage,
  },
  {
    to: `${BASE_URL}/server-call`,
    text: 'Server Call',
    activeNames: ['/server-call'],
    Component: ServerCallPage,
  },
  {
    to: `${BASE_URL}/server-sent-events`,
    text: 'Server Sent Events',
    activeNames: ['/server-sent-events'],
    Component: ServerSentEventsPage,
  },
  {
    to: `${BASE_URL}/redux`,
    text: 'Redux Example',
    activeNames: ['/redux'],
    Component: ReduxExamplePage,
  },
];
