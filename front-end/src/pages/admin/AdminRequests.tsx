import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ImageOff } from "lucide-react";
import { getProductRequests } from "@/services/productRequests";
import { RequestStatusBadge } from "@/components/admin/RequestStatusBadge";
import { SearchBar } from "@/components/ui/SearchBar";
import { TableRowSkeleton } from "@/components/ui/Skeleton";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { useToast } from "@/context/ToastContext";
import { REQUEST_STATUSES } from "@/types";
import type { ProductRequest, RequestStatus } from "@/types";

const TABLE_HEADERS = ["Product", "Requested By", "Variant", "Qty", "Status", "Date"];

export default function AdminRequests() {
  const [requests, setRequests] = useState<ProductRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<RequestStatus | "">("");
  const [searchInput, setSearchInput] = useState("");
  const debouncedSearch = useDebouncedValue(searchInput, 300);
  const { showToast } = useToast();

  useEffect(() => {
    let active = true;
    setLoading(true);
    getProductRequests({ status: statusFilter || undefined, search: debouncedSearch || undefined, limit: 48 })
      .then((res) => {
        if (active) setRequests(res.requests);
      })
      .catch((err) => {
        if (!active) return;
        showToast(err instanceof Error ? err.message : "Failed to load requests", "error");
        setRequests([]);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter, debouncedSearch]);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-medium text-neutral-900">Custom Requests</h1>
          <p className="mt-1 text-sm text-neutral-500">{requests.length} total</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <SearchBar
            value={searchInput}
            onChange={setSearchInput}
            placeholder="Search product or email…"
            className="w-64"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as RequestStatus | "")}
            className="field-input w-auto"
          >
            <option value="">All Statuses</option>
            {REQUEST_STATUSES.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-border bg-surface shadow-soft">
        {loading ? (
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border text-xs uppercase tracking-wide text-neutral-400">
              <tr>
                {TABLE_HEADERS.map((header) => (
                  <th key={header} className="px-5 py-3 font-medium">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 6 }).map((_, i) => (
                <TableRowSkeleton key={i} columns={6} />
              ))}
            </tbody>
          </table>
        ) : requests.length === 0 ? (
          <div className="p-10 text-center text-sm text-neutral-400">
            No requests{statusFilter ? ` with status "${statusFilter}"` : ""}
            {debouncedSearch ? ` matching "${debouncedSearch}"` : ""}.
          </div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border text-xs uppercase tracking-wide text-neutral-400">
              <tr>
                {TABLE_HEADERS.map((header) => (
                  <th key={header} className="px-5 py-3 font-medium">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {requests.map((request) => (
                <tr key={request._id} className="border-b border-border last:border-0 hover:bg-neutral-50">
                  <td className="px-5 py-3">
                    <Link
                      to={`/admin/requests/${request._id}`}
                      className="flex items-center gap-3 font-medium text-neutral-900 hover:text-primary"
                    >
                      {request.image ? (
                        <img
                          src={request.image.url}
                          alt=""
                          className="h-10 w-10 shrink-0 rounded-lg border border-border object-cover"
                        />
                      ) : (
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-dashed border-border-strong text-neutral-300">
                          <ImageOff className="h-4 w-4" aria-hidden />
                        </span>
                      )}
                      {request.productName}
                    </Link>
                  </td>
                  <td className="px-5 py-3 text-neutral-500">{request.email}</td>
                  <td className="px-5 py-3 text-neutral-500">
                    {[request.color, request.size].filter(Boolean).join(" · ") || "—"}
                  </td>
                  <td className="px-5 py-3 text-neutral-500">{request.quantity}</td>
                  <td className="px-5 py-3">
                    <RequestStatusBadge status={request.status} />
                  </td>
                  <td className="px-5 py-3 text-neutral-500">
                    {new Date(request.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
