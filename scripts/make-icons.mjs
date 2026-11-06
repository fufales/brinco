// Genera los íconos de la app (npm run icons). La rana es la misma de src/shared/ui/Mascot.tsx.
import { writeFile } from 'node:fs/promises';
import sharp from 'sharp';

const INK = '#2b2a4c';
const GREEN = '#6fd64b';
const RED = '#ff3b3b';
const BLUSH = '#ff9eb0';

const eye = (x) => `
  <circle cx="${x}" cy="52" r="19" fill="${RED}" stroke-width="4"/>
  <circle cx="${x}" cy="52" r="12" fill="${INK}" stroke="none"/>
  <circle cx="${x + 4}" cy="47" r="4.5" fill="#fff" stroke="none"/>`;

const frogHead = `
  <g stroke="${INK}" stroke-width="5" stroke-linejoin="round" stroke-linecap="round">
    <circle cx="58" cy="52" r="27" fill="none" stroke-width="10"/>
    <circle cx="142" cy="52" r="27" fill="none" stroke-width="10"/>
    <ellipse cx="100" cy="90" rx="68" ry="46" fill="none" stroke-width="10"/>
    <circle cx="58" cy="52" r="27" fill="${GREEN}" stroke="none"/>
    <circle cx="142" cy="52" r="27" fill="${GREEN}" stroke="none"/>
    <ellipse cx="100" cy="90" rx="68" ry="46" fill="${GREEN}" stroke="none"/>
    ${eye(58)}
    ${eye(142)}
    <circle cx="46" cy="96" r="10" fill="${BLUSH}" stroke="none"/>
    <circle cx="154" cy="96" r="10" fill="${BLUSH}" stroke="none"/>
    <path d="M62 92 Q100 138 138 92 Q100 104 62 92 Z" fill="#c2344f"/>
    <path d="M84 112 Q100 104 116 112 Q112 122 100 122 Q88 122 84 112 Z" fill="${BLUSH}" stroke="none"/>
  </g>`;

/** radius 0 llena todo el cuadrado: iOS y Android recortan el ícono por su cuenta. */
function icon({ radius, scale }) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#6c4df6"/>
      <stop offset="1" stop-color="#3fc1f4"/>
    </linearGradient>
  </defs>
  <rect width="512" height="512" rx="${radius}" fill="url(#sky)"/>
  <g transform="translate(256 262) scale(${scale}) translate(-100 -80)">${frogHead}</g>
</svg>
`;
}

const rounded = icon({ radius: 112, scale: 2.7 });
const fullBleed = icon({ radius: 0, scale: 2.7 });
// Las máscaras de Android solo garantizan el círculo central: la rana va más pequeña.
const maskable = icon({ radius: 0, scale: 2.1 });

const render = (svg, size, name) =>
  sharp(Buffer.from(svg), { density: 300 }).resize(size, size).png().toFile(`public/${name}`);

await writeFile('public/icon.svg', rounded);
await render(rounded, 192, 'icon-192.png');
await render(rounded, 512, 'icon-512.png');
await render(maskable, 512, 'icon-maskable-512.png');
await render(fullBleed, 180, 'apple-touch-icon.png');
console.log('Íconos generados en public/');
