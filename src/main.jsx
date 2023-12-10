import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import DarkThemeProvider from './providers/DarkThemeProvider';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <DarkThemeProvider>
      <App />
    </DarkThemeProvider>
  </React.StrictMode>,
);
