"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/** Pages with no scroll animation: the app, sign in and sign up. They never download GSAP or Lenis. */
const still = (path: string) =>
  path.startsWith("/dashboard") || path === "/login" || path === "/signup";

type Libs = {
  gsap: typeof import("gsap").default;
  ScrollTrigger: typeof import("gsap/ScrollTrigger").ScrollTrigger;
  Lenis: typeof import("lenis").default;
};
let libs: Promise<Libs> | null = null;
const loadLibs = () =>
  (libs ??= Promise.all([
    import("gsap"),
    import("gsap/ScrollTrigger"),
    import("lenis"),
  ]).then(([g, st, l]) => {
    g.default.registerPlugin(st.ScrollTrigger);
    return {
      gsap: g.default,
      ScrollTrigger: st.ScrollTrigger,
      Lenis: l.default,
    };
  }));

// Start the download while the page hydrates, not after, so reveals are not held back.
if (typeof window !== "undefined" && !still(window.location.pathname))
  void loadLibs().catch(() => {});

export function Motion() {
  const pathname = usePathname();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (still(pathname)) return;

    let cancelled = false;
    let cleanup: (() => void) | undefined;
    let frame = 0;
    const started = performance.now();

    // wait until React has hydrated the page, so GSAP never edits nodes React still owns
    const hydrated = () => {
      const el = document.querySelector("[data-load],[data-reveal]");
      return !el || Object.keys(el).some((k) => k.startsWith("__reactFiber"));
    };

    const wait = () => {
      if (hydrated()) {
        loadLibs()
          .then((l) => {
            if (cancelled) return;
            cleanup = start(l);
            begun = true;
          })
          .catch((err) => {
            // never leave content hidden if motion fails to load or start
            console.error("Motion failed to start", err);
            document.documentElement.classList.remove("motion");
          });
      } else if (performance.now() - started > 4000)
        document.documentElement.classList.remove("motion");
      else frame = requestAnimationFrame(wait);
    };
    // last resort: if motion has not begun in 5s, show the content rather than leave it hidden
    let begun = false;
    const safety = window.setTimeout(() => {
      if (!begun) document.documentElement.classList.remove("motion");
    }, 5000);
    wait();

    return () => {
      cancelled = true;
      window.clearTimeout(safety);
      cancelAnimationFrame(frame);
      cleanup?.();
    };
  }, [pathname]);

  return null;
}

function start({ gsap, ScrollTrigger, Lenis }: Libs) {
  const lenis = new Lenis({ lerp: 0.1 });
  lenis.on("scroll", ScrollTrigger.update);
  const tick = (t: number) => lenis.raf(t * 1000);
  gsap.ticker.add(tick);
  gsap.ticker.lagSmoothing(0);

  const ctx = gsap.context(() => {
    gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
      gsap.fromTo(
        el,
        { y: 32, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.85,
          ease: "power2.out",
          clearProps: "transform",
          scrollTrigger: { trigger: el, start: "top 90%", once: true },
        },
      );
    });

    gsap.utils.toArray<HTMLElement>("[data-stagger]").forEach((el) => {
      gsap.fromTo(
        el.children,
        { y: 36, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.12,
          clearProps: "transform",
          scrollTrigger: { trigger: el, start: "top 88%", once: true },
        },
      );
    });

    gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((el) => {
      gsap.to(el, {
        yPercent: -Number(el.dataset.parallax),
        ease: "none",
        scrollTrigger: {
          trigger: el,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
    });
  });

  const refresh = window.setTimeout(() => ScrollTrigger.refresh(), 400);

  return () => {
    window.clearTimeout(refresh);
    ctx.revert();
    gsap.ticker.remove(tick);
    lenis.destroy();
  };
}
