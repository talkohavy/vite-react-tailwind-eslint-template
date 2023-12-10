import React from 'react';
import ReactDOM from 'react-dom/client';
import * as TooltipOriginal from '@radix-ui/react-tooltip';
import App from './App';
import DarkThemeProvider from './providers/DarkThemeProvider';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <DarkThemeProvider>
      <TooltipOriginal.Provider delayDuration={800} skipDelayDuration={500}>
        <App />
      </TooltipOriginal.Provider>
    </DarkThemeProvider>
  </React.StrictMode>,
);
