'use client';

import { useCallback, useEffect, useState } from 'react';
import AdminDashboard from '../components/AdminDashboard';
import LoginPanel from '../components/LoginPanel';
import StudentDashboard from '../components/StudentDashboard';
import SupervisorDashboard from '../components/SupervisorDashboard';
import { ApiError, buttonGhostClass, getCurrentUser, logout, roleBadgeClass, alertErrorClass, loadingClass } from '../lib/api';
import { getToken } from '../lib/auth';
import type { User } from '../lib/types';

function LoadingSpinner() {
  return (
    <div className={loadingClass}>
      <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-gray-200 border-t-indigo-600" />
      Loading
    </div>
  );
}

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
    <div className="min-h-screen">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <div>
            <p className="text-base font-semibold text-gray-900">Bootcamp Management</p>
            <p className="text-sm text-gray-500">Scheduling, enrollment & reviews</p>
          </div>

          {user && (
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="hidden text-right sm:block">
                <p className="text-sm font-medium text-gray-900">{user.full_name}</p>
                <p className="text-xs text-gray-500">{user.email}</p>
              </div>
              <span className={roleBadgeClass}>{user.role}</span>
              <button type="button" onClick={handleLogout} className={buttonGhostClass}>
                Sign out
              </button>
            </div>
          )}
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10">
        {error && <p className={`${alertErrorClass} mb-6`}>{error}</p>}

        {initializing ? (
          <LoadingSpinner />
        ) : !user ? (
          <div className="mx-auto max-w-md">
            <LoginPanel onAuthenticated={setUser} />
          </div>
        ) : (
          renderRoleDashboard(user)
        )}
      </main>
    </div>
  );
}
