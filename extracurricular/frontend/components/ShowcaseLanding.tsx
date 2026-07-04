'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import ThemeToggle from './ThemeToggle';
import { buttonPrimaryClass, buttonSecondaryClass, linkClass } from '../lib/ui';
import {
  SHOWCASE_COHORTS,
  SHOWCASE_STATS,
  evaluationLabel,
  filterShowcaseProjects,
  type ShowcaseProject,
} from '../lib/showcaseGallery';

function ProjectCard({ project }: { project: ShowcaseProject }) {
  const isChampion = project.rankLabel.includes('All cohorts');

  return (
    <article className={`showcase-card ${isChampion ? 'showcase-card-champion' : ''}`}>
      <div className="showcase-card-image-wrap">
        <img src={project.imageUrl} alt={project.imageAlt} className="showcase-card-image" loading="lazy" />
        <div className="showcase-card-overlay">
          <span className="showcase-rank-pill">{project.rankLabel}</span>
          {isChampion && <span className="showcase-champion-pill">Showcase champion</span>}
        </div>
      </div>
      <div className="showcase-card-body">
        <div className="showcase-card-meta">
          <span>{project.bootcampTitle}</span>
          <span>
            {project.city}, {project.country}
          </span>
        </div>
        <h3 className="showcase-card-title">{project.projectTitle}</h3>
        <p className="showcase-card-desc">{project.description}</p>
        <div className="showcase-student-row">
          <div>
            <p className="showcase-student-label">{project.studentRole}</p>
            <p className="showcase-student-name">{project.studentName}</p>
          </div>
          <div className="showcase-grade-block">
            <p className="showcase-grade-marks">{project.marks}</p>
            <p className="showcase-grade-eval">{evaluationLabel(project.evaluation)}</p>
          </div>
        </div>
        <ul className="showcase-tag-list">
          {project.tags.map((tag) => (
            <li key={tag} className="showcase-tag">
              {tag}
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}

export default function ShowcaseLanding() {
  const [cohortFilter, setCohortFilter] = useState('all');

  const projects = useMemo(() => filterShowcaseProjects(cohortFilter), [cohortFilter]);
  const featuredGraduates = useMemo(
    () =>
      filterShowcaseProjects('all')
        .slice()
        .sort((a, b) => b.marks - a.marks)
        .slice(0, 3),
    [],
  );

  return (
    <div className="showcase-page app-canvas min-h-screen">
      <header className="showcase-header">
        <div className="showcase-header-inner">
          <div>
            <p className="showcase-kicker">Bootcamp Project Showcase</p>
            <h1 className="showcase-brand">African Innovation Gallery</h1>
          </div>
          <div className="showcase-header-actions">
            <ThemeToggle />
            <Link href="/portal" className={buttonSecondaryClass}>
              Portal login
            </Link>
          </div>
        </div>
      </header>

      <main className="showcase-main">
        <section className="showcase-hero glass-panel">
          <div className="showcase-hero-grid">
            <div>
              <h2 className="showcase-hero-title">
                Past bootcamp projects built across Africa — by African students, for African communities.
              </h2>
              <p className="showcase-hero-desc">
                Explore standout graduate work from fintech in Douala to civic tech in Maputo. Each project
                highlights the top-ranked student from its cohort.
              </p>
              <div className="showcase-hero-actions">
                <a href="#gallery" className={buttonPrimaryClass}>
                  Browse projects
                </a>
                <Link href="/portal" className={buttonSecondaryClass}>
                  Join a bootcamp
                </Link>
              </div>
            </div>
            <div className="showcase-stats-grid">
              <div className="showcase-stat">
                <p className="showcase-stat-value">{SHOWCASE_STATS.bootcamps}</p>
                <p className="showcase-stat-label">Bootcamps</p>
              </div>
              <div className="showcase-stat">
                <p className="showcase-stat-value">{SHOWCASE_STATS.graduates}</p>
                <p className="showcase-stat-label">Graduates</p>
              </div>
              <div className="showcase-stat">
                <p className="showcase-stat-value">{SHOWCASE_STATS.featuredProjects}</p>
                <p className="showcase-stat-label">Featured projects</p>
              </div>
              <div className="showcase-stat">
                <p className="showcase-stat-value">{SHOWCASE_STATS.countries}</p>
                <p className="showcase-stat-label">Countries</p>
              </div>
            </div>
          </div>
        </section>

        <section className="showcase-section">
          <div className="showcase-section-head">
            <h2 className="section-title">Top graduates</h2>
            <p className="section-desc">Highest-ranked builders from recent African bootcamp cohorts.</p>
          </div>
          <div className="showcase-top-grid">
            {featuredGraduates.map((project, index) => (
              <article key={project.id} className="showcase-top-card glass-panel">
                <span className="showcase-top-rank">#{index + 1}</span>
                <img
                  src={project.imageUrl}
                  alt={project.studentName}
                  className="showcase-top-avatar"
                  loading="lazy"
                />
                <p className="showcase-top-name">{project.studentName}</p>
                <p className="showcase-top-project">{project.projectTitle}</p>
                <p className="showcase-top-meta">
                  {project.marks} marks · {evaluationLabel(project.evaluation)} · {project.city}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section id="gallery" className="showcase-section">
          <div className="showcase-section-head showcase-section-head-row">
            <div>
              <h2 className="section-title">Project gallery</h2>
              <p className="section-desc">
                Discover solutions shaped by local context — markets, clinics, farms, and cities.
              </p>
            </div>
            <div className="showcase-filter-wrap">
              <label htmlFor="cohortFilter" className="form-label">
                Cohort
              </label>
              <select
                id="cohortFilter"
                className="glass-input showcase-filter-select"
                value={cohortFilter}
                onChange={(e) => setCohortFilter(e.target.value)}
              >
                {SHOWCASE_COHORTS.map((cohort) => (
                  <option key={cohort.id} value={cohort.id}>
                    {cohort.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="showcase-gallery-grid">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </section>
      </main>

      <footer className="showcase-footer glass-panel">
        <p className="showcase-footer-text">
          Bootcamp Management System · Showcasing African tech talent from Douala to Maputo.
        </p>
        <Link href="/portal" className={linkClass}>
          Staff, student & supervisor portal →
        </Link>
      </footer>
    </div>
  );
}
