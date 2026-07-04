'use client';

import { useMemo, useState } from 'react';
import type { BootcampGradeReport } from '../lib/adminAnalytics';
import {
  emptyStateClass,
  formatDate,
  innerItemClass,
  labelClass,
  sectionClass,
  sectionDescClass,
  sectionTitleClass,
  selectClass,
  statusBadgeClass,
} from '../lib/api';

interface AdminGradingLeaderboardProps {
  reports: BootcampGradeReport[];
}

function statusLabel(status: 'graded' | 'pending' | 'not_submitted'): string {
  switch (status) {
    case 'graded':
      return 'Graded';
    case 'pending':
      return 'Pending review';
    default:
      return 'Not submitted';
  }
}

function formatEvaluation(value: string | null): string {
  if (!value) {
    return '—';
  }
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export default function AdminGradingLeaderboard({ reports }: AdminGradingLeaderboardProps) {
  const [bootcampFilter, setBootcampFilter] = useState('');

  const visibleReports = useMemo(() => {
    if (bootcampFilter === '') {
      return reports;
    }
    const bootcampId = Number(bootcampFilter);
    return reports.filter((item) => item.bootcampId === bootcampId);
  }, [bootcampFilter, reports]);

  return (
    <section id="grading" className={`${sectionClass} scroll-mt-28`}>
      <h2 className={sectionTitleClass}>Grades &amp; rankings</h2>
      <p className={sectionDescClass}>
        Supervisor grades per bootcamp — top student highlighted for quick reporting.
      </p>

      <div className="mt-5 max-w-sm">
        <label htmlFor="gradingFilter" className={labelClass}>
          Filter by bootcamp
        </label>
        <select
          id="gradingFilter"
          className={selectClass}
          value={bootcampFilter}
          onChange={(e) => setBootcampFilter(e.target.value)}
        >
          <option value="">All bootcamps</option>
          {reports.map((report) => (
            <option key={report.bootcampId} value={report.bootcampId}>
              {report.bootcampTitle}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-6 space-y-5">
        {visibleReports.length === 0 && <p className={emptyStateClass}>No bootcamps to show grades for.</p>}

        {visibleReports.map((report) => (
          <article key={report.bootcampId} className={`${innerItemClass} grade-report-card`}>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h3 className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>
                  {report.bootcampTitle}
                </h3>
                <p className="mt-1 text-xs" style={{ color: 'var(--text-tertiary)' }}>
                  {report.gradedCount} graded · {report.pendingCount} pending · {report.notSubmittedCount} not
                  submitted
                </p>
              </div>
              {report.topStudent && (
                <div className="grade-top-badge">
                  <span className="grade-top-label">Top student</span>
                  <span className="grade-top-name">{report.topStudent.studentName}</span>
                  <span className="grade-top-score">{report.topStudent.marks} marks</span>
                </div>
              )}
            </div>

            {report.entries.length === 0 ? (
              <p className={`${emptyStateClass} mt-4`}>No students enrolled in this bootcamp yet.</p>
            ) : (
              <div className="grade-table-wrap mt-4 overflow-x-auto">
                <table className="grade-table">
                  <thead>
                    <tr>
                      <th>Rank</th>
                      <th>Student</th>
                      <th>Project</th>
                      <th>Marks</th>
                      <th>Result</th>
                      <th>Feedback</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {report.entries.map((entry) => (
                      <tr
                        key={`${report.bootcampId}-${entry.studentId}`}
                        className={entry.isTopStudent ? 'grade-row-top' : undefined}
                      >
                        <td>
                          {entry.rank != null ? (
                            <span className={`grade-rank ${entry.rank === 1 ? 'grade-rank-first' : ''}`}>
                              #{entry.rank}
                            </span>
                          ) : (
                            '—'
                          )}
                        </td>
                        <td>
                          <p className="font-medium" style={{ color: 'var(--text-primary)' }}>
                            {entry.studentName}
                          </p>
                          <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                            {entry.studentEmail}
                          </p>
                        </td>
                        <td>{entry.projectTitle ?? '—'}</td>
                        <td>
                          {entry.marks != null ? (
                            <span className="grade-marks">{entry.marks}</span>
                          ) : (
                            '—'
                          )}
                        </td>
                        <td>{formatEvaluation(entry.evaluation)}</td>
                        <td className="grade-feedback-cell">{entry.feedback ?? '—'}</td>
                        <td>
                          <span className={statusBadgeClass}>{statusLabel(entry.status)}</span>
                          {entry.gradedAt && (
                            <p className="mt-1 text-[10px]" style={{ color: 'var(--text-tertiary)' }}>
                              {formatDate(entry.gradedAt)}
                            </p>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}
