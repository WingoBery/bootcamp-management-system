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

export interface StudentGradeEntry {
  studentId: number;
  studentName: string;
  studentEmail: string;
  projectTitle: string | null;
  marks: number | null;
  evaluation: string | null;
  feedback: string | null;
  gradedAt: string | null;
  submittedAt: string | null;
  rank: number | null;
  isTopStudent: boolean;
  status: 'graded' | 'pending' | 'not_submitted';
}

export interface BootcampGradeReport {
  bootcampId: number;
  bootcampTitle: string;
  topStudent: StudentGradeEntry | null;
  entries: StudentGradeEntry[];
  gradedCount: number;
  pendingCount: number;
  notSubmittedCount: number;
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

export function buildBootcampGradeReports(
  bootcamps: Bootcamp[],
  enrollments: EnrollmentDetail[],
  showcases: Showcase[],
): BootcampGradeReport[] {
  return bootcamps.map((bootcamp) => {
    const campEnrollments = enrollments.filter((item) => item.bootcamp_id === bootcamp.id);
    const campShowcases = showcases.filter((item) => item.bootcamp_id === bootcamp.id);

    const entries: StudentGradeEntry[] = campEnrollments.map((enrollment) => {
      const showcase = campShowcases.find((item) => item.student_id === enrollment.student_id);
      const hasProject = Boolean(showcase);
      const isGraded = showcase?.marks != null;

      return {
        studentId: enrollment.student_id,
        studentName: enrollment.student.full_name,
        studentEmail: enrollment.student.email,
        projectTitle: showcase?.project_title ?? null,
        marks: showcase?.marks ?? null,
        evaluation: showcase?.evaluation ?? null,
        feedback: showcase?.feedback ?? null,
        gradedAt: showcase?.graded_at ?? null,
        submittedAt: showcase?.submitted_at ?? null,
        rank: null,
        isTopStudent: false,
        status: isGraded ? 'graded' : hasProject ? 'pending' : 'not_submitted',
      };
    });

    const graded = entries
      .filter((item) => item.status === 'graded')
      .sort((a, b) => (b.marks ?? 0) - (a.marks ?? 0));
    const pending = entries.filter((item) => item.status === 'pending');
    const notSubmitted = entries.filter((item) => item.status === 'not_submitted');

    graded.forEach((item, index) => {
      item.rank = index + 1;
    });

    const topStudent = graded[0] ?? null;
    if (topStudent) {
      topStudent.isTopStudent = true;
    }

    return {
      bootcampId: bootcamp.id,
      bootcampTitle: bootcamp.title,
      topStudent,
      entries: [...graded, ...pending, ...notSubmitted],
      gradedCount: graded.length,
      pendingCount: pending.length,
      notSubmittedCount: notSubmitted.length,
    };
  });
}
