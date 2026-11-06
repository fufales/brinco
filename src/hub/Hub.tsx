import { useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { useLocation } from 'wouter';
import { APPS } from '../apps/registry';
import { totalStars, useProgress } from '../shared/progress';
import { sfx } from '../shared/sfx';
import { speak } from '../shared/speech';
import { Mascot } from '../shared/ui/Mascot';
import { SettingsSheet } from '../shared/ui/SettingsSheet';
import { VoiceNotice } from '../shared/ui/VoiceNotice';
import { GearIcon, LockIcon, NextIcon, StarIcon } from '../shared/ui/icons';
import './hub.css';

const LOGO_LETTERS = [
  { letter: 'B', rotate: -6, y: 2 },
  { letter: 'r', rotate: 4, y: -2 },
  { letter: 'i', rotate: -3, y: 2 },
  { letter: 'n', rotate: 5, y: -3 },
  { letter: 'c', rotate: -5, y: 1 },
  { letter: 'o', rotate: 6, y: -2 },
];

function CloudDeco({ className }: { className: string }) {
  return (
    <svg className={`hub__cloud ${className}`} viewBox="0 0 120 60" aria-hidden="true">
      <path
        d="M24 56 C6 56 2 34 20 30 C20 12 46 8 54 22 C66 6 94 12 94 32 C114 32 116 56 98 56 Z"
        fill="#fff"
      />
    </svg>
  );
}

export function Hub() {
  const state = useProgress();
  const [, navigate] = useLocation();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [greeting, setGreeting] = useState(false);
  const [hops, setHops] = useState(0);
  const greetingTimer = useRef(0);

  const greet = () => {
    sfx.hop();
    speak('Hello!');
    setHops((count) => count + 1);
    setGreeting(true);
    window.clearTimeout(greetingTimer.current);
    greetingTimer.current = window.setTimeout(() => setGreeting(false), 1800);
  };

  return (
    <div className="screen hub">
      <CloudDeco className="hub__cloud--a" />
      <CloudDeco className="hub__cloud--b" />
      <CloudDeco className="hub__cloud--c" />

      <header className="hub__top">
        <div className="hub__stars" aria-label={`${totalStars(state)} estrellas`}>
          <StarIcon /> {totalStars(state)}
        </div>
        <button className="icon-btn" aria-label="Ajustes para papás" onClick={() => setSettingsOpen(true)}>
          <GearIcon />
        </button>
      </header>

      <div className="scroll hub__body">
        <h1 className="hub__logo" aria-label="Brinco">
          {LOGO_LETTERS.map(({ letter, rotate, y }, index) => (
            <span key={index} aria-hidden="true" style={{ transform: `rotate(${rotate}deg) translateY(${y}px)` }}>
              {letter}
            </span>
          ))}
        </h1>

        <div className="hub__stage">
          <AnimatePresence>
            {greeting && (
              <motion.div
                className="hub__bubble"
                lang="en"
                initial={{ opacity: 0, scale: 0.5, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.7 }}
              >
                Hello!
              </motion.div>
            )}
          </AnimatePresence>
          <motion.button
            key={hops}
            className="hub__frog"
            aria-label="Saludar a Brinco"
            onClick={greet}
            initial={hops > 0 ? { y: 0 } : { y: 40, scale: 0.8, opacity: 0 }}
            animate={
              hops > 0
                ? { y: [0, -56, 0, -18, 0], scaleY: [1, 1.08, 0.88, 1.03, 1] }
                : { y: 0, scale: 1, opacity: 1 }
            }
            transition={hops > 0 ? { duration: 0.75 } : { type: 'spring', bounce: 0.55 }}
          >
            <Mascot mood={greeting ? 'wave' : 'happy'} />
          </motion.button>
          <div className="hub__pad" />
        </div>

        <VoiceNotice />

        <h2 className="hub__ask">¿Qué jugamos hoy?</h2>

        <div className="hub__tiles">
          {APPS.map((app, index) => {
            const summary = app.summary(state);
            return (
              <motion.button
                key={app.id}
                className="tile"
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.15 + index * 0.08, type: 'spring', bounce: 0.4 }}
                onClick={() => {
                  sfx.tap();
                  navigate(app.path);
                }}
              >
                <span className="tile__icon" style={{ background: app.color, boxShadow: `0 5px 0 ${app.edge}` }}>
                  <app.Icon />
                </span>
                <span className="tile__text">
                  <strong>{app.title}</strong>
                  <small>{app.tagline}</small>
                  <span className="progress tile__progress">
                    <span className="progress__fill" style={{ display: 'block', width: `${summary.value * 100}%` }} />
                  </span>
                  <small className="tile__count">{summary.label}</small>
                </span>
                <span className="tile__go">
                  <NextIcon />
                </span>
              </motion.button>
            );
          })}

          <div className="tile tile--soon">
            <span className="tile__icon tile__icon--soon">
              <LockIcon />
            </span>
            <span className="tile__text">
              <strong>Muy pronto</strong>
              <small>¡Vienen más juegos!</small>
            </span>
          </div>
        </div>
      </div>

      <SettingsSheet open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </div>
  );
}
