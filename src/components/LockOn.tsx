import React from 'react';
import type { ReactNode } from 'react';

// Lock-on: corner brackets snap in around the button the pointer is over (or keyboard-focused),
// with a "LOCK" tag. Only the hovered button locks — styles in index.css (.lock-on).
const LockOn: React.FC<{ children: ReactNode }> = ({ children }) => (
  <span className="lock-on">
    {children}
    <i aria-hidden="true" className="lock-on-c lock-on-tl" />
    <i aria-hidden="true" className="lock-on-c lock-on-tr" />
    <i aria-hidden="true" className="lock-on-c lock-on-bl" />
    <i aria-hidden="true" className="lock-on-c lock-on-br" />
    <span aria-hidden="true" className="lock-on-tag">LOCK</span>
  </span>
);

export default LockOn;
