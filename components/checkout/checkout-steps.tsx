export function CheckoutStepsPlaceholder() {
  const steps = ["Address", "Payment", "Confirmation"];

  return (
    <ol className="flex gap-4 text-sm">
      {steps.map((step, index) => (
        <li key={step} className="text-zinc-600">
          <span className="font-medium text-zinc-900">{index + 1}.</span> {step}
        </li>
      ))}
    </ol>
  );
}
