import Link from "next/link";
import { SITE_DESCRIPTION, SITE_NAME, SITE_TAGLINE } from "@/lib/site";

export default function HomePage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <section className="mx-auto max-w-2xl text-center">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-zinc-500">
          {SITE_NAME}
        </p>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight text-zinc-900">
          {SITE_TAGLINE}
        </h1>
        <p className="mt-4 text-lg text-zinc-600">{SITE_DESCRIPTION}</p>
        <div className="mt-8 flex justify-center gap-4">
          <Link
            href="/products"
            className="rounded-full bg-zinc-900 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-zinc-700"
          >
            Shop all sarees
          </Link>
          <Link
            href="/categories"
            className="rounded-full border border-zinc-300 px-6 py-3 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-50"
          >
            Browse categories
          </Link>
        </div>
      </section>
    </div>
  );
}
