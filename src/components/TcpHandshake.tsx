import React from 'react';

// TCP three-way handshake, labelled: SYN ●● › SYN-ACK ●● › ACK ●● · NEGOTIATING → ESTABLISHED
// Colour follows the boot sequence: yellow while negotiating, green once established. Styles in index.css.
const TcpHandshake: React.FC = () => (
  <div className="tcp-hs" role="img" aria-label="TCP handshake on port 443: SYN, SYN-ACK, ACK, connection established">
    <span className="tcp-hs-tag" aria-hidden="true">TCP/443</span>
    <span className="tcp-hs-step" aria-hidden="true">
      <span className="tcp-hs-lbl l1">SYN</span>
      <span className="tcp-hs-dots"><i className="d1" /><i className="d2" /></span>
    </span>
    <b aria-hidden="true">›</b>
    <span className="tcp-hs-step" aria-hidden="true">
      <span className="tcp-hs-lbl l2">SYN-ACK</span>
      <span className="tcp-hs-dots"><i className="d3" /><i className="d4" /></span>
    </span>
    <b aria-hidden="true">›</b>
    <span className="tcp-hs-step" aria-hidden="true">
      <span className="tcp-hs-lbl l3">ACK</span>
      <span className="tcp-hs-dots"><i className="d5" /><i className="d6" /></span>
    </span>
    <b aria-hidden="true">·</b>
    <span className="tcp-hs-status" aria-hidden="true">
      <span className="tcp-hs-wait">NEGOTIATING</span>
      <span className="tcp-hs-ok">ESTABLISHED</span>
    </span>
  </div>
);

export default TcpHandshake;
