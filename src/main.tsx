import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource-variable/fredoka';
import './shared/styles.css';
import { App } from './App';
import { captureInstallPrompt } from './install/prompt';
import { lockViewport, markInstalledApp } from './shared/lockViewport';
import { unlockSpeech } from './shared/speech';
import { startUpdates } from './shared/updates';

startUpdates();
captureInstallPrompt();

window.addEventListener('click', unlockSpeech, { capture: true, once: true });

markInstalledApp();
lockViewport();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
