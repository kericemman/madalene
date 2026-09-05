import { Link } from "react-router-dom";
import logoTransparent from "../assets/brand/logo.png";

export default function BrandLogo({ variant = "nav", onClick }) {
  if (variant === "footer") {
    return (
      <Link to="/" className="inline-flex" onClick={onClick} aria-label="Earned Credibility home">
        <img
          src={logoTransparent}
          alt="Magdalene Wambui - Become The Trusted Choice"
          className="h-auto w-64 max-w-full object-contain object-left sm:w-72"
        />
      </Link>
    );
  }

  return (
    <Link
      to="/"
      className="block h-12 w-48 overflow-hidden sm:h-14 sm:w-56"
      onClick={onClick}
      aria-label="Earned Credibility home"
    >
      <img
        src={logoTransparent}
        alt="Magdalene Wambui - Become The Trusted Choice"
        className="h-full w-full object-contain object-left"
      />
    </Link>
  );
}
