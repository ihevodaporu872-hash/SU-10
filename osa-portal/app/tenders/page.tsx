"use client";

import { useState, useCallback } from "react";
import {
  FileSpreadsheet,
  Upload,
  FileDown,
  Filter,
  CheckCircle,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { FileUploader } from "@/components/drawings/file-uploader";
import { TenderTable } from "@/components/tenders/tender-table";
import { parseExcelFile } from "@/components/tenders/excel-parser";
import { generateTenderReport } from "@/components/tenders/pdf-generator";
import { sendCriticalNotification } from "@/lib/notifications";
import {
  TenderRow,
  EXAMPLE_TENDER_DATA,
} from "@/types/tenders";
import { cn } from "@/lib/utils";

const ENGINEERS = ["Инженер 1", "Инженер 2", "Инженер 5"];

export default function TendersPage() {
  const [rows, setRows] = useState<TenderRow[]>([]);
  const [fileName, setFileName] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [filterEngineer, setFilterEngineer] = useState<string | null>(null);

  // Загрузка Excel файла
  const handleFileUpload = useCallback(async (file: File) => {
    setLoading(true);
    try {
      const parsed = await parseExcelFile(file);
      setRows(parsed.rows);
      setFileName(parsed.fileName);
    } catch (error) {
      console.error("Ошибка парсинга:", error);
      alert("Ошибка чтения Excel файла");
    } finally {
      setLoading(false);
    }
  }, []);

  // Загрузка демо-данных
  const loadDemoData = useCallback(() => {
    setRows(EXAMPLE_TENDER_DATA);
    setFileName("demo-tender.xlsx");
  }, []);

  // Обновление строки
  const handleRowUpdate = useCallback(
    async (id: string, updates: Partial<TenderRow>) => {
      setRows((prev) =>
        prev.map((row) => {
          if (row.id === id) {
            const updatedRow = { ...row, ...updates };

            // Если статус изменился на критический — отправляем уведомление
            if (updates.isCritical && !row.isCritical) {
              sendCriticalNotification({
                type: "tender",
                workType: row.workType,
                description: row.description,
                engineers: row.engineers,
              });
            }

            return updatedRow;
          }
          return row;
        })
      );
    },
    []
  );

  // Генерация PDF отчёта
  const handleGenerateReport = useCallback(() => {
    const checkedRows = rows.filter((r) => r.checked);
    if (checkedRows.length === 0) {
      alert("Отметьте хотя бы одну позицию для формирования отчёта");
      return;
    }

    generateTenderReport({
      fileName,
      rows,
      generatedAt: new Date().toLocaleString("ru-RU"),
    });
  }, [rows, fileName]);

  // Статистика
  const stats = {
    total: rows.length,
    checked: rows.filter((r) => r.checked).length,
    critical: rows.filter((r) => r.isCritical).length,
    withComments: rows.filter((r) => r.veComment.trim()).length,
    totalSum: rows.reduce((sum, r) => sum + r.total, 0),
    checkedSum: rows
      .filter((r) => r.checked)
      .reduce((sum, r) => sum + r.total, 0),
  };

  return (
    <div className="flex h-[calc(100vh-3rem)] flex-col">
      {/* Заголовок */}
      <div className="mb-4 flex items-center gap-3">
        <FileSpreadsheet className="h-8 w-8" />
        <h1 className="text-3xl font-bold">Тендерный отдел</h1>
      </div>

      {/* Панель загрузки */}
      <div className="mb-4 rounded-lg border border-border bg-card p-4">
        <div className="grid gap-4 md:grid-cols-2">
          {/* Загрузчик Excel */}
          <div>
            <div className="mb-2 flex items-center gap-2">
              <Upload className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">
                Загрузка Excel-файла тендера
              </span>
              {fileName && (
                <span className="text-xs text-muted-foreground">
                  ({fileName})
                </span>
              )}
            </div>
            <FileUploader
              accept=".xlsx,.xls"
              label="Загрузить Excel"
              onFileSelect={handleFileUpload}
              className="h-20"
            />
          </div>

          {/* Действия */}
          <div className="flex flex-col justify-end gap-2">
            <div className="flex gap-2">
              <button
                onClick={loadDemoData}
                className="text-sm text-primary underline hover:no-underline"
              >
                Загрузить демо-данные
              </button>
            </div>

            <Button
              onClick={handleGenerateReport}
              disabled={stats.checked === 0}
              className="w-full"
            >
              <FileDown className="mr-2 h-4 w-4" />
              Сформировать отчёт (PDF)
            </Button>
          </div>
        </div>

        {/* Фильтр по инженерам */}
        {rows.length > 0 && (
          <div className="mt-4 flex flex-wrap items-center gap-4 border-t border-border pt-4">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                Фильтр по инженеру:
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setFilterEngineer(null)}
                className={cn(
                  "rounded-full px-3 py-1 text-sm transition-colors",
                  !filterEngineer
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                )}
              >
                Все
              </button>
              {ENGINEERS.map((eng) => (
                <button
                  key={eng}
                  onClick={() =>
                    setFilterEngineer(filterEngineer === eng ? null : eng)
                  }
                  className={cn(
                    "rounded-full px-3 py-1 text-sm transition-colors",
                    filterEngineer === eng
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  )}
                >
                  {eng}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Статистика */}
        {rows.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-4 border-t border-border pt-4">
            <div className="text-sm">
              <span className="text-muted-foreground">Всего позиций:</span>{" "}
              <span className="font-medium">{stats.total}</span>
            </div>
            <div className="text-sm">
              <CheckCircle className="mr-1 inline h-4 w-4 text-green-500" />
              <span className="text-green-500">Проверено:</span>{" "}
              <span className="font-medium">{stats.checked}</span>
            </div>
            <div className="text-sm">
              <AlertTriangle className="mr-1 inline h-4 w-4 text-red-500" />
              <span className="text-red-500">Критических:</span>{" "}
              <span className="font-medium">{stats.critical}</span>
            </div>
            <div className="text-sm">
              <span className="text-muted-foreground">С VE комментариями:</span>{" "}
              <span className="font-medium">{stats.withComments}</span>
            </div>
            <div className="ml-auto text-sm">
              <span className="text-muted-foreground">Общая сумма:</span>{" "}
              <span className="font-medium">
                {stats.totalSum.toLocaleString("ru-RU")} ₽
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Таблица */}
      <div className="flex-1 overflow-hidden rounded-lg border border-border bg-card">
        {loading ? (
          <div className="flex h-full items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            <span className="ml-2 text-muted-foreground">
              Обработка файла...
            </span>
          </div>
        ) : rows.length > 0 ? (
          <div className="h-full overflow-auto p-4">
            <TenderTable
              rows={rows}
              onRowUpdate={handleRowUpdate}
              filterEngineer={filterEngineer}
            />
          </div>
        ) : (
          <div className="flex h-full flex-col items-center justify-center text-muted-foreground">
            <FileSpreadsheet className="mb-4 h-16 w-16 opacity-50" />
            <p>Загрузите Excel-файл тендера для начала работы</p>
            <p className="mt-2 text-sm">
              или{" "}
              <button
                onClick={loadDemoData}
                className="text-primary underline hover:no-underline"
              >
                загрузите демо-данные
              </button>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
