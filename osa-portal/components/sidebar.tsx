"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  FileSearch,
  Database,
  FileSpreadsheet,
  FolderTree,
} from "lucide-react";

const navigation = [
  {
    name: "Рабочий стол",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    name: "Анализ чертежей",
    href: "/drawings",
    icon: FileSearch,
  },
  {
    name: "База знаний",
    href: "/knowledge",
    icon: Database,
  },
  {
    name: "Тендерный отдел",
    href: "/tenders",
    icon: FileSpreadsheet,
  },
  {
    name: "Дерево проекта",
    href: "/project-tree",
    icon: FolderTree,
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-64 flex-col border-r border-sidebar-border bg-sidebar">
      {/* Логотип */}
      <div className="flex h-16 items-center border-b border-sidebar-border px-6">
        <h1 className="text-xl font-bold text-sidebar-foreground">
          OSA Portal
        </h1>
      </div>

      {/* Навигация */}
      <nav className="flex-1 space-y-1 p-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Футер */}
      <div className="border-t border-sidebar-border p-4">
        <p className="text-xs text-sidebar-foreground/50">
          OSA Portal v0.1.0
        </p>
      </div>
    </aside>
  );
}
