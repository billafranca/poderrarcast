import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/oauth/callback")({
  head: () => ({ meta: [{ title: "Entrando… — podErrar" }] }),
  component: OAuthCallback,
});

function OAuthCallback() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;
    if (user) navigate({ to: "/dashboard", replace: true });
    else navigate({ to: "/login", replace: true });
  }, [user, loading, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-sm text-muted-foreground">Concluindo login…</p>
    </div>
  );
}
