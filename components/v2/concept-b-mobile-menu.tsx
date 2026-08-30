"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

type MobileMenuLink = {
  label: string;
  href: string;
};

export function ConceptBMobileMenu({ links }: { links: MobileMenuLink[] }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <div className="b2-mobile-menu">
      <button type="button" className="b2-mobile-toggle" aria-expanded={open} aria-label="Toggle menu" onClick={() => setOpen((current) => !current)}>
        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>
      {open ? (
        <div className="b2-mobile-panel">
          {links.map((item) => (
            <Link key={item.href} href={item.href} onClick={() => setOpen(false)}>
              {item.label}
            </Link>
          ))}
          <Link href="/request-quote" onClick={() => setOpen(false)}>
            Get Quote
          </Link>
        </div>
      ) : null}
    </div>
  );
}
