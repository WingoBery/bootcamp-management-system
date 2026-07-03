import { getApiV1Base } from './config';
import { clearToken, getToken, setToken } from './auth';
import type {
  Bootcamp,
  BootcampCreatePayload,
  EnrollmentDetail,
  Registration,
  Showcase,
  ShowcaseGradePayload,
  ShowcaseSubmitPayload,
  TokenResponse,
  User,
  UserRole,
} from './types';

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function parseError(response: Response): Promise<string> {
  try {
    const body = await response.json();
    if (typeof body.detail === 'string') {
      return body.detail;
    }
    if (Array.isArray(body.detail)) {
      return body.detail.map((item: { msg?: string }) => item.msg ?? JSON.stringify(item)).join(', ');
    }
    return JSON.stringify(body.detail ?? body);
  } catch {
    return response.statusText || 'Request failed';
  }
}

export async function apiRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(options.headers ?? {}),
  };

  if (token) {
    (headers as Record<string, string>).Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${getApiV1Base()}${path}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    throw new ApiError(await parseError(response), response.status);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export async function login(email: string, password: string): Promise<User> {
  const tokenData = await apiRequest<TokenResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  setToken(tokenData.access_token);
  return getCurrentUser();
}

export async function register(
  email: string,
  password: string,
  fullName: string,
  role: UserRole,
): Promise<User> {
  await apiRequest<User>('/auth/register', {
    method: 'POST',
    body: JSON.stringify({
      email,
      password,
      full_name: fullName,
      role,
    }),
  });
  return login(email, password);
}

export function logout(): void {
  clearToken();
}

export async function getCurrentUser(): Promise<User> {
  return apiRequest<User>('/users/me');
}

export async function listBootcamps(): Promise<Bootcamp[]> {
  return apiRequest<Bootcamp[]>('/bootcamps/');
}

export async function createBootcamp(payload: BootcampCreatePayload): Promise<Bootcamp> {
  return apiRequest<Bootcamp>('/bootcamps/', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function listStudentRegistrations(studentId: number): Promise<Registration[]> {
  return apiRequest<Registration[]>(`/registrations/student/${studentId}`);
}

export async function registerForBootcamp(studentId: number, bootcampId: number): Promise<Registration> {
  return apiRequest<Registration>('/registrations/', {
    method: 'POST',
    body: JSON.stringify({ student_id: studentId, bootcamp_id: bootcampId }),
  });
}

export async function listStudentShowcases(studentId: number): Promise<Showcase[]> {
  return apiRequest<Showcase[]>(`/showcases/student/${studentId}`);
}

export async function submitShowcase(payload: ShowcaseSubmitPayload): Promise<Showcase> {
  return apiRequest<Showcase>('/showcases/', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function submitShowcaseWithImage(
  payload: ShowcaseSubmitPayload,
  image: File,
): Promise<Showcase> {
  const token = getToken();
  const formData = new FormData();
  formData.append('student_id', String(payload.student_id));
  formData.append('bootcamp_id', String(payload.bootcamp_id));
  formData.append('project_title', payload.project_title);
  if (payload.project_url) {
    formData.append('project_url', payload.project_url);
  }
  if (payload.description) {
    formData.append('description', payload.description);
  }
  formData.append('project_image', image);

  const headers: HeadersInit = {};
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${getApiV1Base()}/showcases/with-image`, {
    method: 'POST',
    headers,
    body: formData,
  });

  if (!response.ok) {
    throw new ApiError(await parseError(response), response.status);
  }

  return response.json() as Promise<Showcase>;
}

export function getProjectImageUrl(filename: string | null | undefined): string | null {
  if (!filename) {
    return null;
  }
  return `${getApiV1Base()}/showcases/files/${filename}`;
}

export async function listEnrollments(bootcampId?: number): Promise<EnrollmentDetail[]> {
  const query = bootcampId != null ? `?bootcamp_id=${bootcampId}` : '';
  return apiRequest<EnrollmentDetail[]>(`/registrations/enrollments${query}`);
}

export async function listPendingShowcases(supervisorId: number): Promise<Showcase[]> {
  return apiRequest<Showcase[]>(`/showcases/supervisor/${supervisorId}/pending`);
}

export async function gradeShowcase(showcaseId: number, payload: ShowcaseGradePayload): Promise<Showcase> {
  return apiRequest<Showcase>(`/showcases/${showcaseId}/grade`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}

export function formatDate(value: string): string {
  return new Date(value).toLocaleString();
}

export {
  alertErrorClass,
  alertSuccessClass,
  buttonGhostClass,
  buttonPrimaryClass,
  buttonSecondaryClass,
  emptyStateClass,
  innerItemClass,
  inputClass,
  labelClass,
  linkClass,
  loadingClass,
  navItemClass,
  roleBadgeClass,
  sectionClass,
  sectionDescClass,
  sectionTitleClass,
  selectClass,
  spinnerClass,
  statCardClass,
  statLabelClass,
  statValueClass,
  statusBadgeClass,
  tabClass,
} from './ui';
