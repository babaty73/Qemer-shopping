import type { ReactNode } from "react";
import { PackageSearch } from "lucide-react";

interface EmptyStateProps {
  title: string;
  description?: string;
  action?: ReactNode;
}

/** Shown wherever a list can legitimately be empty (search, filtered shop grid, dashboard). */
export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-neutral-200 px-6 py-20 text-center">
      <PackageSearch className="h-10 w-10 text-neutral-300" aria-hidden />
      <p className="mt-4 text-base font-medium text-neutral-900">{title}</p>
      {description && <p className="mt-1 max-w-sm text-sm text-neutral-500">{description}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
