import { StrictMode } from 'react';
import axios from 'axios';
import { createRoot } from 'react-dom/client';
import { Provider as StoreProvider } from 'react-redux';
import { BrowserRouter } from 'react-router';
import App from '@src/App';
import SuspenseUntilReady from './components/SuspenseUntilReady';
import { initDAL } from './DAL';
import DarkThemeProvider from './providers/DarkThemeProvider';
import { createStore } from './store';
import './index.css';

const httpClientAxios = axios.create({ baseURL: 'http://localhost:8000', withCredentials: true });

const store = createStore({} as any);

initDAL({ httpClient: httpClientAxios });

function Client() {
  return (
    <StrictMode>
      <SuspenseUntilReady
        asyncFn={async () => {
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
