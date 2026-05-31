import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const schema = z.object({
  fullName: z.string().trim().min(2, "Informe seu nome").max(100),
  email: z.string().trim().email("Email inválido").max(255),
  password: z.string().min(8, "Mínimo 8 caracteres").max(72),
});

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [
      { title: "Criar conta — podErrar" },
      { name: "description", content: "Crie sua conta no podErrar e comece a aprender com erros reais." },
    ],
  }),
  component: SignupPage,
});

function SignupPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (user) navigate({ to: "/dashboard", replace: true });
  }, [user, navigate]);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse({ fullName, email, password });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email: parsed.data.email,
      password: parsed.data.password,
      options: {
        emailRedirectTo: `${window.location.origin}/oauth/callback`,
        data: { full_name: parsed.data.fullName },
      },
    });
    setLoading(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    setSubmitted(true);
  };

  const handleOAuth = async (provider: "google" | "apple") => {
    setLoading(true);
    const result = await lovable.auth.signInWithOAuth(provider, {
      redirect_uri: `${window.location.origin}/oauth/callback`,
    });
    if (result.error) {
      setLoading(false);
      toast.error("Falha no cadastro social.");
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <div className="max-w-md text-center space-y-4">
          <h1 className="text-2xl font-bold">Confirme seu email</h1>
          <p className="text-muted-foreground">
            Enviamos um link de confirmação para <strong>{email}</strong>. Clique no link para ativar sua conta.
          </p>
          <Link to="/login" className="text-sm underline">Voltar para entrar</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Criar conta</h1>
          <p className="text-sm text-muted-foreground">Aprenda com erros reais, evolua com inteligência.</p>
        </div>

        <form onSubmit={handleSignup} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">Nome completo</Label>
            <Input id="fullName" autoComplete="name" required value={fullName} onChange={(e) => setFullName(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <Input id="password" type="password" autoComplete="new-password" required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} />
            <p className="text-xs text-muted-foreground">Mínimo 8 caracteres. Senhas vazadas são bloqueadas.</p>
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Criando…" : "Criar conta"}
          </Button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t" /></div>
          <div className="relative flex justify-center text-xs"><span className="bg-background px-2 text-muted-foreground">ou</span></div>
        </div>

        <div className="space-y-2">
          <Button type="button" variant="outline" className="w-full" onClick={() => handleOAuth("google")} disabled={loading}>
            Cadastrar com Google
          </Button>
          <Button type="button" variant="outline" className="w-full" onClick={() => handleOAuth("apple")} disabled={loading}>
            Cadastrar com Apple
          </Button>
        </div>

        <p className="text-center text-sm text-muted-foreground">
          Já tem conta?{" "}
          <Link to="/login" className="text-foreground underline">Entrar</Link>
        </p>
      </div>
    </div>
  );
}
