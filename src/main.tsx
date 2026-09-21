import React from 'react';
import ReactDOM from 'react-dom/client';
import '@/styles/globals.css';
import { AppProviders } from '@/app/providers';
import { App } from '@/app/App';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Elemen root aplikasi tidak ditemukan di index.html');
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <AppProviders>
      <App />
    </AppProviders>
  </React.StrictMode>
);
