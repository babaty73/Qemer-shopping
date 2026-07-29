import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { SearchBar } from "@/components/ui/SearchBar";
import { CategoryFilter } from "@/components/shop/CategoryFilter";
import { SortSelect } from "@/components/shop/SortSelect";
import { ProductGrid } from "@/components/product/ProductGrid";
import { Pagination } from "@/components/ui/Pagination";
import { ALL_PRODUCTS } from "@/lib/mockData";
import { slugifyToken } from "@/lib/utils";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import type { ProductFilters } from "@/types";

const PAGE_SIZE = 8;
type SortValue = NonNullable<ProductFilters["sort"]>;

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();

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

  const filtered = useMemo(() => {
    let result = ALL_PRODUCTS;

    if (debouncedSearch) {
      const q = debouncedSearch.toLowerCase();
      result = result.filter(
        (p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
      );
    }

    if (category) {
      result = result.filter((p) => slugifyToken(p.category) === category);
    }

    return [...result].sort((a, b) => {
      if (sort === "price_asc") return a.price - b.price;
      if (sort === "price_desc") return b.price - a.price;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [debouncedSearch, category, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(Math.max(page, 1), totalPages);
  const paged = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  // Brief simulated loading state whenever the visible result set changes —
  // stands in for the network round trip once this reads from the real API.
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(timer);
  }, [debouncedSearch, category, sort, safePage]);

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
        description={`${filtered.length} item${filtered.length === 1 ? "" : "s"}`}
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
          products={paged}
          loading={loading}
          emptyMessage="Try a different search term or category."
        />
      </div>

      {!loading && (
        <div className="mt-12">
          <Pagination
            page={safePage}
            totalPages={totalPages}
            onChange={(p) => updateParam("page", String(p))}
          />
        </div>
      )}
    </div>
  );
}
