"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  Database,
  Search,
  FileText,
  Folder,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface MarkdownDocument {
  id: string;
  name: string;
  path: string;
  content: string;
  folder: string;
}

interface GroupedDocuments {
  [folder: string]: MarkdownDocument[];
}

export default function KnowledgePage() {
  const [documents, setDocuments] = useState<MarkdownDocument[]>([]);
  const [selectedDoc, setSelectedDoc] = useState<MarkdownDocument | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Загрузка документов
  useEffect(() => {
    async function fetchDocuments() {
      try {
        const response = await fetch("/api/knowledge");
        const data = await response.json();

        if (data.success) {
          setDocuments(data.documents);
          if (data.documents.length > 0) {
            setSelectedDoc(data.documents[0]);
          }
        } else {
          setError(data.error || "Ошибка загрузки");
        }
      } catch (err) {
        setError("Не удалось загрузить документы");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchDocuments();
  }, []);

  // Фильтрация по поисковому запросу
  const filteredDocuments = useMemo(() => {
    if (!searchQuery.trim()) {
      return documents;
    }

    const query = searchQuery.toLowerCase();
    return documents.filter(
      (doc) =>
        doc.name.toLowerCase().includes(query) ||
        doc.content.toLowerCase().includes(query)
    );
  }, [documents, searchQuery]);

  // Группировка по папкам
  const groupedDocuments = useMemo(() => {
    const grouped: GroupedDocuments = {};

    for (const doc of filteredDocuments) {
      if (!grouped[doc.folder]) {
        grouped[doc.folder] = [];
      }
      grouped[doc.folder].push(doc);
    }

    return grouped;
  }, [filteredDocuments]);

  // Подсветка найденного текста
  const highlightMatches = useCallback(
    (text: string) => {
      if (!searchQuery.trim()) return text;

      const regex = new RegExp(`(${searchQuery})`, "gi");
      return text.replace(
        regex,
        '<mark class="bg-yellow-500/30 text-yellow-200">$1</mark>'
      );
    },
    [searchQuery]
  );

  // Количество совпадений в документе
  const getMatchCount = useCallback(
    (doc: MarkdownDocument) => {
      if (!searchQuery.trim()) return 0;

      const regex = new RegExp(searchQuery, "gi");
      const matches = doc.content.match(regex);
      return matches ? matches.length : 0;
    },
    [searchQuery]
  );

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-3rem)] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <span className="ml-2 text-muted-foreground">Загрузка документов...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-[calc(100vh-3rem)] items-center justify-center">
        <AlertCircle className="h-8 w-8 text-red-500" />
        <span className="ml-2 text-red-500">{error}</span>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-3rem)] flex-col">
      {/* Заголовок */}
      <div className="mb-4 flex items-center gap-3">
        <Database className="h-8 w-8" />
        <h1 className="text-3xl font-bold">База знаний</h1>
        <span className="text-sm text-muted-foreground">
          ({documents.length} документов)
        </span>
      </div>

      {/* Поиск */}
      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Поиск по всем документам..."
            className="w-full rounded-lg border border-input bg-background py-2 pl-10 pr-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        {searchQuery && (
          <p className="mt-2 text-sm text-muted-foreground">
            Найдено документов: {filteredDocuments.length}
          </p>
        )}
      </div>

      {/* Основной контент */}
      <div className="flex flex-1 gap-4 overflow-hidden">
        {/* Левая панель — список документов */}
        <aside className="w-72 flex-shrink-0 overflow-auto rounded-lg border border-border bg-card">
          <div className="p-4">
            <h2 className="mb-3 text-sm font-semibold text-muted-foreground">
              Проекты и документы
            </h2>

            {Object.keys(groupedDocuments).length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Документы не найдены
              </p>
            ) : (
              <nav className="space-y-4">
                {Object.entries(groupedDocuments).map(([folder, docs]) => (
                  <div key={folder}>
                    <div className="mb-2 flex items-center gap-2 text-sm font-medium text-muted-foreground">
                      <Folder className="h-4 w-4" />
                      {folder}
                    </div>
                    <ul className="space-y-1 pl-6">
                      {docs.map((doc) => {
                        const matchCount = getMatchCount(doc);
                        return (
                          <li key={doc.id}>
                            <button
                              onClick={() => setSelectedDoc(doc)}
                              className={cn(
                                "flex w-full items-center gap-2 rounded px-2 py-1.5 text-left text-sm transition-colors",
                                selectedDoc?.id === doc.id
                                  ? "bg-primary text-primary-foreground"
                                  : "hover:bg-accent"
                              )}
                            >
                              <FileText className="h-4 w-4 flex-shrink-0" />
                              <span className="truncate">{doc.name}</span>
                              {matchCount > 0 && (
                                <span className="ml-auto rounded bg-yellow-500/20 px-1.5 py-0.5 text-xs text-yellow-500">
                                  {matchCount}
                                </span>
                              )}
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ))}
              </nav>
            )}
          </div>
        </aside>

        {/* Правая панель — просмотр документа */}
        <main className="flex-1 overflow-auto rounded-lg border border-border bg-card p-6">
          {selectedDoc ? (
            <article className="prose prose-invert max-w-none prose-headings:text-foreground prose-p:text-foreground/90 prose-strong:text-foreground prose-code:text-primary prose-pre:bg-muted prose-pre:text-foreground prose-li:text-foreground/90 prose-table:text-foreground/90 prose-th:text-foreground prose-td:text-foreground/80">
              <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
                <span>{selectedDoc.folder}</span>
                <span>/</span>
                <span>{selectedDoc.name}.md</span>
              </div>

              {searchQuery ? (
                <div
                  dangerouslySetInnerHTML={{
                    __html: highlightMatches(selectedDoc.content),
                  }}
                  className="whitespace-pre-wrap"
                />
              ) : (
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {selectedDoc.content}
                </ReactMarkdown>
              )}
            </article>
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground">
              Выберите документ для просмотра
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
