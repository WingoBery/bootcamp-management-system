'use client';

import { FormEvent, useCallback, useEffect, useState } from 'react';
import type { Bootcamp, User } from '../lib/types';
import {
  ApiError,
  alertErrorClass,
  alertSuccessClass,
  buttonPrimaryClass,
  createBootcamp,
  emptyStateClass,
  formatDate,
  inputClass,
  labelClass,
  listBootcamps,
  loadingClass,
  sectionClass,
  sectionDescClass,
  sectionTitleClass,
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
      setMessage('Bootcamp created.');
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
    return (
      <div className={loadingClass}>
        <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-gray-200 border-t-indigo-600" />
        Loading
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && <p className={alertErrorClass}>{error}</p>}
      {message && <p className={alertSuccessClass}>{message}</p>}

      <section className={sectionClass}>
        <h2 className={sectionTitleClass}>New bootcamp</h2>
        <p className={sectionDescClass}>Add a session to the schedule.</p>
        <form onSubmit={handleCreateBootcamp} className="mt-5 grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="title" className={labelClass}>
              Title
            </label>
            <input id="title" className={inputClass} value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>
          <div>
            <label htmlFor="location" className={labelClass}>
              Location
            </label>
            <input
              id="location"
              className={inputClass}
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
            />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="description" className={labelClass}>
              Description
            </label>
            <input
              id="description"
              className={inputClass}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="startDate" className={labelClass}>
              Starts
            </label>
            <input
              id="startDate"
              className={inputClass}
              type="datetime-local"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="endDate" className={labelClass}>
              Ends
            </label>
            <input
              id="endDate"
              className={inputClass}
              type="datetime-local"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="maxSlots" className={labelClass}>
              Capacity
            </label>
            <input
              id="maxSlots"
              className={inputClass}
              type="number"
              min={1}
              value={maxSlots}
              onChange={(e) => setMaxSlots(e.target.value)}
              required
            />
          </div>
          <div className="flex items-end">
            <button type="submit" disabled={submitting} className={buttonPrimaryClass}>
              {submitting ? 'Saving…' : 'Create bootcamp'}
            </button>
          </div>
        </form>
      </section>

      <section className={sectionClass}>
        <h2 className={sectionTitleClass}>All bootcamps</h2>
        <div className="mt-4 divide-y divide-gray-100">
          {bootcamps.length === 0 && <p className={emptyStateClass}>No bootcamps yet.</p>}
          {bootcamps.map((bootcamp) => (
            <article key={bootcamp.id} className="py-4 first:pt-0 last:pb-0">
              <p className="font-medium text-gray-900">{bootcamp.title}</p>
              <p className="mt-1 text-sm text-gray-600">{bootcamp.description}</p>
              <dl className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
                <div>
                  <dt className="sr-only">Location</dt>
                  <dd>{bootcamp.location}</dd>
                </div>
                <div>
                  <dt className="sr-only">Dates</dt>
                  <dd>
                    {formatDate(bootcamp.start_date)} – {formatDate(bootcamp.end_date)}
                  </dd>
                </div>
                <div>
                  <dt className="sr-only">Enrollment</dt>
                  <dd>
                    {bootcamp.current_registrations}/{bootcamp.max_slots} enrolled
                  </dd>
                </div>
                {bootcamp.supervisor_id && (
                  <div>
                    <dt className="sr-only">Supervisor</dt>
                    <dd>Supervisor #{bootcamp.supervisor_id}</dd>
                  </div>
                )}
              </dl>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
