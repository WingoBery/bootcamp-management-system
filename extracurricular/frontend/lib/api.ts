import { getApiV1Base } from './config';
import { clearToken, getToken, setToken } from './auth';
import type {
  Bootcamp,
  BootcampCreatePayload,
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

export const inputClass =
  'w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-cyan-500 focus:outline-none';

export const buttonPrimaryClass =
  'rounded-lg bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-50';

export const buttonSecondaryClass =
  'rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-sm font-medium text-slate-200 hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50';
