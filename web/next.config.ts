import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV !== "production";

/** Origen de la API de inferencia (connect-src); NEXT_PUBLIC_API_URL se resuelve en el build. */
function apiOrigin(): string | null {
  try {
    return new URL(process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000").origin;
  } catch {
    return null;
  }
}

// TODO(seguridad): 'unsafe-inline' en script-src es necesario hoy por los scripts en línea de Next;
// seguimiento: CSP con nonce (proxy.ts + render dinámico) para eliminarlo.
const csp = [
  "default-src 'self'",
  "img-src 'self' blob: data:",
  `connect-src ${["'self'", apiOrigin(), ...(isDev ? ["ws:", "wss:"] : [])].filter(Boolean).join(" ")}`,
  "style-src 'self' 'unsafe-inline'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "font-src 'self' data:",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join("; ");

const nextConfig: NextConfig = {
  /* config options here */
  output: "standalone",
  poweredByHeader: false,
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
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "Content-Security-Policy", value: csp },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(self), geolocation=(), microphone=()" },
        ],
      },
    ];
  },
};

export default nextConfig;
