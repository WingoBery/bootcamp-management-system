'use client';

import { FormEvent, useState } from 'react';
import type { User, UserRole } from '../lib/types';
import { ApiError, buttonPrimaryClass, buttonSecondaryClass, inputClass, login, register } from '../lib/api';

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

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setMode('login')}
          className={`rounded-full px-4 py-1.5 text-sm ${mode === 'login' ? 'bg-cyan-500 text-slate-950' : 'bg-slate-800 text-slate-300'}`}
        >
          Login
        </button>
        <button
          type="button"
          onClick={() => setMode('register')}
          className={`rounded-full px-4 py-1.5 text-sm ${mode === 'register' ? 'bg-cyan-500 text-slate-950' : 'bg-slate-800 text-slate-300'}`}
        >
          Register
        </button>
      </div>

      <h2 className="mt-4 text-xl font-semibold">{mode === 'login' ? 'Sign in' : 'Create account'}</h2>
      <p className="mt-1 text-sm text-slate-400">
        {mode === 'login'
          ? 'Use your bootcamp account credentials.'
          : 'Register as a student, supervisor, or admin.'}
      </p>

      <form onSubmit={handleSubmit} className="mt-4 space-y-4">
        {mode === 'register' && (
          <>
            <input
              className={inputClass}
              placeholder="Full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
            <select
              className={inputClass}
              value={role}
              onChange={(e) => setRole(e.target.value as UserRole)}
            >
              {roles.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </>
        )}
        <input
          className={inputClass}
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          className={inputClass}
          placeholder="Password"
          type="password"
          minLength={6}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {error && <p className="text-sm text-red-400">{error}</p>}

        <button type="submit" disabled={loading} className={buttonPrimaryClass}>
          {loading ? 'Please wait…' : mode === 'login' ? 'Sign in' : 'Register & sign in'}
        </button>
      </form>
    </div>
  );
}
