import { Link } from "@tanstack/react-router";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-background">
      <div className="container mx-auto px-4 py-12 grid gap-8 md:grid-cols-4">
        <div className="md:col-span-2 space-y-3 opacity-80">
          <Logo />
          <p className="text-sm text-muted-foreground max-w-sm">
            Aprenda com erros reais. Evolua com inteligência. Um curso em formato streaming
            que transforma falhas em decisões melhores usando IA.
          </p>
        </div>
        <div className="space-y-2 text-sm">
          <p className="font-semibold">Navegação</p>
          <ul className="space-y-1 text-muted-foreground">
            <li><Link to="/" className="hover:text-foreground">Início</Link></li>
            <li><Link to="/curso" className="hover:text-foreground">Curso</Link></li>
            <li><Link to="/planos" className="hover:text-foreground">Planos</Link></li>
            <li><Link to="/acesso-gratuito" className="hover:text-foreground">Episódio gratuito</Link></li>
          </ul>
        </div>
        <div className="space-y-2 text-sm">
          <p className="font-semibold">Conta</p>
          <ul className="space-y-1 text-muted-foreground">
            <li><Link to="/login" className="hover:text-foreground">Entrar</Link></li>
            <li><Link to="/signup" className="hover:text-foreground">Criar conta</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border/40">
        <div className="container mx-auto px-4 py-4 text-xs text-muted-foreground flex items-center justify-between">
          <span>© {new Date().getFullYear()} PodErrar. Todos os direitos reservados.</span>
          <span>Feito para quem aprende com os erros.</span>
        </div>
      </div>
    </footer>
  );
}
