import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Pencil, Plus, Star, Trash2 } from "lucide-react";
import { deleteProduct, getProducts, toggleFeatured, toggleStock } from "@/services/products";
import { useToast } from "@/context/ToastContext";
import { Modal } from "@/components/ui/Modal";
import { TableRowSkeleton } from "@/components/ui/Skeleton";
import { Badge } from "@/components/ui/Badge";
import { buttonVariants } from "@/components/ui/Button";
import { cn, formatPrice } from "@/lib/utils";
import type { Product } from "@/types";

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const { showToast } = useToast();

  async function load() {
    setLoading(true);
    try {
      const res = await getProducts({ limit: 48, sort: "newest" });
      setProducts(res.products);
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Failed to load products", "error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleToggleFeatured(product: Product) {
    try {
      const updated = await toggleFeatured(product._id);
      setProducts((prev) => prev.map((p) => (p._id === updated._id ? updated : p)));
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Failed to update product", "error");
    }
  }

  async function handleToggleStock(product: Product) {
    try {
      const updated = await toggleStock(product._id);
      setProducts((prev) => prev.map((p) => (p._id === updated._id ? updated : p)));
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Failed to update product", "error");
    }
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    try {
      await deleteProduct(deleteTarget._id);
      setProducts((prev) => prev.filter((p) => p._id !== deleteTarget._id));
      showToast("Product deleted");
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Failed to delete product", "error");
    } finally {
      setDeleteTarget(null);
    }
  }

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-medium text-neutral-900">Products</h1>
          <p className="mt-1 text-sm text-neutral-500">{products.length} total</p>
        </div>
        <Link to="/admin/products/new" className={buttonVariants()}>
          <Plus className="h-4 w-4" aria-hidden /> Add Product
        </Link>
      </div>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-border bg-surface shadow-soft">
        {loading ? (
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border text-xs uppercase tracking-wide text-neutral-400">
              <tr>
                <th className="px-5 py-3 font-medium">Product</th>
                <th className="px-5 py-3 font-medium">Category</th>
                <th className="px-5 py-3 font-medium">Price</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 5 }).map((_, i) => (
                <TableRowSkeleton key={i} columns={5} />
              ))}
            </tbody>
          </table>
        ) : products.length === 0 ? (
          <div className="p-10 text-center text-sm text-neutral-400">
            No products yet — add your first one.
          </div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border text-xs uppercase tracking-wide text-neutral-400">
              <tr>
                <th className="px-5 py-3 font-medium">Product</th>
                <th className="px-5 py-3 font-medium">Category</th>
                <th className="px-5 py-3 font-medium">Price</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id} className="border-b border-border last:border-0">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={product.images[0]}
                        alt=""
                        className="h-10 w-10 shrink-0 rounded-lg border border-border object-cover"
                      />
                      <span className="font-medium text-neutral-900">{product.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-neutral-500">{product.category}</td>
                  <td className="price-tag px-5 py-3 text-neutral-900">{formatPrice(product.price)}</td>
                  <td className="px-5 py-3">
                    <div className="flex flex-wrap gap-1.5">
                      {product.featured && <Badge variant="featured">Featured</Badge>}
                      {!product.inStock && <Badge variant="outOfStock">Out of Stock</Badge>}
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        type="button"
                        onClick={() => handleToggleFeatured(product)}
                        aria-pressed={product.featured}
                        title="Toggle featured"
                        className={cn(
                          "flex h-8 w-8 items-center justify-center rounded-full hover:bg-neutral-100",
                          product.featured ? "text-accent" : "text-neutral-300"
                        )}
                      >
                        <Star
                          className="h-4 w-4"
                          aria-hidden
                          fill={product.featured ? "currentColor" : "none"}
                        />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleToggleStock(product)}
                        title="Toggle stock status"
                        className="rounded-full px-2 py-1 text-xs font-medium text-neutral-500 hover:bg-neutral-100"
                      >
                        {product.inStock ? "In Stock" : "Out"}
                      </button>
                      <Link
                        to={`/admin/products/${product.slug}/edit`}
                        aria-label="Edit product"
                        className="flex h-8 w-8 items-center justify-center rounded-full text-neutral-500 hover:bg-neutral-100"
                      >
                        <Pencil className="h-4 w-4" aria-hidden />
                      </Link>
                      <button
                        type="button"
                        onClick={() => setDeleteTarget(product)}
                        aria-label="Delete product"
                        className="flex h-8 w-8 items-center justify-center rounded-full text-neutral-500 transition-colors hover:bg-error/10 hover:text-error"
                      >
                        <Trash2 className="h-4 w-4" aria-hidden />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Modal open={deleteTarget !== null} onClose={() => setDeleteTarget(null)} title="Delete product?">
        <p className="text-sm text-neutral-500">
          This permanently removes "{deleteTarget?.name}" from the catalog. This can't be undone.
        </p>
        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={() => setDeleteTarget(null)}
            className={cn(buttonVariants({ variant: "outline" }), "flex-1")}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={confirmDelete}
            className={cn(buttonVariants({ variant: "danger" }), "flex-1")}
          >
            Delete
          </button>
        </div>
      </Modal>
    </div>
  );
}
