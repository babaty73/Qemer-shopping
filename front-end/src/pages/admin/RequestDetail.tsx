import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Archive, ArchiveRestore, ArrowLeft, CheckCircle2, ImageOff, XCircle } from "lucide-react";
import { getProductRequestById, setProductRequestArchived, updateProductRequestStatus } from "@/services/productRequests";
import { RequestStatusBadge } from "@/components/admin/RequestStatusBadge";
import { Skeleton } from "@/components/ui/Skeleton";
import { buttonVariants } from "@/components/ui/Button";
import { useToast } from "@/context/ToastContext";
import { cn } from "@/lib/utils";
import type { ProductRequest, RequestStatus } from "@/types";

const ARCHIVABLE_STATUSES: RequestStatus[] = ["Approved", "Declined"];

export default function RequestDetail() {
  const { id } = useParams<{ id: string }>();
  const { showToast } = useToast();

  const [request, setRequest] = useState<ProductRequest | null | undefined>(undefined);
  const [updating, setUpdating] = useState<RequestStatus | null>(null);
  const [archiving, setArchiving] = useState(false);

  useEffect(() => {
    if (!id) return;
    let active = true;
    getProductRequestById(id)
      .then((fetched) => {
        if (active) setRequest(fetched);
      })
      .catch(() => {
        if (active) setRequest(null);
      });
    return () => {
      active = false;
    };
  }, [id]);

  async function handleStatusChange(status: RequestStatus) {
    if (!request) return;
    setUpdating(status);
    try {
      const updated = await updateProductRequestStatus(request._id, status);
      setRequest(updated);
      showToast(`Request marked "${status}" — customer notified by email`);
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Failed to update request", "error");
    } finally {
      setUpdating(null);
    }
  }

  async function handleArchiveChange(archived: boolean) {
    if (!request) return;
    setArchiving(true);
    try {
      const updated = await setProductRequestArchived(request._id, archived);
      setRequest(updated);
      showToast(archived ? "Request archived" : "Request restored to active list");
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Failed to update request", "error");
    } finally {
      setArchiving(false);
    }
  }

  if (request === undefined) {
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

  if (request === null) {
    return (
      <div className="flex flex-col items-center py-24 text-center">
        <p className="text-lg font-medium text-neutral-900">Request not found</p>
        <Link to="/admin/requests" className={cn(buttonVariants(), "mt-6")}>
          Back to Requests
        </Link>
      </div>
    );
  }

  const isTerminal = ARCHIVABLE_STATUSES.includes(request.status);

  return (
    <div className="max-w-5xl">
      <Link
        to="/admin/requests"
        className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-neutral-500 transition-colors hover:text-primary"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden /> Back to Requests
      </Link>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-medium text-neutral-900">{request.productName}</h1>
          <p className="mt-1 text-sm text-neutral-500">
            Requested {new Date(request.createdAt).toLocaleString()}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {request.archived && (
            <span className="rounded-full border border-border bg-neutral-100 px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-neutral-500">
              Archived
            </span>
          )}
          <RequestStatusBadge status={request.status} />
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="surface-card p-6">
            <p className="text-base font-medium text-neutral-900">Request Details</p>
            <dl className="mt-4 grid grid-cols-2 gap-4 text-sm sm:grid-cols-3">
              <Detail label="Preferred Color" value={request.color} />
              <Detail label="Preferred Size" value={request.size} />
              <Detail label="Quantity" value={String(request.quantity)} />
            </dl>
          </div>

          {request.notes && (
            <div className="surface-card p-6">
              <p className="text-base font-medium text-neutral-900">Customer Notes</p>
              <p className="mt-2 text-sm leading-relaxed text-neutral-600">{request.notes}</p>
            </div>
          )}

          <div className="surface-card p-6">
            <p className="text-base font-medium text-neutral-900">Reference Image</p>
            {request.image ? (
              <a href={request.image.url} target="_blank" rel="noreferrer" className="mt-4 block">
                <img
                  src={request.image.url}
                  alt="Requested product reference"
                  className="max-h-96 w-full rounded-xl border border-border object-contain transition-opacity hover:opacity-90"
                />
              </a>
            ) : (
              <div className="mt-4 flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border-strong bg-surface-muted py-10 text-neutral-400">
                <ImageOff className="h-6 w-6" aria-hidden />
                <p className="text-sm">No image was attached to this request.</p>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="surface-card p-6">
            <p className="text-base font-medium text-neutral-900">Requester</p>
            <dl className="mt-4 space-y-3 text-sm">
              <Detail label="Email" value={request.email} />
              <Detail label="Delivery Address" value={request.deliveryAddress} />
            </dl>
          </div>

          <div className="surface-card p-6">
            <p className="text-base font-medium text-neutral-900">Actions</p>
            <div className="mt-4 flex flex-col gap-2">
              {request.status === "Pending Review" && (
                <>
                  <button
                    type="button"
                    onClick={() => handleStatusChange("Approved")}
                    disabled={updating !== null}
                    className={buttonVariants()}
                  >
                    <CheckCircle2 className="h-4 w-4" aria-hidden />
                    {updating === "Approved" ? "Approving…" : "Approve"}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleStatusChange("Declined")}
                    disabled={updating !== null}
                    className={buttonVariants({ variant: "danger" })}
                  >
                    <XCircle className="h-4 w-4" aria-hidden />
                    {updating === "Declined" ? "Declining…" : "Decline"}
                  </button>
                </>
              )}

              {isTerminal && !request.archived && (
                <button
                  type="button"
                  onClick={() => handleArchiveChange(true)}
                  disabled={archiving}
                  className={buttonVariants({ variant: "outline" })}
                >
                  <Archive className="h-4 w-4" aria-hidden />
                  {archiving ? "Archiving…" : "Archive Request"}
                </button>
              )}

              {request.archived && (
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
