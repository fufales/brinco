import { motion } from 'motion/react';

const CELLS_PER_FRAME = 10;
const STAGGER_S = 0.035;

function Frame({
  value,
  offset,
  counted,
  staggerFrom,
  label,
  onTap,
  tapLabel,
}: {
  value: number;
  offset: number;
  counted: number;
  staggerFrom: number;
  label?: string;
  onTap?: () => void;
  tapLabel?: string;
}) {
  const cells = Array.from({ length: CELLS_PER_FRAME }, (_, index) => {
    const position = offset + index;
    const filled = position < value;
    const showNumber = offset > 0 && index < counted;
    return (
      <span key={index} className="tf__cell">
        {filled && (
          <motion.span
            className={`tf__dot ${offset > 0 ? 'tf__dot--more' : ''} ${showNumber ? 'is-counted' : ''}`}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              type: 'spring',
              bounce: 0.55,
              duration: 0.4,
              delay: Math.max(0, position - staggerFrom) * STAGGER_S,
            }}
          >
            {showNumber ? position + 1 : ''}
          </motion.span>
        )}
      </span>
    );
  });

  const content = (
    <>
      <span className="tf__grid">{cells}</span>
      {label && <span className="tf__label">{label}</span>}
    </>
  );

  return onTap ? (
    <motion.button className="tf__frame" aria-label={tapLabel} whileTap={{ scale: 0.97 }} onClick={onTap}>
      {content}
    </motion.button>
  ) : (
    <span className="tf__frame">{content}</span>
  );
}

/**
 * Los números del 11 al 20 como "diez y algunos más": siempre el primer marco
 * lleno y en el segundo los que sobran.
 */
export function TenFrames({
  value,
  size = 'big',
  counted = 0,
  staggerFrom = 0,
  replay = 0,
  onTapTen,
  onTapMore,
}: {
  value: number;
  size?: 'big' | 'mini';
  /** Cuántos del segundo marco ya se contaron: muestran su número. */
  counted?: number;
  /** A partir de qué posición los nuevos entran uno tras otro. */
  staggerFrom?: number;
  /** Al cambiar, los que sobran vuelven a entrar. */
  replay?: number;
  onTapTen?: () => void;
  onTapMore?: () => void;
}) {
  return (
    <span className={`tf tf--${size}`}>
      <Frame
        value={value}
        offset={0}
        counted={0}
        staggerFrom={staggerFrom}
        label={value >= CELLS_PER_FRAME ? '10' : undefined}
        onTap={onTapTen}
        tapLabel="Diez"
      />
      <Frame
        key={replay}
        value={value}
        offset={CELLS_PER_FRAME}
        counted={counted}
        staggerFrom={staggerFrom}
        onTap={onTapMore}
        tapLabel="Contar los que sobran"
      />
    </span>
  );
}
