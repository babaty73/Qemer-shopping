import { Link } from "react-router-dom";
import { Compass } from "lucide-react";
import { buttonVariants } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="container flex min-h-[70vh] flex-col items-center justify-center text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-light text-primary">
        <Compass className="h-7 w-7" aria-hidden />
      </div>
      <p className="price-tag mt-5 text-sm font-semibold uppercase tracking-[0.2em] text-primary">404</p>
      <h1 className="mt-3 text-3xl font-medium text-neutral-900 sm:text-4xl">This page wandered off.</h1>
      <p className="mt-3 max-w-sm text-base text-neutral-500">
        The page you're looking for doesn't exist, or may have moved.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link to="/" className={buttonVariants({ size: "lg" })}>
          Back to Home
        </Link>
        <Link to="/shop" className={buttonVariants({ variant: "outline", size: "lg" })}>
          Browse Shop
        </Link>
      </div>
    </div>
  );
}
