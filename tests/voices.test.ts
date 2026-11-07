import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import manifest from '../src/shared/voice/manifest.json';
import { allPhrases } from '../src/shared/voice/phrases';

const root = resolve(import.meta.dirname, '..');
const audioDir = join(root, 'public', 'voice');
const clips: Record<string, string> = manifest.clips;

function filesUnder(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    if (['node_modules', 'dist', 'dev-dist', '.git', '.claude'].includes(name) || name.endsWith('.local')) return [];
    const path = join(dir, name);
    return statSync(path).isDirectory() ? filesUnder(path) : [path];
  });
}

describe('pregenerated voices', () => {
  it('has a realistic audio clip for every phrase the app says', () => {
    const missing = allPhrases().filter((phrase) => !clips[phrase] || !existsSync(join(audioDir, clips[phrase])));
    // Si esto falla: corre `npm run voices` (ver CLAUDE.md).
    expect(missing).toEqual([]);
  });

  it('covers the fixed phrases passed straight to speak()', () => {
    const phrases = new Set(allPhrases());
    const literals = filesUnder(join(root, 'src'))
      .filter((file) => /\.tsx?$/.test(file) && !file.includes('.test.'))
      .flatMap((file) => [...readFileSync(file, 'utf8').matchAll(/\bspeak\('([^']+)'/g)].map((match) => match[1]));
    expect(literals.length).toBeGreaterThan(0);
    expect(literals.filter((text) => !phrases.has(text))).toEqual([]);
  });

  it('keeps no leftover audio files', () => {
    const used = new Set(Object.values(clips));
    const extra = readdirSync(audioDir).filter((file) => file.endsWith('.mp3') && !used.has(file));
    expect(extra).toEqual([]);
  });

  it('never commits an OpenRouter key', () => {
    const leaks = filesUnder(root).filter((file) => {
      if (/\.(mp3|png|jpg|woff2)$/.test(file)) return false;
      return /sk-or-v1-[0-9a-f]{16,}/.test(readFileSync(file, 'utf8'));
    });
    expect(leaks).toEqual([]);
  });
});
