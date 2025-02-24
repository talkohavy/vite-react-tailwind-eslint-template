import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider as StoreProvider } from 'react-redux';
import { BrowserRouter } from 'react-router';
import App from '@src/App';
import ReactErrorOverlay from './components/ReactErrorOverlay';
import SuspenseUntilReady from './components/SuspenseUntilReady';
import { initHttpClient } from './lib/HttpClient';
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
    </StrictMode>
  );
}

const rootElement = document.getElementById('root')!;
const root = createRoot(rootElement);
root.render(<Client />);

window.addEventListener('error', ({ error }) => ReactErrorOverlay(error));
window.addEventListener('unhandledrejection', ({ reason }) => ReactErrorOverlay(reason));
