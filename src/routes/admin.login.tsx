import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import logoGold from "@/assets/celunor-logo-gold.png.asset.json";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/login")({
  head: () => ({
    meta: [
      { title: "Admin Sign In — Célunor" },
      { name: "description", content: "Private Célunor administration sign in." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Admin Sign In — Célunor" },
      { property: "og:description", content: "Private Célunor administration sign in." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  ssr: false,
  component: AdminLogin,
});

function AdminLogin() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    void (async () => {
      const { data } = await supabase.auth.getUser();
      if (data.user) navigate({ to: "/admin" });
      const { data: exists } = await supabase.rpc("admin_exists");
      if (exists === false) setMode("signup");
    })();
  }, [navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setInfo(null);
    setBusy(true);
    if (mode === "signup") {
      const { data, error: err } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: `${window.location.origin}/admin` },
      });
      setBusy(false);
      if (err) return setError(err.message);
      if (!data.session) return setInfo("Check your email to confirm the account, then sign in.");
      navigate({ to: "/admin" });
      return;
    }
    const { error: err } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (err) return setError(err.message);
    navigate({ to: "/admin" });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-espresso px-5">
      <div className="w-full max-w-[380px] rounded-[6px] bg-[oklch(0.965_0.012_80)] p-[30px]">
        <img src={logoGold.url} alt="Célunor" className="mx-auto h-[54px] w-auto" />
        <h1 className="mt-[18px] text-center font-display text-[24px] text-cocoa">
          {mode === "signup" ? "Create admin account" : "Admin sign in"}
        </h1>
        <form onSubmit={submit} className="mt-[20px] space-y-[12px]">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="input-line"
          />
          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="input-line"
          />
          {error ? <p className="font-body text-[12.5px] text-destructive">{error}</p> : null}
          {info ? <p className="font-body text-[12.5px] text-cocoa/70">{info}</p> : null}
          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-full bg-espresso py-[13px] font-body text-[11.5px] tracking-[0.12em] text-cream hover:bg-cocoa disabled:opacity-40"
          >
            {busy ? "PLEASE WAIT…" : mode === "signup" ? "CREATE ACCOUNT" : "SIGN IN"}
          </button>
        </form>
      </div>
    </div>
  );
}
