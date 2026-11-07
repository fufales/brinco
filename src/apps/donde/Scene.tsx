import type { CSSProperties, ReactNode, Ref } from 'react';
import { motion } from 'motion/react';
import { Mascot } from '../../shared/ui/Mascot';
import { WordArt } from '../palabras/illustrations';
import { FLOOR, OBJECT_SIZE, OBJECT_X, SPOTS, spotFor, type Scene, type Spot } from './positions';

/** Posición y tamaño de algo parado en un lugar del escenario. */
export function spotStyle(spot: Spot): CSSProperties {
  return {
    left: `${spot.x - spot.size / 2}%`,
    bottom: `${spot.floor}%`,
    width: `${spot.size}%`,
    zIndex: spot.front ? 3 : 1,
  };
}

/**
 * Un escenario con dos objetos en el piso y, si se pide, la rana en su lugar.
 * Cada vez que cambia `play`, la rana vuelve a caer brincando.
 */
export function SceneView({
  scene,
  frog = true,
  play = 0,
  stageRef,
  children,
}: {
  scene: Pick<Scene, 'objects' | 'position' | 'ref'>;
  frog?: boolean;
  play?: number;
  stageRef?: Ref<HTMLDivElement>;
  children?: ReactNode;
}) {
  const spot = SPOTS[spotFor(scene)];
  return (
    <div className="stage" ref={stageRef}>
      <span className="stage__floor" aria-hidden="true" />
      {scene.objects.map((id, index) => (
        <span
          key={`${id}-${index}`}
          className="stage__object"
          aria-hidden="true"
          style={{ left: `${OBJECT_X[index] - OBJECT_SIZE / 2}%`, bottom: `${FLOOR}%`, width: `${OBJECT_SIZE}%` }}
        >
          <WordArt id={id} />
        </span>
      ))}
      {frog && (
        <motion.span
          key={play}
          className={`stage__frog ${spot.front ? 'is-front' : ''}`}
          aria-hidden="true"
          style={spotStyle(spot)}
          initial={play > 0 ? { y: '-80%', opacity: 0 } : false}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: 'spring', bounce: 0.55, duration: 0.6 }}
        >
          <Mascot mood="happy" />
        </motion.span>
      )}
      {children}
    </div>
  );
}
