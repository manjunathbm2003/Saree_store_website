type BadgeProps = {
  variant?: "default" | "success" | "warning" | "danger";
  children: React.ReactNode;
};

const variants = {
  default: "bg-zinc-100 text-zinc-700",
  success: "bg-green-100 text-green-800",
  warning: "bg-amber-100 text-amber-800",
  danger: "bg-red-100 text-red-800",
};

export function Badge({ variant = "default", children }: BadgeProps) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${variants[variant]}`}
    >
      {children}
    </span>
  );
}
