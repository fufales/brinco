import { useCallback, useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import confetti from 'canvas-confetti';
import { motion } from 'motion/react';
import { useLocation } from 'wouter';
import { ResultsScreen } from '../../shared/lesson/ResultsScreen';
import type { LessonItem } from '../../shared/lesson/types';
import { shuffle, starsFor } from '../../shared/lesson/utils';
import { recordLesson } from '../../shared/progress';
import { sfx } from '../../shared/sfx';
import { speak } from '../../shared/speech';
import { Mascot, type Mood } from '../../shared/ui/Mascot';
import { Sheet } from '../../shared/ui/Sheet';
import { CloseIcon, SpeakerIcon } from '../../shared/ui/icons';
import { useBlockUpdates } from '../../shared/updates';
import { PlaceArt } from './illustrations';
import { PEOPLE, type CampusArea } from '../amigos/people';
import type { Topic } from './topics';

/** Dónde está cada lugar en el plano; la entrada, abajo, es donde empieza la rana. */
const ROOMS: { placeId: string; area: CampusArea }[] = [
  { placeId: 'garden', area: 'garden' },
  { placeId: 'cafeteria', area: 'cafeteria' },
  { placeId: 'classroom', area: 'classroom' },
  { placeId: 'library', area: 'library' },
  { placeId: 'restroom', area: 'restroom' },
  { placeId: 'principal-office', area: 'office' },
];
const ENTRANCE = 'entrance';
const SAY_NEXT_MS = 300;
const NEXT_ROUND_MS = 1300;
const CHEER_AFTER_HOP_MS = 380;
const WRONG_TAPS_BEFORE_HINT = 2;

/**
 * El plano de la escuela. Con lugares, se tocan los cuartos ("Go to the library!");
 * con personas, cada una está en su lugar y se toca a ella ("Find the cook!").
 */
export function CampusGame({ topic }: { topic: Topic }) {
  useBlockUpdates();
  const [game, setGame] = useState(0);
  return <CampusRound key={game} topic={topic} onRestart={() => setGame((count) => count + 1)} />;
}

function CampusRound({ topic, onRestart }: { topic: Topic; onRestart: () => void }) {
  const [, navigate] = useLocation();
  const { Art } = topic;
  const peopleMode = topic.id === 'people';
  const [order] = useState(() => shuffle(topic.items));
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
    const timer = window.setTimeout(() => speak(topic.say(target)), SAY_NEXT_MS);
    return () => window.clearTimeout(timer);
  }, [target, finished, topic]);

  // La rana se para abajo al centro de donde está; junto a una persona, a sus pies.
  const placeFrog = useCallback(() => {
    const area = plan.current?.getBoundingClientRect();
    const spot = spots.current[frogAt]?.getBoundingClientRect();
    if (!area || !spot) return;
    const lift = peopleMode && frogAt !== ENTRANCE ? 6 : 30;
    setFrogPos({ x: spot.left - area.left + spot.width / 2, y: spot.bottom - area.top - lift });
  }, [frogAt, peopleMode]);

  useLayoutEffect(placeFrog, [placeFrog]);
  useEffect(() => {
    window.addEventListener('resize', placeFrog);
    return () => window.removeEventListener('resize', placeFrog);
  }, [placeFrog]);

  const later = (callback: () => void, delay: number) => {
    timers.current.push(window.setTimeout(callback, delay));
  };

  const arrive = (item: LessonItem, element: HTMLElement) => {
    busy.current = true;
    if (wrongTaps === 0) cleanRounds.current += 1;
    setFrogAt(item.id);
    setHops((count) => count + 1);
    sfx.hop();

    later(() => {
      const box = element.getBoundingClientRect();
      sfx.correct();
      speak(item.en);
      setMood('cheer');
      setReached(item.id);
      void confetti({
        particleCount: 26,
        spread: 60,
        origin: {
          x: (box.left + box.width / 2) / window.innerWidth,
          y: (box.top + box.height / 2) / window.innerHeight,
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
          topic.gameKey,
          stars,
          topic.items.filter((each) => !missed.current.has(each.id)).map((each) => each.id),
        );
        setFinished({ stars, clean });
      } else {
        setRound(round + 1);
      }
    }, NEXT_ROUND_MS);
  };

  const tap = (item: LessonItem, element: HTMLElement) => {
    if (busy.current) return;
    if (item.id === target.id) {
      arrive(item, element);
      return;
    }
    // El equivocado tiembla y la voz repite la frase.
    missed.current.add(target.id);
    sfx.oops();
    speak(topic.say(target));
    setMood('oops');
    setWrong((current) => ({ id: item.id, count: (current?.count ?? 0) + 1 }));
    setWrongTaps((count) => count + 1);
  };

  /** Lo que se toca: el cuarto entero o una persona. */
  const tappable = (item: LessonItem, className: string, style: CSSProperties | undefined, content: ReactNode) => {
    const isWrong = wrong?.id === item.id;
    const needsHint = item.id === target.id && wrongTaps >= WRONG_TAPS_BEFORE_HINT;
    return (
      <motion.button
        key={`${item.id}-${isWrong ? wrong.count : 0}`}
        ref={(element) => {
          spots.current[item.id] = element;
        }}
        className={`${className} ${needsHint ? 'is-hint' : ''} ${reached === item.id ? 'is-reached' : ''}`}
        style={style}
        aria-label={item.es}
        animate={isWrong ? { x: [0, -9, 9, -6, 6, 0] } : undefined}
        transition={{ duration: 0.35 }}
        whileTap={{ scale: 0.96 }}
        onClick={(event) => tap(item, event.currentTarget)}
      >
        {content}
      </motion.button>
    );
  };

  const peopleIn = (area: CampusArea) => {
    const here = PEOPLE.filter((person) => person.area === area);
    if (here.length === 0) return null;
    return (
      <div className={`campus__people campus__people--${area}`}>
        {here.map((person) => tappable(person, 'campus__person', undefined, <Art id={person.id} play={reached === person.id ? 1 : 0} />))}
      </div>
    );
  };

  if (finished) {
    return (
      <ResultsScreen
        stars={finished.stars}
        clean={finished.clean}
        total={order.length}
        items={topic.items}
        renderThumb={(item, play) => <Art id={item.id} play={play} />}
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
        <button className="speaker speaker--inline" aria-label="Oír otra vez" onClick={() => speak(topic.say(target))}>
          <SpeakerIcon />
        </button>
        <p lang="en">
          {topic.sayVerb} <strong>{target.en}</strong>!
        </p>
      </div>

      <div className={`campus__plan ${peopleMode ? 'campus__plan--people' : ''}`} ref={plan}>
        {ROOMS.map((room) => {
          const place = topic.id === 'places' ? topic.items.find((item) => item.id === room.placeId) : undefined;
          const art = (
            <span className="campus__art">
              <PlaceArt id={room.placeId} play={reached === room.placeId ? 1 : 0} />
            </span>
          );
          if (place) {
            return tappable(place, `campus__room campus__room--${room.area}`, { gridArea: room.area }, art);
          }
          return (
            <div key={room.placeId} className={`campus__room campus__room--${room.area}`} style={{ gridArea: room.area }}>
              {art}
              {peopleIn(room.area)}
            </div>
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
          {peopleMode && peopleIn('entrance')}
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
