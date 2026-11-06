import { useEffect, useState, useSyncExternalStore } from 'react';
import { getEnglishVoices, isSpeechSupported, subscribeVoices } from '../speech';

export function useEnglishVoices() {
  return useSyncExternalStore(subscribeVoices, getEnglishVoices);
}

/** Aviso para los papás si el dispositivo no puede hablar en inglés. */
export function VoiceNotice() {
  const voices = useEnglishVoices();
  // Las voces cargan tarde en algunos navegadores: se espera antes de avisar.
  const [waited, setWaited] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setWaited(true), 2500);
    return () => window.clearTimeout(timer);
  }, []);

  if (!waited || voices.length > 0) return null;

  return (
    <p className="voice-notice" role="status">
      {isSpeechSupported()
        ? 'Papás: este dispositivo no tiene una voz en inglés. Instálala en los ajustes de idioma del teléfono.'
        : 'Papás: este navegador no puede hablar. Prueben con Chrome o Safari actualizados.'}
    </p>
  );
}
