import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';

export default function CurrentTimeClock() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="clock">
      <div className="clock__time">{format(now, 'HH:mm:ss')}</div>
      <div className="clock__date">{format(now, 'EEEE, MMMM d yyyy')}</div>
      <style>{`
        .clock { text-align: right; }
        .clock__time {
          font-family: var(--font-head);
          font-size: clamp(1.6rem, 4vw, 2.4rem);
          font-weight: 800;
          color: var(--accent);
          letter-spacing: -0.02em;
          line-height: 1;
        }
        .clock__date {
          font-size: 0.75rem;
          color: var(--text-dim);
          font-weight: 400;
          margin-top: 2px;
          letter-spacing: 0.04em;
          text-transform: uppercase;
        }
      `}</style>
    </div>
  );
}
