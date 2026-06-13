import React, { useState } from 'react';
import { format } from 'date-fns';
import CountdownTimer from './CountdownTimer';

export default function ReminderCard({ reminder, onDelete, onEdit, onDismiss }) {
  const [confirming, setConfirming] = useState(false);

  const isPending    = reminder.status === 'PENDING';
  const isSent       = reminder.status === 'SENT';
  const isDismissed  = reminder.status === 'DISMISSED';

  const recurrenceLabel = reminder.recurrence !== 'NONE'
    ? reminder.recurrence.charAt(0) + reminder.recurrence.slice(1).toLowerCase()
    : null;

  return (
    <div className={`r-card ${isDismissed || isSent ? 'r-card--muted' : ''}`}>
      <div className="r-card__top">
        <div className="r-card__left">
          <div className="r-card__dot" data-status={reminder.status} />
          <div>
            <h3 className="r-card__title">{reminder.title}</h3>
            {reminder.description && (
              <p className="r-card__desc">{reminder.description}</p>
            )}
          </div>
        </div>
        <div className="r-card__right">
          <span className={`badge badge-${reminder.status.toLowerCase()}`}>
            {reminder.status}
          </span>
          {recurrenceLabel && (
            <span className="r-card__recur">↻ {recurrenceLabel}</span>
          )}
        </div>
      </div>

      <div className="r-card__times">
        <div className="r-card__time-item">
          <span className="r-card__time-label">Notify at</span>
          <span className="r-card__time-val">
            {format(new Date(reminder.remindAt), 'MMM d, HH:mm')}
          </span>
          {isPending && <CountdownTimer remindAt={reminder.remindAt} />}
        </div>
        {reminder.leadMinutes > 0 && (
          <div className="r-card__time-item">
            <span className="r-card__time-label">Event at</span>
            <span className="r-card__time-val">
              {format(new Date(reminder.eventAt), 'MMM d, HH:mm')}
            </span>
          </div>
        )}
      </div>

      <div className="r-card__actions">
        {isPending && (
          <>
            <button className="btn-ghost" style={{fontSize:'0.8rem', padding:'7px 14px'}}
              onClick={() => onEdit(reminder)}>Edit</button>
            <button className="btn-ghost" style={{fontSize:'0.8rem', padding:'7px 14px'}}
              onClick={() => onDismiss(reminder.id)}>Dismiss</button>
          </>
        )}
        {!confirming
          ? <button className="btn-danger" onClick={() => setConfirming(true)}>Delete</button>
          : <div className="r-card__confirm">
              <span>Sure?</span>
              <button className="btn-danger" onClick={() => onDelete(reminder.id)}>Yes</button>
              <button className="btn-ghost" style={{fontSize:'0.8rem', padding:'7px 12px'}}
                onClick={() => setConfirming(false)}>No</button>
            </div>
        }
      </div>

      <style>{`
        .r-card {
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          padding: 20px;
          display: flex; flex-direction: column; gap: 14px;
          transition: border-color 0.2s, box-shadow 0.2s;
          animation: fadeIn 0.35s ease forwards;
        }
        .r-card:hover { border-color: var(--border-mid); box-shadow: var(--shadow); }
        .r-card--muted { opacity: 0.55; }
        .r-card__top { display: flex; justify-content: space-between; align-items: flex-start; gap: 12px; }
        .r-card__left { display: flex; align-items: flex-start; gap: 12px; }
        .r-card__dot {
          width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; margin-top: 6px;
        }
        .r-card__dot[data-status="PENDING"]   { background: var(--blue); box-shadow: 0 0 8px var(--blue); }
        .r-card__dot[data-status="SENT"]      { background: var(--accent); }
        .r-card__dot[data-status="DISMISSED"] { background: var(--text-dim); }
        .r-card__right { display: flex; flex-direction: column; align-items: flex-end; gap: 4px; }
        .r-card__title { font-size: 1rem; font-weight: 600; }
        .r-card__desc  { font-size: 0.82rem; color: var(--text-mid); margin-top: 3px; }
        .r-card__recur { font-size: 0.72rem; color: var(--text-dim); }
        .r-card__times {
          display: flex; gap: 20px; flex-wrap: wrap;
          padding: 12px 16px; background: var(--bg);
          border-radius: 10px; border: 1px solid var(--border);
        }
        .r-card__time-item { display: flex; flex-direction: column; gap: 2px; }
        .r-card__time-label { font-size: 0.7rem; color: var(--text-dim); text-transform: uppercase; letter-spacing: 0.05em; }
        .r-card__time-val   { font-family: var(--font-head); font-size: 0.92rem; font-weight: 600; color: var(--text); }
        .r-card__actions { display: flex; gap: 8px; align-items: center; justify-content: flex-end; }
        .r-card__confirm { display: flex; align-items: center; gap: 8px; font-size: 0.82rem; color: var(--text-mid); }
      `}</style>
    </div>
  );
}
