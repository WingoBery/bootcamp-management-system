'use client';

import { FormEvent, useCallback, useEffect, useMemo, useState } from 'react';
import AdminGradingLeaderboard from './AdminGradingLeaderboard';
import AdminOverviewCharts from './AdminOverviewCharts';
import LoadingSpinner from './LoadingSpinner';
import type { Bootcamp, EnrollmentDetail, Showcase, User } from '../lib/types';
import { buildAdminOverviewMetrics, buildBootcampGradeReports } from '../lib/adminAnalytics';
import {
  ApiError,
  alertErrorClass,
  alertSuccessClass,
  buttonPrimaryClass,
  createBootcamp,
  emptyStateClass,
  formatDate,
  innerItemClass,
  inputClass,
  labelClass,
  listBootcamps,
  listEnrollments,
  listShowcases,
  sectionClass,
  sectionDescClass,
  sectionTitleClass,
  selectClass,
  statusBadgeClass,
} from '../lib/api';

interface AdminDashboardProps {
  user: User;
}

function toIsoFromLocalInput(value: string): string {
  return new Date(value).toISOString();
}

export default function AdminDashboard({ user }: AdminDashboardProps) {
  const [bootcamps, setBootcamps] = useState<Bootcamp[]>([]);
  const [enrollments, setEnrollments] = useState<EnrollmentDetail[]>([]);
  const [showcases, setShowcases] = useState<Showcase[]>([]);
  const [enrollmentFilter, setEnrollmentFilter] = useState('');
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
      const [bootcampData, enrollmentData, showcaseData] = await Promise.all([
        listBootcamps(),
        listEnrollments(),
        listShowcases(),
      ]);
      setBootcamps(bootcampData);
      setEnrollments(enrollmentData);
      setShowcases(showcaseData);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to load admin dashboard');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const overviewMetrics = useMemo(
    () => buildAdminOverviewMetrics(bootcamps, enrollments, showcases),
    [bootcamps, enrollments, showcases],
  );

  const gradeReports = useMemo(
    () => buildBootcampGradeReports(bootcamps, enrollments, showcases),
    [bootcamps, enrollments, showcases],
  );

  const reportDate = useMemo(
    () =>
      new Date().toLocaleString(undefined, {
        dateStyle: 'medium',
        timeStyle: 'short',
      }),
    [bootcamps, enrollments, showcases],
  );

  const visibleEnrollments = useMemo(() => {
    if (enrollmentFilter === '') {
      return enrollments;
    }
    const bootcampId = Number(enrollmentFilter);
    return enrollments.filter((item) => item.bootcamp_id === bootcampId);
  }, [enrollmentFilter, enrollments]);

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

  async function handleEnrollmentFilterChange(value: string) {
    setEnrollmentFilter(value);
  }

  function bootcampTitle(bootcampId: number) {
    return bootcamps.find((item) => item.id === bootcampId)?.title ?? `Bootcamp #${bootcampId}`;
  }

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      <AdminOverviewCharts metrics={overviewMetrics} reportDate={reportDate} />
      <AdminGradingLeaderboard reports={gradeReports} />

      {error && <p className={alertErrorClass}>{error}</p>}
      {message && <p className={alertSuccessClass}>{message}</p>}

      <section id="new-bootcamp" className={`${sectionClass} scroll-mt-28`}>
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

      <section id="all-bootcamps" className={`${sectionClass} scroll-mt-28`}>
        <h2 className={sectionTitleClass}>All bootcamps</h2>
        <div className="glass-divider mt-4">
          {bootcamps.length === 0 && <p className={emptyStateClass}>No bootcamps yet.</p>}
          {bootcamps.map((bootcamp) => (
            <article key={bootcamp.id} className="py-4 first:pt-0 last:pb-0">
              <p className="font-medium" style={{ color: 'var(--text-primary)' }}>
                {bootcamp.title}
              </p>
              <p className="mt-1 text-sm" style={{ color: 'var(--text-secondary)' }}>
                {bootcamp.description}
              </p>
              <dl className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs" style={{ color: 'var(--text-tertiary)' }}>
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

      <section id="enrollments" className={`${sectionClass} scroll-mt-28`}>
        <h2 className={sectionTitleClass}>Enrollments</h2>
        <p className={sectionDescClass}>Students registered for bootcamp sessions.</p>

        <div className="mt-5 max-w-sm">
          <label htmlFor="enrollmentFilter" className={labelClass}>
            Filter by bootcamp
          </label>
          <select
            id="enrollmentFilter"
            className={selectClass}
            value={enrollmentFilter}
            onChange={(e) => handleEnrollmentFilterChange(e.target.value)}
          >
            <option value="">All bootcamps</option>
            {bootcamps.map((bootcamp) => (
              <option key={bootcamp.id} value={bootcamp.id}>
                {bootcamp.title}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-5 space-y-2">
          {visibleEnrollments.length === 0 && <p className={emptyStateClass}>No enrollments found.</p>}
          {visibleEnrollments.map((enrollment) => (
            <article key={enrollment.id} className={`${innerItemClass} text-sm`}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-medium" style={{ color: 'var(--text-primary)' }}>
                    {enrollment.student.full_name}
                  </p>
                  <p style={{ color: 'var(--text-secondary)' }}>{enrollment.student.email}</p>
                </div>
                <span className={statusBadgeClass}>{enrollment.status}</span>
              </div>
              <dl className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs" style={{ color: 'var(--text-tertiary)' }}>
                <div>
                  <dt className="sr-only">Bootcamp</dt>
                  <dd>{bootcampTitle(enrollment.bootcamp_id)}</dd>
                </div>
                <div>
                  <dt className="sr-only">Registered</dt>
                  <dd>{formatDate(enrollment.registered_at)}</dd>
                </div>
              </dl>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
