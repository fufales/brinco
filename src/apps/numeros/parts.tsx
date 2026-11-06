import { motion } from 'motion/react';
import type { LessonItem } from '../../shared/lesson/types';
import { Mascot } from '../../shared/ui/Mascot';
import { NUMBERS, type NumberItem } from './numbers';

const COLORS = ['#f25c3a', '#0f9bd8', '#7a4df0', '#2fa84f', '#e8408f'];

export function colorOf(value: number): string {
  return COLORS[value % COLORS.length];
}

export function numberOf(item: LessonItem): NumberItem {
  return NUMBERS.find((candidate) => candidate.id === item.id)!;
}

export function NumberTile({ value }: { value: number }) {
  return (
    <span className="num-tile" style={{ color: colorOf(value) }}>
      {value}
    </span>
  );
}

/** Una hoja de nenúfar, con su muesca. */
export function LilyPad({ done = false }: { done?: boolean }) {
  return (
    <svg className="lily" viewBox="0 0 100 100" aria-hidden="true">
      <path
        d="M50 50 L63 7 A45 45 0 1 1 37 7 Z"
        fill={done ? '#b6f08f' : '#6fd64b'}
        stroke="#2b2a4c"
        strokeWidth={4}
        strokeLinejoin="round"
      />
      <path
        d="M50 50 L22 26 M50 50 L14 58 M50 50 L38 88 M50 50 L72 84 M50 50 L88 50 M50 50 L78 24"
        stroke="#47a82a"
        strokeWidth={3}
        strokeLinecap="round"
      />
    </svg>
  );
}

/** La rana en una posición (en %) del tablero: salta cada vez que `hops` cambia. */
export function HoppingFrog({ x, y, hops }: { x: number; y: number; hops: number }) {
  return (
    <motion.div
      className="hop-frog"
      initial={false}
      animate={{ left: `${x}%`, top: `${y}%` }}
      transition={{ duration: 0.42, ease: 'easeInOut' }}
    >
      <motion.div
        key={hops}
        className="hop-frog__body"
        animate={hops > 0 ? { y: [0, -44, 0], scaleY: [1, 1.1, 0.88, 1] } : undefined}
        transition={{ duration: 0.42 }}
      >
        <Mascot mood={hops > 0 ? 'cheer' : 'happy'} />
      </motion.div>
    </motion.div>
  );
}
