import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import DarkThemeProvider from './providers/DarkThemeProvider';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <DarkThemeProvider>
        <App />
      </DarkThemeProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
