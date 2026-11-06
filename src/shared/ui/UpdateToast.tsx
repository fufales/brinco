import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { justUpdatedTo } from '../updates';
import { Mascot } from './Mascot';

const VISIBLE_MS = 4000;

export function UpdateToast() {
  const version = justUpdatedTo();
  const [visible, setVisible] = useState(version !== null);

  useEffect(() => {
    if (!visible) return;
    const timer = window.setTimeout(() => setVisible(false), VISIBLE_MS);
    return () => window.clearTimeout(timer);
  }, [visible]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="update-toast"
          role="status"
          initial={{ y: -90, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -90, opacity: 0 }}
          transition={{ type: 'spring', bounce: 0.4 }}
        >
          <span className="update-toast__frog">
            <Mascot mood="cheer" />
          </span>
          ¡Brinco se actualizó a la versión {version}!
        </motion.div>
      )}
    </AnimatePresence>
  );
}
