"use client";

import { useState, useCallback } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from "lucide-react";
import { ErrorMarker } from "./error-marker";
import { Button } from "@/components/ui/button";
import type { DrawingError } from "@/types/drawings";

import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

// Настройка worker для PDF.js
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

interface PdfViewerProps {
  file: File | null;
  errors: DrawingError[];
  selectedErrorId: string | null;
  onSelectError: (error: DrawingError) => void;
}

export function PdfViewer({
  file,
  errors,
  selectedErrorId,
  onSelectError,
}: PdfViewerProps) {
  const [numPages, setNumPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [scale, setScale] = useState<number>(1);

  const onDocumentLoadSuccess = useCallback(
    ({ numPages }: { numPages: number }) => {
      setNumPages(numPages);
      setCurrentPage(1);
    },
    []
  );

  const pageErrors = errors.filter((e) => e.page === currentPage);

  if (!file) {
    return (
      <div className="flex h-full items-center justify-center rounded-lg border border-dashed border-border bg-card">
        <p className="text-muted-foreground">Загрузите PDF-файл для просмотра</p>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col rounded-lg border border-border bg-card">
      {/* Панель управления */}
      <div className="flex items-center justify-between border-b border-border px-4 py-2">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage <= 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm">
            {currentPage} / {numPages}
          </span>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentPage((p) => Math.min(numPages, p + 1))}
            disabled={currentPage >= numPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setScale((s) => Math.max(0.5, s - 0.25))}
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <span className="text-sm">{Math.round(scale * 100)}%</span>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setScale((s) => Math.min(2, s + 0.25))}
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* PDF с маркерами */}
      <div className="flex-1 overflow-auto p-4">
        <div className="relative inline-block">
          <Document file={file} onLoadSuccess={onDocumentLoadSuccess}>
            <Page pageNumber={currentPage} scale={scale} />
          </Document>

          {/* Маркеры ошибок */}
          <div className="absolute inset-0">
            {pageErrors.map((error) => (
              <ErrorMarker
                key={error.id}
                error={error}
                isSelected={error.id === selectedErrorId}
                onClick={() => onSelectError(error)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
