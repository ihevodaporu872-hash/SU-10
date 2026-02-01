import { FolderTree, Folder, File, ChevronRight } from "lucide-react";

export default function ProjectTreePage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <FolderTree className="h-8 w-8" />
        <h1 className="text-3xl font-bold">Дерево проекта</h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Дерево файлов */}
        <div className="lg:col-span-1">
          <div className="rounded-lg border border-border bg-card p-4">
            <h2 className="mb-4 text-lg font-semibold">Структура</h2>
            <div className="space-y-1">
              <TreeItem icon={Folder} name="Проект Alpha" isFolder expanded>
                <TreeItem icon={Folder} name="Документация" isFolder>
                  <TreeItem icon={File} name="ТЗ.docx" />
                  <TreeItem icon={File} name="Спецификация.xlsx" />
                </TreeItem>
                <TreeItem icon={Folder} name="Чертежи" isFolder>
                  <TreeItem icon={File} name="План_этаж_1.dwg" />
                  <TreeItem icon={File} name="Фасад.dwg" />
                </TreeItem>
              </TreeItem>
            </div>
          </div>
        </div>

        {/* Детали */}
        <div className="lg:col-span-2">
          <div className="rounded-lg border border-border bg-card p-6">
            <h2 className="mb-4 text-xl font-semibold">Детали проекта</h2>
            <p className="text-muted-foreground">
              Выберите элемент в дереве для просмотра деталей.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function TreeItem({
  icon: Icon,
  name,
  isFolder = false,
  expanded = false,
  children,
}: {
  icon: typeof Folder;
  name: string;
  isFolder?: boolean;
  expanded?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex cursor-pointer items-center gap-2 rounded px-2 py-1 hover:bg-accent">
        {isFolder && (
          <ChevronRight
            className={`h-4 w-4 transition-transform ${expanded ? "rotate-90" : ""}`}
          />
        )}
        {!isFolder && <span className="w-4" />}
        <Icon className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm">{name}</span>
      </div>
      {children && expanded && <div className="ml-4">{children}</div>}
    </div>
  );
}
