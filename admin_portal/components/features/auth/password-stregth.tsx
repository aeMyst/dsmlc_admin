"use client";

interface PasswordStrengthProps {
  value: string;
}

const LABELS = ["Too short", "Weak", "Fair", "Good", "Strong"];
const COLORS = ["#3a3a3a", "#d43a13", "#ff8a5c", "#5b8dee", "#22c55e"];

function scorePassword(value: string): number {
  if (value.length < 8) return 0;
  let score = 1;
  if (/[a-z]/.test(value) && /[A-Z]/.test(value)) score += 1;
  if (/\d/.test(value)) score += 1;
  if (/[^A-Za-z0-9]/.test(value)) score += 1;
  return Math.min(score, 4);
}

export function PasswordStrength({ value }: PasswordStrengthProps) {
  if (!value) return null;

  const score = scorePassword(value);
  const color = COLORS[score];

  return (
    <div className="mt-2">
      <div className="flex gap-1.5" aria-hidden="true">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-1 flex-1 rounded-full transition-colors duration-300"
            style={{ backgroundColor: i < score ? color : "#1e1e1e" }}
          />
        ))}
      </div>
      <p className="mt-1.5 text-xs font-light" style={{ color }}>
        {LABELS[score]}
      </p>
    </div>
  );
}
