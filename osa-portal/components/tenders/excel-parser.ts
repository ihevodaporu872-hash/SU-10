import * as XLSX from "xlsx";
import { TenderRow, getEngineersForWorkType } from "@/types/tenders";

export interface ParsedExcelData {
  fileName: string;
  rows: TenderRow[];
  totalSum: number;
}

export function parseExcelFile(file: File): Promise<ParsedExcelData> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: "binary" });

        // Берём первый лист
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        // Преобразуем в JSON
        const jsonData = XLSX.utils.sheet_to_json(worksheet, {
          header: 1,
          defval: "",
        }) as unknown[][];

        // Ищем заголовки (пропускаем пустые строки)
        let headerRowIndex = 0;
        for (let i = 0; i < Math.min(10, jsonData.length); i++) {
          const row = jsonData[i];
          if (row && row.length > 3) {
            const rowStr = row.join(" ").toLowerCase();
            if (
              rowStr.includes("наименование") ||
              rowStr.includes("вид работ") ||
              rowStr.includes("описание") ||
              rowStr.includes("ед.") ||
              rowStr.includes("кол-во")
            ) {
              headerRowIndex = i;
              break;
            }
          }
        }

        // Парсим строки данных
        const rows: TenderRow[] = [];
        let totalSum = 0;

        for (let i = headerRowIndex + 1; i < jsonData.length; i++) {
          const row = jsonData[i];

          if (!row || row.length < 3) continue;

          // Пробуем определить структуру строки
          // Типичные колонки: №, Наименование/Вид работ, Описание, Ед.изм., Кол-во, Цена, Сумма
          const workType = String(row[1] || row[0] || "").trim();
          const description = String(row[2] || row[1] || "").trim();

          if (!workType && !description) continue;

          // Ищем числовые значения
          const numericValues: number[] = [];
          for (const cell of row) {
            const num = parseFloat(String(cell).replace(/\s/g, "").replace(",", "."));
            if (!isNaN(num) && num > 0) {
              numericValues.push(num);
            }
          }

          const unit = String(row[3] || "шт.").trim();
          const quantity = numericValues[0] || 1;
          const price = numericValues[1] || 0;
          const total = numericValues[2] || quantity * price;

          if (total > 0) {
            totalSum += total;
          }

          const engineers = getEngineersForWorkType(workType || description);

          rows.push({
            id: `row-${i}`,
            rowNumber: rows.length + 1,
            workType: workType || "Прочие работы",
            description: description || workType,
            unit,
            quantity,
            price,
            total,
            engineers,
            checked: false,
            isCritical: false,
            veComment: "",
          });
        }

        resolve({
          fileName: file.name,
          rows,
          totalSum,
        });
      } catch (error) {
        reject(new Error("Ошибка парсинга Excel файла"));
      }
    };

    reader.onerror = () => {
      reject(new Error("Ошибка чтения файла"));
    };

    reader.readAsBinaryString(file);
  });
}
