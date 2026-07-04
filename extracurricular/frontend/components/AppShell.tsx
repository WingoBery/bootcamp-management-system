'use client';

import { useEffect, useState } from 'react';
import type { User } from '../lib/types';
import type { NavItem } from '../lib/navigation';
import { buttonGhostClass, navItemClass, roleBadgeClass } from '../lib/ui';
import ThemeToggle from './ThemeToggle';

interface AppShellProps {
  user: User;
  navItems: NavItem[];
  onLogout: () => void;
  children: React.ReactNode;
}

function NavIcon({ id }: { id: string }) {
  const props = { width: 18, height: 18, viewBox: '0 0 24 24', fill: 'none', 'aria-hidden': true as const };

  switch (id) {
    case 'overview':
      return (
        <svg {...props}>
          <path
            d="M4 19V5M10 19V9M16 19V13M22 19V7"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      );
    case 'bootcamps':
    case 'all-bootcamps':
      return (
        <svg {...props}>
          <path d="M4 7h16M4 12h16M4 17h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );
    case 'enrollments':
      return (
        <svg {...props}>
          <path
            d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case 'submit-project':
    case 'new-bootcamp':
      return (
        <svg {...props}>
          <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );
    case 'my-projects':
    case 'review-queue':
      return (
        <svg {...props}>
          <path
            d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m6.75 12H9.75m6.75 0a3 3 0 0 1-3 3H9.75a3 3 0 0 1-3-3m8.25 0V9.75a3 3 0 0 0-3-3h-3.75"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    default:
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      );
  }
}

export default function AppShell({ user, navItems, onLogout, children }: AppShellProps) {
  const [activeSection, setActiveSection] = useState(navItems[0]?.id ?? '');

  useEffect(() => {
    const sections = navItems
      .map((item) => document.getElementById(item.id))
      .filter((element): element is HTMLElement => element !== null);

    if (sections.length === 0) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) {
          setActiveSection(visible.target.id);
        }
      },
      { rootMargin: '-20% 0px -60% 0px', threshold: [0, 0.25, 0.5] },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [navItems]);

  return (
    <div className="mx-auto flex min-h-screen max-w-7xl gap-4 p-4 sm:gap-5 sm:p-5 lg:gap-6 lg:p-6">
      <aside className="glass-sidebar sticky top-5 hidden h-[calc(100vh-2.5rem)] w-64 shrink-0 lg:flex">
        <div className="mb-6 px-2 pt-1">
          <p className="text-base font-semibold tracking-tight" style={{ color: 'var(--text-primary)' }}>
            Bootcamp
          </p>
          <p className="mt-0.5 text-xs" style={{ color: 'var(--text-tertiary)' }}>
            Management
          </p>
        </div>

        <nav className="flex flex-1 flex-col gap-1 px-1">
          {navItems.map((item) => (
            <a key={item.id} href={`#${item.id}`} className={navItemClass(activeSection === item.id)}>
              <NavIcon id={item.id} />
              {item.label}
            </a>
          ))}
        </nav>

        <div className="mt-auto space-y-3 border-t pt-4" style={{ borderColor: 'var(--divider)' }}>
          <div className="px-2">
            <p className="truncate text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
              {user.full_name}
            </p>
            <p className="truncate text-xs" style={{ color: 'var(--text-tertiary)' }}>
              {user.email}
            </p>
            <span className={`${roleBadgeClass} mt-2`}>{user.role}</span>
          </div>
          <button type="button" onClick={onLogout} className={`${buttonGhostClass} w-full justify-start px-2`}>
            Sign out
          </button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col gap-4 sm:gap-5">
        <header className="glass-topbar">
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium capitalize lg:hidden" style={{ color: 'var(--text-primary)' }}>
              {user.role} · {user.full_name}
            </p>
            <p className="hidden text-sm lg:block" style={{ color: 'var(--text-secondary)' }}>
              Welcome back, {user.full_name.split(' ')[0]}
            </p>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <ThemeToggle />
            <button type="button" onClick={onLogout} className={`${buttonGhostClass} lg:hidden`}>
              Sign out
            </button>
          </div>
        </header>

        <nav className="glass-panel flex gap-1 overflow-x-auto p-1.5 lg:hidden">
          {navItems.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={`${navItemClass(activeSection === item.id)} shrink-0 whitespace-nowrap px-3 py-2 text-xs`}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <main className="pb-8">{children}</main>
      </div>
    </div>
  );
}
