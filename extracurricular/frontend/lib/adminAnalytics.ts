import type { Bootcamp, EnrollmentDetail, Showcase } from './types';

export interface BootcampFill {
  id: number;
  title: string;
  enrolled: number;
  capacity: number;
  fillPercent: number;
}

export interface ProjectPipeline {
  graded: number;
  pendingReview: number;
  notSubmitted: number;
}

export interface DailyEnrollment {
  label: string;
  dateKey: string;
  count: number;
}

export interface AdminOverviewMetrics {
  bootcampCount: number;
  totalEnrolled: number;
  totalCapacity: number;
  utilizationPercent: number;
  projectSubmissions: number;
  pendingReviews: number;
  gradedProjects: number;
  uniqueStudents: number;
  bootcampFills: BootcampFill[];
  pipeline: ProjectPipeline;
  dailyEnrollments: DailyEnrollment[];
}

function startOfDay(date: Date): Date {
  const copy = new Date(date);
  copy.setHours(0, 0, 0, 0);
  return copy;
}

function formatDayLabel(date: Date): string {
  return date.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
}

export function buildAdminOverviewMetrics(
  bootcamps: Bootcamp[],
  enrollments: EnrollmentDetail[],
  showcases: Showcase[],
  activityDays = 7,
): AdminOverviewMetrics {
  const totalEnrolled = bootcamps.reduce((sum, item) => sum + item.current_registrations, 0);
  const totalCapacity = bootcamps.reduce((sum, item) => sum + item.max_slots, 0);
  const utilizationPercent = totalCapacity > 0 ? Math.round((totalEnrolled / totalCapacity) * 100) : 0;

  const gradedProjects = showcases.filter((item) => item.marks != null).length;
  const pendingReviews = showcases.filter((item) => item.marks == null).length;
  const notSubmitted = Math.max(0, enrollments.length - showcases.length);

  const bootcampFills = bootcamps.map((bootcamp) => ({
    id: bootcamp.id,
    title: bootcamp.title,
    enrolled: bootcamp.current_registrations,
    capacity: bootcamp.max_slots,
    fillPercent:
      bootcamp.max_slots > 0
        ? Math.round((bootcamp.current_registrations / bootcamp.max_slots) * 100)
        : 0,
  }));

  const uniqueStudents = new Set(enrollments.map((item) => item.student_id)).size;

  const today = startOfDay(new Date());
  const dayBuckets: DailyEnrollment[] = [];
  for (let offset = activityDays - 1; offset >= 0; offset -= 1) {
    const day = new Date(today);
    day.setDate(today.getDate() - offset);
    const dateKey = day.toISOString().slice(0, 10);
    dayBuckets.push({ label: formatDayLabel(day), dateKey, count: 0 });
  }

  for (const enrollment of enrollments) {
    const registeredDay = startOfDay(new Date(enrollment.registered_at)).toISOString().slice(0, 10);
    const bucket = dayBuckets.find((item) => item.dateKey === registeredDay);
    if (bucket) {
      bucket.count += 1;
    }
  }

  return {
    bootcampCount: bootcamps.length,
    totalEnrolled,
    totalCapacity,
    utilizationPercent,
    projectSubmissions: showcases.length,
    pendingReviews,
    gradedProjects,
    uniqueStudents,
    bootcampFills,
    pipeline: {
      graded: gradedProjects,
      pendingReview: pendingReviews,
      notSubmitted,
    },
    dailyEnrollments: dayBuckets,
  };
}
