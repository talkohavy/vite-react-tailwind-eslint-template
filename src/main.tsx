import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider as StoreProvider } from 'react-redux';
import { BrowserRouter } from 'react-router';
import App from '@src/App';
import SuspenseUntilReady from './components/SuspenseUntilReady';
import DarkThemeProvider from './providers/DarkThemeProvider';
import { createStore } from './store';
import { initSessionManager } from './SessionManager';
import { initHttpClient } from './lib/HttpClient';
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

createRoot(rootElement).render(<Client />);
