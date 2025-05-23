import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider as StoreProvider } from 'react-redux';
import { BrowserRouter } from 'react-router';
import App from '@src/App';
import { API_GATEWAY_URL, dbName, tables } from './common/constants';
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

const store = createStore({} as any);

function Client() {
  return (
    <StrictMode>
      <GlobalErrorBoundaryDevelopment isDevelopmentOnly>
        <SuspenseUntilReady
          asyncFn={async () => {
            initSessionManager();
            initHttpClient(API_GATEWAY_URL);

            const version = await fetchIndexedDBVersion();

            if (version > 1) {
              tables[1]!.indexes!.push({
                indexName: 'nameIndex',
                fieldName: 'name',
                unique: false,
              });
            }

            await initIndexedDB({ dbName, tables, version });

            console.log('Application is up and running!');
          }}
        >
          <StoreProvider store={store}>
            <BrowserRouter>
              <DarkThemeProvider>
                <App />
              </DarkThemeProvider>
            </BrowserRouter>
          </StoreProvider>
        </SuspenseUntilReady>
      </GlobalErrorBoundaryDevelopment>
    </StrictMode>
  );
}

const rootElement = document.getElementById('root')!;
const root = createRoot(rootElement);
root.render(<Client />);

window.addEventListener('error', ({ error }) => ReactErrorOverlay(error));
window.addEventListener('unhandledrejection', ({ reason }) => ReactErrorOverlay(reason));

// Mock version update:
async function fetchIndexedDBVersion() {
  const version = +(localStorage.getItem('version') as any) || 1;

  return version;
}
