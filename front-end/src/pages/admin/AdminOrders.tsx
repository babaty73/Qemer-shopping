import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getOrders } from "@/services/orders";
import { OrderStatusBadge } from "@/components/admin/OrderStatusBadge";
import { TableRowSkeleton } from "@/components/ui/Skeleton";
import { useToast } from "@/context/ToastContext";
import { formatPrice } from "@/lib/utils";
import { ORDER_STATUSES } from "@/types";
import type { Order, OrderStatus } from "@/types";

const TABLE_HEADERS = ["Order", "Customer", "Items", "Total", "Status", "Date"];

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "">("");
  const { showToast } = useToast();

  useEffect(() => {
    let active = true;
    setLoading(true);
    getOrders({ status: statusFilter || undefined, limit: 48 })
      .then((res) => {
        if (active) setOrders(res.orders);
      })
      .catch((err) => {
        if (!active) return;
        showToast(err instanceof Error ? err.message : "Failed to load orders", "error");
        setOrders([]);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-medium text-neutral-900">Orders</h1>
          <p className="mt-1 text-sm text-neutral-500">{orders.length} total</p>
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as OrderStatus | "")}
          className="field-input w-auto"
        >
          <option value="">All Statuses</option>
          {ORDER_STATUSES.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
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
        ) : orders.length === 0 ? (
          <div className="p-10 text-center text-sm text-neutral-400">
            No orders {statusFilter ? `with status "${statusFilter}"` : "yet"}.
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
              {orders.map((order) => (
                <tr key={order._id} className="border-b border-border last:border-0 hover:bg-neutral-50">
                  <td className="px-5 py-3">
                    <Link
                      to={`/admin/orders/${order._id}`}
                      className="price-tag font-medium text-primary hover:text-primary-hover"
                    >
                      #{order._id.slice(-8).toUpperCase()}
                    </Link>
                  </td>
                  <td className="px-5 py-3 text-neutral-700">{order.customer.fullName}</td>
                  <td className="px-5 py-3 text-neutral-500">
                    {order.items.reduce((sum, item) => sum + item.quantity, 0)}
                  </td>
                  <td className="price-tag px-5 py-3 text-neutral-900">{formatPrice(order.totalPrice)}</td>
                  <td className="px-5 py-3">
                    <OrderStatusBadge status={order.status} />
                  </td>
                  <td className="px-5 py-3 text-neutral-500">
                    {new Date(order.createdAt).toLocaleDateString()}
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
