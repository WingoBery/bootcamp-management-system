'use client';

import type { AdminOverviewMetrics } from '../lib/adminAnalytics';
import { innerItemClass, sectionClass, sectionDescClass, sectionTitleClass } from '../lib/ui';
import StatCard from './StatCard';

interface AdminOverviewChartsProps {
  metrics: AdminOverviewMetrics;
  reportDate: string;
}

const PIPELINE_COLORS = {
  graded: 'var(--chart-graded)',
  pending: 'var(--chart-pending)',
  missing: 'var(--chart-missing)',
};

function DonutSegment({
  percent,
  offset,
  color,
}: {
  percent: number;
  offset: number;
  color: string;
}) {
  const circumference = 2 * Math.PI * 42;
  const length = (percent / 100) * circumference;
  return (
    <circle
      cx="50"
      cy="50"
      r="42"
      fill="none"
      stroke={color}
      strokeWidth="14"
      strokeDasharray={`${length} ${circumference - length}`}
      strokeDashoffset={-offset * circumference}
      transform="rotate(-90 50 50)"
      className="chart-donut-segment"
    />
  );
}

export default function AdminOverviewCharts({ metrics, reportDate }: AdminOverviewChartsProps) {
  const { pipeline, bootcampFills, dailyEnrollments } = metrics;
  const pipelineTotal = pipeline.graded + pipeline.pendingReview + pipeline.notSubmitted;
  const pipelinePercents =
    pipelineTotal > 0
      ? {
          graded: (pipeline.graded / pipelineTotal) * 100,
          pending: (pipeline.pendingReview / pipelineTotal) * 100,
          missing: (pipeline.notSubmitted / pipelineTotal) * 100,
        }
      : { graded: 0, pending: 0, missing: 0 };

  const maxDaily = Math.max(1, ...dailyEnrollments.map((item) => item.count));
  const maxFill = Math.max(1, ...bootcampFills.map((item) => item.fillPercent));

  const reportLines = [
    `${metrics.bootcampCount} active bootcamp${metrics.bootcampCount === 1 ? '' : 's'} with ${metrics.utilizationPercent}% seat utilization (${metrics.totalEnrolled}/${metrics.totalCapacity}).`,
    `${metrics.uniqueStudents} unique student${metrics.uniqueStudents === 1 ? '' : 's'} enrolled across ${metrics.totalEnrolled} registration${metrics.totalEnrolled === 1 ? '' : 's'}.`,
    `${metrics.projectSubmissions} project submission${metrics.projectSubmissions === 1 ? '' : 's'}: ${metrics.gradedProjects} graded, ${metrics.pendingReviews} awaiting review, ${pipeline.notSubmitted} not yet submitted.`,
  ];

  return (
    <section id="overview" className={`${sectionClass} scroll-mt-28`}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className={sectionTitleClass}>System overview</h2>
          <p className={sectionDescClass}>
            Live snapshot for reporting — updated {reportDate}
          </p>
        </div>
        <span className="chart-report-badge">End-of-day report</span>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Bootcamps" value={metrics.bootcampCount} />
        <StatCard label="Seat utilization" value={`${metrics.utilizationPercent}%`} />
        <StatCard label="Project submissions" value={metrics.projectSubmissions} />
        <StatCard label="Pending reviews" value={metrics.pendingReviews} />
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        <article className={`${innerItemClass} chart-card`}>
          <h3 className="chart-card-title">Bootcamp occupancy</h3>
          <p className="chart-card-desc">Enrolled seats vs capacity per session</p>
          {bootcampFills.length === 0 ? (
            <p className="chart-empty">No bootcamps scheduled yet.</p>
          ) : (
            <ul className="mt-4 space-y-4">
              {bootcampFills.map((item) => (
                <li key={item.id}>
                  <div className="chart-bar-header">
                    <span className="chart-bar-label">{item.title}</span>
                    <span className="chart-bar-value">
                      {item.enrolled}/{item.capacity} ({item.fillPercent}%)
                    </span>
                  </div>
                  <div className="chart-bar-track" aria-hidden="true">
                    <div
                      className="chart-bar-fill"
                      style={{ width: `${(item.fillPercent / maxFill) * 100}%` }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </article>

        <article className={`${innerItemClass} chart-card`}>
          <h3 className="chart-card-title">Project pipeline</h3>
          <p className="chart-card-desc">Submission and grading status across all enrollments</p>
          {pipelineTotal === 0 ? (
            <p className="chart-empty">No enrollment or project activity yet.</p>
          ) : (
            <div className="mt-4 flex flex-col items-center gap-5 sm:flex-row sm:items-center sm:justify-center">
              <div className="chart-donut-wrap">
                <svg viewBox="0 0 100 100" className="chart-donut" role="img" aria-label="Project pipeline chart">
                  <circle cx="50" cy="50" r="42" fill="none" stroke="var(--glass-inner)" strokeWidth="14" />
                  <DonutSegment percent={pipelinePercents.graded} offset={0} color={PIPELINE_COLORS.graded} />
                  <DonutSegment
                    percent={pipelinePercents.pending}
                    offset={pipelinePercents.graded / 100}
                    color={PIPELINE_COLORS.pending}
                  />
                  <DonutSegment
                    percent={pipelinePercents.missing}
                    offset={(pipelinePercents.graded + pipelinePercents.pending) / 100}
                    color={PIPELINE_COLORS.missing}
                  />
                </svg>
                <div className="chart-donut-center">
                  <span className="chart-donut-total">{pipelineTotal}</span>
                  <span className="chart-donut-caption">total</span>
                </div>
              </div>
              <ul className="chart-legend">
                <li>
                  <span className="chart-legend-dot" style={{ background: PIPELINE_COLORS.graded }} />
                  Graded <strong>{pipeline.graded}</strong>
                </li>
                <li>
                  <span className="chart-legend-dot" style={{ background: PIPELINE_COLORS.pending }} />
                  Pending review <strong>{pipeline.pendingReview}</strong>
                </li>
                <li>
                  <span className="chart-legend-dot" style={{ background: PIPELINE_COLORS.missing }} />
                  Not submitted <strong>{pipeline.notSubmitted}</strong>
                </li>
              </ul>
            </div>
          )}
        </article>

        <article className={`${innerItemClass} chart-card lg:col-span-2`}>
          <h3 className="chart-card-title">Enrollment activity (last 7 days)</h3>
          <p className="chart-card-desc">New registrations per day</p>
          <div className="mt-5 flex items-end justify-between gap-2 sm:gap-3" role="img" aria-label="Daily enrollment bar chart">
            {dailyEnrollments.map((day) => (
              <div key={day.dateKey} className="chart-column-group">
                <span className="chart-column-value">{day.count > 0 ? day.count : ''}</span>
                <div
                  className="chart-column"
                  style={{ height: `${Math.max(8, (day.count / maxDaily) * 100)}%` }}
                  title={`${day.label}: ${day.count} enrollment${day.count === 1 ? '' : 's'}`}
                />
                <span className="chart-column-label">{day.label.split(',')[0]}</span>
              </div>
            ))}
          </div>
        </article>

        <article className={`${innerItemClass} chart-card lg:col-span-2`}>
          <h3 className="chart-card-title">Report summary</h3>
          <p className="chart-card-desc">Copy-ready highlights for daily stand-ups or end-of-day reports</p>
          <ul className="chart-report-list mt-4 space-y-2">
            {reportLines.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </article>
      </div>
    </section>
  );
}
