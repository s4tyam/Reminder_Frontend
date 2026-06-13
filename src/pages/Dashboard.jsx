import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useReminders } from '../hooks/useReminders';
import { subscribeToPush, isPushSupported, getPushPermission } from '../services/pushService';
import CurrentTimeClock from '../components/CurrentTimeClock';
import ReminderCard from '../components/ReminderCard';
import ReminderForm from '../components/ReminderForm';
import toast from 'react-hot-toast';

export default function Dashboard() {
  const { user } = useAuth();
  const { reminders, loading, createReminder, updateReminder, deleteReminder, dismissReminder } = useReminders();

  const [showForm, setShowForm]   = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [filter, setFilter] = useState('ALL');

  // Stats
  const pending   = reminders.filter((r) => r.status === 'PENDING').length;
  const sent      = reminders.filter((r) => r.status === 'SENT').length;
  const dismissed = reminders.filter((r) => r.status === 'DISMISSED').length;

  // Filtered list
  const filtered = filter === 'ALL'
    ? reminders
    : reminders.filter((r) => r.status === filter);

  const handleCreate = async (payload) => {
    setFormLoading(true);
    try { await createReminder(payload); setShowForm(false); }
    catch (e) { toast.error('Failed to create'); }
    finally { setFormLoading(false); }
  };

  const handleUpdate = async (payload) => {
    setFormLoading(true);
    try { await updateReminder(editTarget.id, payload); setEditTarget(null); }
    catch (e) { toast.error('Failed to update'); }
    finally { setFormLoading(false); }
  };

  const handleEnablePush = async () => {
    if (!isPushSupported()) { toast.error('Push not supported in this browser'); return; }
    const perm = await getPushPermission();
    if (perm === 'denied') { toast.error('Push permission blocked. Enable in browser settings.'); return; }
    const ok = await subscribeToPush();
    if (ok) toast.success('Push notifications enabled!');
    else toast.error('Could not enable push notifications');
  };

  return (
    <div className="dashboard">
      {/* Header row */}
      <div className="dash-header">
        <div>
          <h2 className="dash-greeting">
            Hey, {user?.fullName?.split(' ')[0]} 👋
          </h2>
          <p className="dash-sub">
            {pending > 0 ? `${pending} upcoming reminder${pending > 1 ? 's' : ''}` : 'No upcoming reminders'}
          </p>
        </div>
        <CurrentTimeClock />
      </div>

      {/* Stat pills */}
      <div className="dash-stats">
        {[
          { label: 'Pending',   val: pending,   filter: 'PENDING',   color: 'var(--blue)' },
          { label: 'Sent',      val: sent,       filter: 'SENT',      color: 'var(--accent)' },
          { label: 'Dismissed', val: dismissed,  filter: 'DISMISSED', color: 'var(--text-dim)' },
          { label: 'Total',     val: reminders.length, filter: 'ALL', color: 'var(--text-mid)' },
        ].map((s) => (
          <button key={s.filter}
            className={`stat-pill ${filter === s.filter ? 'stat-pill--active' : ''}`}
            onClick={() => setFilter(s.filter)}
            style={{ '--pill-color': s.color }}>
            <span className="stat-pill__val">{s.val}</span>
            <span className="stat-pill__label">{s.label}</span>
          </button>
        ))}
      </div>

      {/* Action bar */}
      <div className="dash-actions">
        <button className="btn-primary" onClick={() => { setShowForm(true); setEditTarget(null); }}>
          + New Reminder
        </button>
        <button className="btn-ghost" onClick={handleEnablePush} title="Enable background push notifications">
          🔔 Enable Push
        </button>
      </div>

      {/* Reminders list */}
      {loading ? (
        <div className="dash-loading">
          <span className="spinner" style={{width:32, height:32, borderWidth:3}} />
        </div>
      ) : filtered.length === 0 ? (
        <div className="dash-empty">
          <span className="dash-empty__icon">◆</span>
          <p>{filter === 'ALL' ? 'No reminders yet. Create your first one!' : `No ${filter.toLowerCase()} reminders.`}</p>
          {filter === 'ALL' && (
            <button className="btn-primary" style={{marginTop:16}}
              onClick={() => setShowForm(true)}>Create Reminder</button>
          )}
        </div>
      ) : (
        <div className="dash-list">
          {filtered.map((r) => (
            <ReminderCard
              key={r.id}
              reminder={r}
              onDelete={deleteReminder}
              onEdit={(r) => { setEditTarget(r); setShowForm(false); }}
              onDismiss={dismissReminder}
            />
          ))}
        </div>
      )}

      {/* Create modal */}
      {showForm && (
        <Modal title="New Reminder" onClose={() => setShowForm(false)}>
          <ReminderForm
            onSubmit={handleCreate}
            onCancel={() => setShowForm(false)}
            loading={formLoading}
          />
        </Modal>
      )}

      {/* Edit modal */}
      {editTarget && (
        <Modal title="Edit Reminder" onClose={() => setEditTarget(null)}>
          <ReminderForm
            initial={editTarget}
            onSubmit={handleUpdate}
            onCancel={() => setEditTarget(null)}
            loading={formLoading}
          />
        </Modal>
      )}

      <style>{`
        .dashboard { max-width: 760px; margin: 0 auto; padding: 32px 20px 80px; }
        .dash-header {
          display: flex; justify-content: space-between; align-items: flex-start;
          margin-bottom: 28px; flex-wrap: wrap; gap: 16px;
        }
        .dash-greeting { font-size: clamp(1.3rem, 4vw, 1.9rem); font-weight: 800; }
        .dash-sub { color: var(--text-mid); font-size: 0.88rem; margin-top: 4px; }

        .dash-stats { display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 20px; }
        .stat-pill {
          display: flex; flex-direction: column; align-items: center;
          padding: 12px 20px; background: var(--bg-card);
          border: 1px solid var(--border); border-radius: var(--radius);
          cursor: pointer; transition: all 0.2s; min-width: 80px;
        }
        .stat-pill:hover { border-color: var(--border-mid); }
        .stat-pill--active { border-color: var(--pill-color); background: var(--bg-hover); }
        .stat-pill__val   { font-family: var(--font-head); font-size: 1.4rem; font-weight: 800; color: var(--pill-color); line-height: 1; }
        .stat-pill__label { font-size: 0.7rem; color: var(--text-dim); text-transform: uppercase; letter-spacing: 0.05em; margin-top: 4px; }

        .dash-actions { display: flex; gap: 10px; margin-bottom: 24px; flex-wrap: wrap; }
        .dash-list { display: flex; flex-direction: column; gap: 12px; }

        .dash-loading { display: flex; justify-content: center; padding: 60px 0; }
        .dash-empty {
          display: flex; flex-direction: column; align-items: center;
          padding: 60px 24px; color: var(--text-dim); text-align: center;
        }
        .dash-empty__icon { font-size: 2rem; color: var(--border-mid); margin-bottom: 12px; }
        .dash-empty p { font-size: 0.9rem; }
      `}</style>
    </div>
  );
}

function Modal({ title, onClose, children }) {
  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal fade-in">
        <div className="modal__head">
          <h3>{title}</h3>
          <button className="modal__close" onClick={onClose}>✕</button>
        </div>
        <div className="modal__body">{children}</div>
      </div>
      <style>{`
        .modal-overlay {
          position: fixed; inset: 0; z-index: 300;
          background: rgba(0,0,0,0.7); backdrop-filter: blur(4px);
          display: flex; align-items: center; justify-content: center; padding: 20px;
        }
        .modal {
          width: 100%; max-width: 520px; background: var(--bg-card);
          border: 1px solid var(--border-mid); border-radius: var(--radius-lg);
          overflow: hidden; box-shadow: var(--shadow);
        }
        .modal__head {
          display: flex; justify-content: space-between; align-items: center;
          padding: 18px 24px; border-bottom: 1px solid var(--border);
        }
        .modal__head h3 { font-size: 1rem; font-weight: 700; }
        .modal__close { background: none; color: var(--text-mid); font-size: 1rem; }
        .modal__close:hover { color: var(--text); }
        .modal__body { padding: 24px; }
      `}</style>
    </div>
  );
}
