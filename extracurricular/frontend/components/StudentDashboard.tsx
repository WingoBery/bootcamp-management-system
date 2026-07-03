'use client';

import { FormEvent, useCallback, useEffect, useState } from 'react';
import type { Bootcamp, Registration, Showcase, User } from '../lib/types';
import {
  ApiError,
  buttonPrimaryClass,
  buttonSecondaryClass,
  formatDate,
  inputClass,
  listBootcamps,
  listStudentRegistrations,
  listStudentShowcases,
  registerForBootcamp,
  submitShowcase,
} from '../lib/api';

interface StudentDashboardProps {
  user: User;
}

export default function StudentDashboard({ user }: StudentDashboardProps) {
  const [bootcamps, setBootcamps] = useState<Bootcamp[]>([]);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [showcases, setShowcases] = useState<Showcase[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [actionId, setActionId] = useState<number | null>(null);

  const [projectTitle, setProjectTitle] = useState('');
  const [projectUrl, setProjectUrl] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [bootcampId, setBootcampId] = useState('');

  const registeredIds = new Set(registrations.map((item) => item.bootcamp_id));

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [bootcampData, registrationData, showcaseData] = await Promise.all([
        listBootcamps(),
        listStudentRegistrations(user.id),
        listStudentShowcases(user.id),
      ]);
      setBootcamps(bootcampData);
      setRegistrations(registrationData);
      setShowcases(showcaseData);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to load student data');
    } finally {
      setLoading(false);
    }
  }, [user.id]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  async function handleRegister(bootcampIdValue: number) {
    setActionId(bootcampIdValue);
    setMessage(null);
    setError(null);
    try {
      await registerForBootcamp(user.id, bootcampIdValue);
      setMessage('Successfully registered for bootcamp.');
      await loadData();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Registration failed');
    } finally {
      setActionId(null);
    }
  }

  async function handleSubmitShowcase(event: FormEvent) {
    event.preventDefault();
    setMessage(null);
    setError(null);
    try {
      await submitShowcase({
        student_id: user.id,
        bootcamp_id: Number(bootcampId),
        project_title: projectTitle,
        project_url: projectUrl || undefined,
        description: projectDescription || undefined,
      });
      setMessage('Project submitted successfully.');
      setProjectTitle('');
      setProjectUrl('');
      setProjectDescription('');
      setBootcampId('');
      await loadData();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Submission failed');
    }
  }

  if (loading) {
    return <p className="text-sm text-slate-400">Loading student dashboard…</p>;
  }

  return (
    <div className="space-y-6">
      {error && <p className="rounded-lg border border-red-900 bg-red-950/40 px-3 py-2 text-sm text-red-300">{error}</p>}
      {message && (
        <p className="rounded-lg border border-emerald-900 bg-emerald-950/40 px-3 py-2 text-sm text-emerald-300">{message}</p>
      )}

      <section className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
        <h3 className="text-lg font-semibold">Available bootcamps</h3>
        <div className="mt-3 space-y-3">
          {bootcamps.length === 0 && <p className="text-sm text-slate-400">No bootcamps available yet.</p>}
          {bootcamps.map((bootcamp) => (
            <div key={bootcamp.id} className="rounded-lg border border-slate-800 p-3">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-medium">{bootcamp.title}</p>
                  <p className="mt-1 text-sm text-slate-400">{bootcamp.description}</p>
                  <p className="mt-2 text-xs text-slate-500">
                    {bootcamp.location} · {formatDate(bootcamp.start_date)} – {formatDate(bootcamp.end_date)}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    Slots: {bootcamp.current_registrations}/{bootcamp.max_slots}
                  </p>
                </div>
                <button
                  type="button"
                  disabled={registeredIds.has(bootcamp.id) || actionId === bootcamp.id}
                  onClick={() => handleRegister(bootcamp.id)}
                  className={buttonSecondaryClass}
                >
                  {registeredIds.has(bootcamp.id) ? 'Registered' : actionId === bootcamp.id ? 'Registering…' : 'Register'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
        <h3 className="text-lg font-semibold">My registrations</h3>
        <div className="mt-3 space-y-2">
          {registrations.length === 0 && <p className="text-sm text-slate-400">You are not registered for any bootcamp yet.</p>}
          {registrations.map((registration) => {
            const bootcamp = bootcamps.find((item) => item.id === registration.bootcamp_id);
            return (
              <div key={registration.id} className="rounded-lg border border-slate-800 px-3 py-2 text-sm">
                <span className="font-medium">{bootcamp?.title ?? `Bootcamp #${registration.bootcamp_id}`}</span>
                <span className="text-slate-400"> · {registration.status} · {formatDate(registration.registered_at)}</span>
              </div>
            );
          })}
        </div>
      </section>

      <section className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
        <h3 className="text-lg font-semibold">Submit project showcase</h3>
        <form onSubmit={handleSubmitShowcase} className="mt-3 grid gap-3 md:grid-cols-2">
          <select
            className={inputClass}
            value={bootcampId}
            onChange={(e) => setBootcampId(e.target.value)}
            required
          >
            <option value="">Select enrolled bootcamp</option>
            {registrations.map((registration) => {
              const bootcamp = bootcamps.find((item) => item.id === registration.bootcamp_id);
              return (
                <option key={registration.id} value={registration.bootcamp_id}>
                  {bootcamp?.title ?? `Bootcamp #${registration.bootcamp_id}`}
                </option>
              );
            })}
          </select>
          <input
            className={inputClass}
            placeholder="Project title"
            value={projectTitle}
            onChange={(e) => setProjectTitle(e.target.value)}
            required
          />
          <input
            className={inputClass}
            placeholder="Project URL (optional)"
            value={projectUrl}
            onChange={(e) => setProjectUrl(e.target.value)}
          />
          <input
            className={inputClass}
            placeholder="Description (optional)"
            value={projectDescription}
            onChange={(e) => setProjectDescription(e.target.value)}
          />
          <div className="md:col-span-2">
            <button type="submit" className={buttonPrimaryClass}>
              Submit project
            </button>
          </div>
        </form>
      </section>

      <section className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
        <h3 className="text-lg font-semibold">My showcases</h3>
        <div className="mt-3 space-y-3">
          {showcases.length === 0 && <p className="text-sm text-slate-400">No project submissions yet.</p>}
          {showcases.map((showcase) => (
            <div key={showcase.id} className="rounded-lg border border-slate-800 p-3 text-sm">
              <p className="font-medium">{showcase.project_title}</p>
              {showcase.project_url && (
                <a href={showcase.project_url} target="_blank" rel="noreferrer" className="mt-1 block text-cyan-400 hover:underline">
                  {showcase.project_url}
                </a>
              )}
              <p className="mt-2 text-slate-400">
                {showcase.marks != null
                  ? `Graded: ${showcase.marks} · ${showcase.evaluation ?? ''}`
                  : 'Awaiting supervisor review'}
              </p>
              {showcase.feedback && <p className="mt-1 text-slate-500">Feedback: {showcase.feedback}</p>}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
