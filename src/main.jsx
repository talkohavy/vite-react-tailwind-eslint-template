import React from 'react';
import axios from 'axios';
import ReactDOM from 'react-dom/client';
import { Provider as StoreProvider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import DarkThemeProvider from './providers/DarkThemeProvider';
import { createStore } from './store';
import './index.css';

const axiosInstance = axios.create({ baseURL: 'http://localhost:8000', withCredentials: true });

const store = createStore({ preloadedState: {}, axiosInstance });

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <StoreProvider store={store}>
      <BrowserRouter>
        <DarkThemeProvider>
          <App />
        </DarkThemeProvider>
      </BrowserRouter>
    </StoreProvider>
  </React.StrictMode>,
);
