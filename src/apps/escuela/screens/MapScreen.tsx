import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import confetti from 'canvas-confetti';
import { motion } from 'motion/react';
import { useLocation } from 'wouter';
import { ResultsScreen } from '../../../shared/lesson/ResultsScreen';
import { shuffle, starsFor } from '../../../shared/lesson/utils';
import { recordLesson } from '../../../shared/progress';
import { sfx } from '../../../shared/sfx';
import { speak } from '../../../shared/speech';
import { Mascot, type Mood } from '../../../shared/ui/Mascot';
import { Sheet } from '../../../shared/ui/Sheet';
import { CloseIcon, SpeakerIcon } from '../../../shared/ui/icons';
import { useBlockUpdates } from '../../../shared/updates';
import { PlaceArt } from '../illustrations';
import { directions, MAP_KEY, PLACES, type Place } from '../places';

/** Dónde está cada lugar en el plano: el jardín afuera, arriba; la entrada, abajo. */
const ROOMS: { id: string; area: string }[] = [
  { id: 'garden', area: 'garden' },
  { id: 'classroom', area: 'classroom' },
  { id: 'library', area: 'library' },
  { id: 'restroom', area: 'restroom' },
  { id: 'principal-office', area: 'office' },
];
const ENTRANCE = 'entrance';
const SAY_NEXT_MS = 300;
const NEXT_ROUND_MS = 1300;
const CHEER_AFTER_HOP_MS = 380;
const WRONG_TAPS_BEFORE_HINT = 2;

export function MapScreen() {
  useBlockUpdates();
  const [game, setGame] = useState(0);
  return <MapGame key={game} onRestart={() => setGame((count) => count + 1)} />;
}

function MapGame({ onRestart }: { onRestart: () => void }) {
  const [, navigate] = useLocation();
  const [order] = useState(() => shuffle(PLACES));
  const [round, setRound] = useState(0);
  const target = order[round];

  const [frogAt, setFrogAt] = useState(ENTRANCE);
  const [frogPos, setFrogPos] = useState<{ x: number; y: number } | null>(null);
  const [hops, setHops] = useState(0);
  const [reached, setReached] = useState<string | null>(null);
  const [mood, setMood] = useState<Mood>('happy');
  const [wrong, setWrong] = useState<{ id: string; count: number } | null>(null);
  const [wrongTaps, setWrongTaps] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const [finished, setFinished] = useState<{ stars: number; clean: number } | null>(null);

  const plan = useRef<HTMLDivElement>(null);
  const spots = useRef<Record<string, HTMLElement | null>>({});
  const busy = useRef(false);
  const cleanRounds = useRef(0);
  const missed = useRef(new Set<string>());
  const timers = useRef<number[]>([]);

  useEffect(() => () => timers.current.forEach((timer) => window.clearTimeout(timer)), []);

  useEffect(() => {
    if (finished) return;
    const timer = window.setTimeout(() => speak(directions(target)), SAY_NEXT_MS);
    return () => window.clearTimeout(timer);
  }, [target, finished]);

  // La rana se para abajo al centro del lugar donde está.
  const placeFrog = useCallback(() => {
    const area = plan.current?.getBoundingClientRect();
    const spot = spots.current[frogAt]?.getBoundingClientRect();
    if (!area || !spot) return;
    setFrogPos({ x: spot.left - area.left + spot.width / 2, y: spot.bottom - area.top - 30 });
  }, [frogAt]);

  useLayoutEffect(placeFrog, [placeFrog]);
  useEffect(() => {
    window.addEventListener('resize', placeFrog);
    return () => window.removeEventListener('resize', placeFrog);
  }, [placeFrog]);

  const later = (callback: () => void, delay: number) => {
    timers.current.push(window.setTimeout(callback, delay));
  };

  const arrive = (place: Place, element: HTMLElement) => {
    busy.current = true;
    if (wrongTaps === 0) cleanRounds.current += 1;
    setFrogAt(place.id);
    setHops((count) => count + 1);
    sfx.hop();

    later(() => {
      const room = element.getBoundingClientRect();
      sfx.correct();
      speak(place.en);
      setMood('cheer');
      setReached(place.id);
      void confetti({
        particleCount: 26,
        spread: 60,
        origin: {
          x: (room.left + room.width / 2) / window.innerWidth,
          y: (room.top + room.height / 2) / window.innerHeight,
        },
        disableForReducedMotion: true,
      });
    }, CHEER_AFTER_HOP_MS);

    later(() => {
      setMood('happy');
      setReached(null);
      setWrong(null);
      setWrongTaps(0);
      busy.current = false;
      if (round === order.length - 1) {
        const clean = cleanRounds.current;
        const stars = starsFor(clean, order.length);
        recordLesson(
          MAP_KEY,
          stars,
          PLACES.filter((item) => !missed.current.has(item.id)).map((item) => item.id),
        );
        setFinished({ stars, clean });
      } else {
        setRound(round + 1);
      }
    }, NEXT_ROUND_MS);
  };

  const tapRoom = (place: Place, element: HTMLElement) => {
    if (busy.current) return;
    if (place.id === target.id) {
      arrive(place, element);
      return;
    }
    // Ese lugar tiembla y la voz repite a dónde ir.
    missed.current.add(target.id);
    sfx.oops();
    speak(directions(target));
    setMood('oops');
    setWrong((current) => ({ id: place.id, count: (current?.count ?? 0) + 1 }));
    setWrongTaps((count) => count + 1);
  };

  if (finished) {
    return (
      <ResultsScreen
        stars={finished.stars}
        clean={finished.clean}
        total={order.length}
        items={PLACES}
        renderThumb={(item, play) => <PlaceArt id={item.id} play={play} />}
        onRestart={onRestart}
        onExit={() => navigate('/')}
      />
    );
  }

  return (
    <div className="screen campus">
      <header className="bar">
        <button className="icon-btn" aria-label="Salir del juego" onClick={() => setLeaving(true)}>
          <CloseIcon />
        </button>
        <div className="progress" role="progressbar" aria-valuemin={0} aria-valuemax={order.length} aria-valuenow={round}>
          <motion.div
            className="progress__fill"
            initial={{ width: 0 }}
            animate={{ width: `${(round / order.length) * 100}%` }}
            transition={{ type: 'spring', bounce: 0.35 }}
          />
        </div>
      </header>

      <div className="campus__prompt">
        <button className="speaker speaker--inline" aria-label="Oír otra vez" onClick={() => speak(directions(target))}>
          <SpeakerIcon />
        </button>
        <p lang="en">
          Go to the <strong>{target.en}</strong>!
        </p>
      </div>

      <div className="campus__plan" ref={plan}>
        {ROOMS.map((room) => {
          const place = PLACES.find((item) => item.id === room.id)!;
          const isWrong = wrong?.id === place.id;
          const needsHint = place.id === target.id && wrongTaps >= WRONG_TAPS_BEFORE_HINT;
          return (
            <motion.button
              key={`${place.id}-${isWrong ? wrong.count : 0}`}
              ref={(element) => {
                spots.current[place.id] = element;
              }}
              className={`campus__room campus__room--${room.area} ${needsHint ? 'is-hint' : ''} ${reached === place.id ? 'is-reached' : ''}`}
              style={{ gridArea: room.area }}
              aria-label={place.es}
              animate={isWrong ? { x: [0, -9, 9, -6, 6, 0] } : undefined}
              transition={{ duration: 0.35 }}
              whileTap={{ scale: 0.96 }}
              onClick={(event) => tapRoom(place, event.currentTarget)}
            >
              <span className="campus__art">
                <PlaceArt id={place.id} play={reached === place.id ? 1 : 0} />
              </span>
            </motion.button>
          );
        })}

        <div
          className="campus__entrance"
          style={{ gridArea: 'entrance' }}
          ref={(element) => {
            spots.current[ENTRANCE] = element;
          }}
        >
          <span className="campus__door" aria-hidden="true" />
        </div>

        {frogPos && (
          <motion.div
            className="campus__frog"
            initial={false}
            animate={{ x: frogPos.x, y: frogPos.y }}
            transition={{ duration: 0.45, ease: 'easeInOut' }}
          >
            <motion.div
              key={hops}
              className="campus__frog-body"
              animate={hops > 0 ? { y: [0, -54, 0], scaleY: [1, 1.08, 0.92, 1] } : undefined}
              transition={{ duration: 0.45 }}
            >
              <motion.div
                key={mood}
                animate={mood === 'oops' ? { rotate: [0, -6, 6, 0] } : undefined}
                transition={{ duration: 0.4 }}
                style={{ width: '100%', height: '100%' }}
              >
                <Mascot mood={mood} />
              </motion.div>
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
