import { useRef, useState, type CSSProperties } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { useLocation } from 'wouter';
import { isMastered, useProgress } from '../../../shared/progress';
import { sfx } from '../../../shared/sfx';
import { speak } from '../../../shared/speech';
import { VoiceNotice } from '../../../shared/ui/VoiceNotice';
import { BackIcon, PlayIcon, SpeakerIcon, StarIcon } from '../../../shared/ui/icons';
import { WordArt } from '../illustrations';
import { WordText } from '../WordText';
import { ALL_ID, scopeColors, scopeTitle, wordsIn, type Scope, type Word } from '../words';
import { TabBar } from './TabBar';

/** Tocar otra vez dentro de este tiempo repite la palabra más lento. */
const REPEAT_WINDOW_MS = 6000;
const WIN_DELAY_MS = 1100;

interface LastTap {
  id: string;
  time: number;
  slow: boolean;
}

export function DiscoverScreen({ scope }: { scope: Scope }) {
  const state = useProgress();
  const [, navigate] = useLocation();
  const words = wordsIn(scope);
  const { color, edge } = scopeColors(scope);
  const [heard, setHeard] = useState<Record<string, number>>({});
  const [slowId, setSlowId] = useState<string | null>(null);
  const lastTap = useRef<LastTap | null>(null);

  const heardCount = Object.keys(heard).length;
  const allHeard = heardCount === words.length;

  const hear = (word: Word) => {
    const now = performance.now();
    const previous = lastTap.current;
    const repeated = previous?.id === word.id && now - previous.time < REPEAT_WINDOW_MS;
    const slow = repeated && !previous.slow;
    lastTap.current = { id: word.id, time: now, slow };
    speak(word.en, { slow });
    setSlowId(slow ? word.id : null);
    const next = { ...heard, [word.id]: (heard[word.id] ?? 0) + 1 };
    setHeard(next);
    // El premio suena después, para no tapar la última palabra.
    if (!allHeard && Object.keys(next).length === words.length) {
      window.setTimeout(() => sfx.win(), WIN_DELAY_MS);
    }
  };

  return (
    <div className="screen discover" style={{ '--accent': color, '--accent-edge': edge } as CSSProperties}>
      <header className="bar">
        <button className="icon-btn" aria-label="Volver al camino" onClick={() => navigate('/')}>
          <BackIcon />
        </button>
        <div className="discover__head">
          <h1 className="bar__title bar__title--dark">{scopeTitle(scope)}</h1>
          <div className="progress discover__progress">
            <motion.div
              className="progress__fill"
              initial={false}
              animate={{ width: `${(heardCount / words.length) * 100}%` }}
              transition={{ type: 'spring', bounce: 0.3 }}
            />
          </div>
        </div>
      </header>

      <div className="scroll discover__body">
        <VoiceNotice />
        <p className="discover__hint">Toca una imagen para oír la palabra</p>
        <div className="word-grid">
          {words.map((word, index) => {
            const plays = heard[word.id] ?? 0;
            const mastered = isMastered(state, word.id);
            return (
              <motion.button
                key={word.id}
                className={`word-card ${plays > 0 ? 'is-heard' : ''}`}
                aria-label={`${word.es}: escuchar en inglés`}
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', bounce: 0.5, delay: Math.min(index * 0.04, 0.4) }}
                whileTap={{ scale: 0.94 }}
                onClick={() => hear(word)}
              >
                {mastered && (
                  <span className="word-card__star" aria-label="Palabra dominada">
                    <StarIcon />
                  </span>
                )}
                <span className="word-card__art">
                  {plays > 0 && <span key={plays} className="word-card__ring" aria-hidden="true" />}
                  <WordArt id={word.id} play={plays} />
                </span>
                <span className="word-card__en">
                  {plays > 0 ? (
                    <WordText text={word.en} />
                  ) : (
                    <span className="word-card__tap">
                      <SpeakerIcon />
                    </span>
                  )}
                </span>
                <span className="word-card__es">{word.es}</span>
                <AnimatePresence>
                  {slowId === word.id && (
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
            navigate(`/${scope}/leccion`);
          }}
        >
          <PlayIcon /> ¡A jugar!
        </motion.button>
      </div>

      {scope === ALL_ID && <TabBar active="words" />}
    </div>
  );
}
