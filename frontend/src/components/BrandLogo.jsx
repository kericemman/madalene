import { Link } from "react-router-dom";
import logoTransparent from "../assets/brand/logo.png";
import logoLockupDarkCrop from "../assets/brand/mw-lockup-dark-crop.png";

export default function BrandLogo({ variant = "nav", onClick }) {
  if (variant === "footer") {
    return (
      <Link to="/" className="inline-flex" onClick={onClick} aria-label="Earned Credibility home">
        <img
          src={logoLockupDarkCrop}
          alt="Magdalene Wambui - Become The Trusted Choice"
          className="h-auto w-72 max-w-full object-contain mix-blend-lighten"
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
