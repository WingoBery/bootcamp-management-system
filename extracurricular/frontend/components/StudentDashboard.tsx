'use client';

import { FormEvent, useCallback, useEffect, useState } from 'react';
import LoadingSpinner from './LoadingSpinner';
import StatCard from './StatCard';
import type { Bootcamp, Registration, Showcase, User } from '../lib/types';
import {
  ApiError,
  alertErrorClass,
  alertSuccessClass,
  buttonPrimaryClass,
  buttonSecondaryClass,
  emptyStateClass,
  formatDate,
  innerItemClass,
  inputClass,
  labelClass,
  linkClass,
  listBootcamps,
  listStudentRegistrations,
  listStudentShowcases,
  registerForBootcamp,
  sectionClass,
  sectionDescClass,
  sectionTitleClass,
  selectClass,
  statusBadgeClass,
  submitShowcase,
  submitShowcaseWithImage,
  getProjectImageUrl,
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
  const [projectImage, setProjectImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const registeredIds = new Set(registrations.map((item) => item.bootcamp_id));
  const pendingReviews = showcases.filter((item) => item.marks == null).length;

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
      const payload = {
        student_id: user.id,
        bootcamp_id: Number(bootcampId),
        project_title: projectTitle,
        project_url: projectUrl || undefined,
        description: projectDescription || undefined,
      };

      if (projectImage) {
        await submitShowcaseWithImage(payload, projectImage);
      } else {
        await submitShowcase(payload);
      }

      setMessage('Project submitted.');
      setProjectTitle('');
      setProjectUrl('');
      setProjectDescription('');
      setBootcampId('');
      setProjectImage(null);
      setImagePreview(null);
      await loadData();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Submission failed');
    }
  }

  function handleImageChange(file: File | null) {
    setProjectImage(file);
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }
    setImagePreview(file ? URL.createObjectURL(file) : null);
  }

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Open bootcamps" value={bootcamps.length} />
        <StatCard label="Enrollments" value={registrations.length} />
        <StatCard label="Submissions" value={showcases.length} />
        <StatCard label="Pending review" value={pendingReviews} />
      </div>

      {error && <p className={alertErrorClass}>{error}</p>}
      {message && <p className={alertSuccessClass}>{message}</p>}

      <section id="bootcamps" className={`${sectionClass} scroll-mt-28`}>
        <h2 className={sectionTitleClass}>Bootcamps</h2>
        <p className={sectionDescClass}>Open sessions you can enroll in.</p>
        <div className="glass-divider mt-5">
          {bootcamps.length === 0 && <p className={emptyStateClass}>Nothing scheduled yet.</p>}
          {bootcamps.map((bootcamp) => (
            <div key={bootcamp.id} className="flex flex-wrap items-start justify-between gap-4 py-4 first:pt-0 last:pb-0">
              <div className="min-w-0 flex-1">
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

      <section id="enrollments" className={`${sectionClass} scroll-mt-28`}>
        <h2 className={sectionTitleClass}>My enrollments</h2>
        <ul className="mt-4 space-y-2">
          {registrations.length === 0 && <li className={emptyStateClass}>No enrollments yet.</li>}
          {registrations.map((registration) => {
            const bootcamp = bootcamps.find((item) => item.id === registration.bootcamp_id);
            return (
              <li key={registration.id} className={`${innerItemClass} flex flex-wrap items-center justify-between gap-2 text-sm`}>
                <span className="font-medium" style={{ color: 'var(--text-primary)' }}>
                  {bootcamp?.title ?? `Bootcamp #${registration.bootcamp_id}`}
                </span>
                <span className="flex items-center gap-2" style={{ color: 'var(--text-secondary)' }}>
                  <span className={statusBadgeClass}>{registration.status}</span>
                  {formatDate(registration.registered_at)}
                </span>
              </li>
            );
          })}
        </ul>
      </section>

      <section id="submit-project" className={`${sectionClass} scroll-mt-28`}>
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
              URL <span className="font-normal opacity-70">(optional)</span>
            </label>
            <input
              id="projectUrl"
              className={inputClass}
              value={projectUrl}
              onChange={(e) => setProjectUrl(e.target.value)}
            />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="projectImage" className={labelClass}>
              Project photo
            </label>
            <input
              id="projectImage"
              className={inputClass}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              onChange={(e) => handleImageChange(e.target.files?.[0] ?? null)}
            />
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Project preview"
                className="mt-3 max-h-48 rounded-2xl border object-cover"
                style={{ borderColor: 'var(--glass-border)' }}
              />
            )}
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="projectDescription" className={labelClass}>
              Notes <span className="font-normal opacity-70">(optional)</span>
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

      <section id="my-projects" className={`${sectionClass} scroll-mt-28`}>
        <h2 className={sectionTitleClass}>My projects</h2>
        <div className="mt-4 space-y-3">
          {showcases.length === 0 && <p className={emptyStateClass}>No submissions yet.</p>}
          {showcases.map((showcase) => {
            const imageUrl = getProjectImageUrl(showcase.project_image_url);
            return (
            <article key={showcase.id} className={innerItemClass}>
              {imageUrl && (
                <img
                  src={imageUrl}
                  alt={showcase.project_title}
                  className="mb-3 max-h-56 w-full rounded-2xl object-cover"
                />
              )}
              <p className="font-medium" style={{ color: 'var(--text-primary)' }}>
                {showcase.project_title}
              </p>
              {showcase.project_url && (
                <a href={showcase.project_url} target="_blank" rel="noreferrer" className={`${linkClass} mt-1 block`}>
                  {showcase.project_url}
                </a>
              )}
              <p className="mt-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                {showcase.marks != null ? (
                  <>
                    <span className={statusBadgeClass}>{showcase.evaluation ?? 'graded'}</span>
                    <span className="ml-2">{showcase.marks} marks</span>
                  </>
                ) : (
                  <span className={statusBadgeClass}>Pending review</span>
                )}
              </p>
              {showcase.feedback && (
                <p className="mt-2 text-sm" style={{ color: 'var(--text-tertiary)' }}>
                  {showcase.feedback}
                </p>
              )}
            </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}
