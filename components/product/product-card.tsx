import Image from "next/image";
import Link from "next/link";
import { formatINR } from "@/lib/format";

type ProductCardProps = {
  name: string;
  slug: string;
  price: number;
  compareAt?: number | null;
  imageUrl?: string | null;
  categoryName?: string;
};

export function ProductCard({
  name,
  slug,
  price,
  compareAt,
  imageUrl,
  categoryName,
}: ProductCardProps) {
  return (
    <Link href={`/products/${slug}`} className="group block">
      <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-zinc-100">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
            sizes="(max-width: 768px) 50vw, 25vw"
            unoptimized
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-zinc-400">
            No image
          </div>
        )}
      </div>
      <div className="mt-3">
        {categoryName && (
          <p className="text-xs uppercase tracking-wide text-zinc-500">
            {categoryName}
          </p>
        )}
        <p className="mt-0.5 text-sm font-medium text-zinc-900 group-hover:underline">
          {name}
        </p>
        <div className="mt-1 flex items-baseline gap-2">
          <p className="text-sm text-zinc-900">{formatINR(price)}</p>
          {compareAt != null && compareAt > price && (
            <p className="text-sm text-zinc-400 line-through">
              {formatINR(compareAt)}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}
