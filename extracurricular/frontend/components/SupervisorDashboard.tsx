'use client';

import { FormEvent, useCallback, useEffect, useState } from 'react';
import type { Showcase, User } from '../lib/types';
import {
  ApiError,
  buttonPrimaryClass,
  formatDate,
  gradeShowcase,
  inputClass,
  listPendingShowcases,
} from '../lib/api';

interface SupervisorDashboardProps {
  user: User;
}

export default function SupervisorDashboard({ user }: SupervisorDashboardProps) {
  const [pending, setPending] = useState<Showcase[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [gradingId, setGradingId] = useState<number | null>(null);

  const [marks, setMarks] = useState('85');
  const [evaluation, setEvaluation] = useState('pass');
  const [feedback, setFeedback] = useState('');

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setPending(await listPendingShowcases(user.id));
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to load pending showcases');
    } finally {
      setLoading(false);
    }
  }, [user.id]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  async function handleGrade(event: FormEvent, showcaseId: number) {
    event.preventDefault();
    setGradingId(showcaseId);
    setError(null);
    setMessage(null);

    try {
      await gradeShowcase(showcaseId, {
        supervisor_id: user.id,
        marks: Number(marks),
        evaluation,
        feedback,
      });
      setMessage('Showcase graded successfully.');
      setFeedback('');
      await loadData();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to grade showcase');
    } finally {
      setGradingId(null);
    }
  }

  if (loading) {
    return <p className="text-sm text-slate-400">Loading supervisor dashboard…</p>;
  }

  return (
    <div className="space-y-6">
      <p className="text-sm text-slate-400">Signed in as supervisor · {user.full_name}</p>

      {error && <p className="rounded-lg border border-red-900 bg-red-950/40 px-3 py-2 text-sm text-red-300">{error}</p>}
      {message && (
        <p className="rounded-lg border border-emerald-900 bg-emerald-950/40 px-3 py-2 text-sm text-emerald-300">{message}</p>
      )}

      <section className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
        <h3 className="text-lg font-semibold">Pending project reviews</h3>
        <p className="mt-1 text-sm text-slate-400">
          Submissions assigned to you or awaiting a grade appear here.
        </p>

        <div className="mt-4 space-y-4">
          {pending.length === 0 && (
            <p className="text-sm text-slate-400">No pending showcases at the moment.</p>
          )}

          {pending.map((showcase) => (
            <div key={showcase.id} className="rounded-lg border border-slate-800 p-4">
              <p className="font-medium">{showcase.project_title}</p>
              {showcase.project_url && (
                <a href={showcase.project_url} target="_blank" rel="noreferrer" className="mt-1 block text-sm text-cyan-400 hover:underline">
                  {showcase.project_url}
                </a>
              )}
              {showcase.description && <p className="mt-2 text-sm text-slate-400">{showcase.description}</p>}
              <p className="mt-2 text-xs text-slate-500">
                Student #{showcase.student_id} · Bootcamp #{showcase.bootcamp_id} · Submitted {formatDate(showcase.submitted_at)}
              </p>

              <form onSubmit={(event) => handleGrade(event, showcase.id)} className="mt-4 grid gap-3 md:grid-cols-3">
                <input
                  className={inputClass}
                  type="number"
                  min={0}
                  max={100}
                  step={0.1}
                  value={marks}
                  onChange={(e) => setMarks(e.target.value)}
                  placeholder="Marks"
                  required
                />
                <select className={inputClass} value={evaluation} onChange={(e) => setEvaluation(e.target.value)} required>
                  <option value="pass">Pass</option>
                  <option value="merit">Merit</option>
                  <option value="distinction">Distinction</option>
                  <option value="fail">Fail</option>
                </select>
                <input
                  className={inputClass}
                  placeholder="Feedback"
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  required
                />
                <div className="md:col-span-3">
                  <button
                    type="submit"
                    disabled={gradingId === showcase.id}
                    className={buttonPrimaryClass}
                  >
                    {gradingId === showcase.id ? 'Submitting grade…' : 'Submit grade'}
                  </button>
                </div>
              </form>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
