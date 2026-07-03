'use client';

import { useCallback, useEffect, useState } from 'react';
import AdminDashboard from '../components/AdminDashboard';
import AppShell from '../components/AppShell';
import LoadingSpinner from '../components/LoadingSpinner';
import LoginPanel from '../components/LoginPanel';
import StudentDashboard from '../components/StudentDashboard';
import SupervisorDashboard from '../components/SupervisorDashboard';
import ThemeToggle from '../components/ThemeToggle';
import { ApiError, alertErrorClass, getCurrentUser, logout } from '../lib/api';
import { getToken } from '../lib/auth';
import { getNavItemsForRole } from '../lib/navigation';
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
    <div className="app-canvas min-h-screen">
      {initializing ? (
        <div className="flex min-h-screen items-center justify-center p-6">
          <LoadingSpinner />
        </div>
      ) : !user ? (
        <div className="relative flex min-h-screen flex-col items-center justify-center p-6">
          <div className="absolute right-5 top-5 sm:right-8 sm:top-8">
            <ThemeToggle />
          </div>
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl" style={{ color: 'var(--text-primary)' }}>
              Bootcamp Management
            </h1>
            <p className="mt-2 text-sm sm:text-base" style={{ color: 'var(--text-secondary)' }}>
              Scheduling, enrollment, and project reviews
            </p>
          </div>
          <div className="w-full max-w-md">
            {error && <p className={`${alertErrorClass} mb-4`}>{error}</p>}
            <LoginPanel onAuthenticated={setUser} />
          </div>
        </div>
      ) : (
        <AppShell user={user} navItems={getNavItemsForRole(user.role)} onLogout={handleLogout}>
          {error && <p className={`${alertErrorClass} mb-5`}>{error}</p>}
          {renderRoleDashboard(user)}
        </AppShell>
      )}
    </div>
  );
}
