import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import confetti from 'canvas-confetti';
import { animate, motion, useMotionValue } from 'motion/react';
import { useLocation } from 'wouter';
import { ResultsScreen } from '../../shared/lesson/ResultsScreen';
import { shuffle, starsFor, type Random } from '../../shared/lesson/utils';
import { recordLesson } from '../../shared/progress';
import { sfx } from '../../shared/sfx';
import { speak } from '../../shared/speech';
import { Mascot, type Mood } from '../../shared/ui/Mascot';
import { Sheet } from '../../shared/ui/Sheet';
import { CloseIcon, SpeakerIcon } from '../../shared/ui/icons';
import { useBlockUpdates } from '../../shared/updates';
import { HighlightedSentence } from './DondeChoice';
import {
  acceptedSpots,
  command,
  GAME_KEY,
  POSITIONS,
  randomScene,
  sentence,
  SPOTS,
  type PositionId,
  type Scene,
  type SpotId,
} from './positions';
import { SceneView } from './Scene';

const ROUNDS_PER_POSITION = 2;
const PAD_IDS = Object.keys(SPOTS) as SpotId[];
const SAY_NEXT_MS = 300;
const BACK_HOME_MS = 650;
const NEXT_ROUND_MS = 1700;
const WRONG_TAPS_BEFORE_HINT = 2;
/** Qué tan cerca de una hojita hay que soltar a la rana, en fracción del ancho del escenario. */
const DROP_RADIUS = 0.17;
const FLOOR_SIZE = SPOTS.between.size;

/** Seis rondas: cada posición dos veces, mezcladas, sin repetir la misma seguida. */
export function makeRounds(random: Random = Math.random): Scene[] {
  const positions = POSITIONS.map((item) => item.id as PositionId);
  let order = shuffle(
    positions.flatMap((position) => Array<PositionId>(ROUNDS_PER_POSITION).fill(position)),
    random,
  );
  for (let attempt = 0; attempt < 50 && order.some((position, index) => index > 0 && position === order[index - 1]); attempt++) {
    order = shuffle(order, random);
  }
  return order.map((position) => randomScene(position, random));
}

export function MoveGame() {
  useBlockUpdates();
  const [game, setGame] = useState(0);
  return <MoveRound key={game} onRestart={() => setGame((count) => count + 1)} />;
}

function MoveRound({ onRestart }: { onRestart: () => void }) {
  const [, navigate] = useLocation();
  const [rounds] = useState(() => makeRounds());
  const [round, setRound] = useState(0);
  const scene = rounds[round];
  const accepted = acceptedSpots(scene);

  const [mood, setMood] = useState<Mood>('happy');
  const [placed, setPlaced] = useState<SpotId | null>(null);
  const [wrong, setWrong] = useState<{ spot: SpotId; count: number } | null>(null);
  const [wrongTaps, setWrongTaps] = useState(0);
  const [frogBox, setFrogBox] = useState<{ left: number; top: number; size: number } | null>(null);
  const [leaving, setLeaving] = useState(false);
  const [finished, setFinished] = useState<{ stars: number; clean: number } | null>(null);

  const arena = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const home = useRef<HTMLDivElement>(null);
  const frog = useRef<HTMLDivElement>(null);
  const pads = useRef<Partial<Record<SpotId, HTMLElement | null>>>({});
  const busy = useRef(false);
  const cleanRounds = useRef(0);
  const missed = useRef(new Set<string>());
  const timers = useRef<number[]>([]);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const scale = useMotionValue(1);

  useEffect(() => () => timers.current.forEach((timer) => window.clearTimeout(timer)), []);

  useEffect(() => {
    if (finished) return;
    const timer = window.setTimeout(() => speak(command(scene)), SAY_NEXT_MS);
    return () => window.clearTimeout(timer);
  }, [scene, finished]);

  // La rana espera en su hojita de salida, debajo del escenario; su tamaño sigue al del escenario.
  const measure = useCallback(() => {
    const area = arena.current?.getBoundingClientRect();
    const start = home.current?.getBoundingClientRect();
    const floor = stage.current?.getBoundingClientRect();
    if (!area || !start || !floor) return;
    const size = (floor.width * FLOOR_SIZE) / 100;
    setFrogBox({ left: start.left - area.left + start.width / 2 - size / 2, top: start.top - area.top + start.height / 2 - size * 0.9, size });
  }, []);

  useLayoutEffect(measure, [measure]);
  useEffect(() => {
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [measure]);

  const later = (callback: () => void, delay: number) => {
    timers.current.push(window.setTimeout(callback, delay));
  };

  /** Cuánto mover a la rana para que sus patas queden sobre una hojita. */
  const offsetTo = (spot: SpotId) => {
    const pad = pads.current[spot]?.getBoundingClientRect();
    const area = arena.current?.getBoundingClientRect();
    if (!pad || !area || !frogBox) return { dx: 0, dy: 0 };
    const footX = pad.left - area.left + pad.width / 2;
    const footY = pad.top - area.top + pad.height / 2;
    return { dx: footX - (frogBox.left + frogBox.size / 2), dy: footY - (frogBox.top + frogBox.size * 0.94) };
  };

  const goHome = () => {
    void animate(x, 0, { type: 'spring', bounce: 0.3 });
    void animate(y, [y.get(), Math.min(y.get(), 0) - 50, 0], { duration: 0.5 });
    void animate(scale, 1, { duration: 0.3 });
  };

  const moveTo = (spot: SpotId, hop: boolean) => {
    const { dx, dy } = offsetTo(spot);
    const grow = SPOTS[spot].size / FLOOR_SIZE;
    void animate(x, dx, { duration: 0.45, ease: 'easeOut' });
    void animate(y, hop ? [y.get(), Math.min(y.get(), dy) - 70, dy] : dy, { duration: 0.45 });
    void animate(scale, grow, { duration: 0.45 });
    sfx.hop();
  };

  const place = (spot: SpotId, hop: boolean) => {
    if (busy.current) return;
    busy.current = true;
    moveTo(spot, hop);

    if (accepted.includes(spot)) {
      if (wrongTaps === 0) cleanRounds.current += 1;
      later(() => {
        sfx.correct();
        speak(sentence(scene));
        setMood('cheer');
        setPlaced(spot);
        const pad = pads.current[spot]?.getBoundingClientRect();
        if (pad) {
          void confetti({
            particleCount: 30,
            spread: 65,
            origin: { x: (pad.left + pad.width / 2) / window.innerWidth, y: pad.top / window.innerHeight },
            disableForReducedMotion: true,
          });
        }
      }, 420);
      later(() => {
        x.set(0);
        y.set(0);
        scale.set(1);
        setMood('happy');
        setPlaced(null);
        setWrong(null);
        setWrongTaps(0);
        busy.current = false;
        if (round === rounds.length - 1) {
          const clean = cleanRounds.current;
          const stars = starsFor(clean, rounds.length);
          recordLesson(
            GAME_KEY,
            stars,
            POSITIONS.filter((item) => !missed.current.has(item.id)).map((item) => item.id),
          );
          setFinished({ stars, clean });
        } else {
          setRound(round + 1);
        }
      }, NEXT_ROUND_MS);
      return;
    }

    // Lugar equivocado: la rana se queda un momento, la hojita tiembla y regresa a la salida.
    missed.current.add(scene.position);
    later(() => {
      sfx.oops();
      speak(command(scene));
      setMood('oops');
      setWrong((current) => ({ spot, count: (current?.count ?? 0) + 1 }));
      setWrongTaps((count) => count + 1);
    }, 420);
    later(() => {
      goHome();
      setMood('happy');
      busy.current = false;
    }, BACK_HOME_MS + 420);
  };

  const drop = () => {
    const floor = stage.current?.getBoundingClientRect();
    const body = frog.current?.getBoundingClientRect();
    if (!floor || !body) return;
    // Las patas de la rana: el centro de abajo de donde la soltaron.
    const footX = body.left + body.width / 2;
    const footY = body.bottom - body.height * 0.06;
    let nearest: { spot: SpotId; distance: number } | null = null;
    for (const spot of PAD_IDS) {
      const pad = pads.current[spot]?.getBoundingClientRect();
      if (!pad) continue;
      const distance = Math.hypot(pad.left + pad.width / 2 - footX, pad.top + pad.height / 2 - footY);
      if (!nearest || distance < nearest.distance) nearest = { spot, distance };
    }
    if (nearest && nearest.distance < floor.width * DROP_RADIUS) {
      place(nearest.spot, false);
    } else {
      goHome();
    }
  };

  if (finished) {
    return (
      <ResultsScreen
        stars={finished.stars}
        clean={finished.clean}
        total={rounds.length}
        items={POSITIONS}
        renderThumb={(item, play) => (
          <SceneView scene={{ objects: ['van', 'vase'], position: item.id as PositionId, ref: 0 }} play={play} />
        )}
        onRestart={onRestart}
        onExit={() => navigate('/')}
      />
    );
  }

  const hintSpot = wrongTaps >= WRONG_TAPS_BEFORE_HINT ? accepted[0] : null;

  return (
    <div className="screen move">
      <header className="bar">
        <button className="icon-btn" aria-label="Salir del juego" onClick={() => setLeaving(true)}>
          <CloseIcon />
        </button>
        <div className="progress" role="progressbar" aria-valuemin={0} aria-valuemax={rounds.length} aria-valuenow={round}>
          <motion.div
            className="progress__fill"
            initial={{ width: 0 }}
            animate={{ width: `${(round / rounds.length) * 100}%` }}
            transition={{ type: 'spring', bounce: 0.35 }}
          />
        </div>
      </header>

      <div className="move__prompt">
        <button className="speaker speaker--inline" aria-label="Oír otra vez" onClick={() => speak(command(scene))}>
          <SpeakerIcon />
        </button>
        <p>
          <HighlightedSentence text={command(scene)} phrase={POSITIONS.find((item) => item.id === scene.position)!.en} />
        </p>
      </div>

      <div className="move__arena" ref={arena}>
        <SceneView key={round} scene={scene} frog={false} stageRef={stage}>
          {PAD_IDS.map((spot) => {
            const { x: spotX, floor, size, front } = SPOTS[spot];
            const isWrong = wrong?.spot === spot;
            return (
              <motion.button
                key={`${spot}-${isWrong ? wrong.count : 0}`}
                ref={(element) => {
                  pads.current[spot] = element;
                }}
                className={`move__pad ${front ? 'is-front' : ''} ${hintSpot === spot ? 'is-hint' : ''} ${placed === spot ? 'is-right' : ''}`}
                style={{ left: `${spotX - size / 2}%`, bottom: `${floor - 4}%`, width: `${size}%` }}
                aria-label={`Poner a la rana aquí`}
                animate={isWrong ? { x: [0, -8, 8, -5, 5, 0] } : undefined}
                transition={{ duration: 0.35 }}
                onClick={() => place(spot, true)}
              />
            );
          })}
        </SceneView>

        <div className="move__home" ref={home} aria-hidden="true">
          <span className="move__home-pad" />
          <span className="move__home-hint">Arrastra a la rana o toca una hojita</span>
        </div>

        {frogBox && (
          <motion.div
            ref={frog}
            className="move__frog"
            style={{
              left: frogBox.left,
              top: frogBox.top,
              width: frogBox.size,
              height: frogBox.size,
              x,
              y,
              scale,
              transformOrigin: '50% 94%',
            }}
            drag={!placed}
            dragMomentum={false}
            dragElastic={0}
            onDragStart={() => sfx.tap()}
            onDragEnd={drop}
            aria-label="Rana: arrástrala a su lugar"
          >
            <motion.div
              key={mood}
              style={{ width: '100%', height: '100%' }}
              animate={mood === 'cheer' ? { y: [0, -16, 0] } : mood === 'oops' ? { rotate: [0, -8, 8, 0] } : undefined}
              transition={{ duration: 0.45 }}
            >
              <Mascot mood={mood} />
            </motion.div>
          </motion.div>
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
