import { lazy } from 'react';
import type { Route } from './common/types';
import { BASE_URL } from './common/constants';
import RedirectToHome from './pages/RedirectToHome';

const HomePage = lazy(() => import('./pages/Home'));
const ReduxExamplePage = lazy(() => import('./pages/ReduxExample'));
const ShowcasePage = lazy(() => import('./pages/Showcase'));
const ServerCallPage = lazy(() => import('./pages/ServerCall'));
const ServerSentEventsPage = lazy(() => import('./pages/ServerSentEvent'));
const TabCommunicationPage = lazy(() => import('./pages/TabCommunication'));
const WebWorkerPage = lazy(() => import('./pages/WebWorker'));
const ServiceWorkerPage = lazy(() => import('./pages/ServiceWorkerPage'));
const PicturePage = lazy(() => import('./pages/PicturePage'));
const IndexedDBPage = lazy(() => import('./pages/IndexedDBPage'));

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
    to: `${BASE_URL}/tab-communication`,
    text: 'Tab Communication',
    activeNames: ['/tab-communication'],
    Component: TabCommunicationPage,
  },
  {
    to: `${BASE_URL}/web-worker`,
    text: 'Web Worker',
    activeNames: ['/web-worker'],
    Component: WebWorkerPage,
  },
  {
    to: `${BASE_URL}/service-worker`,
    text: 'Service Worker',
    activeNames: ['/service-worker'],
    Component: ServiceWorkerPage,
  },
  {
    to: `${BASE_URL}/redux`,
    text: 'Redux Example',
    activeNames: ['/redux'],
    Component: ReduxExamplePage,
  },
  {
    to: `${BASE_URL}/picture`,
    text: 'Picture',
    activeNames: ['/picture'],
    Component: PicturePage,
  },
  {
    to: `${BASE_URL}/indexed-db`,
    text: 'IndexedDB',
    activeNames: ['/indexed-db'],
    Component: IndexedDBPage,
  },
];
