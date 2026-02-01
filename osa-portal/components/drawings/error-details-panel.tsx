"use client";

import { X, AlertTriangle, DollarSign, Check, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { DrawingError, ErrorStatus } from "@/types/drawings";

interface ErrorDetailsPanelProps {
  error: DrawingError | null;
  onClose: () => void;
  onStatusChange: (errorId: string, status: ErrorStatus) => void;
}

export function ErrorDetailsPanel({
  error,
  onClose,
  onStatusChange,
}: ErrorDetailsPanelProps) {
  if (!error) {
    return null;
  }

  const isCritical = error.severity === "Критическая";

  return (
    <div className="flex h-full w-80 flex-col border-l border-border bg-card">
      {/* Заголовок */}
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <h3 className="font-semibold">Детали ошибки</h3>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Содержимое */}
      <div className="flex-1 overflow-auto p-4">
        {/* Тип ошибки */}
        <div
          className={cn(
            "mb-4 flex items-center gap-2 rounded-lg p-3",
            isCritical ? "bg-red-500/20" : "bg-yellow-500/20"
          )}
        >
          {isCritical ? (
            <AlertTriangle className="h-5 w-5 text-red-500" />
          ) : (
            <DollarSign className="h-5 w-5 text-yellow-500" />
          )}
          <span
            className={cn(
              "font-medium",
              isCritical ? "text-red-500" : "text-yellow-500"
            )}
          >
            {error.severity}
          </span>
        </div>

        {/* Описание */}
        <div className="mb-4">
          <p className="mb-1 text-xs text-muted-foreground">Описание</p>
          <p className="text-sm">{error.description}</p>
        </div>

        {/* Вид работ */}
        <div className="mb-4">
          <p className="mb-1 text-xs text-muted-foreground">Вид работ</p>
          <p className="text-sm">{error.workType}</p>
        </div>

        {/* Ответственный */}
        <div className="mb-4">
          <p className="mb-1 text-xs text-muted-foreground">Ответственный</p>
          <p className="text-sm">{error.engineer}</p>
        </div>

        {/* Координаты */}
        <div className="mb-4">
          <p className="mb-1 text-xs text-muted-foreground">Позиция</p>
          <p className="text-sm">
            Страница {error.page}, X: {error.x}%, Y: {error.y}%
          </p>
        </div>

        {/* Текущий статус */}
        <div className="mb-6">
          <p className="mb-1 text-xs text-muted-foreground">Статус</p>
          <span
            className={cn(
              "inline-block rounded-full px-2 py-1 text-xs font-medium",
              error.status === "pending" && "bg-muted text-muted-foreground",
              error.status === "confirmed" && "bg-green-500/20 text-green-500",
              error.status === "rejected" && "bg-red-500/20 text-red-500"
            )}
          >
            {error.status === "pending" && "Ожидает проверки"}
            {error.status === "confirmed" && "Подтверждено"}
            {error.status === "rejected" && "Отклонено"}
          </span>
        </div>
      </div>

      {/* Кнопки действий */}
      <div className="border-t border-border p-4">
        <div className="flex gap-2">
          <Button
            variant={error.status === "confirmed" ? "default" : "outline"}
            className="flex-1"
            onClick={() => onStatusChange(error.id, "confirmed")}
          >
            <Check className="mr-2 h-4 w-4" />
            Подтвердить
          </Button>
          <Button
            variant={error.status === "rejected" ? "destructive" : "outline"}
            className="flex-1"
            onClick={() => onStatusChange(error.id, "rejected")}
          >
            <XCircle className="mr-2 h-4 w-4" />
            Отклонить
          </Button>
        </div>
      </div>
    </div>
  );
}
