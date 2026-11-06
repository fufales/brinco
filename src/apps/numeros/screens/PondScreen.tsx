import { useState, type CSSProperties, type ReactNode } from 'react';
import { motion } from 'motion/react';
import { useLocation } from 'wouter';
import { totalStars, useProgress } from '../../../shared/progress';
import { sfx } from '../../../shared/sfx';
import { Mascot } from '../../../shared/ui/Mascot';
import { Sheet } from '../../../shared/ui/Sheet';
import { TabBar } from '../../../shared/ui/TabBar';
import { BackIcon, EarIcon, PlayIcon, StarIcon } from '../../../shared/ui/icons';
import {
  FIREFLY_PROGRESS_KEY,
  numbersIn,
  progressKey,
  scopeInfo,
  type NumberScope,
} from '../numbers';
import { LilyPad, NumberTile } from '../parts';
import { Firefly } from './FireflyScreen';
import { NUMBER_TABS } from './tabs';

const BOARD_WIDTH = 375;
const BOARD_HEIGHT = 780;

const FIREFLY_COLOR = { color: '#2b2f7a', edge: '#191b52' };

interface Node {
  id: string;
  key: string;
  x: number;
  y: number;
  label: ReactNode;
  caption?: string;
  ariaLabel: string;
  colors: { color: string; edge: string };
  scope?: NumberScope;
}

const NODES: Node[] = [
  { id: 'a', key: progressKey('a'), x: 112, y: 105, label: '11–15', ariaLabel: 'Del 11 al 15', colors: scopeInfo('a'), scope: 'a' },
  { id: 'b', key: progressKey('b'), x: 262, y: 270, label: '16–20', ariaLabel: 'Del 16 al 20', colors: scopeInfo('b'), scope: 'b' },
  {
    id: 'firefly',
    key: FIREFLY_PROGRESS_KEY,
    x: 112,
    y: 435,
    label: <Firefly value={null} />,
    caption: 'Luciérnagas',
    ariaLabel: 'Atrapa las luciérnagas',
    colors: FIREFLY_COLOR,
  },
  {
    id: 'todos',
    key: progressKey('todos'),
    x: 262,
    y: 610,
    label: '11–20',
    caption: 'Gran reto',
    ariaLabel: 'Gran reto, del 11 al 20',
    colors: scopeInfo('todos'),
    scope: 'todos',
  },
];

const ROUTE = 'M112 105 C112 195 262 180 262 270 C262 360 112 345 112 435 C112 530 262 515 262 610';

const RIPPLES = [
  { x: 280, y: 110 },
  { x: 30, y: 250 },
  { x: 300, y: 420 },
  { x: 40, y: 590 },
  { x: 190, y: 30 },
  { x: 60, y: 720 },
];

function Stars({ count }: { count: number }) {
  return (
    <span className="stars" style={{ fontSize: 24 }} aria-label={`${count} de 3 estrellas`}>
      {[0, 1, 2].map((index) => (
        <StarIcon key={index} filled={index < count} />
      ))}
    </span>
  );
}

function nextNode(stars: Record<string, number>): string {
  const pending = NODES.find((node) => !stars[node.key]);
  if (pending) return pending.id;
  return NODES.reduce((lowest, node) => ((stars[node.key] ?? 0) < (stars[lowest.key] ?? 0) ? node : lowest)).id;
}

export function PondScreen() {
  const state = useProgress();
  const [, navigate] = useLocation();
  const [selected, setSelected] = useState<NumberScope | null>(null);
  const [lastSelected, setLastSelected] = useState<NumberScope>('a');
  const next = nextNode(state.stars);
  const info = scopeInfo(lastSelected);

  const openNode = (node: Node) => {
    sfx.pop();
    if (!node.scope) {
      navigate('/luciernagas');
      return;
    }
    setLastSelected(node.scope);
    setSelected(node.scope);
  };

  return (
    <div className="screen pond">
      <header className="bar">
        <button className="icon-btn" aria-label="Volver al inicio" onClick={() => navigate('~/')}>
          <BackIcon />
        </button>
        <h1 className="bar__title">Brincanúmeros</h1>
        <div className="pill" aria-label={`${totalStars(state)} estrellas`}>
          <StarIcon /> {totalStars(state)}
        </div>
      </header>

      <div className="scroll">
        <div className="pond__board" style={{ aspectRatio: `${BOARD_WIDTH} / ${BOARD_HEIGHT}` }}>
          <svg className="pond__route" viewBox={`0 0 ${BOARD_WIDTH} ${BOARD_HEIGHT}`} aria-hidden="true">
            {RIPPLES.map((ripple, index) => (
              <ellipse
                key={index}
                className="pond__ripple"
                style={{ animationDelay: `${index * -0.8}s` }}
                cx={ripple.x}
                cy={ripple.y}
                rx={26}
                ry={9}
              />
            ))}
            <path d={ROUTE} className="pond__path" />
          </svg>

          {NODES.map((node, index) => (
            <div
              key={node.id}
              className="pond-node"
              style={
                {
                  left: `${(node.x / BOARD_WIDTH) * 100}%`,
                  top: `${(node.y / BOARD_HEIGHT) * 100}%`,
                  '--c': node.colors.color,
                  '--e': node.colors.edge,
                } as CSSProperties
              }
            >
              <span className="pond-node__lily" aria-hidden="true">
                <LilyPad />
              </span>
              <motion.button
                className="pond-node__btn"
                aria-label={node.ariaLabel}
                initial={{ scale: 0.4, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', bounce: 0.55, delay: index * 0.07 }}
                onClick={() => openNode(node)}
              >
                {node.label}
              </motion.button>
              <div className="pond-node__label">
                {node.caption && <strong>{node.caption}</strong>}
                <Stars count={state.stars[node.key] ?? 0} />
              </div>
              {node.id === next && (
                <motion.div
                  className="pond-node__frog"
                  style={{ [index % 2 ? 'left' : 'right']: -48 }}
                  animate={{ y: [0, -14, 0], scaleY: [1, 1.05, 0.95, 1] }}
                  transition={{ duration: 1.2, repeat: Infinity, repeatDelay: 0.9 }}
                >
                  <Mascot mood="happy" />
                </motion.div>
              )}
            </div>
          ))}
        </div>
      </div>

      <TabBar tabs={NUMBER_TABS} active="map" />

      <Sheet open={selected !== null} onClose={() => setSelected(null)} label={info.title}>
        <div className="scope-sheet" style={{ '--c': info.color, '--e': info.edge } as CSSProperties}>
          <h2>{info.title}</h2>
          <div className="scope-sheet__art" aria-hidden="true">
            {numbersIn(lastSelected)
              .slice(0, 5)
              .map((item, index) => (
                <motion.span
                  key={item.id}
                  className="scope-sheet__num"
                  initial={{ scale: 0.3, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: 'spring', bounce: 0.55, delay: index * 0.05 }}
                >
                  <NumberTile value={item.value} />
                </motion.span>
              ))}
          </div>
          <button
            className="btn btn--sky btn--wide"
            onClick={() => {
              sfx.tap();
              navigate(`/${lastSelected}/escuchar`);
            }}
          >
            <EarIcon /> Escuchar números
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
