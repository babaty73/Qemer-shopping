import { cn } from "@/lib/utils";
import type { RequestStatus } from "@/types";

const STATUS_STYLES: Record<RequestStatus, string> = {
  "Pending Review": "border-warning/30 bg-warning-light text-warning",
  Approved: "border-success/25 bg-success-light text-success",
  Declined: "border-error/25 bg-error-light text-error",
};

export function RequestStatusBadge({ status }: { status: RequestStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center whitespace-nowrap rounded-full border px-2.5 py-1 text-xs font-semibold",
        STATUS_STYLES[status]
      )}
    >
      {status}
    </span>
  );
}
