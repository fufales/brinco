import { useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { isMastered, useProgress } from '../progress';
import { sfx } from '../sfx';
import { speak } from '../speech';
import { VoiceNotice } from '../ui/VoiceNotice';
import { BackIcon, PlayIcon, SpeakerIcon, StarIcon } from '../ui/icons';
import { useBlockUpdates } from '../updates';
import type { LessonItem } from './types';
import './lesson.css';

/** Tocar otra vez dentro de este tiempo repite la palabra más lento. */
const REPEAT_WINDOW_MS = 6000;
const WIN_DELAY_MS = 1100;

interface LastTap {
  id: string;
  time: number;
  slow: boolean;
}

/** Tarjetas que dicen la palabra en inglés al tocarlas. */
export function DiscoverGrid<T extends LessonItem>({
  title,
  hint,
  items,
  accent,
  renderArt,
  renderWord,
  onBack,
  onPlay,
  footer,
}: {
  title: string;
  hint: string;
  items: T[];
  accent: { color: string; edge: string };
  renderArt: (item: T, plays: number) => ReactNode;
  renderWord: (item: T) => ReactNode;
  onBack: () => void;
  onPlay: () => void;
  footer?: ReactNode;
}) {
  useBlockUpdates();
  const state = useProgress();
  const [heard, setHeard] = useState<Record<string, number>>({});
  const [slowId, setSlowId] = useState<string | null>(null);
  const lastTap = useRef<LastTap | null>(null);

  const heardCount = Object.keys(heard).length;
  const allHeard = heardCount === items.length;

  const hear = (item: T) => {
    const now = performance.now();
    const previous = lastTap.current;
    const repeated = previous?.id === item.id && now - previous.time < REPEAT_WINDOW_MS;
    const slow = repeated && !previous.slow;
    lastTap.current = { id: item.id, time: now, slow };
    speak(item.en, { slow });
    setSlowId(slow ? item.id : null);
    const next = { ...heard, [item.id]: (heard[item.id] ?? 0) + 1 };
    setHeard(next);
    // El premio suena después, para no tapar la última palabra.
    if (!allHeard && Object.keys(next).length === items.length) {
      window.setTimeout(() => sfx.win(), WIN_DELAY_MS);
    }
  };

  return (
    <div className="screen discover" style={{ '--accent': accent.color, '--accent-edge': accent.edge } as CSSProperties}>
      <header className="bar">
        <button className="icon-btn" aria-label="Volver al camino" onClick={onBack}>
          <BackIcon />
        </button>
        <div className="discover__head">
          <h1 className="bar__title bar__title--dark">{title}</h1>
          <div className="progress discover__progress">
            <motion.div
              className="progress__fill"
              initial={false}
              animate={{ width: `${(heardCount / items.length) * 100}%` }}
              transition={{ type: 'spring', bounce: 0.3 }}
            />
          </div>
        </div>
      </header>

      <div className="scroll discover__body">
        <VoiceNotice />
        <p className="discover__hint">{hint}</p>
        <div className="word-grid">
          {items.map((item, index) => {
            const plays = heard[item.id] ?? 0;
            return (
              <motion.button
                key={item.id}
                className={`word-card ${plays > 0 ? 'is-heard' : ''}`}
                aria-label={`${item.es}: escuchar en inglés`}
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', bounce: 0.5, delay: Math.min(index * 0.04, 0.4) }}
                whileTap={{ scale: 0.94 }}
                onClick={() => hear(item)}
              >
                {isMastered(state, item.id) && (
                  <span className="word-card__star" aria-label="Dominada">
                    <StarIcon />
                  </span>
                )}
                <span className="word-card__art">
                  {plays > 0 && <span key={plays} className="word-card__ring" aria-hidden="true" />}
                  {renderArt(item, plays)}
                </span>
                <span className="word-card__en">
                  {plays > 0 ? (
                    renderWord(item)
                  ) : (
                    <span className="word-card__tap">
                      <SpeakerIcon />
                    </span>
                  )}
                </span>
                <span className="word-card__es">{item.es}</span>
                <AnimatePresence>
                  {slowId === item.id && (
                    <motion.span
                      className="word-card__slow"
                      initial={{ scale: 0.4, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.4, opacity: 0 }}
                    >
                      más lento
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            );
          })}
        </div>
      </div>

      <div className="discover__cta">
        <motion.button
          className="btn btn--wide"
          animate={allHeard ? { scale: [1, 1.04, 1] } : { scale: 1 }}
          transition={allHeard ? { duration: 0.9, repeat: Infinity } : undefined}
          onClick={() => {
            sfx.tap();
            onPlay();
          }}
        >
          <PlayIcon /> ¡A jugar!
        </motion.button>
      </div>

      {footer}
    </div>
  );
}
