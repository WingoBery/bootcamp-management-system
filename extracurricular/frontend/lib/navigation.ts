import type { UserRole } from './types';

export interface NavItem {
  id: string;
  label: string;
}

export function getNavItemsForRole(role: UserRole): NavItem[] {
  switch (role) {
    case 'admin':
      return [
        { id: 'overview', label: 'Overview' },
        { id: 'grading', label: 'Grades & rankings' },
        { id: 'new-bootcamp', label: 'New bootcamp' },
        { id: 'all-bootcamps', label: 'All bootcamps' },
        { id: 'enrollments', label: 'Enrollments' },
      ];
    case 'supervisor':
      return [{ id: 'review-queue', label: 'Review queue' }];
    case 'student':
    default:
      return [
        { id: 'bootcamps', label: 'Bootcamps' },
        { id: 'enrollments', label: 'Enrollments' },
        { id: 'submit-project', label: 'Submit project' },
        { id: 'my-projects', label: 'My projects' },
      ];
  }
}
