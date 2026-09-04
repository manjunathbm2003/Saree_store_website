import type { NextConfig } from "next";

function getSupabaseHostname(): string {
  const raw = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  if (!raw) return "*.supabase.co";

  try {
    const withProtocol = raw.startsWith("http") ? raw : `https://${raw}`;
    const { hostname } = new URL(withProtocol);
    if (hostname) return hostname;
  } catch {
    // Invalid env value — fall back so the build still succeeds
  }

  return "*.supabase.co";
}

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: getSupabaseHostname(),
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;
