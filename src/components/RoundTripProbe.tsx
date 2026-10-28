import React, { useEffect, useState } from 'react';

// Round-trip probe: a packet travels between two nodes and back.
// The readout is the visitor's real request → first-byte time, read once from the Navigation Timing API.
const RoundTripProbe: React.FC = () => {
  const [rtt, setRtt] = useState<number | null>(null);

  useEffect(() => {
    const read = () => {
      const nav = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined;
      if (nav && nav.responseStart > 0) setRtt(Math.max(1, Math.round(nav.responseStart - nav.requestStart)));
    };
    if (document.readyState === 'complete') read();
    else window.addEventListener('load', read, { once: true });
    return () => window.removeEventListener('load', read);
  }, []);

  return (
    <span className="rtt-probe inline-flex items-center gap-2 font-mono text-xs text-[var(--color-accent)]" title="Round-trip time for this page load">
      <span aria-hidden="true" className="rtt-probe-track"><span className="rtt-probe-packet" /></span>
      <span className="tabular-nums">RTT {rtt !== null ? `${rtt}ms` : '--'}</span>
    </span>
  );
};

export default RoundTripProbe;
