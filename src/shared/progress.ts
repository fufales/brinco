import { useSyncExternalStore } from 'react';
import { configureSpeech, NORMAL_RATE } from './speech';
import { setSfxEnabled } from './sfx';

/** Aciertos a la primera que hacen falta para ganarse la estrellita de una palabra. */
export const MASTERY_GOAL = 3;

export interface Settings {
  voiceURI: string | null;
  rate: number;
  sfx: boolean;
}

export interface State {
  /** Mejor resultado por lección, de 0 a 3 estrellas. */
  stars: Record<string, number>;
  /** Aciertos a la primera por palabra. */
  correct: Record<string, number>;
  settings: Settings;
}

const STORAGE_KEY = 'brinco:v1';

function initialState(): State {
  return {
    stars: {},
    correct: {},
    settings: { voiceURI: null, rate: NORMAL_RATE, sfx: true },
  };
}

function load(): State {
  const fresh = initialState();
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? 'null');
    if (!saved) return fresh;
    return {
      stars: saved.stars ?? {},
      correct: saved.correct ?? {},
      settings: { ...fresh.settings, ...saved.settings },
    };
  } catch {
    return fresh;
  }
}

let state = load();
const listeners = new Set<() => void>();

function applySettings() {
  configureSpeech({ voiceURI: state.settings.voiceURI, rate: state.settings.rate });
  setSfxEnabled(state.settings.sfx);
}

applySettings();

function commit(next: State) {
  state = next;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // En navegación privada puede no haber almacenamiento: la app sigue funcionando.
  }
  applySettings();
  listeners.forEach((listener) => listener());
}

export function useProgress(): State {
  return useSyncExternalStore(
    (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    () => state,
  );
}

export function recordLesson(scope: string, stars: number, firstTryWordIds: string[]) {
  const correct = { ...state.correct };
  for (const id of firstTryWordIds) {
    correct[id] = (correct[id] ?? 0) + 1;
  }
  commit({
    ...state,
    correct,
    stars: { ...state.stars, [scope]: Math.max(state.stars[scope] ?? 0, stars) },
  });
}

export function updateSettings(patch: Partial<Settings>) {
  commit({ ...state, settings: { ...state.settings, ...patch } });
}

export function resetProgress() {
  commit({ ...state, stars: {}, correct: {} });
}

export function isMastered(current: State, wordId: string): boolean {
  return (current.correct[wordId] ?? 0) >= MASTERY_GOAL;
}

export function totalStars(current: State): number {
  return Object.values(current.stars).reduce((sum, stars) => sum + stars, 0);
}
