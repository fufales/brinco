import { useEffect, useMemo, useRef, useState } from 'react';
import confetti from 'canvas-confetti';
import { motion } from 'motion/react';
import { useLocation } from 'wouter';
import { ResultsScreen } from '../../../shared/lesson/ResultsScreen';
import '../../../shared/lesson/lesson.css';
import { shuffle, starsFor } from '../../../shared/lesson/utils';
import { recordLesson } from '../../../shared/progress';
import { sfx } from '../../../shared/sfx';
import { speak } from '../../../shared/speech';
import { Mascot, type Mood } from '../../../shared/ui/Mascot';
import { Sheet } from '../../../shared/ui/Sheet';
import { CloseIcon, SpeakerIcon } from '../../../shared/ui/icons';
import { useBlockUpdates } from '../../../shared/updates';
import { FIREFLY_PROGRESS_KEY, NUMBERS, type NumberItem } from '../numbers';
import { LilyPad, NumberTile, numberOf } from '../parts';

const BUGS_PER_ROUND = 5;
/** Dónde pueden volar, en % de la zona de juego; abajo queda la rana. */
const SLOTS = [
  { x: 22, y: 12 },
  { x: 74, y: 9 },
  { x: 48, y: 29 },
  { x: 18, y: 45 },
  { x: 80, y: 42 },
  { x: 50, y: 60 },
];
const TONGUE_MS = 420;
const SAY_NEXT_MS = 300;
const WRONG_TAPS_BEFORE_HINT = 2;

interface Bug {
  item: NumberItem;
  x: number;
  y: number;
  driftX: number;
  driftY: number;
  duration: number;
}

function makeBugs(target: NumberItem): Bug[] {
  const others = shuffle(NUMBERS.filter((item) => item.id !== target.id)).slice(0, BUGS_PER_ROUND - 1);
  const slots = shuffle(SLOTS);
  return shuffle([target, ...others]).map((item, index) => ({
    item,
    x: slots[index].x,
    y: slots[index].y,
    driftX: 10 + Math.random() * 12,
    driftY: 8 + Math.random() * 10,
    duration: 3.5 + Math.random() * 2.5,
  }));
}

/** Una luciérnaga con su número; sin número, sirve de ícono en el mapa. */
export function Firefly({ value }: { value: number | null }) {
  return (
    <span className="firefly">
      <span className="firefly__wing firefly__wing--left" />
      <span className="firefly__wing firefly__wing--right" />
      <span className="firefly__body">{value}</span>
    </span>
  );
}

interface Tongue {
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
}

export function FireflyScreen() {
  useBlockUpdates();
  const [game, setGame] = useState(0);
  return <FireflyGame key={game} onRestart={() => setGame((count) => count + 1)} />;
}

function FireflyGame({ onRestart }: { onRestart: () => void }) {
  const [, navigate] = useLocation();
  const [order] = useState(() => shuffle(NUMBERS));
  const [round, setRound] = useState(0);
  const target = order[round];
  const bugs = useMemo(() => makeBugs(target), [target]);

  const [tongue, setTongue] = useState<Tongue | null>(null);
  const [caught, setCaught] = useState(false);
  const [mood, setMood] = useState<Mood>('happy');
  const [wrong, setWrong] = useState<{ id: string; count: number } | null>(null);
  const [wrongTaps, setWrongTaps] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const [finished, setFinished] = useState<{ stars: number; clean: number } | null>(null);

  const arena = useRef<HTMLDivElement>(null);
  const frog = useRef<HTMLDivElement>(null);
  const busy = useRef(false);
  const cleanRounds = useRef(0);
  const missed = useRef(new Set<string>());
  const nextRoundTimer = useRef(0);

  useEffect(() => () => window.clearTimeout(nextRoundTimer.current), []);

  useEffect(() => {
    if (finished) return;
    const timer = window.setTimeout(() => speak(target.en), SAY_NEXT_MS);
    return () => window.clearTimeout(timer);
  }, [target, finished]);

  const catchBug = (element: HTMLElement) => {
    const area = arena.current!.getBoundingClientRect();
    const mouth = frog.current!.getBoundingClientRect();
    const bug = element.getBoundingClientRect();
    busy.current = true;
    setTongue({
      fromX: mouth.left + mouth.width / 2 - area.left,
      fromY: mouth.top + mouth.height * 0.5 - area.top,
      toX: bug.left + bug.width / 2 - area.left,
      toY: bug.top + bug.height / 2 - area.top,
    });
    setCaught(true);
    setMood('cheer');
    sfx.correct();
    void confetti({
      particleCount: 22,
      spread: 50,
      origin: {
        x: (bug.left + bug.width / 2) / window.innerWidth,
        y: (bug.top + bug.height / 2) / window.innerHeight,
      },
      disableForReducedMotion: true,
    });
    if (wrongTaps === 0) cleanRounds.current += 1;

    nextRoundTimer.current = window.setTimeout(() => {
      setTongue(null);
      setCaught(false);
      setMood('happy');
      setWrong(null);
      setWrongTaps(0);
      busy.current = false;
      if (round === order.length - 1) {
        const clean = cleanRounds.current;
        const stars = starsFor(clean, order.length);
        recordLesson(
          FIREFLY_PROGRESS_KEY,
          stars,
          NUMBERS.filter((item) => !missed.current.has(item.id)).map((item) => item.id),
        );
        setFinished({ stars, clean });
      } else {
        setRound(round + 1);
      }
    }, TONGUE_MS);
  };

  const tapBug = (item: NumberItem, element: HTMLElement) => {
    if (busy.current) return;
    if (item.id === target.id) {
      catchBug(element);
      return;
    }
    // La equivocada se escapa un poco y la voz repite el número.
    missed.current.add(target.id);
    sfx.oops();
    speak(target.en);
    setMood('oops');
    setWrong((current) => ({ id: item.id, count: (current?.count ?? 0) + 1 }));
    setWrongTaps((count) => count + 1);
  };

  if (finished) {
    return (
      <ResultsScreen
        stars={finished.stars}
        clean={finished.clean}
        total={order.length}
        items={NUMBERS}
        renderThumb={(item) => <NumberTile value={numberOf(item).value} />}
        onRestart={onRestart}
        onExit={() => navigate('/')}
      />
    );
  }

  return (
    <div className="screen night">
      <header className="bar night__bar">
        <button className="icon-btn" aria-label="Salir del juego" onClick={() => setLeaving(true)}>
          <CloseIcon />
        </button>
        <div className="progress night__progress" role="progressbar" aria-valuemin={0} aria-valuemax={order.length} aria-valuenow={round}>
          <motion.div
            className="progress__fill"
            initial={{ width: 0 }}
            animate={{ width: `${(round / order.length) * 100}%` }}
            transition={{ type: 'spring', bounce: 0.35 }}
          />
        </div>
      </header>

      <div className="night__prompt">
        <button className="speaker speaker--inline" aria-label="Oír el número otra vez" onClick={() => speak(target.en)}>
          <SpeakerIcon />
        </button>
        <p>
          Atrapa <strong lang="en">{target.en}</strong>
        </p>
      </div>

      <div className="night__arena" ref={arena}>
        {bugs.map((bug) => {
          const isTarget = bug.item.id === target.id;
          const isWrong = wrong?.id === bug.item.id;
          const needsHint = isTarget && wrongTaps >= WRONG_TAPS_BEFORE_HINT;
          return (
            <span key={`${round}-${bug.item.id}`} className="night__spot" style={{ left: `${bug.x}%`, top: `${bug.y}%` }}>
              <motion.span
                className="night__drift"
                animate={{ x: [0, bug.driftX, 0, -bug.driftX, 0], y: [0, -bug.driftY, 0, bug.driftY, 0] }}
                transition={{ duration: bug.duration, repeat: Infinity, ease: 'easeInOut' }}
              >
                <motion.button
                  key={isWrong ? wrong.count : 0}
                  className={`night__bug ${needsHint ? 'is-hint' : ''}`}
                  aria-label={`Luciérnaga ${bug.item.value}`}
                  initial={{ scale: 0 }}
                  animate={
                    caught && isTarget
                      ? { scale: [1, 1.2, 0], opacity: [1, 1, 0] }
                      : isWrong
                        ? { scale: 1, x: [0, -9, 9, -6, 6, 0] }
                        : { scale: 1 }
                  }
                  transition={{ duration: caught && isTarget ? TONGUE_MS / 1000 : 0.35 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={(event) => tapBug(bug.item, event.currentTarget)}
                >
                  <Firefly value={bug.item.value} />
                </motion.button>
              </motion.span>
            </span>
          );
        })}

        <div className="night__frog">
          <span className="night__lily">
            <LilyPad />
          </span>
          <motion.div
            key={mood}
            ref={frog}
            className="night__frog-body"
            animate={mood === 'cheer' ? { y: [0, -14, 0] } : mood === 'oops' ? { rotate: [0, -5, 5, 0] } : undefined}
            transition={{ duration: 0.4 }}
          >
            <Mascot mood={mood} />
          </motion.div>
        </div>

        {tongue && (
          <svg className="night__tongue" aria-hidden="true">
            {[
              { stroke: '#2b2a4c', width: 15 },
              { stroke: '#ff8fb0', width: 9 },
            ].map(({ stroke, width }) => (
              <motion.line
                key={stroke}
                x1={tongue.fromX}
                y1={tongue.fromY}
                stroke={stroke}
                strokeWidth={width}
                strokeLinecap="round"
                initial={{ x2: tongue.fromX, y2: tongue.fromY }}
                animate={{
                  x2: [tongue.fromX, tongue.toX, tongue.fromX],
                  y2: [tongue.fromY, tongue.toY, tongue.fromY],
                }}
                transition={{ duration: TONGUE_MS / 1000, times: [0, 0.45, 1], ease: 'easeOut' }}
              />
            ))}
          </svg>
        )}
      </div>

      <Sheet open={leaving} onClose={() => setLeaving(false)} label="Salir del juego">
        <div className="leave">
          <div className="leave__frog">
            <Mascot mood="oops" />
          </div>
          <h2>¿Quieres salir?</h2>
          <p>Si sales ahora, esta partida no se guarda.</p>
          <button className="btn btn--wide" onClick={() => setLeaving(false)}>
            Seguir jugando
          </button>
          <button className="btn btn--white btn--wide" onClick={() => navigate('/')}>
            Salir
          </button>
        </div>
      </Sheet>
    </div>
  );
}
