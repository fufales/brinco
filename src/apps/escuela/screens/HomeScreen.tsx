import type { ComponentType, CSSProperties } from 'react';
import { motion } from 'motion/react';
import { useLocation } from 'wouter';
import { totalStars, useProgress, type State } from '../../../shared/progress';
import { sfx } from '../../../shared/sfx';
import { Mascot } from '../../../shared/ui/Mascot';
import { BackIcon, EarIcon, MapIcon, PlayIcon, StarIcon } from '../../../shared/ui/icons';
import { SchoolIcon } from '../summary';
import { PEOPLE_TOPIC, PLACES_TOPIC, type Topic } from '../topics';

interface Option {
  path: string;
  title: string;
  hint: string;
  Icon: ComponentType;
  color: string;
  edge: string;
  starsKey?: string;
}

const SKY = { color: '#22b8f0', edge: '#0f8fc4' };
const LIME = { color: '#6fd64b', edge: '#47a82a' };
const SUN = { color: '#ffb627', edge: '#df8f00' };

const SECTIONS: { title: string; topic: Topic; options: Option[] }[] = [
  {
    title: 'Lugares',
    topic: PLACES_TOPIC,
    options: [
      { path: '/descubrir', title: 'Descubre', hint: 'Oye cómo se dice cada lugar', Icon: EarIcon, ...SKY },
      { path: '/leccion', title: 'Lección', hint: 'Escucha, lee y une', Icon: PlayIcon, ...LIME, starsKey: PLACES_TOPIC.lessonKey },
      { path: '/mapa', title: '¿Dónde está?', hint: 'Lleva a la rana por la escuela', Icon: MapIcon, ...SUN, starsKey: PLACES_TOPIC.gameKey },
    ],
  },
  {
    title: 'Personas',
    topic: PEOPLE_TOPIC,
    options: [
      { path: '/personas/descubrir', title: 'Descubre', hint: 'Conoce a la gente de la escuela', Icon: EarIcon, ...SKY },
      { path: '/personas/leccion', title: 'Lección', hint: 'Escucha, lee y une', Icon: PlayIcon, ...LIME, starsKey: PEOPLE_TOPIC.lessonKey },
      { path: '/personas/quien', title: '¿Quién es?', hint: 'Encuentra a cada persona', Icon: MapIcon, ...SUN, starsKey: PEOPLE_TOPIC.gameKey },
    ],
  },
];

function OptionButton({ option, state, delay }: { option: Option; state: State; delay: number }) {
  const [, navigate] = useLocation();
  const stars = option.starsKey ? (state.stars[option.starsKey] ?? 0) : null;
  return (
    <motion.button
      className="school-option"
      style={{ '--c': option.color, '--e': option.edge } as CSSProperties}
      initial={{ y: 30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', bounce: 0.45, delay }}
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
}

export function HomeScreen() {
  const state = useProgress();
  const [, navigate] = useLocation();

  return (
    <div className="screen school">
      <header className="bar">
        <button className="icon-btn" aria-label="Volver al inicio" onClick={() => navigate('~/')}>
          <BackIcon />
        </button>
        <h1 className="bar__title">Brincaescuela</h1>
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
            <SchoolIcon />
          </motion.span>
          <motion.span
            className="school__frog"
            animate={{ y: [0, -14, 0], scaleY: [1, 1.05, 0.95, 1] }}
            transition={{ duration: 1.2, repeat: Infinity, repeatDelay: 0.9 }}
          >
            <Mascot mood="wave" />
          </motion.span>
        </div>

        {SECTIONS.map((section, sectionIndex) => (
          <section key={section.title} className="school__section">
            <h2 className="school__heading">
              <span className="school__heading-art" aria-hidden="true">
                <section.topic.Art id={section.topic.items[0].id} />
              </span>
              {section.title}
            </h2>
            <div className="school__options">
              {section.options.map((option, index) => (
                <OptionButton key={option.path} option={option} state={state} delay={0.1 + (sectionIndex * 3 + index) * 0.06} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
