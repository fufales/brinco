import { useEffect } from 'react';
import { registerSW } from 'virtual:pwa-register';
import { createUpdateGate } from './updateGate';

export const APP_VERSION = __APP_VERSION__;

export type CheckResult = 'latest' | 'found' | 'failed' | 'unavailable';

/** Una PWA instalada casi no navega: el navegador solo no buscaría versiones nuevas. */
const CHECK_EVERY_MS = 15 * 60 * 1000;
const VERSION_KEY = 'brinco:version';

let registration: ServiceWorkerRegistration | undefined;
let updatedVersion: string | null = null;
let applyUpdate = () => {};

const gate = createUpdateGate(() => applyUpdate());

function checkSilently() {
  if (!registration || registration.installing || !navigator.onLine) return;
  // Un fallo de red aquí no importa: se intentará en la siguiente búsqueda.
  registration.update().catch(() => {});
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

export function startUpdates() {
  rememberVersion();

  const activateWaitingVersion = registerSW({
    immediate: true,
    onNeedRefresh: () => gate.markReady(),
    onRegisteredSW(_url, current) {
      registration = current;
      if (!current) return;
      window.setInterval(checkSilently, CHECK_EVERY_MS);
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') checkSilently();
      });
    },
  });

  // Activa la versión en espera; al tomar el control, la página se recarga sola.
  applyUpdate = () => void activateWaitingVersion();
}

/** La versión a la que se acaba de actualizar, o null si este arranque no trajo cambios. */
export function justUpdatedTo(): string | null {
  return updatedVersion;
}

export async function checkForUpdate(): Promise<CheckResult> {
  if (!registration) return 'unavailable';
  try {
    await registration.update();
  } catch {
    return 'failed';
  }
  return registration.installing || registration.waiting ? 'found' : 'latest';
}

/** Para pantallas que no se deben interrumpir: la actualización espera a que se cierren. */
export function useBlockUpdates() {
  useEffect(() => gate.block(), []);
}
