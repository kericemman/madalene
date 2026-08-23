import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowRight, Lock } from "lucide-react";
import BrandLogo from "../../components/BrandLogo.jsx";
import { loginAdmin } from "../../services/api.js";

export default function AdminLoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const destination = location.state?.from?.pathname || "/admin";

  const handleChange = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      await loginAdmin(form);
      navigate(destination, { replace: true });
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Login failed. Check your details and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="grid min-h-screen bg-[linear-gradient(120deg,#222222_0%,#222222_52%,#0B6E4F_100%)] text-mistWhite lg:grid-cols-[0.92fr_1.08fr]">
      <section className="relative hidden overflow-hidden border-r border-mistWhite/10 p-10 lg:block">
        <div className="absolute bottom-0 right-0 h-80 w-80 border border-mutedMint/10 bg-deepEmerald/25" aria-hidden="true" />
        <div className="relative">
          <BrandLogo variant="footer" />
          <p className="mt-20 flex items-center gap-3 text-xs font-extrabold uppercase tracking-[0.18em] text-mutedMint">
            <span className="h-px w-8 bg-mutedMint" aria-hidden="true" />
            Admin Console
          </p>
          <h1 className="mt-6 max-w-xl font-serif text-6xl leading-[0.95] text-balance">
            Manage the Trust Hub with clarity.
          </h1>
          <p className="mt-6 max-w-lg text-lg leading-8 text-mistWhite/72">
            Review assessment results, manage leads, update email templates, track messages, and
            keep the credibility engine moving.
          </p>
        </div>
      </section>

      <section className="grid place-items-center px-4 py-10">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md rounded border border-mistWhite/15 bg-mistWhite p-6 text-charcoal shadow-[0_24px_64px_rgba(0,0,0,0.24)] sm:p-8"
        >
          <div className="flex size-12 items-center justify-center rounded bg-deepEmerald text-mistWhite">
            <Lock size={22} aria-hidden="true" />
          </div>
          <h2 className="mt-6 font-serif text-4xl leading-tight">Sign in</h2>
          <p className="mt-3 text-sm leading-6 text-charcoal/70">
            Use your admin account to access the Trust Hub console.
          </p>

          <label className="mt-8 block">
            <span className="text-sm font-semibold">Email</span>
            <input
              className="input mt-2"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              autoComplete="email"
              required
            />
          </label>

          <label className="mt-5 block">
            <span className="text-sm font-semibold">Password</span>
            <input
              className="input mt-2"
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              autoComplete="current-password"
              required
              minLength={8}
            />
          </label>

          {error && (
            <p className="mt-5 rounded border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-full border border-deepEmerald bg-deepEmerald px-5 py-3 text-center text-sm font-bold leading-5 text-mistWhite shadow-[0_12px_28px_rgba(11,110,79,0.18)] transition hover:border-charcoal hover:bg-charcoal disabled:cursor-not-allowed disabled:opacity-65"
          >
            {loading ? "Signing in..." : "Sign in to admin"}
            <ArrowRight size={16} aria-hidden="true" />
          </button>
        </form>
      </section>
    </main>
  );
}
