"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Maximize } from "lucide-react";
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
  const [scale, setScale] = useState<number>(0.5);
  const [pageSize, setPageSize] = useState<{ width: number; height: number } | null>(null);

  // Для перетаскивания
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [scrollStart, setScrollStart] = useState({ x: 0, y: 0 });

  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Подгонка под размер контейнера
  const fitToContainer = useCallback(() => {
    if (!containerRef.current || !pageSize) return;

    const container = containerRef.current;
    const containerWidth = container.clientWidth - 32; // padding
    const containerHeight = container.clientHeight - 32;

    const scaleX = containerWidth / pageSize.width;
    const scaleY = containerHeight / pageSize.height;
    const fitScale = Math.min(scaleX, scaleY, 1);

    setScale(Math.max(0.1, fitScale));
  }, [pageSize]);

  const onDocumentLoadSuccess = useCallback(
    ({ numPages }: { numPages: number }) => {
      setNumPages(numPages);
      setCurrentPage(1);
    },
    []
  );

  const onPageLoadSuccess = useCallback(
    ({ width, height }: { width: number; height: number }) => {
      setPageSize({ width, height });
    },
    []
  );

  // Авто-подгонка при первой загрузке страницы
  useEffect(() => {
    if (pageSize && containerRef.current) {
      fitToContainer();
    }
  }, [pageSize, fitToContainer]);

  // Ctrl + колесо мыши для зума
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      if (e.ctrlKey) {
        e.preventDefault();
        const delta = e.deltaY > 0 ? -0.1 : 0.1;
        setScale((s) => Math.min(3, Math.max(0.1, s + delta)));
      }
    };

    container.addEventListener("wheel", handleWheel, { passive: false });
    return () => container.removeEventListener("wheel", handleWheel);
  }, []);

  // ПКМ для перетаскивания
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button === 2) { // ПКМ
      e.preventDefault();
      setIsDragging(true);
      setDragStart({ x: e.clientX, y: e.clientY });
      if (containerRef.current) {
        setScrollStart({
          x: containerRef.current.scrollLeft,
          y: containerRef.current.scrollTop,
        });
      }
    }
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging || !containerRef.current) return;

    const dx = e.clientX - dragStart.x;
    const dy = e.clientY - dragStart.y;

    containerRef.current.scrollLeft = scrollStart.x - dx;
    containerRef.current.scrollTop = scrollStart.y - dy;
  }, [isDragging, dragStart, scrollStart]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Отключаем контекстное меню на ПКМ
  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
  }, []);

  const pageErrors = errors.filter((e) => e.page === currentPage);

  if (!file) {
    return (
      <div className="flex h-full items-center justify-center rounded-lg border border-dashed border-border bg-card">
        <p className="text-muted-foreground">Загрузите PDF-файл для просмотра</p>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col overflow-hidden bg-card">
      {/* Панель управления */}
      <div className="flex flex-shrink-0 items-center justify-between border-b border-border px-4 py-2">
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
            onClick={() => setScale((s) => Math.max(0.1, s - 0.1))}
            title="Уменьшить"
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <span className="min-w-[50px] text-center text-sm">{Math.round(scale * 100)}%</span>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setScale((s) => Math.min(3, s + 0.1))}
            title="Увеличить"
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={fitToContainer}
            title="Вписать в окно"
          >
            <Maximize className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Подсказка */}
      <div className="flex-shrink-0 border-b border-border bg-muted/30 px-4 py-1 text-xs text-muted-foreground">
        Ctrl + колесо мыши — масштаб | ПКМ + перетаскивание — перемещение
      </div>

      {/* PDF с маркерами */}
      <div
        ref={containerRef}
        className="flex-1 overflow-auto p-4"
        style={{ cursor: isDragging ? "grabbing" : "default" }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onContextMenu={handleContextMenu}
      >
        <div ref={contentRef} className="relative inline-block">
          <Document file={file} onLoadSuccess={onDocumentLoadSuccess}>
            <Page
              pageNumber={currentPage}
              scale={scale}
              onLoadSuccess={onPageLoadSuccess}
            />
          </Document>

          {/* Маркеры ошибок */}
          <div className="pointer-events-none absolute inset-0">
            {pageErrors.map((error) => (
              <div key={error.id} className="pointer-events-auto">
                <ErrorMarker
                  error={error}
                  isSelected={error.id === selectedErrorId}
                  onClick={() => onSelectError(error)}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
