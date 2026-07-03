'use client';

import { FormEvent, useCallback, useEffect, useState } from 'react';
import type { Bootcamp, Registration, Showcase, User } from '../lib/types';
import {
  ApiError,
  alertErrorClass,
  alertSuccessClass,
  buttonPrimaryClass,
  buttonSecondaryClass,
  emptyStateClass,
  formatDate,
  inputClass,
  labelClass,
  linkClass,
  listBootcamps,
  listStudentRegistrations,
  listStudentShowcases,
  loadingClass,
  registerForBootcamp,
  sectionClass,
  sectionDescClass,
  sectionTitleClass,
  selectClass,
  statusBadgeClass,
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
      setMessage('Registered successfully.');
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
      setMessage('Project submitted.');
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
        <h2 className={sectionTitleClass}>Bootcamps</h2>
        <p className={sectionDescClass}>Open sessions you can enroll in.</p>
        <div className="mt-5 divide-y divide-gray-100">
          {bootcamps.length === 0 && <p className={emptyStateClass}>Nothing scheduled yet.</p>}
          {bootcamps.map((bootcamp) => (
            <div key={bootcamp.id} className="flex flex-wrap items-start justify-between gap-4 py-4 first:pt-0 last:pb-0">
              <div className="min-w-0 flex-1">
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
                    <dt className="sr-only">Capacity</dt>
                    <dd>
                      {bootcamp.current_registrations}/{bootcamp.max_slots} enrolled
                    </dd>
                  </div>
                </dl>
              </div>
              <button
                type="button"
                disabled={registeredIds.has(bootcamp.id) || actionId === bootcamp.id}
                onClick={() => handleRegister(bootcamp.id)}
                className={buttonSecondaryClass}
              >
                {registeredIds.has(bootcamp.id)
                  ? 'Enrolled'
                  : actionId === bootcamp.id
                    ? 'Enrolling…'
                    : 'Enroll'}
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className={sectionClass}>
        <h2 className={sectionTitleClass}>My enrollments</h2>
        <ul className="mt-4 space-y-2">
          {registrations.length === 0 && <li className={emptyStateClass}>No enrollments yet.</li>}
          {registrations.map((registration) => {
            const bootcamp = bootcamps.find((item) => item.id === registration.bootcamp_id);
            return (
              <li
                key={registration.id}
                className="flex flex-wrap items-center justify-between gap-2 rounded-md border border-gray-100 bg-gray-50 px-3 py-2.5 text-sm"
              >
                <span className="font-medium text-gray-900">
                  {bootcamp?.title ?? `Bootcamp #${registration.bootcamp_id}`}
                </span>
                <span className="flex items-center gap-2 text-gray-500">
                  <span className={statusBadgeClass}>{registration.status}</span>
                  {formatDate(registration.registered_at)}
                </span>
              </li>
            );
          })}
        </ul>
      </section>

      <section className={sectionClass}>
        <h2 className={sectionTitleClass}>Submit a project</h2>
        <p className={sectionDescClass}>For a bootcamp you&apos;re enrolled in.</p>
        <form onSubmit={handleSubmitShowcase} className="mt-5 grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label htmlFor="bootcampId" className={labelClass}>
              Bootcamp
            </label>
            <select
              id="bootcampId"
              className={selectClass}
              value={bootcampId}
              onChange={(e) => setBootcampId(e.target.value)}
              required
            >
              <option value="">Select bootcamp</option>
              {registrations.map((registration) => {
                const bootcamp = bootcamps.find((item) => item.id === registration.bootcamp_id);
                return (
                  <option key={registration.id} value={registration.bootcamp_id}>
                    {bootcamp?.title ?? `Bootcamp #${registration.bootcamp_id}`}
                  </option>
                );
              })}
            </select>
          </div>
          <div>
            <label htmlFor="projectTitle" className={labelClass}>
              Title
            </label>
            <input
              id="projectTitle"
              className={inputClass}
              value={projectTitle}
              onChange={(e) => setProjectTitle(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="projectUrl" className={labelClass}>
              URL <span className="font-normal text-gray-400">(optional)</span>
            </label>
            <input
              id="projectUrl"
              className={inputClass}
              value={projectUrl}
              onChange={(e) => setProjectUrl(e.target.value)}
            />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="projectDescription" className={labelClass}>
              Notes <span className="font-normal text-gray-400">(optional)</span>
            </label>
            <input
              id="projectDescription"
              className={inputClass}
              value={projectDescription}
              onChange={(e) => setProjectDescription(e.target.value)}
            />
          </div>
          <div className="sm:col-span-2">
            <button type="submit" className={buttonPrimaryClass}>
              Submit
            </button>
          </div>
        </form>
      </section>

      <section className={sectionClass}>
        <h2 className={sectionTitleClass}>My projects</h2>
        <div className="mt-4 space-y-3">
          {showcases.length === 0 && <p className={emptyStateClass}>No submissions yet.</p>}
          {showcases.map((showcase) => (
            <article key={showcase.id} className="rounded-md border border-gray-100 bg-gray-50 p-4">
              <p className="font-medium text-gray-900">{showcase.project_title}</p>
              {showcase.project_url && (
                <a href={showcase.project_url} target="_blank" rel="noreferrer" className={`${linkClass} mt-1 block`}>
                  {showcase.project_url}
                </a>
              )}
              <p className="mt-2 text-sm text-gray-600">
                {showcase.marks != null ? (
                  <>
                    <span className={statusBadgeClass}>{showcase.evaluation ?? 'graded'}</span>
                    <span className="ml-2">{showcase.marks} marks</span>
                  </>
                ) : (
                  <span className={statusBadgeClass}>Pending review</span>
                )}
              </p>
              {showcase.feedback && <p className="mt-2 text-sm text-gray-500">{showcase.feedback}</p>}
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
