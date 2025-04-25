import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider as StoreProvider } from 'react-redux';
import { BrowserRouter } from 'react-router';
import App from '@src/App';
import { dbName, tables } from './common/constants';
import GlobalErrorBoundaryDevelopment from './components/ErrorBoundaries/ErrorBoundaryWithModalFallback';
import ReactErrorOverlay from './components/ReactErrorOverlay';
import SuspenseUntilReady from './components/SuspenseUntilReady';
import { initHttpClient } from './lib/HttpClient';
import { initIndexedDB } from './lib/IndexedDB/indexedDB';
import { initSessionManager } from './lib/SessionManager';
import DarkThemeProvider from './providers/DarkThemeProvider';
import { createStore } from './store';
import './common/bootstrap';
import './index.css';

const API_GATEWAY_URL = 'http://localhost:8000';

const store = createStore({} as any);

function Client() {
  return (
    <StrictMode>
      <SuspenseUntilReady
        asyncFn={async () => {
          initSessionManager();
          initHttpClient(API_GATEWAY_URL);

          await initIndexedDB({ dbName, tables, version: 2 });

          console.log('Application is up and running!');
        }}
      >
        <GlobalErrorBoundaryDevelopment isDevelopmentOnly>
          <StoreProvider store={store}>
            <BrowserRouter>
              <DarkThemeProvider>
                <App />
              </DarkThemeProvider>
            </BrowserRouter>
          </StoreProvider>
        </GlobalErrorBoundaryDevelopment>
      </SuspenseUntilReady>
    </StrictMode>
  );
}

const rootElement = document.getElementById('root')!;
const root = createRoot(rootElement);
root.render(<Client />);

window.addEventListener('error', ({ error }) => ReactErrorOverlay(error));
window.addEventListener('unhandledrejection', ({ reason }) => ReactErrorOverlay(reason));
