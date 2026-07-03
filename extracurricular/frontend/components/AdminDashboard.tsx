'use client';

import { FormEvent, useCallback, useEffect, useState } from 'react';
import type { Bootcamp, User } from '../lib/types';
import {
  ApiError,
  buttonPrimaryClass,
  createBootcamp,
  formatDate,
  inputClass,
  listBootcamps,
} from '../lib/api';

interface AdminDashboardProps {
  user: User;
}

function toIsoFromLocalInput(value: string): string {
  return new Date(value).toISOString();
}

export default function AdminDashboard({ user }: AdminDashboardProps) {
  const [bootcamps, setBootcamps] = useState<Bootcamp[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [maxSlots, setMaxSlots] = useState('20');

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setBootcamps(await listBootcamps());
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to load bootcamps');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  async function handleCreateBootcamp(event: FormEvent) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    setMessage(null);

    try {
      await createBootcamp({
        title,
        description,
        location,
        start_date: toIsoFromLocalInput(startDate),
        end_date: toIsoFromLocalInput(endDate),
        max_slots: Number(maxSlots),
      });
      setMessage('Bootcamp created successfully.');
      setTitle('');
      setDescription('');
      setLocation('');
      setStartDate('');
      setEndDate('');
      setMaxSlots('20');
      await loadData();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to create bootcamp');
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return <p className="text-sm text-slate-400">Loading admin dashboard…</p>;
  }

  return (
    <div className="space-y-6">
      <p className="text-sm text-slate-400">Signed in as admin · {user.full_name}</p>

      {error && <p className="rounded-lg border border-red-900 bg-red-950/40 px-3 py-2 text-sm text-red-300">{error}</p>}
      {message && (
        <p className="rounded-lg border border-emerald-900 bg-emerald-950/40 px-3 py-2 text-sm text-emerald-300">{message}</p>
      )}

      <section className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
        <h3 className="text-lg font-semibold">Create bootcamp</h3>
        <form onSubmit={handleCreateBootcamp} className="mt-3 grid gap-3 md:grid-cols-2">
          <input className={inputClass} placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
          <input className={inputClass} placeholder="Location" value={location} onChange={(e) => setLocation(e.target.value)} required />
          <input
            className={`${inputClass} md:col-span-2`}
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
          <label className="block text-sm text-slate-400">
            Start date
            <input
              className={`${inputClass} mt-1`}
              type="datetime-local"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
            />
          </label>
          <label className="block text-sm text-slate-400">
            End date
            <input
              className={`${inputClass} mt-1`}
              type="datetime-local"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
            />
          </label>
          <input
            className={inputClass}
            placeholder="Max slots"
            type="number"
            min={1}
            value={maxSlots}
            onChange={(e) => setMaxSlots(e.target.value)}
            required
          />
          <div className="flex items-end">
            <button type="submit" disabled={submitting} className={buttonPrimaryClass}>
              {submitting ? 'Creating…' : 'Create bootcamp'}
            </button>
          </div>
        </form>
      </section>

      <section className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
        <h3 className="text-lg font-semibold">All bootcamps</h3>
        <div className="mt-3 space-y-3">
          {bootcamps.length === 0 && <p className="text-sm text-slate-400">No bootcamps created yet.</p>}
          {bootcamps.map((bootcamp) => (
            <div key={bootcamp.id} className="rounded-lg border border-slate-800 p-3 text-sm">
              <p className="font-medium">{bootcamp.title}</p>
              <p className="mt-1 text-slate-400">{bootcamp.description}</p>
              <p className="mt-2 text-slate-500">
                {bootcamp.location} · {formatDate(bootcamp.start_date)} – {formatDate(bootcamp.end_date)}
              </p>
              <p className="mt-1 text-slate-500">
                Enrolled {bootcamp.current_registrations}/{bootcamp.max_slots}
                {bootcamp.supervisor_id ? ` · Supervisor #${bootcamp.supervisor_id}` : ''}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
