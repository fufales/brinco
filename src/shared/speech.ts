/**
 * Voz en inglés con speechSynthesis.
 * Cada dispositivo trae voces distintas, así que se ordenan de mejor a peor
 * y los papás pueden elegir otra en Ajustes.
 */

export const PREFERRED_LANG = 'en-US';
export const NORMAL_RATE = 0.85;
export const SLOW_RATE = 0.55;

export interface VoiceLike {
  name: string;
  lang: string;
  localService?: boolean;
}

const GOOD_VOICES: [RegExp, number][] = [
  [/\b(natural|neural|premium|enhanced|siri)\b/i, 300],
  [/google us english/i, 260],
  [/\b(ava|samantha|allison|nicky|zoe|evan|nathan|joelle|noelle|tom|susan)\b/i, 240],
  [/\b(aria|jenny|guy|ana|michelle|christopher|eric|emma|brian)\b/i, 220],
];

/** Voces de broma de macOS y motores robóticos: nunca para enseñar pronunciación. */
const BAD_VOICES =
  /\b(albert|bad news|bahh|bells|boing|bubbles|cellos|deranged|good news|hysterical|jester|junior|kathy|organ|princess|ralph|superstar|trinoids|whisper|wobble|zarvox|fred|eddy|flo|grandma|grandpa|reed|rocko|sandy|shelley|espeak|compact)\b/i;

function normalizeLang(lang: string): string {
  return lang.replace('_', '-').toLowerCase();
}

export function isEnglish(voice: VoiceLike): boolean {
  return normalizeLang(voice.lang).startsWith('en');
}

export function rankVoice(voice: VoiceLike): number {
  if (!isEnglish(voice)) return -1;
  let score = normalizeLang(voice.lang) === PREFERRED_LANG.toLowerCase() ? 1000 : 0;
  for (const [pattern, points] of GOOD_VOICES) {
    if (pattern.test(voice.name)) {
      score += points;
      break;
    }
  }
  if (BAD_VOICES.test(voice.name)) score -= 800;
  return score;
}

export function sortVoices<T extends VoiceLike>(voices: T[]): T[] {
  return voices
    .filter(isEnglish)
    .map((voice, index) => ({ voice, index, score: rankVoice(voice) }))
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .map((item) => item.voice);
}

const synth = typeof window !== 'undefined' ? window.speechSynthesis : undefined;

let voices: SpeechSynthesisVoice[] = [];
let chosenVoiceURI: string | null = null;
let baseRate = NORMAL_RATE;
const listeners = new Set<() => void>();

/** Safari no siempre avisa cuando cargan las voces: hay que volver a preguntar. */
const VOICE_RETRY_MS = [250, 1000, 2500, 5000];
/** Errores que sí significan que no hay con qué hablar; `not-allowed` y `canceled` no. */
const NO_VOICE_ERRORS = new Set(['language-unavailable', 'voice-unavailable', 'synthesis-unavailable', 'synthesis-failed']);

let voiceFailed = false;

function notify() {
  listeners.forEach((listener) => listener());
}

function refreshVoices() {
  if (!synth) return;
  const next = sortVoices(synth.getVoices());
  if (next.length === voices.length) return;
  voices = next;
  notify();
}

if (synth) {
  refreshVoices();
  synth.addEventListener?.('voiceschanged', refreshVoices);
  VOICE_RETRY_MS.forEach((delay) => window.setTimeout(refreshVoices, delay));
}

export type SpeechProblem = 'unsupported' | 'no-voice' | null;

/** Una lista vacía no basta para avisar: iOS puede hablar en inglés sin entregarla. */
export function getSpeechProblem(): SpeechProblem {
  if (!synth) return 'unsupported';
  return voiceFailed && voices.length === 0 ? 'no-voice' : null;
}

export function getEnglishVoices(): SpeechSynthesisVoice[] {
  return voices;
}

export function subscribeVoices(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function configureSpeech(options: { voiceURI: string | null; rate: number }) {
  chosenVoiceURI = options.voiceURI;
  baseRate = options.rate;
}

/** La voz que sonará ahora: la elegida en Ajustes o la mejor del dispositivo. */
export function currentVoice(): SpeechSynthesisVoice | undefined {
  return voices.find((voice) => voice.voiceURI === chosenVoiceURI) ?? voices[0];
}

let unlocked = false;
let latestRequest = 0;

/** iOS exige que la primera voz nazca de un toque; esto la deja lista. */
export function unlockSpeech() {
  if (!synth || unlocked) return;
  unlocked = true;
  const silent = new SpeechSynthesisUtterance(' ');
  silent.volume = 0;
  silent.lang = PREFERRED_LANG;
  synth.speak(silent);
}

export function speak(text: string, options: { slow?: boolean } = {}): void {
  if (!synth) return;
  if (voices.length === 0) refreshVoices();
  // Sin esto, tocar varias imágenes seguidas acumula palabras en cola.
  synth.cancel();
  // Chrome en Android puede quedar en pausa tras pasar a segundo plano.
  synth.resume();
  const request = ++latestRequest;

  const say = (retry: boolean) => {
    const utterance = new SpeechSynthesisUtterance(text);
    const voice = currentVoice();
    if (voice) utterance.voice = voice;
    utterance.lang = voice?.lang.replace('_', '-') ?? PREFERRED_LANG;
    utterance.rate = options.slow ? SLOW_RATE : baseRate;
    utterance.pitch = 1;
    utterance.volume = 1;

    let started = false;
    utterance.onstart = () => {
      started = true;
    };
    utterance.onerror = (event) => {
      if (voices.length === 0 && NO_VOICE_ERRORS.has(event.error)) {
        voiceFailed = true;
        notify();
      }
    };
    synth.speak(utterance);

    // Algunos Android se tragan en silencio la primera frase: se reintenta una vez.
    if (retry) {
      window.setTimeout(() => {
        if (request === latestRequest && !started && !synth.speaking && !synth.pending) say(false);
      }, 900);
    }
  };

  say(true);
}
