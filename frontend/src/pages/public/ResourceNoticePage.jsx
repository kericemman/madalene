import { Link, useParams } from "react-router-dom";
import { Mail, ArrowRight } from "lucide-react";

const titleFromSlug = (slug = "") =>
  slug
    .split("-")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

export default function ResourceNoticePage() {
  const { slug } = useParams();
  const title = titleFromSlug(slug);

  return (
    <section className="bg-mistWhite py-14 sm:py-20 lg:py-24">
      <div className="container-shell max-w-3xl">
        <div className="rounded border border-sage bg-white p-6 text-center shadow-[0_22px_50px_rgba(26,26,26,0.06)] sm:p-9">
          <Mail className="mx-auto text-deepEmerald" size={38} aria-hidden="true" />
          <p className="mt-5 text-xs font-extrabold uppercase tracking-[0.16em] text-deepEmerald">
            Email-delivered resource
          </p>
          <h1 className="mt-3 font-serif text-4xl leading-tight text-charcoal sm:text-5xl">
            {title || "Your resource"} is delivered inside your email.
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-charcoal/70">
            No ebook download needed. After completing the Resonance Quotient assessment, the recommended
            resource is sent directly to your inbox as a readable, action-ready email.
          </p>
          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              to="/assessment"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-deepEmerald px-5 py-3 text-sm font-extrabold text-mistWhite transition hover:bg-charcoal"
            >
              Take the assessment
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
            <Link
              to="/code-of-resonance?subscribe=1"
              className="inline-flex items-center justify-center rounded-full border border-deepEmerald/25 px-5 py-3 text-sm font-extrabold text-deepEmerald transition hover:border-deepEmerald hover:bg-sage"
            >
              Subscribe to the Code
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
