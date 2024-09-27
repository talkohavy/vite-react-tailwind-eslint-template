import { StrictMode } from 'react';
import axios from 'axios';
import { createRoot } from 'react-dom/client';
import { Provider as StoreProvider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import App from '@src/App';
import { initDAL } from './DAL';
import DarkThemeProvider from './providers/DarkThemeProvider';
import { createStore } from './store';
import './index.css';

const httpClientAxios = axios.create({ baseURL: 'http://localhost:8000', withCredentials: true });

const store = createStore({ preloadedState: {} });

initDAL({ httpClient: httpClientAxios });

function Client() {
  return (
    <StrictMode>
      <StoreProvider store={store}>
        <BrowserRouter>
          <DarkThemeProvider>
            <App />
          </DarkThemeProvider>
        </BrowserRouter>
      </StoreProvider>
    </StrictMode>
  );
}

const rootElement = document.getElementById('root')!;

createRoot(rootElement).render(<Client />);
