import { useEffect } from 'react';
import { registerSW } from 'virtual:pwa-register';
import { createUpdateGate } from './updateGate';

export const APP_VERSION = __APP_VERSION__;

export type CheckResult = 'latest' | 'found' | 'failed' | 'unavailable';

/** Una PWA instalada casi no navega: el navegador solo no buscaría versiones nuevas.
 *  Reducido de 15 min → 5 min. Ahora 60 s para que el update sea responsivo.
 */
const CHECK_EVERY_MS = 60 * 1000; // 60 s
const BURST_CHECKS = [500, 3000, 10000]; // ms: checks extra al arrancar
const VERSION_KEY = 'brinco:version';

let registration: ServiceWorkerRegistration | undefined;
let updatedVersion: string | null = null;
let applyUpdate: (() => void) | null = null;

const gate = createUpdateGate(() => {
  if (applyUpdate) applyUpdate();
});

function checkSilently() {
  if (!registration || registration.installing || !navigator.onLine) return;
  registration.update()
    .then(() => {
      if (registration?.waiting || registration?.installing) {
        console.log('[brinco] Nueva versión detectada');
      }
    })
    .catch((err) => {
      console.warn('[brinco] Error checking update:', err);
    });
}

function rememberVersion() {
  try {
    const previous = localStorage.getItem(VERSION_KEY);
    localStorage.setItem(VERSION_KEY, APP_VERSION);
    if (previous && previous !== APP_VERSION) updatedVersion = APP_VERSION;
  } catch {
    // Sin almacenamiento solo se pierde el aviso de "se actualizó".
  }
}

/** Inicia el sistema de actualizaciones: registro del SW, check automático cada 60 s,
 *  burst al arrancar, check al volver a la app. */
export function startUpdates() {
  rememberVersion();

  const activateWaitingVersion = registerSW({
    immediate: true,
    onNeedRefresh: () => gate.markReady(),
    onRegisteredSW(_url, current) {
      registration = current;
      if (!current) return;
      // Primer check inmediato al abrir la app
      checkSilently();
      // Burst inicial: checks extra para detectar updates publicados justo antes
      for (const delay of BURST_CHECKS) {
        window.setTimeout(checkSilently, delay);
      }
      // Intervalo continuo cada 60 s
      const timerId = window.setInterval(checkSilently, CHECK_EVERY_MS);
      // Check cada vez que la app pasa a primer plano
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') checkSilently();
      });
      return () => window.clearInterval(timerId);
    },
  });

  // Activa la versión en espera; al tomar el control, la página se recarga sola.
  applyUpdate = () => void activateWaitingVersion();
}

/** La versión a la que se acaba de actualizar, o null si este arranque no trajo cambios. */
export function justUpdatedTo(): string | null {
  return updatedVersion;
}

/** Busca una actualización manualmente. */
export async function checkForUpdate(): Promise<CheckResult> {
  if (!registration) return 'unavailable';
  try {
    await registration.update();
  } catch {
    return 'failed';
  }
  return registration.installing || registration.waiting ? 'found' : 'latest';
}

/** Fuerza la activación de la versión en espera (skipWaiting + recarga automática).
 *  Retorna true si había un update pendiente, false si no. */
export function triggerUpdate(): boolean {
  if (!registration?.waiting) return false;
  if (applyUpdate) applyUpdate();
  return true;
}

/** Para pantallas que no se deben interrumpir: la actualización espera a que se cierren. */
export function useBlockUpdates() {
  useEffect(() => gate.block(), []);
}
