import logoSrc from "@/assets/logo.png";
import { cn } from "@/lib/utils";

export function Logo({
  className,
  showText = true,
  size = 32,
}: {
  className?: string;
  showText?: boolean;
  size?: number;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <img
        src={logoSrc}
        alt="PodErrar"
        width={size}
        height={size}
        className="object-contain"
        style={{ height: size, width: size }}
      />
      {showText && (
        <span className="font-display font-bold text-lg tracking-tight">
          pod<span className="text-primary">Errar</span>
        </span>
      )}
    </span>
  );
}
