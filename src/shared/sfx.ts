/** Efectos de sonido sintetizados: no hace falta descargar archivos de audio. */

let context: AudioContext | null = null;
let enabled = true;

export function setSfxEnabled(value: boolean) {
  enabled = value;
}

function getContext(): AudioContext | null {
  if (typeof window === 'undefined' || !window.AudioContext) return null;
  context ??= new AudioContext();
  if (context.state === 'suspended') void context.resume();
  return context;
}

function note(
  frequency: number,
  startIn: number,
  duration: number,
  options: { type?: OscillatorType; volume?: number; slideTo?: number } = {},
) {
  const ctx = getContext();
  if (!ctx || !enabled) return;
  const start = ctx.currentTime + startIn;
  const oscillator = ctx.createOscillator();
  const gain = ctx.createGain();
  oscillator.type = options.type ?? 'triangle';
  oscillator.frequency.setValueAtTime(frequency, start);
  if (options.slideTo) {
    oscillator.frequency.exponentialRampToValueAtTime(options.slideTo, start + duration);
  }
  const volume = options.volume ?? 0.16;
  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(volume, start + 0.012);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
  oscillator.connect(gain).connect(ctx.destination);
  oscillator.start(start);
  oscillator.stop(start + duration + 0.02);
}

export const sfx = {
  tap() {
    note(520, 0, 0.09, { type: 'sine', volume: 0.1, slideTo: 760 });
  },
  pop() {
    note(320, 0, 0.12, { type: 'sine', volume: 0.14, slideTo: 880 });
  },
  correct() {
    note(660, 0, 0.14);
    note(990, 0.1, 0.24);
  },
  /** Suave a propósito: equivocarse no debe sentirse como un castigo. */
  oops() {
    note(300, 0, 0.2, { type: 'sine', volume: 0.12, slideTo: 230 });
  },
  hop() {
    note(240, 0, 0.16, { type: 'sine', volume: 0.14, slideTo: 620 });
  },
  star(index: number) {
    note(660 + index * 180, 0, 0.26);
  },
  win() {
    [523, 659, 784, 1047].forEach((frequency, index) => note(frequency, index * 0.11, 0.3));
  },
};
