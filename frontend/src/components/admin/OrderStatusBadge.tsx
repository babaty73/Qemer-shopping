import { cn } from "@/lib/utils";
import type { OrderStatus } from "@/types";

const STATUS_STYLES: Record<OrderStatus, string> = {
  "Pending Verification": "border-warning/30 bg-warning-light text-warning",
  Accepted: "border-primary/20 bg-primary-light text-primary",
  Preparing: "border-accent/25 bg-accent-light text-accent",
  Delivered: "border-success/25 bg-success-light text-success",
  "Payment Rejected": "border-error/25 bg-error-light text-error",
  Cancelled: "border-border bg-neutral-100 text-neutral-500",
};

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
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
