export function ProductCardPlaceholder() {
  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-4">
      <div className="aspect-[3/4] rounded-md bg-zinc-100" />
      <p className="mt-3 text-sm font-medium text-zinc-900">Product name</p>
      <p className="text-sm text-zinc-500">₹0</p>
    </div>
  );
}
