'use client';

import { useCallback, useEffect, useState } from 'react';
import AdminDashboard from '../components/AdminDashboard';
import LoginPanel from '../components/LoginPanel';
import StudentDashboard from '../components/StudentDashboard';
import SupervisorDashboard from '../components/SupervisorDashboard';
import { ApiError, getCurrentUser, logout } from '../lib/api';
import { getApiUrl } from '../lib/config';
import { getToken } from '../lib/auth';
import type { User } from '../lib/types';

export default function HomePage() {
  const [user, setUser] = useState<User | null>(null);
  const [initializing, setInitializing] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const restoreSession = useCallback(async () => {
    if (!getToken()) {
      setUser(null);
      setInitializing(false);
      return;
    }

    try {
      setUser(await getCurrentUser());
      setError(null);
    } catch (err) {
      logout();
      setUser(null);
      if (err instanceof ApiError && err.status !== 401) {
        setError(err.message);
      }
    } finally {
      setInitializing(false);
    }
  }, []);

  useEffect(() => {
    restoreSession();
  }, [restoreSession]);

  function handleLogout() {
    logout();
    setUser(null);
    setError(null);
  }

  function renderRoleDashboard(currentUser: User) {
    switch (currentUser.role) {
      case 'admin':
        return <AdminDashboard user={currentUser} />;
      case 'supervisor':
        return <SupervisorDashboard user={currentUser} />;
      case 'student':
      default:
        return <StudentDashboard user={currentUser} />;
    }
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-6xl flex-col gap-8 px-6 py-10">
      <header className="rounded-2xl border border-slate-800 bg-slate-900/70 p-8 shadow-xl">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-cyan-400">Bootcamp Management</p>
            <h1 className="mt-3 text-4xl font-semibold">Role-based workspace</h1>
            <p className="mt-3 max-w-2xl text-slate-300">
              Sign in to manage bootcamps, enrollments, and project showcases through the API gateway.
            </p>
            <p className="mt-2 text-xs text-slate-500">
              API: <code className="text-cyan-400">{getApiUrl()}</code>
            </p>
          </div>

          {user && (
            <div className="rounded-xl border border-slate-800 bg-slate-950/70 px-4 py-3 text-sm">
              <p className="font-medium">{user.full_name}</p>
              <p className="text-slate-400">{user.email}</p>
              <p className="mt-1 capitalize text-cyan-400">{user.role}</p>
              <button
                type="button"
                onClick={handleLogout}
                className="mt-3 rounded-lg border border-slate-700 px-3 py-1.5 text-xs text-slate-300 hover:bg-slate-800"
              >
                Sign out
              </button>
            </div>
          )}
        </div>
      </header>

      {error && (
        <p className="rounded-lg border border-red-900 bg-red-950/40 px-3 py-2 text-sm text-red-300">{error}</p>
      )}

      {initializing ? (
        <p className="text-sm text-slate-400">Restoring session…</p>
      ) : !user ? (
        <section className="grid gap-6 md:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
            <h2 className="text-xl font-semibold">What you can do</h2>
            <ul className="mt-4 space-y-3 text-sm text-slate-400">
              <li><span className="font-medium text-slate-200">Students</span> — browse bootcamps, register, submit projects.</li>
              <li><span className="font-medium text-slate-200">Supervisors</span> — review pending showcases and submit grades.</li>
              <li><span className="font-medium text-slate-200">Admins</span> — create and monitor bootcamp schedules.</li>
            </ul>
          </div>
          <LoginPanel onAuthenticated={setUser} />
        </section>
      ) : (
        <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
          <h2 className="mb-4 text-xl font-semibold capitalize">{user.role} dashboard</h2>
          {renderRoleDashboard(user)}
        </section>
      )}
    </main>
  );
}
