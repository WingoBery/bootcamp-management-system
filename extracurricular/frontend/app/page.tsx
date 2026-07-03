"use client";

import { useState } from 'react';
import { getApiUrl } from '../lib/config';

const roles = ['student', 'supervisor', 'admin'];
const apiUrl = getApiUrl();

export default function HomePage() {
  const [selectedRole, setSelectedRole] = useState('student');

  return (
    <main className="mx-auto flex min-h-screen max-w-6xl flex-col gap-8 px-6 py-10">
      <header className="rounded-2xl border border-slate-800 bg-slate-900/70 p-8 shadow-xl">
        <p className="text-sm uppercase tracking-[0.3em] text-cyan-400">Bootcamp Management</p>
        <h1 className="mt-3 text-4xl font-semibold">Role-based workspace</h1>
        <p className="mt-3 max-w-2xl text-slate-300">
          A simple Next.js shell for student, supervisor, and admin workflows connected to the gateway.
        </p>
        <p className="mt-2 text-xs text-slate-500">
          API: <code className="text-cyan-400">{apiUrl}</code>
        </p>
      </header>

      <section className="grid gap-6 md:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
          <h2 className="text-xl font-semibold">Choose a role</h2>
          <div className="mt-4 flex flex-wrap gap-3">
            {roles.map((role) => (
              <button
                key={role}
                onClick={() => setSelectedRole(role)}
                className={`rounded-full px-4 py-2 text-sm font-medium capitalize ${selectedRole === role ? 'bg-cyan-500 text-slate-950' : 'bg-slate-800 text-slate-200'}`}
              >
                {role}
              </button>
            ))}
          </div>

          <div className="mt-6 rounded-xl border border-slate-800 bg-slate-950/70 p-4">
            {selectedRole === 'student' && (
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Student view</h3>
                <p className="text-sm text-slate-400">See enrolled bootcamps and submit project links.</p>
              </div>
            )}
            {selectedRole === 'supervisor' && (
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Supervisor view</h3>
                <p className="text-sm text-slate-400">Review assigned showcases and add feedback.</p>
              </div>
            )}
            {selectedRole === 'admin' && (
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Admin view</h3>
                <p className="text-sm text-slate-400">Create and manage bootcamp schedules.</p>
              </div>
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
          <h2 className="text-xl font-semibold">Login</h2>
          <form className="mt-4 space-y-4">
            <input className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2" placeholder="Email" />
            <input className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2" placeholder="Password" type="password" />
            <button className="rounded-lg bg-cyan-500 px-4 py-2 font-semibold text-slate-950">Store JWT</button>
          </form>
        </div>
      </section>
    </main>
  );
}
