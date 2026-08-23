import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import {
  AlertCircle,
  CheckCircle2,
  Loader2,
  Mail,
  Plus,
  RefreshCcw,
  Save,
  Settings,
  ShieldCheck,
  ListChecks,
  UploadCloud,
  Users
} from "lucide-react";
import { createAdminUser, getPlatformReadiness, listAdminUsers, updateAdminUser } from "../../services/api.js";

const emptyUser = {
  name: "",
  email: "",
  password: "",
  role: "content_editor",
  active: true
};

const formatDateTime = (value) => {
  if (!value) return "Not recorded";
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit"
  }).format(new Date(value));
};

const statusStyle = {
  ready: "bg-mutedMint text-deepEmerald",
  needs_configuration: "bg-amber-50 text-amber-800",
  needs_attention: "bg-red-50 text-red-700"
};

const statusLabel = {
  ready: "Ready",
  needs_configuration: "Configure",
  needs_attention: "Attention"
};

function SystemCard({ icon: Icon, check }) {
  const status = check?.state || "needs_attention";
  return (
    <article className="rounded border border-sage bg-mistWhite p-5 shadow-[0_12px_28px_rgba(34,34,34,0.035)]">
      <div className="flex items-start justify-between gap-4">
        <Icon className="text-deepEmerald" size={22} aria-hidden="true" />
        <span className={`rounded-full px-3 py-1 text-xs font-extrabold uppercase tracking-[0.1em] ${statusStyle[status]}`}>
          {statusLabel[status]}
        </span>
      </div>
      <h2 className="mt-5 font-serif text-2xl leading-tight text-charcoal">{check?.label || "Checking service"}</h2>
      <p className="mt-2 text-sm leading-6 text-charcoal/62">{check?.detail || "The platform is checking this service."}</p>
    </article>
  );
}

export default function AdminSettingsPage() {
  const { admin } = useOutletContext();
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState(emptyUser);
  const [readiness, setReadiness] = useState(null);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState("");
  const [creating, setCreating] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadSettings = async () => {
    setLoading(true);
    setError("");
    try {
      const [usersResponse, readinessResponse] = await Promise.all([listAdminUsers(), getPlatformReadiness()]);
      setUsers(usersResponse.data.users || []);
      setReadiness(readinessResponse.data || null);
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Could not load admin settings.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const checksByKey = Object.fromEntries((readiness?.checks || []).map((check) => [check.key, check]));

  const createUser = async (event) => {
    event.preventDefault();
    setCreating(true);
    setError("");
    setMessage("");

    try {
      const response = await createAdminUser(newUser);
      setUsers((current) => [response.data.user, ...current]);
      setNewUser(emptyUser);
      setMessage("Admin user created.");
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Could not create admin user.");
    } finally {
      setCreating(false);
    }
  };

  const updateUser = async (user, payload) => {
    const id = user.id || user._id;
    if (!id) return;

    setSavingId(id);
    setError("");
    setMessage("");

    try {
      const response = await updateAdminUser(id, payload);
      setUsers((current) => current.map((item) => ((item.id || item._id) === id ? response.data.user : item)));
      setMessage("Admin user updated.");
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Could not update admin user.");
    } finally {
      setSavingId("");
    }
  };

  return (
    <section>
      <div className="flex flex-col gap-5 border-b border-sage pb-7 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-deepEmerald">Settings</p>
          <h1 className="mt-3 font-serif text-4xl leading-tight text-charcoal sm:text-5xl">Admin and System Settings</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-charcoal/65">
            Manage admin access and review the core services powering email delivery, media optimization, and security.
          </p>
        </div>
        <button
          type="button"
          onClick={loadSettings}
          className="inline-flex items-center justify-center gap-2 rounded-full border border-charcoal bg-charcoal px-5 py-3 text-sm font-bold text-mutedMint transition hover:bg-deepEmerald hover:text-mistWhite"
        >
          <RefreshCcw size={16} aria-hidden="true" />
          Refresh
        </button>
      </div>

      {(message || error) && (
        <div className={`mt-6 flex gap-3 rounded border p-4 text-sm ${error ? "border-red-200 bg-red-50 text-red-700" : "border-deepEmerald/20 bg-mutedMint text-deepEmerald"}`}>
          {error ? <AlertCircle className="mt-0.5 shrink-0" size={18} aria-hidden="true" /> : <CheckCircle2 className="mt-0.5 shrink-0" size={18} aria-hidden="true" />}
          <p>{error || message}</p>
        </div>
      )}

      <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <SystemCard
          icon={ShieldCheck}
          check={checksByKey.database}
        />
        <SystemCard
          icon={Mail}
          check={checksByKey.email}
        />
        <SystemCard
          icon={UploadCloud}
          check={checksByKey.media}
        />
        <SystemCard
          icon={Settings}
          check={checksByKey.worker}
        />
        <SystemCard
          icon={ListChecks}
          check={checksByKey.assessment}
        />
        <SystemCard
          icon={ShieldCheck}
          check={checksByKey.public_url}
        />
      </div>

      <article className="mt-8 grid gap-5 border border-sage bg-white p-5 shadow-[0_16px_34px_rgba(34,34,34,0.045)] lg:grid-cols-[1fr_auto] lg:items-center">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-deepEmerald">Launch catalogue</p>
          <h2 className="mt-2 font-serif text-3xl leading-tight text-charcoal">Three ways to build credibility</h2>
          <p className="mt-2 text-sm leading-6 text-charcoal/64">
            {readiness?.offerCatalogue?.active ?? 0} of {readiness?.offerCatalogue?.expected ?? 3} approved offers are active in the public catalogue.
          </p>
          {!!readiness?.offerCatalogue?.missing?.length && (
            <p className="mt-3 text-sm font-bold text-amber-800">Missing: {readiness.offerCatalogue.missing.join(", ")}</p>
          )}
        </div>
        <span className={`w-fit rounded-full px-3 py-1 text-xs font-extrabold uppercase tracking-[0.1em] ${readiness?.offerCatalogue?.missing?.length ? "bg-amber-50 text-amber-800" : "bg-mutedMint text-deepEmerald"}`}>
          {readiness?.offerCatalogue?.missing?.length ? "Needs attention" : "Ready"}
        </span>
      </article>

      <div className="mt-8 grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <form onSubmit={createUser} className="rounded border border-sage bg-white p-5 shadow-[0_16px_34px_rgba(34,34,34,0.045)]">
          <div className="flex items-center gap-3">
            <Users className="text-deepEmerald" size={21} aria-hidden="true" />
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-deepEmerald">Access</p>
              <h2 className="font-serif text-3xl leading-tight text-charcoal">Create Admin User</h2>
            </div>
          </div>

          <div className="mt-5 grid gap-4">
            <label className="grid gap-2">
              <span className="text-sm font-extrabold text-charcoal">Name</span>
              <input className="input bg-mistWhite" value={newUser.name} onChange={(event) => setNewUser((current) => ({ ...current, name: event.target.value }))} required />
            </label>
            <label className="grid gap-2">
              <span className="text-sm font-extrabold text-charcoal">Email</span>
              <input className="input bg-mistWhite" type="email" value={newUser.email} onChange={(event) => setNewUser((current) => ({ ...current, email: event.target.value }))} required />
            </label>
            <label className="grid gap-2">
              <span className="text-sm font-extrabold text-charcoal">Temporary password</span>
              <input className="input bg-mistWhite" type="password" minLength={8} value={newUser.password} onChange={(event) => setNewUser((current) => ({ ...current, password: event.target.value }))} required />
            </label>
            <div className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
              <label className="grid gap-2">
                <span className="text-sm font-extrabold text-charcoal">Role</span>
                <select className="input bg-mistWhite" value={newUser.role} onChange={(event) => setNewUser((current) => ({ ...current, role: event.target.value }))}>
                  <option value="content_editor">Content editor</option>
                  <option value="admin">Admin</option>
                </select>
              </label>
              <label className="inline-flex items-center gap-2 pb-3 text-sm font-extrabold text-charcoal">
                <input type="checkbox" className="accent-deepEmerald" checked={newUser.active} onChange={(event) => setNewUser((current) => ({ ...current, active: event.target.checked }))} />
                Active
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={creating}
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-deepEmerald px-5 py-3 text-sm font-extrabold text-mistWhite transition hover:bg-charcoal disabled:opacity-60"
          >
            {creating ? <Loader2 className="animate-spin" size={16} aria-hidden="true" /> : <Plus size={16} aria-hidden="true" />}
            {creating ? "Creating..." : "Create user"}
          </button>
        </form>

        <article className="rounded border border-sage bg-white p-5 shadow-[0_16px_34px_rgba(34,34,34,0.045)]">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-deepEmerald">Team</p>
              <h2 className="font-serif text-3xl leading-tight text-charcoal">Admin Users</h2>
            </div>
            <span className="rounded-full bg-sage px-3 py-1 text-xs font-extrabold text-deepEmerald">
              {users.length} users
            </span>
          </div>

          {loading ? (
            <div className="mt-6 grid min-h-[240px] place-items-center text-sm font-bold text-deepEmerald">
              Loading users...
            </div>
          ) : (
            <div className="mt-6 grid gap-3">
              {users.map((user) => {
                const id = user.id || user._id;
                const isSelf = id === admin?.id;
                return (
                  <div key={id} className="grid gap-4 rounded border border-sage bg-mistWhite p-4 lg:grid-cols-[1fr_auto] lg:items-center">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-bold text-charcoal">{user.name}</h3>
                        {isSelf && <span className="rounded-full bg-mutedMint px-2.5 py-1 text-xs font-extrabold text-deepEmerald">You</span>}
                        <span className={`rounded-full px-2.5 py-1 text-xs font-extrabold ${user.active ? "bg-mutedMint text-deepEmerald" : "bg-sage text-charcoal/55"}`}>
                          {user.active ? "Active" : "Inactive"}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-charcoal/64">{user.email}</p>
                      <p className="mt-1 text-xs text-charcoal/50">
                        {user.role} · Last login: {formatDateTime(user.lastLoginAt)}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <select
                        className="input w-auto min-w-40 bg-white text-sm"
                        value={user.role}
                        disabled={savingId === id || isSelf}
                        onChange={(event) => updateUser(user, { role: event.target.value })}
                      >
                        <option value="content_editor">Content editor</option>
                        <option value="admin">Admin</option>
                      </select>
                      <button
                        type="button"
                        disabled={savingId === id || isSelf}
                        onClick={() => updateUser(user, { active: !user.active })}
                        className="inline-flex items-center justify-center gap-2 rounded-full border border-sage bg-white px-4 py-2.5 text-sm font-bold text-charcoal transition hover:border-deepEmerald hover:text-deepEmerald disabled:cursor-not-allowed disabled:opacity-45"
                      >
                        {savingId === id ? <Loader2 className="animate-spin" size={15} aria-hidden="true" /> : <Save size={15} aria-hidden="true" />}
                        {user.active ? "Deactivate" : "Activate"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </article>
      </div>
    </section>
  );
}
