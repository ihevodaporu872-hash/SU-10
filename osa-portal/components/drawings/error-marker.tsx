"use client";

import { cn } from "@/lib/utils";
import type { DrawingError } from "@/types/drawings";

interface ErrorMarkerProps {
  error: DrawingError;
  isSelected: boolean;
  onClick: () => void;
}

export function ErrorMarker({ error, isSelected, onClick }: ErrorMarkerProps) {
  const isCritical = error.severity === "Критическая";

  return (
    <button
      onClick={onClick}
      className={cn(
        "absolute z-10 flex h-6 w-6 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 text-xs font-bold transition-all hover:scale-125",
        isCritical
          ? "border-red-500 bg-red-500/80 text-white"
          : "border-yellow-500 bg-yellow-500/80 text-black",
        isSelected && "scale-125 ring-2 ring-white",
        error.status === "confirmed" && "opacity-50",
        error.status === "rejected" && "opacity-30 line-through"
      )}
      style={{
        left: `${error.x}%`,
        top: `${error.y}%`,
      }}
      title={error.description}
    >
      {isCritical ? "!" : "?"}
    </button>
  );
}
