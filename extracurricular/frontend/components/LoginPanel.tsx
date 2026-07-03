'use client';

import { FormEvent, useState } from 'react';
import type { User, UserRole } from '../lib/types';
import {
  ApiError,
  alertErrorClass,
  buttonPrimaryClass,
  inputClass,
  labelClass,
  login,
  register,
  sectionClass,
  selectClass,
} from '../lib/api';

interface LoginPanelProps {
  onAuthenticated: (user: User) => void;
}

const roles: UserRole[] = ['student', 'supervisor', 'admin'];

export default function LoginPanel({ onAuthenticated }: LoginPanelProps) {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState<UserRole>('student');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const user =
        mode === 'login'
          ? await login(email, password)
          : await register(email, password, fullName, role);
      onAuthenticated(user);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Authentication failed');
    } finally {
      setLoading(false);
    }
  }

  const tabClass = (active: boolean) =>
    `flex-1 border-b-2 pb-3 text-sm font-medium transition ${
      active
        ? 'border-indigo-600 text-indigo-600'
        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
    }`;

  return (
    <div className={sectionClass}>
      <div className="flex gap-6 border-b border-gray-200">
        <button type="button" onClick={() => setMode('login')} className={tabClass(mode === 'login')}>
          Sign in
        </button>
        <button type="button" onClick={() => setMode('register')} className={tabClass(mode === 'register')}>
          Register
        </button>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        {mode === 'register' && (
          <>
            <div>
              <label htmlFor="fullName" className={labelClass}>
                Full name
              </label>
              <input
                id="fullName"
                className={inputClass}
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="role" className={labelClass}>
                Role
              </label>
              <select
                id="role"
                className={selectClass}
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
              >
                {roles.map((item) => (
                  <option key={item} value={item}>
                    {item.charAt(0).toUpperCase() + item.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </>
        )}

        <div>
          <label htmlFor="email" className={labelClass}>
            Email
          </label>
          <input
            id="email"
            className={inputClass}
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="password" className={labelClass}>
            Password
          </label>
          <input
            id="password"
            className={inputClass}
            type="password"
            autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {error && <p className={alertErrorClass}>{error}</p>}

        <button type="submit" disabled={loading} className={`${buttonPrimaryClass} w-full`}>
          {loading ? 'Working…' : mode === 'login' ? 'Sign in' : 'Create account'}
        </button>
      </form>
    </div>
  );
}
