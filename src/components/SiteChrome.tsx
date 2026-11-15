"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

/** Marketing pages get the navbar and footer; the app dashboard and sign-in bring their own. */
export function SiteChrome({
  nav,
  footer,
  children,
}: {
  nav: ReactNode;
  footer: ReactNode;
  children: ReactNode;
}) {
  const path = usePathname();
  const inApp =
    path.startsWith("/dashboard") || path === "/login" || path === "/signup";
  if (inApp) return <main className="flex-1">{children}</main>;
  return (
    <>
      {nav}
      <main className="flex-1 pt-20 sm:pt-24">{children}</main>
      {footer}
    </>
  );
}
