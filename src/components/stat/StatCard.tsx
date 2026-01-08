import type { LucideIcon } from "lucide-react";
import { Card } from "../ui/card";
import clsx from "clsx";

type Variant = "default" | "success" | "danger" | "warning";

const variants: Record<Variant, string> = {
  default: "border-border bg-card/50 text-foreground",
  success: "border-success/30 bg-success/10 text-success",
  danger: "border-danger/30 bg-danger/10 text-danger",
  warning: "border-warning/30 bg-warning/10 text-warning",
};

const iconColors: Record<Variant, string> = {
  default: "text-foreground",
  success: "text-green-500",
  danger: "text-red-500",
  warning: "text-yellow-500",
};

interface StatCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  variant?: Variant;
}

export function StatCard({
  title,
  value,
  icon: Icon,
  variant = "default",
}: StatCardProps) {
  return (
    <Card
      className={clsx(
        "relative overflow-hidden rounded-xl border p-4 shadow-md backdrop-blur transition-all hover:shadow-lg",
        variants[variant]
      )}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium opacity-80">{title}</p>
          <p className="mt-1 text-2xl font-bold">{value}</p>
        </div>

        <div className="rounded-lg bg-background/40 p-2">
          <Icon className={clsx("h-5 w-5", iconColors[variant])} />
        </div>
      </div>
    </Card>
  );
}
