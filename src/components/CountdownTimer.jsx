import React, { useState, useEffect } from 'react';
import { differenceInSeconds } from 'date-fns';

export default function CountdownTimer({ remindAt }) {
  const [secs, setSecs] = useState(() =>
    Math.max(0, differenceInSeconds(new Date(remindAt), new Date()))
  );

  useEffect(() => {
    if (secs <= 0) return;
    const id = setInterval(() => {
      setSecs(Math.max(0, differenceInSeconds(new Date(remindAt), new Date())));
    }, 1000);
    return () => clearInterval(id);
  }, [remindAt, secs]);

  if (secs <= 0) return <span className="countdown countdown--fired">Now!</span>;

  const d = Math.floor(secs / 86400);
  const h = Math.floor((secs % 86400) / 3600);
  const m = Math.floor((secs % 3600) / 60);
  const s = secs % 60;

  const parts = [];
  if (d > 0) parts.push(`${d}d`);
  if (h > 0) parts.push(`${h}h`);
  if (m > 0) parts.push(`${m}m`);
  if (d === 0) parts.push(`${s}s`);

  const urgent = secs < 300; // under 5 min → red

  return (
    <span className={`countdown ${urgent ? 'countdown--urgent' : ''}`}>
      in {parts.join(' ')}
      <style>{`
        .countdown {
          font-family: var(--font-head);
          font-size: 0.78rem;
          font-weight: 700;
          color: var(--text-mid);
          letter-spacing: 0.02em;
        }
        .countdown--urgent { color: var(--amber); }
        .countdown--fired   { color: var(--accent); }
      `}</style>
    </span>
  );
}
