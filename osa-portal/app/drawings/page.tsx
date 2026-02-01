"use client";

import { useState, useCallback } from "react";
import { FileSearch, FileJson, FileText } from "lucide-react";
import { FileUploader } from "@/components/drawings/file-uploader";
import { PdfViewer } from "@/components/drawings/pdf-viewer";
import { ErrorDetailsPanel } from "@/components/drawings/error-details-panel";
import { EngineerFilter } from "@/components/drawings/engineer-filter";
import {
  ENGINEERS,
  EXAMPLE_JSON,
  type DrawingError,
  type ErrorsReport,
  type ErrorStatus,
  type Engineer,
} from "@/types/drawings";
import { sendCriticalNotification } from "@/lib/notifications";

export default function DrawingsPage() {
  // Состояния файлов
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfFileName, setPdfFileName] = useState<string>("");

  // Состояние ошибок
  const [errors, setErrors] = useState<DrawingError[]>([]);
  const [reportInfo, setReportInfo] = useState<{
    documentName: string;
    analyzedAt: string;
  } | null>(null);

  // Выбранная ошибка
  const [selectedError, setSelectedError] = useState<DrawingError | null>(null);

  // Фильтрация по инженерам
  const [selectedEngineers, setSelectedEngineers] =
    useState<Engineer[]>(ENGINEERS);

  // Обработка загрузки PDF
  const handlePdfUpload = useCallback((file: File) => {
    setPdfFile(file);
    setPdfFileName(file.name);
  }, []);

  // Обработка загрузки JSON
  const handleJsonUpload = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target?.result as string) as ErrorsReport;
        setErrors(json.errors);
        setReportInfo({
          documentName: json.documentName,
          analyzedAt: json.analyzedAt,
        });
      } catch (err) {
        console.error("Ошибка парсинга JSON:", err);
        alert("Ошибка чтения JSON-файла");
      }
    };
    reader.readAsText(file);
  }, []);

  // Загрузка демо-данных
  const loadDemoData = useCallback(() => {
    setErrors(EXAMPLE_JSON.errors);
    setReportInfo({
      documentName: EXAMPLE_JSON.documentName,
      analyzedAt: EXAMPLE_JSON.analyzedAt,
    });
  }, []);

  // Выбор ошибки
  const handleSelectError = useCallback((error: DrawingError) => {
    setSelectedError(error);
  }, []);

  // Изменение статуса ошибки
  const handleStatusChange = useCallback(
    (errorId: string, status: ErrorStatus) => {
      const error = errors.find((e) => e.id === errorId);

      // Отправляем уведомление при подтверждении критической ошибки
      if (error && status === "confirmed" && error.severity === "Критическая") {
        sendCriticalNotification({
          type: "drawing",
          workType: error.workType,
          description: error.description,
          engineers: [error.engineer],
          severity: error.severity,
        });
      }

      setErrors((prev) =>
        prev.map((e) => (e.id === errorId ? { ...e, status } : e))
      );
      setSelectedError((prev) =>
        prev?.id === errorId ? { ...prev, status } : prev
      );
    },
    [errors]
  );

  // Переключение фильтра инженеров
  const handleToggleEngineer = useCallback((engineer: Engineer) => {
    setSelectedEngineers((prev) =>
      prev.includes(engineer)
        ? prev.filter((e) => e !== engineer)
        : [...prev, engineer]
    );
  }, []);

  // Фильтрованные ошибки
  const filteredErrors = errors.filter((e) =>
    selectedEngineers.includes(e.engineer)
  );

  // Статистика
  const stats = {
    total: filteredErrors.length,
    critical: filteredErrors.filter((e) => e.severity === "Критическая").length,
    economic: filteredErrors.filter((e) => e.severity === "Экономическая")
      .length,
    confirmed: filteredErrors.filter((e) => e.status === "confirmed").length,
    rejected: filteredErrors.filter((e) => e.status === "rejected").length,
  };

  return (
    <div className="flex h-[calc(100vh-3rem)] flex-col">
      {/* Заголовок */}
      <div className="mb-4 flex items-center gap-3">
        <FileSearch className="h-8 w-8" />
        <h1 className="text-3xl font-bold">Анализ чертежей</h1>
      </div>

      {/* Панель загрузки и фильтров */}
      <div className="mb-4 rounded-lg border border-border bg-card p-4">
        <div className="mb-4 grid gap-4 md:grid-cols-2">
          {/* Загрузчик PDF */}
          <div>
            <div className="mb-2 flex items-center gap-2">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">PDF-файл чертежа</span>
              {pdfFileName && (
                <span className="text-xs text-muted-foreground">
                  ({pdfFileName})
                </span>
              )}
            </div>
            <FileUploader
              accept=".pdf"
              label="Загрузить PDF"
              onFileSelect={handlePdfUpload}
              className="h-24"
            />
          </div>

          {/* Загрузчик JSON */}
          <div>
            <div className="mb-2 flex items-center gap-2">
              <FileJson className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">JSON с ошибками</span>
              {reportInfo && (
                <span className="text-xs text-muted-foreground">
                  ({reportInfo.documentName})
                </span>
              )}
            </div>
            <FileUploader
              accept=".json"
              label="Загрузить JSON"
              onFileSelect={handleJsonUpload}
              className="h-24"
            />
          </div>
        </div>

        {/* Кнопка демо + фильтр */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              Фильтр по инженерам:
            </span>
            <EngineerFilter
              selectedEngineers={selectedEngineers}
              onToggle={handleToggleEngineer}
            />
          </div>

          <button
            onClick={loadDemoData}
            className="text-sm text-primary underline hover:no-underline"
          >
            Загрузить демо-данные
          </button>
        </div>

        {/* Статистика */}
        {errors.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-4 border-t border-border pt-4">
            <div className="text-sm">
              <span className="text-muted-foreground">Всего:</span>{" "}
              <span className="font-medium">{stats.total}</span>
            </div>
            <div className="text-sm">
              <span className="text-red-500">Критических:</span>{" "}
              <span className="font-medium">{stats.critical}</span>
            </div>
            <div className="text-sm">
              <span className="text-yellow-500">Экономических:</span>{" "}
              <span className="font-medium">{stats.economic}</span>
            </div>
            <div className="text-sm">
              <span className="text-green-500">Подтверждено:</span>{" "}
              <span className="font-medium">{stats.confirmed}</span>
            </div>
            <div className="text-sm">
              <span className="text-muted-foreground">Отклонено:</span>{" "}
              <span className="font-medium">{stats.rejected}</span>
            </div>
          </div>
        )}
      </div>

      {/* Основная область: PDF + панель деталей */}
      <div className="flex flex-1 gap-0 overflow-hidden rounded-lg border border-border">
        {/* PDF Viewer */}
        <div className="flex-1">
          <PdfViewer
            file={pdfFile}
            errors={filteredErrors}
            selectedErrorId={selectedError?.id ?? null}
            onSelectError={handleSelectError}
          />
        </div>

        {/* Панель деталей */}
        {selectedError && (
          <ErrorDetailsPanel
            error={selectedError}
            onClose={() => setSelectedError(null)}
            onStatusChange={handleStatusChange}
          />
        )}
      </div>
    </div>
  );
}
