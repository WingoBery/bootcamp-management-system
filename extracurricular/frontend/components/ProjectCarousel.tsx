'use client';

import { useCallback, useEffect, useState } from 'react';
import ShowcaseImage from './ShowcaseImage';
import { IUC_SCHOOL, evaluationLabel, type ShowcaseProject } from '../lib/showcaseGallery';

interface ProjectCarouselProps {
  projects: ShowcaseProject[];
  activeIndex: number;
  onSelect: (index: number) => void;
}

export default function ProjectCarousel({ projects, activeIndex, onSelect }: ProjectCarouselProps) {
  const [paused, setPaused] = useState(false);
  const count = projects.length;

  const goTo = useCallback(
    (index: number) => {
      if (count === 0) return;
      const next = ((index % count) + count) % count;
      onSelect(next);
    },
    [count, onSelect],
  );

  const goNext = useCallback(() => goTo(activeIndex + 1), [activeIndex, goTo]);
  const goPrev = useCallback(() => goTo(activeIndex - 1), [activeIndex, goTo]);

  useEffect(() => {
    if (paused || count <= 1) return;
    const timer = window.setInterval(() => goNext(), 6000);
    return () => window.clearInterval(timer);
  }, [paused, count, goNext]);

  if (count === 0) {
    return (
      <div className="showcase-carousel-empty glass-panel">
        <p>No projects match this cohort filter.</p>
      </div>
    );
  }

  const project = projects[activeIndex];
  const isChampion = project.rankLabel.includes('All cohorts');

  return (
    <section
      className="showcase-carousel glass-panel"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-roledescription="carousel"
      aria-label="Featured IUC bootcamp projects"
    >
      <div className="showcase-carousel-main">
        <div className="showcase-carousel-media">
          <ShowcaseImage
            key={project.id}
            src={project.imageUrl}
            alt={project.imageAlt}
            className="showcase-carousel-image"
            loading="eager"
          />
          <div className="showcase-carousel-media-overlay" />
          <div className="showcase-carousel-badges">
            <span className="showcase-rank-pill">{project.rankLabel}</span>
            {isChampion && <span className="showcase-champion-pill">Showcase champion</span>}
          </div>
        </div>

        <div className="showcase-carousel-content">
          <p className="showcase-carousel-kicker">
            {project.bootcampTitle} · {project.city} · {IUC_SCHOOL.name}
          </p>
          <h2 className="showcase-carousel-title">{project.projectTitle}</h2>
          <p className="showcase-carousel-desc">{project.description}</p>

          <div className="showcase-carousel-student glass-inner">
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

          <div className="showcase-carousel-controls">
            <button type="button" className="showcase-carousel-btn" onClick={goPrev} aria-label="Previous project">
              ←
            </button>
            <span className="showcase-carousel-counter">
              {activeIndex + 1} / {count}
            </span>
            <button type="button" className="showcase-carousel-btn" onClick={goNext} aria-label="Next project">
              →
            </button>
          </div>
        </div>
      </div>

      <div className="showcase-carousel-thumbs" role="tablist" aria-label="Project thumbnails">
        {projects.map((item, index) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={index === activeIndex}
            aria-label={`Show ${item.projectTitle}`}
            className={`showcase-carousel-thumb ${index === activeIndex ? 'showcase-carousel-thumb-active' : ''}`}
            onClick={() => goTo(index)}
          >
            <ShowcaseImage src={item.portraitUrl} alt={item.studentName} className="showcase-carousel-thumb-image" />
            <span className="showcase-carousel-thumb-label">{item.projectTitle}</span>
          </button>
        ))}
      </div>

      <div className="showcase-carousel-dots" aria-hidden="true">
        {projects.map((item, index) => (
          <button
            key={item.id}
            type="button"
            className={`showcase-carousel-dot ${index === activeIndex ? 'showcase-carousel-dot-active' : ''}`}
            onClick={() => goTo(index)}
            tabIndex={-1}
          />
        ))}
      </div>
    </section>
  );
}
