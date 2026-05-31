import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const schema = z.object({
  password: z.string().min(8, "Mínimo 8 caracteres").max(72),
  confirm: z.string(),
}).refine((d) => d.password === d.confirm, { message: "Senhas não conferem", path: ["confirm"] });

export const Route = createFileRoute("/reset-password")({
  head: () => ({ meta: [{ title: "Nova senha — podErrar" }] }),
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);

  // Supabase parses the recovery hash automatically and emits PASSWORD_RECOVERY.
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") setReady(true);
    });
    // Already-recovery session check on mount.
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setReady(true);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handle = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse({ password, confirm });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password: parsed.data.password });
    setLoading(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Senha redefinida!");
    navigate({ to: "/dashboard", replace: true });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <form onSubmit={handle} className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Nova senha</h1>
          <p className="text-sm text-muted-foreground">Defina uma nova senha para sua conta.</p>
        </div>
        {!ready && (
          <p className="text-sm text-muted-foreground text-center">
            Abra esta página pelo link enviado no seu email.
          </p>
        )}
        <div className="space-y-2">
          <Label htmlFor="password">Senha</Label>
          <Input id="password" type="password" autoComplete="new-password" required minLength={8}
            value={password} onChange={(e) => setPassword(e.target.value)} disabled={!ready} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="confirm">Confirmar senha</Label>
          <Input id="confirm" type="password" required minLength={8}
            value={confirm} onChange={(e) => setConfirm(e.target.value)} disabled={!ready} />
        </div>
        <Button type="submit" className="w-full" disabled={loading || !ready}>
          {loading ? "Salvando…" : "Salvar nova senha"}
        </Button>
      </form>
    </div>
  );
}
