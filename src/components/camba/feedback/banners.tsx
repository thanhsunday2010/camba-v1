import { cn } from "@/lib/utils";
import { bannerVariants } from "@/lib/design/card-variants";
import type { VariantProps } from "class-variance-authority";
import type { LucideIcon } from "lucide-react";
import {
  AlertCircle,
  CheckCircle2,
  Info,
  PartyPopper,
  Sparkles,
  Target,
  Trophy,
} from "lucide-react";

type BannerTone = VariantProps<typeof bannerVariants>["tone"];

const toneIcons: Record<NonNullable<BannerTone>, LucideIcon> = {
  success: CheckCircle2,
  warning: AlertCircle,
  error: AlertCircle,
  info: Info,
  celebration: PartyPopper,
  mastery: Trophy,
  mission: Target,
};

interface FeedbackBannerProps {
  tone?: BannerTone;
  title: string;
  description?: string;
  action?: React.ReactNode;
  icon?: LucideIcon;
  className?: string;
}

export function FeedbackBanner({
  tone = "info",
  title,
  description,
  action,
  icon,
  className,
}: FeedbackBannerProps) {
  const Icon = icon ?? toneIcons[tone ?? "info"];
  return (
    <div className={cn(bannerVariants({ tone }), className)} role="status">
      <Icon className="h-5 w-5 shrink-0 mt-0.5 text-program" aria-hidden />
      <div className="flex-1 min-w-0">
        <p className="camba-h3 text-sm text-foreground">{title}</p>
        {description && <p className="camba-caption text-muted mt-0.5">{description}</p>}
        {action && <div className="mt-2">{action}</div>}
      </div>
    </div>
  );
}

export function CelebrationBanner(props: Omit<FeedbackBannerProps, "tone">) {
  return <FeedbackBanner tone="celebration" {...props} icon={props.icon ?? Sparkles} />;
}

export function MasteryUnlockedBanner(props: Omit<FeedbackBannerProps, "tone">) {
  return <FeedbackBanner tone="mastery" {...props} />;
}

export function MissionCompletedBanner(props: Omit<FeedbackBannerProps, "tone">) {
  return <FeedbackBanner tone="mission" {...props} />;
}
