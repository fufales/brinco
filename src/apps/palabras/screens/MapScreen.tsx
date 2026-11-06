import { useState, type CSSProperties } from 'react';
import { motion } from 'motion/react';
import { useLocation } from 'wouter';
import { totalStars, useProgress } from '../../../shared/progress';
import { sfx } from '../../../shared/sfx';
import { Mascot } from '../../../shared/ui/Mascot';
import { Sheet } from '../../../shared/ui/Sheet';
import { BackIcon, EarIcon, PlayIcon, StarIcon } from '../../../shared/ui/icons';
import { WordArt } from '../illustrations';
import { ALL_ID, scopeColors, scopeTitle, wordsIn, type Scope } from '../words';
import { TabBar } from './TabBar';

const BOARD_WIDTH = 375;
const BOARD_HEIGHT = 900;

const NODES: { scope: Scope; label: string; x: number; y: number; sticker: string }[] = [
  { scope: 'k', label: 'K', x: 112, y: 100, sticker: 'kangaroo' },
  { scope: 'w', label: 'W', x: 262, y: 262, sticker: 'water' },
  { scope: 'v', label: 'V', x: 112, y: 424, sticker: 'volcano' },
  { scope: 'j', label: 'J', x: 262, y: 586, sticker: 'jellyfish' },
  { scope: ALL_ID, label: '17', x: 188, y: 770, sticker: 'king' },
];

const ROUTE = `M112 100 C112 190 262 170 262 262 C262 352 112 332 112 424 C112 514 262 494 262 586 C262 670 188 680 188 770`;

const WAVES = [
  { x: 30, y: 190 },
  { x: 300, y: 130 },
  { x: 40, y: 330 },
  { x: 305, y: 400 },
  { x: 30, y: 560 },
  { x: 290, y: 720 },
  { x: 50, y: 700 },
  { x: 190, y: 40 },
];

function Stars({ count, size = 24 }: { count: number; size?: number }) {
  return (
    <span className="stars" style={{ fontSize: size }} aria-label={`${count} de 3 estrellas`}>
      {[0, 1, 2].map((index) => (
        <StarIcon key={index} filled={index < count} />
      ))}
    </span>
  );
}

/** La isla que le toca: la primera sin estrellas o, si ya pasó todas, la de menos estrellas. */
function nextScope(stars: Record<string, number>): Scope {
  const pending = NODES.find((node) => !stars[node.scope]);
  if (pending) return pending.scope;
  return NODES.reduce((lowest, node) => ((stars[node.scope] ?? 0) < (stars[lowest.scope] ?? 0) ? node : lowest)).scope;
}

export function MapScreen() {
  const state = useProgress();
  const [, navigate] = useLocation();
  const [selected, setSelected] = useState<Scope | null>(null);
  const [lastSelected, setLastSelected] = useState<Scope>('k');
  const next = nextScope(state.stars);

  const open = (scope: Scope) => {
    sfx.pop();
    setLastSelected(scope);
    setSelected(scope);
  };

  const { color, edge } = scopeColors(lastSelected);

  return (
    <div className="screen map">
      <header className="bar bar--clear">
        <button className="icon-btn" aria-label="Volver al inicio" onClick={() => navigate('~/')}>
          <BackIcon />
        </button>
        <h1 className="bar__title">Brincapalabras</h1>
        <div className="pill" aria-label={`${totalStars(state)} estrellas`}>
          <StarIcon /> {totalStars(state)}
        </div>
      </header>

      <div className="scroll">
        <div className="map__board" style={{ aspectRatio: `${BOARD_WIDTH} / ${BOARD_HEIGHT}` }}>
          <svg className="map__route" viewBox={`0 0 ${BOARD_WIDTH} ${BOARD_HEIGHT}`} aria-hidden="true">
            {WAVES.map((wave, index) => (
              <path
                key={index}
                className="map__wave"
                style={{ animationDelay: `${index * -0.7}s` }}
                d={`M${wave.x} ${wave.y} q9 -9 18 0 t18 0 t18 0`}
              />
            ))}
            <path d={ROUTE} className="map__path" />
          </svg>

          {NODES.map((node, index) => {
            const stars = state.stars[node.scope] ?? 0;
            const colors = scopeColors(node.scope);
            const isAll = node.scope === ALL_ID;
            return (
              <div
                key={node.scope}
                className="island"
                style={
                  {
                    left: `${(node.x / BOARD_WIDTH) * 100}%`,
                    top: `${(node.y / BOARD_HEIGHT) * 100}%`,
                    '--c': colors.color,
                    '--e': colors.edge,
                  } as CSSProperties
                }
              >
                <svg className="island__land" viewBox="0 0 190 90" aria-hidden="true">
                  <path
                    d="M12 50 C6 22 50 8 95 8 C140 8 186 20 178 52 C172 78 130 84 95 84 C55 84 18 78 12 50 Z"
                    fill="#ffe29a"
                    stroke="#2b2a4c"
                    strokeWidth={4}
                  />
                  <path
                    d="M30 42 C30 24 64 16 95 16 C126 16 162 24 160 44 C156 62 124 64 95 64 C64 64 34 62 30 42 Z"
                    fill="#7cd956"
                  />
                </svg>

                <div className="island__sticker" style={{ [index % 2 ? 'right' : 'left']: -46 }} aria-hidden="true">
                  <WordArt id={node.sticker} />
                </div>

                <motion.button
                  className="island__btn"
                  aria-label={isAll ? 'Gran reto, las 17 palabras' : `Letra ${node.label}`}
                  initial={{ scale: 0.4, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: 'spring', bounce: 0.55, delay: index * 0.07 }}
                  onClick={() => open(node.scope)}
                >
                  {node.label}
                </motion.button>

                <div className="island__label">
                  {isAll && <strong>Gran reto</strong>}
                  <Stars count={stars} />
                </div>

                {node.scope === next && (
                  <motion.div
                    className="island__frog"
                    style={{ [index % 2 ? 'left' : 'right']: -44 }}
                    animate={{ y: [0, -14, 0], scaleY: [1, 1.05, 0.95, 1] }}
                    transition={{ duration: 1.2, repeat: Infinity, repeatDelay: 0.9 }}
                  >
                    <Mascot mood="happy" />
                  </motion.div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <TabBar active="map" />

      <Sheet open={selected !== null} onClose={() => setSelected(null)} label={scopeTitle(lastSelected)}>
        <div className="scope-sheet" style={{ '--c': color, '--e': edge } as CSSProperties}>
          <h2>{lastSelected === ALL_ID ? 'Gran reto' : scopeTitle(lastSelected)}</h2>
          <div className="scope-sheet__art" aria-hidden="true">
            {wordsIn(lastSelected)
              .slice(0, 5)
              .map((word, index) => (
                <motion.span
                  key={word.id}
                  initial={{ scale: 0.3, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: 'spring', bounce: 0.55, delay: index * 0.05 }}
                >
                  <WordArt id={word.id} />
                </motion.span>
              ))}
          </div>
          <button
            className="btn btn--sky btn--wide"
            onClick={() => {
              sfx.tap();
              navigate(`/${lastSelected}/descubrir`);
            }}
          >
            <EarIcon /> Escuchar palabras
          </button>
          <button
            className="btn btn--wide"
            onClick={() => {
              sfx.tap();
              navigate(`/${lastSelected}/leccion`);
            }}
          >
            <PlayIcon /> ¡A jugar!
          </button>
        </div>
      </Sheet>
    </div>
  );
}
