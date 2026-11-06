import { Mascot } from './Mascot';

/** Solo se ve con un teléfono acostado: iOS no permite bloquear la orientación de estas apps. */
export function RotateHint() {
  return (
    <div className="rotate-hint" role="status">
      <span className="rotate-hint__frog">
        <Mascot mood="wave" />
      </span>
      <p>Gira el teléfono para seguir jugando</p>
    </div>
  );
}
