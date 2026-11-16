import type { NextConfig } from "next";

/** Sent with every response. A Content-Security-Policy is left until Stripe and Supabase are connected, since both need their domains allowed. */
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  // The microphone is for dictation in Assistance; payment is for Stripe later.
  {
    key: "Permissions-Policy",
    value: "camera=(), geolocation=(), microphone=(self), payment=(self)",
  },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  headers: () => [{ source: "/:path*", headers: securityHeaders }],
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
