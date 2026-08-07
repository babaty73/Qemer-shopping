import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Archive,
  ArchiveRestore,
  ArrowLeft,
  CheckCircle2,
  PackageCheck,
  PackagePlus,
  XCircle,
} from "lucide-react";
import { getOrderById, setOrderArchived, updateOrderStatus } from "@/services/orders";
import { OrderStatusBadge } from "@/components/admin/OrderStatusBadge";
import { Skeleton } from "@/components/ui/Skeleton";
import { buttonVariants } from "@/components/ui/Button";
import { useToast } from "@/context/ToastContext";
import { cn, formatPrice } from "@/lib/utils";
import type { Order, OrderStatus } from "@/types";

const ARCHIVABLE_STATUSES: OrderStatus[] = ["Delivered", "Payment Rejected", "Cancelled"];

export default function OrderDetail() {
  const { id } = useParams<{ id: string }>();
  const { showToast } = useToast();

  const [order, setOrder] = useState<Order | null | undefined>(undefined);
  const [updating, setUpdating] = useState<OrderStatus | null>(null);
  const [archiving, setArchiving] = useState(false);

  useEffect(() => {
    if (!id) return;
    let active = true;
    getOrderById(id)
      .then((fetched) => {
        if (active) setOrder(fetched);
      })
      .catch(() => {
        if (active) setOrder(null);
      });
    return () => {
      active = false;
    };
  }, [id]);

  async function handleStatusChange(status: OrderStatus) {
    if (!order) return;
    setUpdating(status);
    try {
      const updated = await updateOrderStatus(order._id, status);
      setOrder(updated);
      showToast(
        status === "Delivered" ? "Order marked delivered — stock updated" : `Order updated to "${status}"`
      );
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Failed to update order", "error");
    } finally {
      setUpdating(null);
    }
  }

  async function handleArchiveChange(archived: boolean) {
    if (!order) return;
    setArchiving(true);
    try {
      const updated = await setOrderArchived(order._id, archived);
      setOrder(updated);
      showToast(archived ? "Order archived" : "Order restored to active list");
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Failed to update order", "error");
    } finally {
      setArchiving(false);
    }
  }

  if (order === undefined) {
    return (
      <div className="max-w-3xl">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="mt-6 h-8 w-56" />
        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
          <Skeleton className="h-64 lg:col-span-2" />
          <Skeleton className="h-64" />
        </div>
      </div>
    );
  }

  if (order === null) {
    return (
      <div className="flex flex-col items-center py-24 text-center">
        <p className="text-lg font-medium text-neutral-900">Order not found</p>
        <Link to="/admin/orders" className={cn(buttonVariants(), "mt-6")}>
          Back to Orders
        </Link>
      </div>
    );
  }

  const isTerminal = ARCHIVABLE_STATUSES.includes(order.status);

  return (
    <div className="max-w-5xl">
      <Link
        to="/admin/orders"
        className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-neutral-500 transition-colors hover:text-primary"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden /> Back to Orders
      </Link>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="price-tag text-2xl font-medium text-neutral-900">
            Order #{order._id.slice(-8).toUpperCase()}
          </h1>
          <p className="mt-1 text-sm text-neutral-500">
            Placed {new Date(order.createdAt).toLocaleString()}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {order.archived && (
            <span className="rounded-full border border-border bg-neutral-100 px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-neutral-500">
              Archived
            </span>
          )}
          <OrderStatusBadge status={order.status} />
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="surface-card p-6">
            <p className="text-base font-medium text-neutral-900">Items</p>
            <div className="mt-4 divide-y divide-border">
              {order.items.map((item, i) => (
                <div key={i} className="flex items-center gap-4 py-4 first:pt-0 last:pb-0">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-16 w-16 shrink-0 rounded-xl border border-border object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-neutral-900">{item.name}</p>
                    <p className="mt-0.5 text-xs text-neutral-400">
                      {[item.color, item.size].filter(Boolean).join(" · ") || "—"} · Qty {item.quantity}
                    </p>
                  </div>
                  <p className="price-tag shrink-0 text-sm font-semibold text-neutral-900">
                    {formatPrice(item.price * item.quantity)}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
              <span className="text-sm font-medium text-neutral-900">Total</span>
              <span className="price-tag text-lg font-semibold text-primary">
                {formatPrice(order.totalPrice)}
              </span>
            </div>
          </div>

          {order.notes && (
            <div className="surface-card p-6">
              <p className="text-base font-medium text-neutral-900">Customer Notes</p>
              <p className="mt-2 text-sm leading-relaxed text-neutral-600">{order.notes}</p>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="surface-card p-6">
            <p className="text-base font-medium text-neutral-900">Customer</p>
            <dl className="mt-4 space-y-3 text-sm">
              <Detail label="Full Name" value={order.customer.fullName} />
              <Detail label="Phone" value={order.customer.phone} />
              <Detail label="Email" value={order.customer.email} />
              <Detail label="Delivery Address" value={order.customer.address} />
            </dl>
          </div>

          <div className="surface-card p-6">
            <p className="text-base font-medium text-neutral-900">Payment</p>
            <dl className="mt-4 space-y-3 text-sm">
              <Detail label="Method" value={order.paymentMethod} />
            </dl>
            <a href={order.paymentScreenshot.url} target="_blank" rel="noreferrer" className="mt-4 block">
              <img
                src={order.paymentScreenshot.url}
                alt="Payment screenshot"
                className="w-full rounded-xl border border-border object-cover transition-opacity hover:opacity-90"
              />
            </a>
            <p className="mt-2 text-xs text-neutral-400">Click the screenshot to view full size.</p>
          </div>

          <div className="surface-card p-6">
            <p className="text-base font-medium text-neutral-900">Actions</p>
            <div className="mt-4 flex flex-col gap-2">
              {order.status === "Pending Verification" && (
                <>
                  <ActionButton
                    icon={CheckCircle2}
                    label="Approve Payment"
                    onClick={() => handleStatusChange("Accepted")}
                    loading={updating === "Accepted"}
                    disabled={updating !== null}
                  />
                  <button
                    type="button"
                    onClick={() => handleStatusChange("Payment Rejected")}
                    disabled={updating !== null}
                    className={buttonVariants({ variant: "danger" })}
                  >
                    <XCircle className="h-4 w-4" aria-hidden />
                    {updating === "Payment Rejected" ? "Rejecting…" : "Reject Payment"}
                  </button>
                </>
              )}

              {order.status === "Accepted" && (
                <ActionButton
                  icon={PackagePlus}
                  label="Mark as Preparing"
                  onClick={() => handleStatusChange("Preparing")}
                  loading={updating === "Preparing"}
                  disabled={updating !== null}
                />
              )}

              {order.status === "Preparing" && (
                <ActionButton
                  icon={PackageCheck}
                  label="Mark as Delivered"
                  onClick={() => handleStatusChange("Delivered")}
                  loading={updating === "Delivered"}
                  disabled={updating !== null}
                />
              )}

              {isTerminal && !order.archived && (
                <button
                  type="button"
                  onClick={() => handleArchiveChange(true)}
                  disabled={archiving}
                  className={buttonVariants({ variant: "outline" })}
                >
                  <Archive className="h-4 w-4" aria-hidden />
                  {archiving ? "Archiving…" : "Archive Order"}
                </button>
              )}

              {order.archived && (
                <button
                  type="button"
                  onClick={() => handleArchiveChange(false)}
                  disabled={archiving}
                  className={buttonVariants({ variant: "outline" })}
                >
                  <ArchiveRestore className="h-4 w-4" aria-hidden />
                  {archiving ? "Restoring…" : "Restore from Archive"}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-wide text-neutral-400">{label}</dt>
      <dd className="mt-0.5 text-neutral-800">{value}</dd>
    </div>
  );
}

function ActionButton({
  icon: Icon,
  label,
  onClick,
  loading,
  disabled,
}: {
  icon: typeof CheckCircle2;
  label: string;
  onClick: () => void;
  loading: boolean;
  disabled?: boolean;
}) {
  return (
    <button type="button" onClick={onClick} disabled={disabled ?? loading} className={buttonVariants()}>
      <Icon className="h-4 w-4" aria-hidden />
      {loading ? "Updating…" : label}
    </button>
  );
}
