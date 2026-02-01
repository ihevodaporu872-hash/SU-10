"use client";

import { cn } from "@/lib/utils";
import { ENGINEERS, type Engineer } from "@/types/drawings";

interface EngineerFilterProps {
  selectedEngineers: Engineer[];
  onToggle: (engineer: Engineer) => void;
}

export function EngineerFilter({
  selectedEngineers,
  onToggle,
}: EngineerFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {ENGINEERS.map((engineer) => {
        const isSelected = selectedEngineers.includes(engineer);
        return (
          <button
            key={engineer}
            onClick={() => onToggle(engineer)}
            className={cn(
              "rounded-full px-3 py-1 text-sm transition-colors",
              isSelected
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            )}
          >
            {engineer}
          </button>
        );
      })}
    </div>
  );
}
