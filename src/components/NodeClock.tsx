import React, { useEffect, useRef, useState } from 'react';

// Node clock beacon: Sydney local time, with a beacon that pulses exactly on each second.
const fmt = new Intl.DateTimeFormat('en-AU', {
  timeZone: 'Australia/Sydney',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hourCycle: 'h23',
  timeZoneName: 'short',
});

const read = () => {
  const p = fmt.formatToParts(new Date());
  const g = (k: Intl.DateTimeFormatPartTypes) => p.find((x) => x.type === k)?.value ?? '';
  return `${g('hour')}:${g('minute')}:${g('second')} ${g('timeZoneName')}`;
};

const NodeClock: React.FC = () => {
  const [time, setTime] = useState(read);
  const dot = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let t: ReturnType<typeof setTimeout>;
    const tick = () => {
      setTime(read());
      const el = dot.current;
      if (el) { el.classList.remove('is-tick'); void el.offsetWidth; el.classList.add('is-tick'); }
      t = setTimeout(tick, 1000 - (Date.now() % 1000)); // align to the second boundary
    };
    t = setTimeout(tick, 1000 - (Date.now() % 1000));
    return () => clearTimeout(t);
  }, []);

  return (
    <span className="node-clock inline-flex items-center gap-2 font-mono text-xs text-[var(--color-accent)]" title="Sydney local time">
      <span ref={dot} aria-hidden="true" className="node-clock-dot" />
      <time className="tabular-nums">{time}</time>
    </span>
  );
};

export default NodeClock;
