import { useSyncExternalStore } from 'react';
import { getEnglishVoices, getSpeechProblem, subscribeVoices } from '../speech';

export function useEnglishVoices() {
  return useSyncExternalStore(subscribeVoices, getEnglishVoices);
}

/** Aviso para los papás, solo si de verdad no se puede hablar en inglés. */
export function VoiceNotice() {
  const problem = useSyncExternalStore(subscribeVoices, getSpeechProblem);
  if (!problem) return null;

  return (
    <p className="voice-notice" role="status">
      {problem === 'no-voice'
        ? 'Papás: este dispositivo no tiene una voz en inglés. Instálala en los ajustes de idioma del teléfono.'
        : 'Papás: este navegador no puede hablar. Prueben con Chrome o Safari actualizados.'}
    </p>
  );
}
