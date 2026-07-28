import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { NAV_LINKS, SITE_NAME } from "@/lib/constants";

/**
 * Sticky, scroll-aware navbar: transparent over the hero, solid once the
 * page scrolls past it. Mobile menu is a full-height slide-in panel.
 */
export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-colors duration-300",
        scrolled
          ? "bg-white/90 shadow-soft backdrop-blur-md"
          : "bg-transparent"
      )}
    >
      <div className="container flex h-16 items-center justify-between sm:h-20">
        <NavLink to="/" className="font-display text-xl font-semibold text-neutral-900">
          {SITE_NAME}
        </NavLink>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.href}
              to={link.href}
              className={({ isActive }) =>
                cn(
                  "text-sm font-medium text-neutral-600 transition-colors hover:text-emerald-600",
                  isActive && "text-emerald-600"
                )
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Search products"
            className="hidden h-10 w-10 items-center justify-center rounded-full text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-emerald-600 sm:flex"
          >
            <Search className="h-5 w-5" aria-hidden />
          </button>

          <button
            type="button"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((v) => !v)}
            className="flex h-10 w-10 items-center justify-center rounded-full text-neutral-700 hover:bg-neutral-100 md:hidden"
          >
            {mobileOpen ? <X className="h-5 w-5" aria-hidden /> : <Menu className="h-5 w-5" aria-hidden />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.nav
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="overflow-hidden border-t border-neutral-100 bg-white md:hidden"
          >
            <div className="container flex flex-col gap-1 py-4">
              {NAV_LINKS.map((link) => (
                <NavLink
                  key={link.href}
                  to={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      "rounded-lg px-3 py-3 text-base font-medium text-neutral-700 hover:bg-neutral-50",
                      isActive && "text-emerald-600"
                    )
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
