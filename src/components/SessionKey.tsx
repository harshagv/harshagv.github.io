import React, { useEffect, useRef, useState } from 'react';
import { KeyRound } from 'lucide-react';

// Session key chip: an ephemeral key fingerprint at the end of the navbar.
// One byte quietly rotates every 6s; navigating to a section re-keys all three
// bytes (listen for the 'session-rekey' event) and turns the key icon.
const HEX = '0123456789ABCDEF';
const hx = () => HEX[(Math.random() * 16) | 0] + HEX[(Math.random() * 16) | 0];

const SessionKey: React.FC = () => {
  const [bytes, setBytes] = useState<string[]>(() => [hx(), hx(), hx()]);
  const [hot, setHot] = useState<number[]>([]);
  const [rekey, setRekey] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const later = (fn: () => void, ms: number) => { timers.current.push(setTimeout(fn, ms)); };

    const scramble = (idx: number[]) => {
      setHot(idx);
      for (let n = 1; n <= 9; n++) {
        later(() => setBytes((b) => b.map((v, k) => (idx.includes(k) ? hx() : v))), n * 45);
      }
      later(() => setHot([]), 9 * 45 + 250);
    };

    const rotate = setInterval(() => {
      if (!document.hidden) scramble([(Math.random() * 3) | 0]);
    }, 6000);

    const onRekey = () => {
      setRekey(true);
      later(() => setRekey(false), 600);
      scramble([0, 1, 2]);
    };
    window.addEventListener('session-rekey', onRekey);

    return () => {
      clearInterval(rotate);
      window.removeEventListener('session-rekey', onRekey);
      timers.current.forEach(clearTimeout);
      timers.current = [];
    };
  }, []);

  return (
    <span
      className={`session-chip inline-flex items-center gap-1.5 ${rekey ? 'is-rekey' : ''}`}
      title="Ephemeral session key · re-keys when you navigate"
    >
      <KeyRound aria-hidden="true" className="session-chip-icon w-3.5 h-3.5 text-[var(--color-accent)]/70" />
      <span className="session-key font-mono text-[11px] tracking-[0.06em] tabular-nums" aria-hidden="true">
        {bytes.map((b, i) => (
          <React.Fragment key={i}>
            {i > 0 && <em>:</em>}
            <span className={hot.includes(i) ? 'is-hot' : undefined}>{b}</span>
          </React.Fragment>
        ))}
      </span>
    </span>
  );
};

export default SessionKey;
