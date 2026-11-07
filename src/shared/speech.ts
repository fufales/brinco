/**
 * Voz en inglés.
 *
 * Primero se reproduce el audio realista pregenerado de la frase (public/voice/, ver
 * `npm run voices`). Si una frase no tiene audio, se usa speechSynthesis como respaldo:
 * cada dispositivo trae voces distintas, así que se ordenan de mejor a peor y los papás
 * pueden elegir otra en Ajustes.
 */
import voiceManifest from './voice/manifest.json';
import { normalizePhrase } from './voice/normalize';

export const PREFERRED_LANG = 'en-US';
export const NORMAL_RATE = 0.85;
export const SLOW_RATE = 0.55;
/** Velocidad del audio al repetir "más lento"; más lento que esto se oye estirado. */
const CLIP_SLOW_RATE = 0.75;

const CLIPS: Record<string, string> = voiceManifest.clips;

/** El archivo de audio pregenerado de una frase, si existe. */
export function clipFor(text: string): string | undefined {
  return CLIPS[normalizePhrase(text)];
}

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
  // Con los audios pregenerados no hace falta ninguna voz del teléfono.
  if (canPlayClips()) return null;
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
let player: HTMLAudioElement | null = null;

function canPlayClips(): boolean {
  return typeof Audio !== 'undefined';
}

/** Un solo reproductor para toda la app: así iOS lo deja sonar después del primer toque. */
function getPlayer(): HTMLAudioElement | null {
  if (!player && canPlayClips()) {
    player = new Audio();
    player.preload = 'auto';
    const keepPitch = player as HTMLAudioElement & { webkitPreservesPitch?: boolean };
    keepPitch.preservesPitch = true;
    keepPitch.webkitPreservesPitch = true;
  }
  return player;
}

/** Un instante de silencio en WAV, para desbloquear el reproductor con el primer toque. */
function silentWav(): string {
  const samples = 800;
  const bytes = new Uint8Array(44 + samples);
  const view = new DataView(bytes.buffer);
  const text = (offset: number, value: string) => [...value].forEach((char, i) => view.setUint8(offset + i, char.charCodeAt(0)));
  text(0, 'RIFF');
  view.setUint32(4, 36 + samples, true);
  text(8, 'WAVEfmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, 8000, true);
  view.setUint32(28, 8000, true);
  view.setUint16(32, 1, true);
  view.setUint16(34, 8, true);
  text(36, 'data');
  view.setUint32(40, samples, true);
  bytes.fill(128, 44);
  return URL.createObjectURL(new Blob([bytes], { type: 'audio/wav' }));
}

/** iOS exige que el primer sonido nazca de un toque; esto deja listos el reproductor y la voz. */
export function unlockSpeech() {
  if (unlocked) return;
  unlocked = true;
  const audio = getPlayer();
  if (audio) {
    audio.src = silentWav();
    void audio.play().catch(() => {});
  }
  if (synth) {
    const silent = new SpeechSynthesisUtterance(' ');
    silent.volume = 0;
    silent.lang = PREFERRED_LANG;
    synth.speak(silent);
  }
}

/** Reproduce el audio pregenerado. Devuelve false si no hay con qué. */
function playClip(text: string, file: string, slow: boolean): boolean {
  const audio = getPlayer();
  if (!audio) return false;
  synth?.cancel();
  audio.pause();
  audio.src = `${import.meta.env.BASE_URL}voice/${file}`;
  // Cargar un audio nuevo devuelve la velocidad a la de por defecto: se fija después.
  const rate = slow ? CLIP_SLOW_RATE : Math.min(1.25, Math.max(0.7, baseRate / NORMAL_RATE));
  audio.defaultPlaybackRate = rate;
  audio.playbackRate = rate;
  void audio.play().catch((error: unknown) => {
    // Si el navegador no deja reproducir (o falla la descarga), habla el respaldo.
    if (error instanceof DOMException && error.name === 'AbortError') return;
    speakWithDevice(text, slow);
  });
  return true;
}

export function speak(text: string, options: { slow?: boolean } = {}): void {
  const file = clipFor(text);
  if (file && playClip(text, file, options.slow ?? false)) return;
  if (!file && import.meta.env.DEV) {
    console.warn(`Falta audio para "${text}". Agrégalo en src/shared/voice/phrases.ts y corre npm run voices.`);
  }
  speakWithDevice(text, options.slow ?? false);
}

function speakWithDevice(text: string, slow: boolean): void {
  if (!synth) return;
  player?.pause();
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
    utterance.rate = slow ? SLOW_RATE : baseRate;
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
