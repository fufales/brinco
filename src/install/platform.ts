export type Phone = 'ios' | 'android' | 'other';

/** iPhone o iPad (los iPad nuevos dicen ser Mac, pero tienen pantalla táctil). */
export function detectPhone(userAgent: string, maxTouchPoints = 0): Phone {
  if (/iPhone|iPad|iPod/i.test(userAgent)) return 'ios';
  if (/Macintosh/i.test(userAgent) && maxTouchPoints > 1) return 'ios';
  if (/Android/i.test(userAgent)) return 'android';
  return 'other';
}

export function currentPhone(): Phone {
  return detectPhone(navigator.userAgent, navigator.maxTouchPoints);
}

/** ¿Ya se abrió como app desde el ícono de la pantalla de inicio? */
export function isInstalled(): boolean {
  const onIosHomeScreen = (navigator as Navigator & { standalone?: boolean }).standalone === true;
  return onIosHomeScreen || matchMedia('(display-mode: standalone), (display-mode: fullscreen)').matches;
}
