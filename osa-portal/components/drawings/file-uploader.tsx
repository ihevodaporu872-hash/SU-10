"use client";

import { useCallback } from "react";
import { Upload } from "lucide-react";
import { cn } from "@/lib/utils";

interface FileUploaderProps {
  accept: string;
  label: string;
  onFileSelect: (file: File) => void;
  className?: string;
}

export function FileUploader({
  accept,
  label,
  onFileSelect,
  className,
}: FileUploaderProps) {
  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (file) {
        onFileSelect(file);
      }
    },
    [onFileSelect]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        onFileSelect(file);
      }
    },
    [onFileSelect]
  );

  return (
    <div
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      className={cn(
        "relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border p-6 transition-colors hover:border-primary/50 hover:bg-accent/50",
        className
      )}
    >
      <Upload className="mb-2 h-8 w-8 text-muted-foreground" />
      <p className="mb-1 text-sm font-medium">{label}</p>
      <p className="text-xs text-muted-foreground">
        Перетащите файл или нажмите для выбора
      </p>
      <input
        type="file"
        accept={accept}
        onChange={handleChange}
        className="absolute inset-0 cursor-pointer opacity-0"
      />
    </div>
  );
}
