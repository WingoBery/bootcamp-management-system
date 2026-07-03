interface StatCardProps {
  label: string;
  value: string | number;
}

export default function StatCard({ label, value }: StatCardProps) {
  return (
    <div className="glass-stat">
      <p className="stat-label">{label}</p>
      <p className="stat-value">{value}</p>
    </div>
  );
}
