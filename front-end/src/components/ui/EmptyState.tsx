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
    <div className="surface-card flex flex-col items-center justify-center px-6 py-20 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary-light text-primary">
        <PackageSearch className="h-6 w-6" aria-hidden />
      </div>
      <p className="mt-5 text-base font-medium text-neutral-900">{title}</p>
      {description && <p className="mt-1.5 max-w-sm text-sm text-neutral-500">{description}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
