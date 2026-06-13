import { useState, useEffect, useCallback } from 'react';
import { reminderApi } from '../services/api';
import toast from 'react-hot-toast';

export function useReminders() {
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading]     = useState(true);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await reminderApi.getAll();
      setReminders(Array.isArray(data) ? data : []);
    } catch (e) {
      toast.error('Failed to load reminders');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const createReminder = useCallback(async (payload) => {
    const { data } = await reminderApi.create(payload);
    setReminders((prev) => [...prev, data].sort(
      (a, b) => new Date(a.remindAt) - new Date(b.remindAt)
    ));
    toast.success('Reminder created!');
    return data;
  }, []);

  const updateReminder = useCallback(async (id, payload) => {
    const { data } = await reminderApi.update(id, payload);
    setReminders((prev) => prev.map((r) => (r.id === id ? data : r)));
    toast.success('Reminder updated!');
    return data;
  }, []);

  const deleteReminder = useCallback(async (id) => {
    await reminderApi.delete(id);
    setReminders((prev) => prev.filter((r) => r.id !== id));
    toast.success('Reminder deleted');
  }, []);

  const dismissReminder = useCallback(async (id) => {
    const { data } = await reminderApi.dismiss(id);
    setReminders((prev) => prev.map((r) => (r.id === id ? data : r)));
  }, []);

  return { reminders, loading, createReminder, updateReminder, deleteReminder, dismissReminder, reload: load };
}
