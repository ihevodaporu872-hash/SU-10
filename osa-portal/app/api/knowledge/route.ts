import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

interface MarkdownDocument {
  id: string;
  name: string;
  path: string;
  content: string;
  folder: string;
}

function readMarkdownFilesRecursively(
  dir: string,
  baseDir: string = dir
): MarkdownDocument[] {
  const documents: MarkdownDocument[] = [];

  if (!fs.existsSync(dir)) {
    return documents;
  }

  const items = fs.readdirSync(dir, { withFileTypes: true });

  for (const item of items) {
    const fullPath = path.join(dir, item.name);

    if (item.isDirectory()) {
      // Рекурсивно читаем подпапки
      documents.push(...readMarkdownFilesRecursively(fullPath, baseDir));
    } else if (item.name.endsWith(".md")) {
      // Читаем .md файл
      const content = fs.readFileSync(fullPath, "utf-8");
      const relativePath = path.relative(baseDir, fullPath);
      const folder = path.dirname(relativePath);

      documents.push({
        id: relativePath.replace(/[\\\/]/g, "-").replace(".md", ""),
        name: item.name.replace(".md", ""),
        path: relativePath,
        content,
        folder: folder === "." ? "Корень" : folder,
      });
    }
  }

  return documents;
}

export async function GET() {
  try {
    const dataSourcePath = path.join(process.cwd(), "data-source", "projects-md");
    const documents = readMarkdownFilesRecursively(dataSourcePath);

    return NextResponse.json({
      success: true,
      documents,
      count: documents.length,
    });
  } catch (error) {
    console.error("Ошибка чтения файлов:", error);
    return NextResponse.json(
      { success: false, error: "Ошибка чтения файлов" },
      { status: 500 }
    );
  }
}
