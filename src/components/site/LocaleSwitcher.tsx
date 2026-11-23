import Link from "next/link";
import {
  LOCALE_CONFIG,
  LOCALE_LABEL,
  LOCALES,
  localePath,
  type Locale,
} from "@/i18n/locales";
import { cn } from "@/lib/utils";

export function LocaleSwitcher({
  locale,
  label,
  variant = "compact",
}: {
  locale: Locale;
  label: string;
  variant?: "compact" | "full";
}) {
  const compact = variant === "compact";

  return (
    <span
      aria-label={label}
      className={cn("flex items-center", compact ? "gap-0.5" : "gap-3 text-xs")}
    >
      {LOCALES.map((item) => (
        <Link
          key={item}
          href={localePath(item)}
          hrefLang={LOCALE_CONFIG[item].hreflang}
          aria-current={item === locale ? "page" : undefined}
          title={LOCALE_LABEL[item]}
          className={cn(
            compact
              ? "rounded-lg px-1.5 py-1 text-xs font-bold uppercase tracking-wide transition-colors"
              : "transition-colors",
            item === locale
              ? compact
                ? "text-cyan-300"
                : "font-bold text-cyan-300"
              : compact
                ? "text-zinc-500 hover:text-white"
                : "hover:text-white",
          )}
        >
          {compact ? item : LOCALE_LABEL[item]}
        </Link>
      ))}
    </span>
  );
}
