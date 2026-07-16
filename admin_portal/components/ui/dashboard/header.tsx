import type React from "react";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  rightSlot?: React.ReactNode;
}

export function PageHeader({ title, subtitle, rightSlot }: PageHeaderProps) {
  return (
    <div className="mb-8 flex items-start justify-between gap-4">
      <div>
        <h1 className="text-xl font-light text-white">{title}</h1>
        {subtitle && (
          <p className="mt-1 text-sm font-light text-white/50">{subtitle}</p>
        )}
      </div>
      {rightSlot}
    </div>
  );
}
