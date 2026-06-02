import { useState } from "react";
import { Play } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { Episode } from "@/data/modules";

type Props = { episode: Episode; index: number };

export function EpisodeCard({ episode, index }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          type="button"
          className="group relative block w-full overflow-hidden rounded-lg border border-border/50 bg-secondary/40 text-left transition hover:border-primary/50 hover:shadow-glow"
        >
          <div className="relative aspect-video w-full overflow-hidden">
            <img
              src={episode.thumb}
              alt={episode.title}
              loading="lazy"
              width={1280}
              height={736}
              className="h-full w-full object-cover transition group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/30 to-transparent" />
            <div className="absolute inset-0 flex items-center justify-center opacity-80 transition group-hover:opacity-100">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-glow">
                <Play className="h-5 w-5 fill-current" />
              </div>
            </div>
            <span className="absolute top-2 left-2 rounded bg-background/80 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary">
              EP {index + 1}
            </span>
            <span className="absolute bottom-2 right-2 rounded bg-background/80 px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
              {episode.durationLabel}
            </span>
          </div>
          <div className="p-3">
            <h4 className="text-sm font-semibold leading-tight line-clamp-2">{episode.title}</h4>
          </div>
        </button>
      </DialogTrigger>

      <DialogContent className="max-w-3xl p-0 overflow-hidden bg-background">
        <DialogHeader className="px-5 pt-4 pb-2">
          <DialogTitle className="text-base">{episode.title}</DialogTitle>
        </DialogHeader>
        <div className="aspect-video w-full bg-black">
          {open && (
            <iframe
              src={`${episode.videoUrl}?autoplay=1&rel=0`}
              title={episode.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="h-full w-full"
            />
          )}
        </div>
        <p className="px-5 py-3 text-xs text-muted-foreground">
          Conteúdo curado externo (YouTube). Em breve substituído por episódios próprios da PodErrar.
        </p>
      </DialogContent>
    </Dialog>
  );
}
