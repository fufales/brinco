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

/** Lado corto, en px CSS, para el que está dibujada la app en una tablet. */
const TABLET_SHORT_SIDE = 600;
const TABLET_MAX_SCALE = 1.5;
const SETTLE_MS = [150, 500];
const PHONE_VIEWPORT = 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover';

/**
 * La etiqueta viewport para una ventana de este tamaño (en puntos del dispositivo).
 * Devuelve `tablet: false` y la de teléfono si no es una tablet táctil.
 */
export function viewportFor(width: number, height: number, touch: boolean): { tablet: boolean; content: string } {
  const short = Math.min(width, height);
  if (!touch || short < TABLET_SHORT_SIDE) return { tablet: false, content: PHONE_VIEWPORT };
  const scale = Math.min(TABLET_MAX_SCALE, short / TABLET_SHORT_SIDE);
  const s = scale.toFixed(3);
  const cssWidth = Math.round(width / Number(s));
  return {
    tablet: true,
    content: `width=${cssWidth}, initial-scale=${s}, minimum-scale=${s}, maximum-scale=${s}, user-scalable=no, viewport-fit=cover`,
  };
}

/**
 * En una tablet, todo se dibuja más grande cambiando la escala de la etiqueta viewport:
 * el navegador agranda la página entera y los toques, el arrastre y
 * `getBoundingClientRect` siguen en las mismas unidades, a diferencia de CSS `zoom`.
 * La escala sale del lado corto de la ventana, así que al girar la tablet todo
 * conserva su tamaño y en horizontal queda más ancho. Con la ventana partida en un
 * iPad (menos de 600 px de lado corto) se usa el diseño de teléfono.
 */
export function fitTabletViewport() {
  const meta = document.querySelector<HTMLMetaElement>('meta[name="viewport"]');
  if (!meta) return;

  const apply = () => {
    const view = window.visualViewport;
    // Tamaño real de la ventana, sin importar la escala que ya se haya puesto.
    const scaleNow = view?.scale ?? 1;
    const width = (view?.width ?? innerWidth) * scaleNow;
    const height = (view?.height ?? innerHeight) * scaleNow;
    const { tablet, content } = viewportFor(width, height, navigator.maxTouchPoints > 0);
    document.documentElement.classList.toggle('tablet', tablet);
    if (meta.content !== content) {
      meta.content = content;
      // La nueva escala tarda un momento en aplicarse. Los juegos que miden posiciones
      // (la rana, el plano) vuelven a medir con este aviso, ya con el tamaño final.
      for (const delay of SETTLE_MS) {
        window.setTimeout(() => window.dispatchEvent(new Event('resize')), delay);
      }
    }
  };

  apply();
  window.addEventListener('resize', apply);
  window.addEventListener('orientationchange', () => window.setTimeout(apply, 250));
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
