import Link from "next/link";
import type { Crumb } from "@/lib/breadcrumbs";

export function Breadcrumbs({
  items,
  label,
}: {
  items: Crumb[];
  label: string;
}) {
  return (
    <nav
      aria-label={label}
      className="flex flex-wrap items-center gap-2 pt-2 text-xs text-zinc-500"
    >
      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <span key={`${item.href}-${item.name}`} className="flex items-center gap-2">
            {isLast ? (
              <span aria-current="page" className="text-zinc-300">
                {item.name}
              </span>
            ) : (
              <>
                <Link
                  href={item.href}
                  className="transition-colors hover:text-white"
                >
                  {item.name}
                </Link>
                <span aria-hidden="true">/</span>
              </>
            )}
          </span>
        );
      })}
    </nav>
  );
}
