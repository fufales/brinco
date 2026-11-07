#!/usr/bin/env node
/**
 * Genera, con OpenRouter, un audio realista de cada frase que dice la app.
 * SOLO PARA DESARROLLO: corre en tu computadora y lee la clave de `.env.local`
 * (ignorado por git). La app publicada solo reproduce los mp3; nunca llama al modelo.
 *
 *   npm run voices            genera las frases que aún no tienen audio
 *   npm run voices -- --force regenera todo (por ejemplo, al cambiar de voz)
 */
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { createServer } from 'vite';

const MODEL = 'elevenlabs/eleven-v4';
const VOICE = 'sarah';
const CONCURRENCY = 4;

const root = resolve(import.meta.dirname, '..');
const audioDir = join(root, 'public', 'voice');
const manifestPath = join(root, 'src', 'shared', 'voice', 'manifest.json');
const force = process.argv.includes('--force');

if (process.env.CI) {
  console.error('Este script es solo para desarrollo: no corre en CI.');
  process.exit(1);
}

function readKey() {
  if (process.env.OPENROUTER_API_KEY) return process.env.OPENROUTER_API_KEY.trim();
  const envFile = join(root, '.env.local');
  if (existsSync(envFile)) {
    const line = readFileSync(envFile, 'utf8')
      .split('\n')
      .find((entry) => entry.startsWith('OPENROUTER_API_KEY='));
    if (line) return line.slice('OPENROUTER_API_KEY='.length).trim();
  }
  console.error('Falta OPENROUTER_API_KEY en .env.local (ese archivo nunca se sube a git).');
  process.exit(1);
}

/** Carga la lista de frases de la app a través de Vite, que entiende TypeScript. */
async function loadPhrases() {
  const server = await createServer({ root, logLevel: 'error', server: { middlewareMode: true }, appType: 'custom' });
  try {
    const module = await server.ssrLoadModule('/src/shared/voice/phrases.ts');
    return module.allPhrases();
  } finally {
    await server.close();
  }
}

function fileNameFor(text) {
  const slug = text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 40);
  const hash = createHash('sha1').update(`${MODEL}|${VOICE}|${text}`).digest('hex').slice(0, 8);
  return `${slug}-${hash}.mp3`;
}

function hasFfmpeg() {
  try {
    execFileSync('ffmpeg', ['-version'], { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

/** Mono a 64 kbps: la mitad del peso y suena igual en el parlante del teléfono. */
function compress(input, output) {
  execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', input, '-ac', '1', '-b:a', '64k', output]);
}

async function synthesize(key, text) {
  for (let attempt = 1; attempt <= 4; attempt++) {
    const response = await fetch('https://openrouter.ai/api/v1/audio/speech', {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: MODEL, voice: VOICE, input: text, response_format: 'mp3' }),
    });
    if (response.ok) return Buffer.from(await response.arrayBuffer());
    const detail = (await response.text()).slice(0, 200);
    if (attempt === 4 || (response.status < 500 && response.status !== 429)) {
      throw new Error(`OpenRouter respondió ${response.status} para "${text}": ${detail}`);
    }
    await new Promise((done) => setTimeout(done, attempt * 2000));
  }
  throw new Error('unreachable');
}

async function main() {
  const key = readKey();
  const phrases = await loadPhrases();
  const previous = existsSync(manifestPath) ? JSON.parse(readFileSync(manifestPath, 'utf8')) : { clips: {} };
  const sameVoice = previous.model === MODEL && previous.voice === VOICE;
  mkdirSync(audioDir, { recursive: true });

  const clips = {};
  const pending = [];
  for (const text of phrases) {
    const file = fileNameFor(text);
    clips[text] = file;
    const exists = existsSync(join(audioDir, file));
    if (force || !sameVoice || !exists) pending.push(text);
  }

  const ffmpeg = hasFfmpeg();
  const scratch = join(tmpdir(), `brinco-voices-${process.pid}`);
  mkdirSync(scratch, { recursive: true });
  console.log(`${phrases.length} frases; ${pending.length} por generar con ${MODEL} (${VOICE}).`);

  let done = 0;
  const queue = [...pending];
  async function worker() {
    while (queue.length) {
      const text = queue.shift();
      const audio = await synthesize(key, text);
      const target = join(audioDir, clips[text]);
      if (ffmpeg) {
        const raw = join(scratch, clips[text]);
        writeFileSync(raw, audio);
        compress(raw, target);
      } else {
        writeFileSync(target, audio);
      }
      done += 1;
      console.log(`  [${done}/${pending.length}] ${text}`);
    }
  }
  await Promise.all(Array.from({ length: CONCURRENCY }, worker));
  rmSync(scratch, { recursive: true, force: true });

  // Los audios que ya no corresponden a ninguna frase se borran.
  const keep = new Set(Object.values(clips));
  for (const file of readdirSync(audioDir)) {
    if (file.endsWith('.mp3') && !keep.has(file)) rmSync(join(audioDir, file));
  }

  const sorted = Object.fromEntries(Object.entries(clips).sort(([a], [b]) => a.localeCompare(b)));
  writeFileSync(manifestPath, `${JSON.stringify({ model: MODEL, voice: VOICE, clips: sorted }, null, 2)}\n`);
  console.log(`Listo: ${Object.keys(sorted).length} audios en public/voice/.`);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
