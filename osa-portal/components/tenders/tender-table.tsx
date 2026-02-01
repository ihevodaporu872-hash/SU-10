"use client";

import { useState, Fragment } from "react";
import {
  Check,
  AlertTriangle,
  MessageSquare,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { TenderRow } from "@/types/tenders";

interface TenderTableProps {
  rows: TenderRow[];
  onRowUpdate: (id: string, updates: Partial<TenderRow>) => void;
  filterEngineer: string | null;
}

export function TenderTable({
  rows,
  onRowUpdate,
  filterEngineer,
}: TenderTableProps) {
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  // Фильтрация по инженеру
  const filteredRows = filterEngineer
    ? rows.filter((row) => row.engineers.includes(filterEngineer))
    : rows;

  const formatNumber = (num: number) => {
    return num.toLocaleString("ru-RU");
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border text-left text-sm">
            <th className="w-10 pb-3 pl-2">
              <Check className="h-4 w-4 text-muted-foreground" />
            </th>
            <th className="w-10 pb-3 text-center">#</th>
            <th className="pb-3">Вид работ</th>
            <th className="pb-3">Описание</th>
            <th className="w-16 pb-3 text-center">Ед.</th>
            <th className="w-20 pb-3 text-right">Кол-во</th>
            <th className="w-24 pb-3 text-right">Цена</th>
            <th className="w-28 pb-3 text-right">Сумма</th>
            <th className="w-32 pb-3">Инженеры</th>
            <th className="w-10 pb-3"></th>
          </tr>
        </thead>
        <tbody>
          {filteredRows.map((row) => (
            <Fragment key={row.id}>
              <tr
                className={cn(
                  "border-b border-border/50 transition-colors",
                  row.checked && "bg-green-500/10",
                  row.isCritical && "bg-red-500/10"
                )}
              >
                {/* Чекбокс */}
                <td className="py-3 pl-2">
                  <input
                    type="checkbox"
                    checked={row.checked}
                    onChange={(e) =>
                      onRowUpdate(row.id, { checked: e.target.checked })
                    }
                    className="h-4 w-4 rounded border-border bg-background"
                  />
                </td>

                {/* Номер */}
                <td className="py-3 text-center text-sm text-muted-foreground">
                  {row.rowNumber}
                </td>

                {/* Вид работ */}
                <td className="py-3">
                  <div className="flex items-center gap-2">
                    {row.isCritical && (
                      <AlertTriangle className="h-4 w-4 text-red-500" />
                    )}
                    <span className="text-sm font-medium">{row.workType}</span>
                  </div>
                </td>

                {/* Описание */}
                <td className="max-w-xs py-3">
                  <span className="line-clamp-2 text-sm text-muted-foreground">
                    {row.description}
                  </span>
                </td>

                {/* Ед. изм */}
                <td className="py-3 text-center text-sm">{row.unit}</td>

                {/* Количество */}
                <td className="py-3 text-right text-sm">
                  {formatNumber(row.quantity)}
                </td>

                {/* Цена */}
                <td className="py-3 text-right text-sm">
                  {formatNumber(row.price)}
                </td>

                {/* Сумма */}
                <td className="py-3 text-right text-sm font-medium">
                  {formatNumber(row.total)}
                </td>

                {/* Инженеры */}
                <td className="py-3">
                  <div className="flex flex-wrap gap-1">
                    {row.engineers.map((eng) => (
                      <span
                        key={eng}
                        className="rounded bg-primary/20 px-1.5 py-0.5 text-xs text-primary"
                      >
                        {eng}
                      </span>
                    ))}
                  </div>
                </td>

                {/* Раскрыть */}
                <td className="py-3">
                  <button
                    onClick={() =>
                      setExpandedRow(expandedRow === row.id ? null : row.id)
                    }
                    className="rounded p-1 hover:bg-accent"
                  >
                    {expandedRow === row.id ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </button>
                </td>
              </tr>

              {/* Расширенная строка */}
              {expandedRow === row.id && (
                <tr className="border-b border-border bg-muted/30">
                  <td colSpan={10} className="p-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      {/* Критическая отметка */}
                      <div>
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={row.isCritical}
                            onChange={(e) =>
                              onRowUpdate(row.id, { isCritical: e.target.checked })
                            }
                            className="h-4 w-4 rounded border-red-500 bg-background"
                          />
                          <AlertTriangle className="h-4 w-4 text-red-500" />
                          <span className="text-sm font-medium text-red-500">
                            Критическая позиция
                          </span>
                        </label>
                      </div>

                      {/* VE комментарий */}
                      <div className="md:col-span-2">
                        <label className="mb-2 flex items-center gap-2 text-sm font-medium">
                          <MessageSquare className="h-4 w-4" />
                          Value Engineering предложение
                        </label>
                        <textarea
                          value={row.veComment}
                          onChange={(e) =>
                            onRowUpdate(row.id, { veComment: e.target.value })
                          }
                          placeholder="Введите предложение по оптимизации..."
                          className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                          rows={2}
                        />
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </Fragment>
          ))}
        </tbody>
      </table>

      {filteredRows.length === 0 && (
        <div className="py-8 text-center text-muted-foreground">
          Нет данных для отображения
        </div>
      )}
    </div>
  );
}
