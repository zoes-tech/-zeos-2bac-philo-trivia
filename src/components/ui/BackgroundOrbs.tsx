/**
 * Decorative background. CSS-only on purpose: these orbs are visible on every
 * locale, and shipping Framer Motion just to animate three blurred circles
 * added ~35 KB of JavaScript to pages that are otherwise static.
 */
export function BackgroundOrbs() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      <div className="orb orb-a absolute left-[-10%] top-[-10%] h-[500px] w-[500px] rounded-full bg-purple-600/20 blur-[100px]" />
      <div className="orb orb-b absolute right-[-10%] top-[20%] h-[400px] w-[400px] rounded-full bg-cyan-500/20 blur-[100px]" />
      <div className="orb orb-c absolute bottom-[-10%] left-[20%] h-[600px] w-[600px] rounded-full bg-blue-600/20 blur-[120px]" />
    </div>
  );
}
