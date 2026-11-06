import { useEffect, type ComponentType } from 'react';
import { motion, useAnimationControls, type TargetAndTransition } from 'motion/react';
import { Kangaroo, Keys, King, Kite } from './letterK';
import { Walk, Water, Week } from './letterW';
import { Van, Vase, Vest, Violin, Volcano } from './letterV';
import { Jam, Jellyfish, Juice, Jump, Jumper } from './letterJ';

const ILLUSTRATIONS: Record<string, ComponentType> = {
  kangaroo: Kangaroo,
  kite: Kite,
  keys: Keys,
  king: King,
  water: Water,
  walk: Walk,
  week: Week,
  van: Van,
  vest: Vest,
  violin: Violin,
  vase: Vase,
  volcano: Volcano,
  juice: Juice,
  jam: Jam,
  jumper: Jumper,
  jump: Jump,
  jellyfish: Jellyfish,
};

const HOP: TargetAndTransition = {
  y: [0, -30, 0, -16, 0],
  scaleY: [1, 1.08, 0.9, 1.04, 1],
  transition: { duration: 0.8 },
};
const SWAY: TargetAndTransition = {
  rotate: [0, -12, 11, -7, 5, 0],
  y: [0, -8, 0, -6, 0, 0],
  transition: { duration: 1 },
};
const JINGLE: TargetAndTransition = {
  rotate: [0, -18, 16, -13, 10, -6, 0],
  transition: { duration: 0.8 },
};
const POP: TargetAndTransition = {
  scale: [1, 1.18, 0.94, 1.06, 1],
  transition: { duration: 0.6 },
};
const WOBBLE: TargetAndTransition = {
  scaleX: [1, 1.12, 0.92, 1.05, 1],
  scaleY: [1, 0.9, 1.08, 0.97, 1],
  transition: { duration: 0.7 },
};
const WALK: TargetAndTransition = {
  x: [0, -8, 8, -6, 6, 0],
  y: [0, -7, 0, -7, 0, 0],
  rotate: [0, -4, 4, -3, 3, 0],
  transition: { duration: 1 },
};
const JUMP: TargetAndTransition = {
  y: [0, 6, -40, 0, -12, 0],
  scaleY: [1, 0.86, 1.08, 0.92, 1.03, 1],
  transition: { duration: 0.9 },
};
const DRIVE: TargetAndTransition = {
  x: [0, -6, 22, -4, 0],
  rotate: [0, 1.5, -2, 1, 0],
  transition: { duration: 0.9 },
};
const FIDDLE: TargetAndTransition = {
  rotate: [0, -7, 7, -7, 7, -4, 0],
  transition: { duration: 1 },
};
const ERUPT: TargetAndTransition = {
  x: [0, -4, 4, -4, 4, -2, 0],
  scale: [1, 1.04, 1.1, 1.14, 1.08, 1.02, 1],
  transition: { duration: 0.9 },
};
const FLOAT: TargetAndTransition = {
  y: [0, -22, 4, -12, 0],
  scaleY: [1, 0.92, 1.08, 0.96, 1],
  transition: { duration: 1.1 },
};

const ANIMATIONS: Record<string, TargetAndTransition> = {
  kangaroo: HOP,
  kite: SWAY,
  keys: JINGLE,
  king: POP,
  water: WOBBLE,
  walk: WALK,
  week: POP,
  van: DRIVE,
  vest: WOBBLE,
  violin: FIDDLE,
  vase: SWAY,
  volcano: ERUPT,
  juice: WOBBLE,
  jam: POP,
  jumper: SWAY,
  jump: JUMP,
  jellyfish: FLOAT,
};

/** Dibuja la palabra y reproduce su animación cada vez que cambia `play`. */
export function WordArt({ id, play = 0 }: { id: string; play?: number }) {
  const controls = useAnimationControls();
  const Illustration = ILLUSTRATIONS[id];

  useEffect(() => {
    if (play > 0) void controls.start(ANIMATIONS[id]);
  }, [play, id, controls]);

  return (
    <motion.div animate={controls} style={{ width: '100%', height: '100%', transformOrigin: '50% 90%' }}>
      <Illustration />
    </motion.div>
  );
}
