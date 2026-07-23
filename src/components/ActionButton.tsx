import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type Props = {
  to?: string;
  href?: string;
  variant?: "primary" | "secondary" | "ghost" | "gold";
  size?: "sm" | "md" | "lg";
  className?: string;
  children?: ReactNode;
};

const variants = {
  primary:
    "bg-brand text-brand-foreground hover:bg-brand/90 shadow-elegant",
  secondary:
    "bg-crimson text-crimson-foreground hover:bg-crimson/90",
  gold: "bg-gold text-gold-foreground hover:bg-gold/90",
  ghost:
    "bg-transparent text-foreground border border-border hover:bg-muted",
};

const sizes = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-6 text-sm",
  lg: "h-13 px-8 text-base",
};

export function ActionButton({
  to,
  href,
  variant = "primary",
  size = "md",
  className,
  children = "Schedule a Consultation",
}: Props) {
  const cls = cn(
    "inline-flex items-center justify-center gap-2 rounded-md font-semibold uppercase tracking-wide transition-all duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
    variants[variant],
    sizes[size],
    className,
  );
  const label = typeof children === "string" ? children : "cta";
  const onClickTrack = () => {
    if (typeof window !== "undefined") {
      const isPhone = href?.startsWith("tel:");
      window.trackEvent?.(isPhone ? "book_call_click" : "cta_click", "conversion", label);
    }
  };
  if (href) {
    return (
      <a href={href} className={cls} onClick={onClickTrack}>
        {children}
      </a>
    );
  }
  return (
    <Link to={to ?? "/consultation"} className={cls} onClick={onClickTrack}>
      {children}
    </Link>
  );
}
