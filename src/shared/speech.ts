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

function refreshVoices() {
  if (!synth) return;
  voices = sortVoices(synth.getVoices());
  listeners.forEach((listener) => listener());
}

if (synth) {
  refreshVoices();
  synth.addEventListener?.('voiceschanged', refreshVoices);
}

export function isSpeechSupported(): boolean {
  return Boolean(synth);
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
