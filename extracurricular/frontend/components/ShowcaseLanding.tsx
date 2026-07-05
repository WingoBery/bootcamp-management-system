'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import ProjectCarousel from './ProjectCarousel';
import ShowcaseImage from './ShowcaseImage';
import ThemeToggle from './ThemeToggle';
import { buttonPrimaryClass, buttonSecondaryClass, linkClass } from '../lib/ui';
import {
  IUC_SCHOOL,
  SHOWCASE_COHORTS,
  SHOWCASE_STATS,
  evaluationLabel,
  filterShowcaseProjects,
  type ShowcaseProject,
} from '../lib/showcaseGallery';

function ProjectCard({
  project,
  isActive,
  onSelect,
}: {
  project: ShowcaseProject;
  isActive: boolean;
  onSelect: () => void;
}) {
  const isChampion = project.rankLabel.includes('All cohorts');

  return (
    <article
      className={`showcase-card ${isChampion ? 'showcase-card-champion' : ''} ${isActive ? 'showcase-card-active' : ''}`}
    >
      <button type="button" className="showcase-card-hit" onClick={onSelect} aria-label={`View ${project.projectTitle} in carousel`}>
        <div className="showcase-card-image-wrap">
          <ShowcaseImage src={project.imageUrl} alt={project.imageAlt} className="showcase-card-image" />
          <div className="showcase-card-overlay">
            <span className="showcase-rank-pill">{project.rankLabel}</span>
            {isChampion && <span className="showcase-champion-pill">Showcase champion</span>}
          </div>
        </div>
        <div className="showcase-card-body">
          <div className="showcase-card-meta">
            <span>{project.bootcampTitle}</span>
            <span>
              {project.city} · {IUC_SCHOOL.name}
            </span>
          </div>
          <h3 className="showcase-card-title">{project.projectTitle}</h3>
          <p className="showcase-card-desc">{project.description}</p>
          <div className="showcase-student-row">
            <div className="showcase-student-info">
              <ShowcaseImage
                src={project.portraitUrl}
                alt={project.studentName}
                className="showcase-card-portrait"
              />
              <div>
                <p className="showcase-student-label">{project.studentRole}</p>
                <p className="showcase-student-name">{project.studentName}</p>
              </div>
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
      </button>
    </article>
  );
}

export default function ShowcaseLanding() {
  const [cohortFilter, setCohortFilter] = useState('all');
  const [activeIndex, setActiveIndex] = useState(0);

  const projects = useMemo(() => filterShowcaseProjects(cohortFilter), [cohortFilter]);
  const featuredGraduates = useMemo(
    () =>
      filterShowcaseProjects('all')
        .slice()
        .sort((a, b) => b.marks - a.marks)
        .slice(0, 3),
    [],
  );

  useEffect(() => {
    setActiveIndex(0);
  }, [cohortFilter]);

  useEffect(() => {
    if (activeIndex >= projects.length) {
      setActiveIndex(0);
    }
  }, [activeIndex, projects.length]);

  function scrollToCarousel() {
    document.getElementById('featured-carousel')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function handleCardSelect(projectId: string) {
    const index = projects.findIndex((project) => project.id === projectId);
    if (index >= 0) {
      setActiveIndex(index);
      scrollToCarousel();
    }
  }

  return (
    <div className="showcase-page app-canvas min-h-screen">
      <header className="showcase-header">
        <div className="showcase-header-inner">
          <div>
            <p className="showcase-kicker">{IUC_SCHOOL.tagline}</p>
            <h1 className="showcase-brand">{IUC_SCHOOL.fullName}</h1>
            <p className="showcase-location">{IUC_SCHOOL.location}</p>
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
                Past bootcamp projects built by IUC students — solving real problems in Douala.
              </h2>
              <p className="showcase-hero-desc">
                Browse the featured carousel below or explore the full gallery. Each project highlights the
                top-ranked IUC student from its cohort.
              </p>
              <div className="showcase-hero-actions">
                <a href="#featured-carousel" className={buttonPrimaryClass}>
                  View featured projects
                </a>
                <Link href="/portal" className={buttonSecondaryClass}>
                  IUC portal login
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
                <p className="showcase-stat-value">{SHOWCASE_STATS.departments}</p>
                <p className="showcase-stat-label">Departments</p>
              </div>
            </div>
          </div>
        </section>

        <section id="featured-carousel" className="showcase-section">
          <div className="showcase-section-head">
            <h2 className="section-title">Featured project carousel</h2>
            <p className="section-desc">
              Swipe through standout IUC graduate work. Use the thumbnails or arrows to explore each project.
            </p>
          </div>
          <ProjectCarousel projects={projects} activeIndex={activeIndex} onSelect={setActiveIndex} />
        </section>

        <section className="showcase-section">
          <div className="showcase-section-head">
            <h2 className="section-title">Top graduates</h2>
            <p className="section-desc">Highest-ranked IUC builders from recent bootcamp cohorts.</p>
          </div>
          <div className="showcase-top-grid">
            {featuredGraduates.map((project, index) => (
              <article key={project.id} className="showcase-top-card glass-panel">
                <span className="showcase-top-rank">#{index + 1}</span>
                <ShowcaseImage
                  src={project.portraitUrl}
                  alt={project.studentName}
                  className="showcase-top-avatar"
                />
                <p className="showcase-top-name">{project.studentName}</p>
                <p className="showcase-top-project">{project.projectTitle}</p>
                <p className="showcase-top-meta">
                  {project.marks} marks · {evaluationLabel(project.evaluation)} · IUC · {project.city}
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
                Tap a card to jump to that project in the carousel above.
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
            {projects.map((project, index) => (
              <ProjectCard
                key={project.id}
                project={project}
                isActive={index === activeIndex}
                onSelect={() => handleCardSelect(project.id)}
              />
            ))}
          </div>
        </section>
      </main>

      <footer className="showcase-footer glass-panel">
        <p className="showcase-footer-text">
          {IUC_SCHOOL.fullName} · {IUC_SCHOOL.location} · Showcasing IUC student innovation in Douala.
        </p>
        <Link href="/portal" className={linkClass}>
          Staff, student & supervisor portal →
        </Link>
      </footer>
    </div>
  );
}
