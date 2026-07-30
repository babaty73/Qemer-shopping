import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { SearchBar } from "@/components/ui/SearchBar";
import { CategoryFilter } from "@/components/shop/CategoryFilter";
import { SortSelect } from "@/components/shop/SortSelect";
import { ProductGrid } from "@/components/product/ProductGrid";
import { Pagination } from "@/components/ui/Pagination";
import { getProducts } from "@/services/products";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { useToast } from "@/context/ToastContext";
import type { Product, ProductFilters } from "@/types";

const PAGE_SIZE = 8;
type SortValue = NonNullable<ProductFilters["sort"]>;

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { showToast } = useToast();

  const category = searchParams.get("category");
  const sort = (searchParams.get("sort") as SortValue | null) ?? "newest";
  const page = Number(searchParams.get("page") ?? "1");

  const [searchInput, setSearchInput] = useState(searchParams.get("q") ?? "");
  const debouncedSearch = useDebouncedValue(searchInput, 300);

  // Push the debounced search term into the URL (shareable/bookmarkable),
  // resetting back to page 1 whenever the term changes.
  useEffect(() => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (debouncedSearch) next.set("q", debouncedSearch);
        else next.delete("q");
        next.delete("page");
        return next;
      },
      { replace: true }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  const [products, setProducts] = useState<Product[]>([]);
  const [totalResults, setTotalResults] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);

    getProducts({
      search: debouncedSearch || undefined,
      category: category ?? undefined,
      sort,
      page,
      limit: PAGE_SIZE,
    })
      .then((res) => {
        if (!active) return;
        setProducts(res.products);
        setTotalResults(res.totalResults);
        setTotalPages(res.totalPages);
      })
      .catch((err) => {
        if (!active) return;
        showToast(err instanceof Error ? err.message : "Failed to load products", "error");
        setProducts([]);
        setTotalResults(0);
        setTotalPages(1);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch, category, sort, page]);

  function updateParam(key: "category" | "sort" | "page", value: string | null) {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (value) next.set(key, value);
      else next.delete(key);
      if (key !== "page") next.delete("page");
      return next;
    });
  }

  return (
    <div className="container py-16">
      <SectionTitle
        eyebrow="Shop"
        title="All products"
        description={`${totalResults} item${totalResults === 1 ? "" : "s"}`}
      />

      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <SearchBar value={searchInput} onChange={setSearchInput} className="sm:max-w-xs sm:flex-1" />
        <SortSelect value={sort} onChange={(value) => updateParam("sort", value)} />
      </div>

      <div className="mt-4">
        <CategoryFilter value={category} onChange={(slug) => updateParam("category", slug)} />
      </div>

      <div className="mt-10">
        <ProductGrid
          products={products}
          loading={loading}
          emptyMessage="Try a different search term or category."
        />
      </div>

      {!loading && (
        <div className="mt-12">
          <Pagination page={page} totalPages={totalPages} onChange={(p) => updateParam("page", String(p))} />
        </div>
      )}
    </div>
  );
}
