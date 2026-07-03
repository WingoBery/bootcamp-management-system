'use client';

import { FormEvent, useCallback, useEffect, useState } from 'react';
import LoadingSpinner from './LoadingSpinner';
import StatCard from './StatCard';
import type { Showcase, User } from '../lib/types';
import {
  ApiError,
  alertErrorClass,
  alertSuccessClass,
  buttonPrimaryClass,
  emptyStateClass,
  formatDate,
  gradeShowcase,
  innerItemClass,
  inputClass,
  labelClass,
  linkClass,
  listPendingShowcases,
  sectionClass,
  sectionDescClass,
  sectionTitleClass,
  selectClass,
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
      setMessage('Grade saved.');
      setFeedback('');
      await loadData();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to grade showcase');
    } finally {
      setGradingId(null);
    }
  }

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <StatCard label="Awaiting review" value={pending.length} />
        <StatCard label="Queue" value={pending.length === 0 ? 'All clear' : 'Needs attention'} />
      </div>

      {error && <p className={alertErrorClass}>{error}</p>}
      {message && <p className={alertSuccessClass}>{message}</p>}

      <section id="review-queue" className={`${sectionClass} scroll-mt-28`}>
        <h2 className={sectionTitleClass}>Review queue</h2>
        <p className={sectionDescClass}>Projects waiting for a grade.</p>

        <div className="mt-5 space-y-4">
          {pending.length === 0 && <p className={emptyStateClass}>Nothing in the queue.</p>}

          {pending.map((showcase) => (
            <article key={showcase.id} className={innerItemClass}>
              <p className="font-medium" style={{ color: 'var(--text-primary)' }}>
                {showcase.project_title}
              </p>
              {showcase.project_url && (
                <a href={showcase.project_url} target="_blank" rel="noreferrer" className={`${linkClass} mt-1 block`}>
                  {showcase.project_url}
                </a>
              )}
              {showcase.description && (
                <p className="mt-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                  {showcase.description}
                </p>
              )}
              <p className="mt-2 text-xs" style={{ color: 'var(--text-tertiary)' }}>
                Student #{showcase.student_id} · Bootcamp #{showcase.bootcamp_id} ·{' '}
                {formatDate(showcase.submitted_at)}
              </p>

              <form onSubmit={(event) => handleGrade(event, showcase.id)} className="mt-4 grid gap-3 sm:grid-cols-3">
                <div>
                  <label htmlFor={`marks-${showcase.id}`} className={labelClass}>
                    Marks
                  </label>
                  <input
                    id={`marks-${showcase.id}`}
                    className={inputClass}
                    type="number"
                    min={0}
                    max={100}
                    step={0.1}
                    value={marks}
                    onChange={(e) => setMarks(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label htmlFor={`evaluation-${showcase.id}`} className={labelClass}>
                    Result
                  </label>
                  <select
                    id={`evaluation-${showcase.id}`}
                    className={selectClass}
                    value={evaluation}
                    onChange={(e) => setEvaluation(e.target.value)}
                    required
                  >
                    <option value="pass">Pass</option>
                    <option value="merit">Merit</option>
                    <option value="distinction">Distinction</option>
                    <option value="fail">Fail</option>
                  </select>
                </div>
                <div>
                  <label htmlFor={`feedback-${showcase.id}`} className={labelClass}>
                    Feedback
                  </label>
                  <input
                    id={`feedback-${showcase.id}`}
                    className={inputClass}
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    required
                  />
                </div>
                <div className="sm:col-span-3">
                  <button type="submit" disabled={gradingId === showcase.id} className={buttonPrimaryClass}>
                    {gradingId === showcase.id ? 'Saving…' : 'Save grade'}
                  </button>
                </div>
              </form>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
