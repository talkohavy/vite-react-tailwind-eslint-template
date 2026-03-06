import { lazy } from 'react';
import { BASE_URL } from './common/constants';
import type { Route } from './common/types';

// Main pages
const RedirectToHome = lazy(() => import('./pages/RedirectToHome'));
const SvgImportsPage = lazy(() => import('./pages/SvgImports'));
const HomePage = lazy(() => import('./pages/Home'));
const ReduxExamplePage = lazy(() => import('./pages/ReduxExample'));
const ShowcasePage = lazy(() => import('./pages/Showcase'));
const ServerCallPage = lazy(() => import('./pages/ServerCallPage'));
const ServerSentEventsPage = lazy(() => import('./pages/ServerSentEvent'));
const TabCommunicationPage = lazy(() => import('./pages/TabCommunication'));
const WebWorkerPage = lazy(() => import('./pages/WebWorkerPage'));
const ProgressiveWebAppPage = lazy(() => import('./pages/ProgressiveWebAppPage'));
const PicturePage = lazy(() => import('./pages/PicturePage'));
const IndexedDBPage = lazy(() => import('./pages/IndexedDBPage'));
const GetCookiesPage = lazy(() => import('./pages/GetCookiesPage'));
const QueryParamsPage = lazy(() => import('./pages/QueryParamsPage'));
const PushNotificationsPage = lazy(() => import('./pages/PushNotificationsPage'));
const OutletTabsPage = lazy(() => import('./pages/OutletTabsPage'));
const IFramePage = lazy(() => import('./pages/IFramePage'));
const MasterFilterPage = lazy(() => import('./pages/MasterFilterPage'));
const QueryLanguagePage = lazy(() => import('./pages/QueryLanguagePage'));
const WebEditorPage = lazy(() => import('./pages/WebEditorPage'));
const TableDemoPage = lazy(() => import('./pages/TableDemoPage'));
const SocketIOPage = lazy(() => import('./pages/SocketIOPage'));
const WebSocketPage = lazy(() => import('./pages/WebSocketPage'));
const WebRtcPage = lazy(() => import('./pages/WebRtcPage'));
const InfiniteScrollPage = lazy(() => import('./pages/InfiniteScrollPage'));
const MediaCaptureApiPage = lazy(() => import('./pages/MediaCaptureApiPage'));
const ScreenCaptureApiPage = lazy(() => import('./pages/ScreenCaptureApiPage'));

// OutletTabsPage tabs:
const OverviewTab = lazy(() => import('./pages/OutletTabsPage/tabs/Overview'));
const AnalyticsTab = lazy(() => import('./pages/OutletTabsPage/tabs/Analytics'));
const SettingsTab = lazy(() => import('./pages/OutletTabsPage/tabs/Settings'));

// IFramePage tabs:
const HostTab1 = lazy(() => import('./pages/IFramePage/tabs/HostTab1'));
const HostTab2 = lazy(() => import('./pages/IFramePage/tabs/HostTab2'));
const HostTab3 = lazy(() => import('./pages/IFramePage/tabs/HostTab3'));

// ProgressiveWebAppPage tabs:
const RegisterTab = lazy(() => import('./pages/ProgressiveWebAppPage/tabs/RegisterServiceWorkerTab'));
const CacheAssetTab = lazy(() => import('./pages/ProgressiveWebAppPage/tabs/CacheAssetTab'));
const CacheContentTab = lazy(() => import('./pages/ProgressiveWebAppPage/tabs/CacheContentTab'));
const BackgroundSyncTab = lazy(() => import('./pages/ProgressiveWebAppPage/tabs/BackgroundSyncTab'));
const FullExampleTab = lazy(() => import('./pages/ProgressiveWebAppPage/tabs/FullExampleTab'));

// QueryPage tabs:
const LexerTab = lazy(() => import('./pages/QueryLanguagePage/tabs/LexerTab'));
const QueryParserTab = lazy(() => import('./pages/QueryLanguagePage/tabs/QueryParserTab'));
const SuggestionsTab = lazy(() => import('./pages/QueryLanguagePage/tabs/SuggestionsTab'));
const UIChipsTab = lazy(() => import('./pages/QueryLanguagePage/tabs/UIChipsTab'));
const QueryLanguageTab = lazy(() => import('./pages/QueryLanguagePage/tabs/QueryLanguageTab'));

// TreeViewPage tabs:
const TreeViewDemoPage = lazy(() => import('./pages/TreeViewDemo'));
const StaticTreeTab = lazy(() => import('./pages/TreeViewDemo/tabs/StaticTreeTab'));
const DynamicTreeTab = lazy(() => import('./pages/TreeViewDemo/tabs/DynamicTreeTab'));
const CustomRenderingTab = lazy(() => import('./pages/TreeViewDemo/tabs/CustomRenderingTab'));
const RefControlTab = lazy(() => import('./pages/TreeViewDemo/tabs/RefControlTab'));
const PlaygroundTab = lazy(() => import('./pages/TreeViewDemo/tabs/PlaygroundTab'));

// WebRTCPage tabs:
const WebRtcOverviewTab = lazy(() => import('./pages/WebRtcPage/tabs/OverviewTab'));
const WebRtcSenderTab = lazy(() => import('./pages/WebRtcPage/tabs/SenderTab'));
const WebRtcReceiverTab = lazy(() => import('./pages/WebRtcPage/tabs/ReceiverTab'));

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
    to: `${BASE_URL}/progressive-web-app`,
    text: 'Progressive Web App',
    activeNames: [`${BASE_URL}/progressive-web-app`],
    Component: ProgressiveWebAppPage,
    children: [
      {
        to: '',
        text: 'Register',
        activeNames: [],
        Component: RegisterTab,
      },
      {
        to: 'cache-asset',
        text: 'Cache Asset',
        activeNames: [],
        Component: CacheAssetTab,
      },
      {
        to: 'cache-content',
        text: 'Cache Content',
        activeNames: [],
        Component: CacheContentTab,
      },
      {
        to: 'background-sync',
        text: 'Background Sync',
        activeNames: [],
        Component: BackgroundSyncTab,
      },
      {
        to: 'full-example',
        text: 'Full Example',
        activeNames: [],
        Component: FullExampleTab,
      },
    ],
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
    activeNames: [
      `${BASE_URL}/iframe/`,
      `${BASE_URL}/iframe/host-tab-1`,
      `${BASE_URL}/iframe/host-tab-2`,
      `${BASE_URL}/iframe/host-tab-3`,
    ],
    Component: IFramePage,
    children: [
      {
        to: '',
        text: 'Overview',
        activeNames: [],
        Component: HostTab1,
      },
      {
        to: 'host-tab-2',
        text: 'Analytics',
        activeNames: [],
        Component: HostTab2,
      },
      {
        to: 'host-tab-3',
        text: 'Settings',
        activeNames: [],
        Component: HostTab3,
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
    Component: QueryLanguagePage,
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
  {
    to: `${BASE_URL}/media-capture-api`,
    text: 'Media Capture API',
    activeNames: [`${BASE_URL}/media-capture-api`],
    Component: MediaCaptureApiPage,
  },
  {
    to: `${BASE_URL}/screen-capture-api`,
    text: 'Screen Capture API',
    activeNames: [`${BASE_URL}/screen-capture-api`],
    Component: ScreenCaptureApiPage,
  },
  {
    to: `${BASE_URL}/webrtc`,
    text: 'WebRTC P2P',
    activeNames: [`${BASE_URL}/webrtc`, `${BASE_URL}/webrtc/sender`, `${BASE_URL}/webrtc/receiver`],
    Component: WebRtcPage,
    children: [
      {
        to: '',
        text: 'Overview',
        activeNames: [],
        Component: WebRtcOverviewTab,
      },
      {
        to: 'sender',
        text: 'Sender',
        activeNames: [],
        Component: WebRtcSenderTab,
      },
      {
        to: 'receiver',
        text: 'Receiver',
        activeNames: [],
        Component: WebRtcReceiverTab,
      },
    ],
  },
];
