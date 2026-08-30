import Image from "next/image";
import Link from "next/link";
import { brand } from "@/lib/design-system";
import { cn } from "@/lib/utils";

export function LogoLockup({ className, priority = false }: { className?: string; priority?: boolean }) {
  return (
    <Link href="/" className={cn("flex min-w-0 items-center gap-2.5 sm:gap-3", className)} aria-label="ICONIC Filtration home">
      <Image
        src={brand.logoPath}
        alt="ICONIC Filtration and Engineers LLP logo"
        width={62}
        height={62}
        priority={priority}
        className="h-11 w-11 shrink-0 object-contain sm:h-14 sm:w-14"
      />
      <span className="block min-w-0 leading-tight">
        <span className="block font-heading text-base font-semibold text-iconic-blue sm:text-lg">ICONIC</span>
        <span className="block text-[10.5px] font-medium leading-[1.15] text-muted-foreground sm:hidden">
          Filtration and
          <br />
          Engineers LLP
        </span>
        <span className="hidden text-xs font-medium text-muted-foreground sm:block">
          Filtration and Engineers LLP
        </span>
      </span>
    </Link>
  );
}
