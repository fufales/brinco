import type { ComponentType, CSSProperties } from 'react';
import { motion } from 'motion/react';
import { useLocation } from 'wouter';
import { totalStars, useProgress } from '../../../shared/progress';
import { sfx } from '../../../shared/sfx';
import { Mascot } from '../../../shared/ui/Mascot';
import { BackIcon, EarIcon, MapIcon, PlayIcon, StarIcon } from '../../../shared/ui/icons';
import type { Topic } from '../topics';

export interface HomeOption {
  path: string;
  title: string;
  hint: string;
  Icon: ComponentType;
  color: string;
  edge: string;
  starsKey?: string;
}

/** Las tres actividades de siempre: descubrir, la lección y el juego del plano. */
export function schoolOptions(
  topic: Topic,
  discoverHint: string,
  game: { path: string; title: string; hint: string },
): HomeOption[] {
  return [
    { path: '/descubrir', title: 'Descubre', hint: discoverHint, Icon: EarIcon, color: '#22b8f0', edge: '#0f8fc4' },
    { path: '/leccion', title: 'Lección', hint: 'Escucha, lee y une', Icon: PlayIcon, color: '#6fd64b', edge: '#47a82a', starsKey: topic.lessonKey },
    { path: game.path, title: game.title, hint: game.hint, Icon: MapIcon, color: '#ffb627', edge: '#df8f00', starsKey: topic.gameKey },
  ];
}

/** Portada de Brincaescuela y de Brincamigos: el título, el dibujo y las actividades cambian. */
export function HomeScreen({
  title,
  Hero,
  options,
  className,
}: {
  title: string;
  Hero: ComponentType;
  options: HomeOption[];
  className: string;
}) {
  const state = useProgress();
  const [, navigate] = useLocation();

  return (
    <div className={`screen school ${className}`}>
      <header className="bar">
        <button className="icon-btn" aria-label="Volver al inicio" onClick={() => navigate('~/')}>
          <BackIcon />
        </button>
        <h1 className="bar__title">{title}</h1>
        <div className="pill" aria-label={`${totalStars(state)} estrellas`}>
          <StarIcon /> {totalStars(state)}
        </div>
      </header>

      <div className="scroll school__body">
        <div className="school__hero" aria-hidden="true">
          <motion.span
            className="school__building"
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', bounce: 0.5 }}
          >
            <Hero />
          </motion.span>
          <motion.span
            className="school__frog"
            animate={{ y: [0, -14, 0], scaleY: [1, 1.05, 0.95, 1] }}
            transition={{ duration: 1.2, repeat: Infinity, repeatDelay: 0.9 }}
          >
            <Mascot mood="wave" />
          </motion.span>
        </div>

        <div className="school__options">
          {options.map((option, index) => {
            const stars = option.starsKey ? (state.stars[option.starsKey] ?? 0) : null;
            return (
              <motion.button
                key={option.path}
                className="school-option"
                style={{ '--c': option.color, '--e': option.edge } as CSSProperties}
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ type: 'spring', bounce: 0.45, delay: 0.1 + index * 0.07 }}
                onClick={() => {
                  sfx.pop();
                  navigate(option.path);
                }}
              >
                <span className="school-option__icon">
                  <option.Icon />
                </span>
                <span className="school-option__text">
                  <strong>{option.title}</strong>
                  <span>{option.hint}</span>
                </span>
                {stars !== null && (
                  <span className="stars school-option__stars" aria-label={`${stars} de 3 estrellas`}>
                    {[0, 1, 2].map((star) => (
                      <StarIcon key={star} filled={star < stars} />
                    ))}
                  </span>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
