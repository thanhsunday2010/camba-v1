import { Link } from "@/i18n/routing";
import { UserCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { dashboardHubHref } from "@/lib/dashboard/dashboard-hub-routes";

interface PortfolioLinkProps {
  label: string;
  variant?: "default" | "ghost";
  className?: string;
}

export function PortfolioLink({ label, variant = "ghost", className }: PortfolioLinkProps) {
  return (
    <Link href={dashboardHubHref("profile")} className={className}>
      <Button variant={variant} size="sm">
        <UserCircle className="h-4 w-4 mr-1" aria-hidden />
        {label}
      </Button>
    </Link>
  );
}
