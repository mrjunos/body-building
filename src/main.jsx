import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { initPwa } from './pwa.js';
import { importLegacyHandoff } from './domains/entreno/utils/legacyHandoff.js';

// Antes de pintar nada: recoge el historial que manda la app vieja de Pages.
importLegacyHandoff();
initPwa();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
