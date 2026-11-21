"use client";

import dynamic from "next/dynamic";

/**
 * The dashboard owns the store and the curriculum data, so it is loaded after
 * hydration. The server HTML keeps a reserved block, which avoids layout shift
 * and keeps the marketing copy (and its JS budget) untouched.
 */
const RetentionDashboard = dynamic(
  () =>
    import("./RetentionDashboard").then((module) => module.RetentionDashboard),
  {
    ssr: false,
    loading: () => (
      <section
        aria-busy="true"
        aria-label="جارٍ تحميل لوحة التقدم"
        className="relative z-10 mx-auto w-full max-w-3xl px-4 pb-8"
      >
        <div className="glass-panel animate-pulse rounded-2xl p-5 sm:p-6">
          <div className="h-6 w-40 rounded bg-white/10" />
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {[0, 1, 2, 3].map((index) => (
              <div
                key={index}
                className="h-[150px] rounded-xl bg-white/[0.04]"
              />
            ))}
          </div>
        </div>
      </section>
    ),
  },
);

export function DashboardIsland() {
  return <RetentionDashboard />;
}
