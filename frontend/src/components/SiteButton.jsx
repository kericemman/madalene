import { Link } from "react-router-dom";

const base =
  "inline-flex min-w-0 max-w-full items-center justify-center gap-2 rounded-full px-5 py-3 text-center text-sm font-bold leading-5 transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4";

const variants = {
  brandOnDark:
    "border border-mutedMint/50 bg-deepEmerald text-mistWhite shadow-[0_16px_34px_rgba(0,0,0,0.24)] hover:border-mutedMint hover:bg-mutedMint hover:text-charcoal focus-visible:outline-mutedMint",
  darkPrimary:
    "border border-mistWhite bg-mistWhite text-charcoal shadow-[0_16px_30px_rgba(34,34,34,0.18)] hover:border-mutedMint hover:bg-mutedMint focus-visible:outline-mutedMint",
  darkSecondary:
    "border border-mistWhite/40 bg-transparent text-mistWhite hover:border-mutedMint hover:text-mutedMint focus-visible:outline-mutedMint",
  lightPrimary:
    "border border-deepEmerald bg-deepEmerald text-mistWhite shadow-[0_12px_28px_rgba(11,110,79,0.18)] hover:border-charcoal hover:bg-charcoal focus-visible:outline-deepEmerald",
  lightSecondary:
    "border border-deepEmerald/25 bg-transparent text-deepEmerald hover:border-deepEmerald hover:bg-sage focus-visible:outline-deepEmerald",
  blackGreen:
    "border border-charcoal bg-charcoal text-mutedMint shadow-[0_12px_24px_rgba(34,34,34,0.18)] hover:border-deepEmerald hover:bg-deepEmerald hover:text-mistWhite focus-visible:outline-deepEmerald",
  nav:
    "border border-deepEmerald bg-deepEmerald px-4 py-2.5 text-mistWhite shadow-[0_12px_24px_rgba(11,110,79,0.2)] hover:border-mutedMint hover:bg-mutedMint hover:text-charcoal focus-visible:outline-mutedMint"
};

export default function SiteButton({ to, href, variant = "lightPrimary", className = "", children, onClick }) {
  const classes = `${base} ${variants[variant]} ${className}`;

  if (href) {
    return (
      <a href={href} className={classes} onClick={onClick}>
        {children}
      </a>
    );
  }

  return (
    <Link to={to} className={classes} onClick={onClick}>
      {children}
    </Link>
  );
}
