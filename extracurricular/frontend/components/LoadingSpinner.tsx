import { loadingClass, spinnerClass } from '../lib/ui';

export default function LoadingSpinner({ label = 'Loading' }: { label?: string }) {
  return (
    <div className={loadingClass} style={{ color: 'var(--text-secondary)' }}>
      <span className={spinnerClass} />
      {label}
    </div>
  );
}
