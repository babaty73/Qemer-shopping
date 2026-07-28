import { SectionTitle } from "@/components/ui/SectionTitle";
import { CategoryCard } from "@/components/category/CategoryCard";
import { CATEGORIES } from "@/lib/mockData";

export function FeaturedCategories() {
  return (
    <section className="py-20 sm:py-24">
      <div className="container">
        <SectionTitle eyebrow="Browse" title="Shop by category" />
        <div className="mt-10 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
          {CATEGORIES.map((category, index) => (
            <CategoryCard key={category.slug} index={index} {...category} />
          ))}
        </div>
      </div>
    </section>
  );
}
