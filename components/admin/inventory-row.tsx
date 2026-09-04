"use client";

import { useState } from "react";
import { updateInventory } from "@/app/admin/actions/categories";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type InventoryRowProps = {
  productId: string;
  sku: string;
  quantity: number;
};

export function InventoryRow({ productId, sku, quantity }: InventoryRowProps) {
  const [pending, setPending] = useState(false);
  const isLow = quantity > 0 && quantity <= 5;
  const isOut = quantity === 0;

  async function handleSubmit(formData: FormData) {
    setPending(true);
    const newSku = (formData.get("sku") as string)?.trim() || null;
    const newQty = parseInt(formData.get("quantity") as string, 10);
    await updateInventory(productId, newQty, newSku);
    setPending(false);
  }

  return (
    <>
      <td className="px-4 py-3">
        <form id={`inv-${productId}`} action={handleSubmit}>
          <Input
            name="sku"
            defaultValue={sku}
            placeholder="SKU"
            className="w-28"
          />
        </form>
      </td>
      <td className="px-4 py-3">
        <Input
          form={`inv-${productId}`}
          name="quantity"
          type="number"
          min="0"
          defaultValue={quantity}
          className="w-20"
        />
      </td>
      <td className="px-4 py-3">
        {isOut ? (
          <Badge variant="danger">Out of stock</Badge>
        ) : isLow ? (
          <Badge variant="warning">Low stock</Badge>
        ) : (
          <Badge variant="success">In stock</Badge>
        )}
      </td>
      <td className="px-4 py-3">
        <Button
          type="submit"
          form={`inv-${productId}`}
          variant="secondary"
          disabled={pending}
          className="!px-3 !py-1.5 !text-xs"
        >
          {pending ? "..." : "Save"}
        </Button>
      </td>
    </>
  );
}
