import { lazy } from 'react';
import { BASE_URL } from './common/constants';
import type { Route } from './common/types';

// Main pages
const RedirectToHome = lazy(() => import('./pages/RedirectToHome'));
const SvgImportsPage = lazy(() => import('./pages/SvgImports'));
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
const GetCookiesPage = lazy(() => import('./pages/GetCookiesPage'));
const QueryParamsPage = lazy(() => import('./pages/QueryParamsPage'));
const PushNotificationsPage = lazy(() => import('./pages/PushNotificationsPage'));
const OutletTabsPage = lazy(() => import('./pages/OutletTabsPage'));
const IFramePage = lazy(() => import('./pages/IFramePage'));
const MasterFilterPage = lazy(() => import('./pages/MasterFilterPage'));
const QueryPage = lazy(() => import('./pages/QueryPage'));
const WebEditorPage = lazy(() => import('./pages/WebEditorPage'));
const TableDemoPage = lazy(() => import('./pages/TableDemoPage'));
const SocketIOPage = lazy(() => import('./pages/SocketIOPage'));
const WebSocketPage = lazy(() => import('./pages/WebSocketPage'));
const InfiniteScrollPage = lazy(() => import('./pages/InfiniteScrollPage'));

// Mini-pages/tabs
const OverviewTab = lazy(() => import('./pages/OutletTabsPage/tabs/Overview'));
const AnalyticsTab = lazy(() => import('./pages/OutletTabsPage/tabs/Analytics'));
const SettingsTab = lazy(() => import('./pages/OutletTabsPage/tabs/Settings'));
const LexerTab = lazy(() => import('./pages/QueryPage/tabs/LexerTab'));
const QueryParserTab = lazy(() => import('./pages/QueryPage/tabs/QueryParserTab'));
const SuggestionsTab = lazy(() => import('./pages/QueryPage/tabs/SuggestionsTab'));
const UIChipsTab = lazy(() => import('./pages/QueryPage/tabs/UIChipsTab'));
const QueryLanguageTab = lazy(() => import('./pages/QueryPage/tabs/QueryLanguageTab'));

// TreeView Main page & Demo tabs
const TreeViewDemoPage = lazy(() => import('./pages/TreeViewDemo'));
const StaticTreeTab = lazy(() => import('./pages/TreeViewDemo/tabs/StaticTreeTab'));
const DynamicTreeTab = lazy(() => import('./pages/TreeViewDemo/tabs/DynamicTreeTab'));
const CustomRenderingTab = lazy(() => import('./pages/TreeViewDemo/tabs/CustomRenderingTab'));
const RefControlTab = lazy(() => import('./pages/TreeViewDemo/tabs/RefControlTab'));
const PlaygroundTab = lazy(() => import('./pages/TreeViewDemo/tabs/PlaygroundTab'));

export const routes: Array<Route> = [
  {
    to: '/',
    hideFromSidebar: true,
    Component: RedirectToHome,
  } as Route,
  {
    to: `${BASE_URL}/home`,
    text: 'Home',
    activeNames: [BASE_URL, `${BASE_URL}/home/`],
    Component: HomePage,
  },
  {
    to: `${BASE_URL}/svg-imports`,
    text: 'SVG Imports',
    activeNames: [`${BASE_URL}/svg-imports`],
    Component: SvgImportsPage,
  },
  {
    to: `${BASE_URL}/showcase`,
    text: 'Showcase',
    activeNames: [`${BASE_URL}/showcase`],
    Component: ShowcasePage,
  },
  {
    to: `${BASE_URL}/tree-view-demo`,
    text: 'TreeView Demo',
    activeNames: [`${BASE_URL}/tree-view-demo`],
    Component: TreeViewDemoPage,
    children: [
      {
        to: `${BASE_URL}/tree-view-demo/static-tree`,
        text: 'Static Tree',
        activeNames: [`${BASE_URL}/tree-view-demo/static-tree`],
        Component: StaticTreeTab,
      },
      {
        to: `${BASE_URL}/tree-view-demo/dynamic-tree`,
        text: 'Dynamic Tree',
        activeNames: [`${BASE_URL}/tree-view-demo/dynamic-tree`],
        Component: DynamicTreeTab,
      },
      {
        to: `${BASE_URL}/tree-view-demo/custom-rendering`,
        text: 'Custom Rendering',
        activeNames: [`${BASE_URL}/tree-view-demo/custom-rendering`],
        Component: CustomRenderingTab,
      },
      {
        to: `${BASE_URL}/tree-view-demo/ref-control`,
        text: 'Ref Control',
        activeNames: [`${BASE_URL}/tree-view-demo/ref-control`],
        Component: RefControlTab,
      },
      {
        to: `${BASE_URL}/tree-view-demo/playground`,
        text: 'Playground',
        activeNames: [`${BASE_URL}/tree-view-demo/playground`],
        Component: PlaygroundTab,
      },
    ],
  },
  {
    to: `${BASE_URL}/server-call`,
    text: 'Server Call',
    activeNames: [`${BASE_URL}/server-call`],
    Component: ServerCallPage,
  },
  {
    to: `${BASE_URL}/server-sent-events`,
    text: 'Server Sent Events',
    activeNames: [`${BASE_URL}/server-sent-events`],
    Component: ServerSentEventsPage,
  },
  {
    to: `${BASE_URL}/tab-communication`,
    text: 'Tab Communication',
    activeNames: [`${BASE_URL}/tab-communication`],
    Component: TabCommunicationPage,
  },
  {
    to: `${BASE_URL}/web-worker`,
    text: 'Web Worker',
    activeNames: [`${BASE_URL}/web-worker`],
    Component: WebWorkerPage,
  },
  {
    to: `${BASE_URL}/service-worker`,
    text: 'Service Worker',
    activeNames: [`${BASE_URL}/service-worker`],
    Component: ServiceWorkerPage,
  },
  {
    to: `${BASE_URL}/redux`,
    text: 'Redux Example',
    activeNames: [`${BASE_URL}/redux`],
    Component: ReduxExamplePage,
  },
  {
    to: `${BASE_URL}/picture`,
    text: 'Picture',
    activeNames: [`${BASE_URL}/picture`],
    Component: PicturePage,
  },
  {
    to: `${BASE_URL}/indexed-db`,
    text: 'IndexedDB',
    activeNames: [`${BASE_URL}/indexed-db`],
    Component: IndexedDBPage,
  },
  {
    to: `${BASE_URL}/push-notifications`,
    text: 'Push Notifications',
    activeNames: [`${BASE_URL}/push-notifications`],
    Component: PushNotificationsPage,
  },
  {
    to: `${BASE_URL}/query-params`,
    text: 'Query Params',
    activeNames: [`${BASE_URL}/query-params`],
    Component: QueryParamsPage,
  },
  {
    to: `${BASE_URL}/get-cookies`,
    text: 'Get Cookies',
    activeNames: [`${BASE_URL}/get-cookies`],
    Component: GetCookiesPage,
  },
  {
    to: `${BASE_URL}/outlet`,
    text: 'Outlet Tabs',
    activeNames: [`${BASE_URL}/outlet/`, `${BASE_URL}/outlet/analytics`, `${BASE_URL}/outlet/settings`],
    Component: OutletTabsPage,
    children: [
      {
        to: '',
        text: 'Overview',
        activeNames: [],
        Component: OverviewTab,
      },
      {
        to: 'analytics',
        text: 'Analytics',
        activeNames: [],
        Component: AnalyticsTab,
      },
      {
        to: 'settings',
        text: 'Settings',
        activeNames: [],
        Component: SettingsTab,
      },
    ],
  },
  {
    to: `${BASE_URL}/iframe`,
    text: 'IFrame',
    activeNames: [`${BASE_URL}/iframe/`, `${BASE_URL}/iframe/analytics`, `${BASE_URL}/iframe/settings`],
    Component: IFramePage,
    children: [
      {
        to: '',
        text: 'Overview',
        activeNames: [],
        Component: OverviewTab,
      },
      {
        to: 'analytics',
        text: 'Analytics',
        activeNames: [],
        Component: AnalyticsTab,
      },
      {
        to: 'settings',
        text: 'Settings',
        activeNames: [],
        Component: SettingsTab,
      },
    ],
  },
  {
    to: `${BASE_URL}/filters`,
    text: 'Master Filter',
    activeNames: [`${BASE_URL}/filters`],
    Component: MasterFilterPage,
  },
  {
    to: `${BASE_URL}/query-language`,
    text: 'Query Language',
    activeNames: [
      `${BASE_URL}/query-language/`,
      `${BASE_URL}/query-language/lexer`,
      `${BASE_URL}/query-language/query-parser`,
      `${BASE_URL}/query-language/suggestions`,
      `${BASE_URL}/query-language/ui-chips`,
      `${BASE_URL}/query-language/query-language`,
    ],
    Component: QueryPage,
    children: [
      {
        to: 'lexer',
        text: 'Lexer',
        activeNames: [],
        Component: LexerTab,
      },
      {
        to: 'query-parser',
        text: 'Query Parser',
        activeNames: [],
        Component: QueryParserTab,
      },
      {
        to: 'suggestions',
        text: 'Suggestions',
        activeNames: [],
        Component: SuggestionsTab,
      },
      {
        to: 'ui-chips',
        text: 'UI chips',
        activeNames: [],
        Component: UIChipsTab,
      },
      {
        to: 'query-language',
        text: 'Query Language',
        activeNames: [],
        Component: QueryLanguageTab,
      },
    ],
  },
  {
    to: `${BASE_URL}/web-editor`,
    text: 'Code Editor',
    activeNames: [`${BASE_URL}/web-editor`],
    Component: WebEditorPage,
  },
  {
    to: `${BASE_URL}/table-demo`,
    text: 'Table Demo',
    activeNames: [`${BASE_URL}/table-demo`],
    Component: TableDemoPage,
  },
  {
    to: `${BASE_URL}/socket-io`,
    text: 'Socket.IO',
    activeNames: [`${BASE_URL}/socket-io`],
    Component: SocketIOPage,
  },
  {
    to: `${BASE_URL}/websocket`,
    text: 'WebSocket',
    activeNames: [`${BASE_URL}/websocket`],
    Component: WebSocketPage,
  },
  {
    to: `${BASE_URL}/infinite-scroll`,
    text: 'Infinite Scroll',
    activeNames: [`${BASE_URL}/infinite-scroll`],
    Component: InfiniteScrollPage,
  },
];
