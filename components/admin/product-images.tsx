import Image from "next/image";
import { deleteProductImage } from "@/app/admin/actions/products";

type ProductImage = { id: string; url: string; alt: string | null };

export function ProductImages({
  images,
  productId,
}: {
  images: ProductImage[];
  productId: string;
}) {
  if (images.length === 0) return null;

  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-6">
      <p className="mb-3 text-sm font-medium text-zinc-700">Current images</p>
      <div className="flex flex-wrap gap-3">
        {images.map((image) => (
          <div key={image.id}>
            <div className="relative h-24 w-20 overflow-hidden rounded-lg border border-zinc-200">
              <Image
                src={image.url}
                alt={image.alt ?? "Product"}
                fill
                className="object-cover"
                unoptimized
              />
            </div>
            <form
              action={deleteProductImage.bind(null, image.id, productId)}
              className="mt-1"
            >
              <button
                type="submit"
                className="w-full text-xs text-red-600 hover:text-red-800"
              >
                Remove
              </button>
            </form>
          </div>
        ))}
      </div>
    </div>
  );
}
