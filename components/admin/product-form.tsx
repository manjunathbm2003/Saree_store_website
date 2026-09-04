"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { paiseToRupees, slugify } from "@/lib/format";

type Category = { id: string; name: string };

type ProductFormProps = {
  categories: Category[];
  action: (formData: FormData) => Promise<void>;
  deleteAction?: () => Promise<void>;
  defaultValues?: {
    name: string;
    slug: string;
    description: string;
    price: number;
    compareAt: number | null;
    categoryId: string;
    isActive: boolean;
    quantity: number;
    sku: string;
  };
};

export function ProductForm({
  categories,
  action,
  deleteAction,
  defaultValues,
}: ProductFormProps) {
  const [name, setName] = useState(defaultValues?.name ?? "");
  const [slug, setSlug] = useState(defaultValues?.slug ?? "");
  const [slugEdited, setSlugEdited] = useState(!!defaultValues?.slug);
  const [previews, setPreviews] = useState<string[]>([]);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleNameChange(value: string) {
    setName(value);
    if (!slugEdited) setSlug(slugify(value));
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files) return;
    setPreviews(Array.from(files).map((f) => URL.createObjectURL(f)));
  }

  async function handleSubmit(formData: FormData) {
    setPending(true);
    setError(null);
    try {
      await action(formData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setPending(false);
    }
  }

  return (
    <form action={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid gap-6 rounded-lg border border-zinc-200 bg-white p-6 md:grid-cols-2">
        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Product name *</Label>
            <Input
              id="name"
              name="name"
              required
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="Banarasi Red Silk Saree"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="slug">URL slug *</Label>
            <Input
              id="slug"
              name="slug"
              required
              value={slug}
              onChange={(e) => {
                setSlug(e.target.value);
                setSlugEdited(true);
              }}
              placeholder="banarasi-red-silk"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="categoryId">Category *</Label>
            <Select
              id="categoryId"
              name="categoryId"
              required
              defaultValue={defaultValues?.categoryId ?? ""}
              className="mt-1"
            >
              <option value="" disabled>
                Select category
              </option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </Select>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              rows={4}
              defaultValue={defaultValues?.description ?? ""}
              placeholder="Handwoven silk with gold zari border..."
              className="mt-1"
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="price">Price (₹) *</Label>
              <Input
                id="price"
                name="price"
                type="number"
                step="0.01"
                min="0"
                required
                defaultValue={
                  defaultValues ? paiseToRupees(defaultValues.price) : ""
                }
                placeholder="1500"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="compareAt">Compare at (₹)</Label>
              <Input
                id="compareAt"
                name="compareAt"
                type="number"
                step="0.01"
                min="0"
                defaultValue={
                  defaultValues?.compareAt
                    ? paiseToRupees(defaultValues.compareAt)
                    : ""
                }
                placeholder="2000"
                className="mt-1"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="quantity">Stock quantity</Label>
              <Input
                id="quantity"
                name="quantity"
                type="number"
                min="0"
                defaultValue={defaultValues?.quantity ?? 0}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="sku">SKU</Label>
              <Input
                id="sku"
                name="sku"
                defaultValue={defaultValues?.sku ?? ""}
                placeholder="SILK-RED-001"
                className="mt-1"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              id="isActive"
              name="isActive"
              type="checkbox"
              defaultChecked={defaultValues?.isActive ?? true}
              className="h-4 w-4 rounded border-zinc-300"
            />
            <Label htmlFor="isActive" className="mb-0">
              Active (visible in store)
            </Label>
          </div>

          <div>
            <Label htmlFor="images">
              {defaultValues ? "Add more images" : "Product images"}
            </Label>
            <Input
              id="images"
              name="images"
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              className="mt-1"
            />
            <p className="mt-1 text-xs text-zinc-500">
              JPG, PNG, or WebP. First image is the cover photo.
            </p>
          </div>
        </div>
      </div>

      {previews.length > 0 && (
        <div className="rounded-lg border border-zinc-200 bg-white p-6">
          <p className="mb-3 text-sm font-medium text-zinc-700">New uploads</p>
          <div className="flex flex-wrap gap-3">
            {previews.map((src, i) => (
              <div
                key={src}
                className="relative h-24 w-20 overflow-hidden rounded-lg border border-zinc-200"
              >
                <Image
                  src={src}
                  alt={`Preview ${i + 1}`}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={pending}>
          {pending
            ? "Saving..."
            : defaultValues
              ? "Update product"
              : "Create product"}
        </Button>
        {deleteAction && (
          <Button
            type="button"
            variant="secondary"
            className="!border-red-300 !text-red-700 hover:!bg-red-50"
            disabled={pending}
            onClick={async () => {
              if (!confirm("Delete this product permanently?")) return;
              setPending(true);
              await deleteAction();
            }}
          >
            Delete product
          </Button>
        )}
      </div>
    </form>
  );
}
