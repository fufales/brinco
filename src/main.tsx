import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource-variable/fredoka';
import './shared/styles.css';
import { App } from './App';
import { unlockSpeech } from './shared/speech';
import { startUpdates } from './shared/updates';

startUpdates();

window.addEventListener('click', unlockSpeech, { capture: true, once: true });

// En iOS, pellizcar la pantalla haría zoom y rompería la sensación de app.
document.addEventListener('gesturestart', (event) => event.preventDefault());

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
