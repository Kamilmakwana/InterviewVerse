import { TopNav } from "@/components/layout/top-nav";
import { Footer } from "@/components/layout/footer";
import { AnimatedBackground } from "@/components/shared/animated-background";

export function PageShell({
  children,
  background = true,
  footer = true,
}: {
  children: React.ReactNode;
  background?: boolean;
  footer?: boolean;
}) {
  return (
    <div className="relative min-h-screen">
      {background && <AnimatedBackground />}
      <TopNav />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">{children}</main>
      {footer && <Footer />}
    </div>
  );
}
