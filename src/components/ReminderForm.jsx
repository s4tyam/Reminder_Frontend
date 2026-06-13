import React, { useState } from 'react';
import { format, addMinutes } from 'date-fns';

const LEAD_OPTIONS = [
  { label: 'At event time', value: 0 },
  { label: '5 min before',  value: 5 },
  { label: '10 min before', value: 10 },
  { label: '15 min before', value: 15 },
  { label: '30 min before', value: 30 },
  { label: '1 hr before',   value: 60 },
  { label: '2 hrs before',  value: 120 },
  { label: '1 day before',  value: 1440 },
];

const RECURRENCE = ['NONE', 'DAILY', 'WEEKLY', 'MONTHLY'];

const toDatetimeLocal = (date) => format(date, "yyyy-MM-dd'T'HH:mm");

export default function ReminderForm({ initial, onSubmit, onCancel, loading }) {
  const [form, setForm] = useState({
    title: '',
    description: '',
    leadMinutes: 10,
    recurrence: 'NONE',
    ...initial,
    eventAt: initial?.eventAt
      ? toDatetimeLocal(new Date(initial.eventAt))
      : toDatetimeLocal(addMinutes(new Date(), 60)),
  });

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      title:       form.title,
      description: form.description,
      eventAt:     new Date(form.eventAt).toISOString(),
      leadMinutes: parseInt(form.leadMinutes),
      recurrence:  form.recurrence,
    });
  };

  // Show computed remindAt preview
  const remindAt = form.eventAt
    ? new Date(new Date(form.eventAt).getTime() - form.leadMinutes * 60000)
    : null;

  return (
    <form onSubmit={handleSubmit} className="reminder-form">
      <div className="form-group">
        <label>Title</label>
        <input
          value={form.title}
          onChange={(e) => set('title', e.target.value)}
          placeholder="What do you need to remember?"
          required
          autoFocus
        />
      </div>

      <div className="form-group">
        <label>Description (optional)</label>
        <textarea
          value={form.description}
          onChange={(e) => set('description', e.target.value)}
          placeholder="Any extra details..."
          rows={2}
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Event Time</label>
          <input
            type="datetime-local"
            value={form.eventAt}
            onChange={(e) => set('eventAt', e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Remind Me</label>
          <select value={form.leadMinutes} onChange={(e) => set('leadMinutes', e.target.value)}>
            {LEAD_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Preview of when notification fires */}
      {remindAt && (
        <div className="form-preview">
          <span className="form-preview__dot" />
          Notification fires at{' '}
          <strong>{format(remindAt, 'MMM d, HH:mm')}</strong>
        </div>
      )}

      <div className="form-group">
        <label>Repeat</label>
        <div className="recurrence-pills">
          {RECURRENCE.map((r) => (
            <button
              key={r}
              type="button"
              className={`recurrence-pill ${form.recurrence === r ? 'active' : ''}`}
              onClick={() => set('recurrence', r)}
            >
              {r === 'NONE' ? 'Once' : r.charAt(0) + r.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="form-actions">
        <button type="button" className="btn-ghost" onClick={onCancel}>Cancel</button>
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? <span className="spinner" /> : (initial ? 'Save Changes' : 'Create Reminder')}
        </button>
      </div>

      <style>{`
        .reminder-form { display: flex; flex-direction: column; gap: 18px; }
        .form-group { display: flex; flex-direction: column; }
        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
        @media (max-width: 500px) { .form-row { grid-template-columns: 1fr; } }
        textarea { resize: vertical; min-height: 64px; }
        .form-preview {
          font-size: 0.82rem; color: var(--text-mid);
          background: var(--accent-glow);
          border: 1px solid rgba(212,255,87,0.2);
          border-radius: 8px; padding: 10px 14px;
          display: flex; align-items: center; gap: 8px;
        }
        .form-preview strong { color: var(--accent); }
        .form-preview__dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: var(--accent); flex-shrink: 0;
          box-shadow: 0 0 8px var(--accent);
        }
        .recurrence-pills { display: flex; gap: 8px; flex-wrap: wrap; }
        .recurrence-pill {
          padding: 7px 16px; border-radius: 99px;
          font-size: 0.82rem; font-weight: 500;
          background: var(--bg-hover); color: var(--text-mid);
          border: 1px solid var(--border-mid);
          transition: all 0.2s;
        }
        .recurrence-pill:hover { border-color: var(--text-mid); color: var(--text); }
        .recurrence-pill.active {
          background: var(--accent-glow); color: var(--accent);
          border-color: rgba(212,255,87,0.4);
        }
        .form-actions { display: flex; gap: 10px; justify-content: flex-end; padding-top: 4px; }
      `}</style>
    </form>
  );
}
