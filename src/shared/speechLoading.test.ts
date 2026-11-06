import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

type Voice = { name: string; lang: string; voiceURI: string };

const SAMANTHA: Voice = { name: 'Samantha', lang: 'en-US', voiceURI: 'samantha' };

class FakeUtterance {
  onstart: (() => void) | null = null;
  onerror: ((event: { error: string }) => void) | null = null;
  constructor(public text: string) {}
}

/** Un navegador como Safari: entrega las voces tarde y nunca dispara `voiceschanged`. */
function fakeBrowser(voicesOverTime: Voice[][]) {
  let calls = 0;
  const spoken: FakeUtterance[] = [];
  const synth = {
    getVoices: () => voicesOverTime[Math.min(calls++, voicesOverTime.length - 1)],
    addEventListener: vi.fn(),
    cancel: vi.fn(),
    resume: vi.fn(),
    speak: (utterance: FakeUtterance) => spoken.push(utterance),
    speaking: false,
    pending: false,
  };
  vi.stubGlobal('window', {
    speechSynthesis: synth,
    setTimeout: (callback: () => void, delay: number) => setTimeout(callback, delay),
  });
  vi.stubGlobal('SpeechSynthesisUtterance', FakeUtterance);
  return { spoken };
}

describe('loading voices', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it('finds voices that arrive late even if the browser never announces them', async () => {
    fakeBrowser([[], [], [SAMANTHA]]);
    const speech = await import('./speech');
    expect(speech.getEnglishVoices()).toHaveLength(0);

    await vi.advanceTimersByTimeAsync(1000);
    expect(speech.getEnglishVoices().map((voice) => voice.name)).toEqual(['Samantha']);
  });

  it('asks again right before speaking if the list is still empty', async () => {
    fakeBrowser([[], [SAMANTHA]]);
    const speech = await import('./speech');
    speech.speak('kite');
    expect(speech.getEnglishVoices()).toHaveLength(1);
  });

  it('does not report a problem just because the list is empty', async () => {
    fakeBrowser([[]]);
    const speech = await import('./speech');
    await vi.advanceTimersByTimeAsync(6000);
    expect(speech.getEnglishVoices()).toHaveLength(0);
    expect(speech.getSpeechProblem()).toBeNull();
  });

  it('reports a problem only when the system says there is no voice', async () => {
    const { spoken } = fakeBrowser([[]]);
    const speech = await import('./speech');

    speech.speak('kite');
    const [utterance] = spoken;
    utterance.onerror!({ error: 'not-allowed' });
    utterance.onerror!({ error: 'canceled' });
    expect(speech.getSpeechProblem()).toBeNull();

    utterance.onerror!({ error: 'language-unavailable' });
    expect(speech.getSpeechProblem()).toBe('no-voice');
  });

  it('reports when the browser cannot speak at all', async () => {
    vi.stubGlobal('window', {});
    const speech = await import('./speech');
    expect(speech.getSpeechProblem()).toBe('unsupported');
  });
});
