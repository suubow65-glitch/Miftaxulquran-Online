import type { ReactNode } from "react";

/**
 * Admin layout — suppresses the public SiteHeader + SiteFooter.
 * The dashboard has its own sidebar navigation.
 */
export default function AdminLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
