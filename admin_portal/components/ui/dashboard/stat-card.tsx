interface StatCardProps {
  label: string;
  value: string | number;
  caption?: string;
}

export function StatCard({ label, value, caption }: StatCardProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
      <p className="text-xs font-light text-white/50">{label}</p>
      <p className="mt-2 text-3xl font-light text-white">{value}</p>
      {caption && (
        <p className="mt-1 text-xs font-light text-white/40">{caption}</p>
      )}
    </div>
  );
}
