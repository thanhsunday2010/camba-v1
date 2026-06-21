import { cn } from "@/lib/utils";
import { cambaCardVariants, type CambaCardVariant } from "@/lib/design/card-variants";
import type { VariantProps } from "class-variance-authority";

export interface CambaCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cambaCardVariants> {
  variant?: CambaCardVariant;
}

export function CambaCard({
  className,
  variant,
  padding,
  interactive,
  ...props
}: CambaCardProps) {
  return (
    <div
      className={cn(cambaCardVariants({ variant, padding, interactive }), className)}
      {...props}
    />
  );
}
