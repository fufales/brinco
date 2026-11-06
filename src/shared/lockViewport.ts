/**
 * Marca la app instalada en un dispositivo táctil. No basta con `display-mode` en
 * CSS: WebKit a veces reporta `fullscreen` en vez de `standalone`, y en iOS lo
 * seguro es `navigator.standalone`.
 */
export function markInstalledApp() {
  const onIosHomeScreen = (navigator as Navigator & { standalone?: boolean }).standalone === true;
  const installed = matchMedia('(display-mode: standalone), (display-mode: fullscreen)').matches;
  const touch = matchMedia('(pointer: coarse)').matches;
  document.documentElement.classList.toggle('installed-app', onIosHomeScreen || (installed && touch));
}

const DOUBLE_TAP_MS = 300;
const INTERACTIVE = 'button, a, input, select, textarea, label';

/**
 * Evita el zoom en iOS, que ignora `user-scalable=no`. En Android basta con
 * la etiqueta viewport y `touch-action`, definidos en index.html y styles.css.
 */
export function lockViewport() {
  const cancel = (event: Event) => {
    if (event.cancelable) event.preventDefault();
  };

  for (const gesture of ['gesturestart', 'gesturechange', 'gestureend']) {
    document.addEventListener(gesture, cancel, { passive: false });
  }
  document.addEventListener('dblclick', cancel, { passive: false });

  document.addEventListener(
    'touchmove',
    (event) => {
      if (event.touches.length > 1) cancel(event);
    },
    { passive: false },
  );

  // Los botones quedan fuera: cancelar ahí perdería los toques rápidos de un niño.
  let lastTap = 0;
  document.addEventListener(
    'touchend',
    (event) => {
      const isDoubleTap = event.timeStamp - lastTap < DOUBLE_TAP_MS;
      lastTap = event.timeStamp;
      const target = event.target instanceof Element ? event.target : null;
      if (isDoubleTap && !target?.closest(INTERACTIVE)) cancel(event);
    },
    { passive: false },
  );
}
