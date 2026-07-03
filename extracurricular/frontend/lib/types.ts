export type UserRole = 'student' | 'supervisor' | 'admin';

export interface User {
  id: number;
  email: string;
  full_name: string;
  role: UserRole;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
}

export interface Bootcamp {
  id: number;
  title: string;
  description: string;
  location: string;
  start_date: string;
  end_date: string;
  max_slots: number;
  current_registrations: number;
  supervisor_id: number | null;
}

export interface Registration {
  id: number;
  student_id: number;
  bootcamp_id: number;
  status: string;
  registered_at: string;
}

export interface Showcase {
  id: number;
  student_id: number;
  bootcamp_id: number;
  supervisor_id: number | null;
  project_title: string;
  project_url: string | null;
  description: string | null;
  marks: number | null;
  evaluation: string | null;
  feedback: string | null;
  submitted_at: string;
  graded_at: string | null;
}

export interface BootcampCreatePayload {
  title: string;
  description: string;
  location: string;
  start_date: string;
  end_date: string;
  max_slots: number;
}

export interface ShowcaseSubmitPayload {
  student_id: number;
  bootcamp_id: number;
  project_title: string;
  project_url?: string;
  description?: string;
}

export interface ShowcaseGradePayload {
  supervisor_id: number;
  marks: number;
  evaluation: string;
  feedback: string;
}
