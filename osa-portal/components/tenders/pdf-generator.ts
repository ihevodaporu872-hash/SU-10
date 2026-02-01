import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import type { TenderRow } from "@/types/tenders";

export interface PdfReportData {
  fileName: string;
  rows: TenderRow[];
  generatedAt: string;
}

export function generateTenderReport(data: PdfReportData): void {
  const doc = new jsPDF();

  // Заголовок (латиница для базового шрифта)
  doc.setFontSize(18);
  doc.text("Tender Checklist Report", 14, 20);

  doc.setFontSize(10);
  doc.text(`File: ${data.fileName}`, 14, 30);
  doc.text(`Generated: ${data.generatedAt}`, 14, 36);

  // Фильтруем только отмеченные строки
  const checkedRows = data.rows.filter((row) => row.checked);

  // Статистика
  const criticalCount = checkedRows.filter((r) => r.isCritical).length;
  const withComments = checkedRows.filter((r) => r.veComment.trim()).length;
  const totalSum = checkedRows.reduce((sum, r) => sum + r.total, 0);

  doc.setFontSize(12);
  doc.text("Summary:", 14, 48);
  doc.setFontSize(10);
  doc.text(`Total checked items: ${checkedRows.length}`, 14, 56);
  doc.text(`Critical items: ${criticalCount}`, 14, 62);
  doc.text(`Items with VE comments: ${withComments}`, 14, 68);
  doc.text(
    `Total sum: ${totalSum.toLocaleString("ru-RU")} RUB`,
    14,
    74
  );

  // Таблица отмеченных позиций
  if (checkedRows.length > 0) {
    const tableData = checkedRows.map((row) => [
      row.rowNumber.toString(),
      row.workType.substring(0, 25),
      row.description.substring(0, 40),
      row.engineers.join(", "),
      row.isCritical ? "CRITICAL" : "OK",
      row.veComment.substring(0, 30) || "-",
      row.total.toLocaleString("ru-RU"),
    ]);

    autoTable(doc, {
      startY: 82,
      head: [
        ["#", "Work Type", "Description", "Engineers", "Status", "VE Comment", "Sum"],
      ],
      body: tableData,
      styles: {
        fontSize: 8,
        cellPadding: 2,
      },
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: 255,
      },
      columnStyles: {
        0: { cellWidth: 10 },
        1: { cellWidth: 30 },
        2: { cellWidth: 45 },
        3: { cellWidth: 25 },
        4: { cellWidth: 18 },
        5: { cellWidth: 35 },
        6: { cellWidth: 25 },
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245],
      },
      didParseCell: function (data) {
        // Подсветка критических строк
        if (data.section === "body" && data.column.index === 4) {
          if (data.cell.raw === "CRITICAL") {
            data.cell.styles.textColor = [255, 0, 0];
            data.cell.styles.fontStyle = "bold";
          }
        }
      },
    });
  }

  // Value Engineering секция
  const veRows = checkedRows.filter((r) => r.veComment.trim());
  if (veRows.length > 0) {
    const finalY = (doc as jsPDF & { lastAutoTable?: { finalY: number } }).lastAutoTable?.finalY || 100;

    doc.setFontSize(12);
    doc.text("Value Engineering Proposals:", 14, finalY + 15);

    let yPos = finalY + 25;
    doc.setFontSize(9);

    for (const row of veRows) {
      if (yPos > 270) {
        doc.addPage();
        yPos = 20;
      }

      doc.setFont("helvetica", "bold");
      doc.text(`${row.rowNumber}. ${row.workType}`, 14, yPos);
      doc.setFont("helvetica", "normal");
      yPos += 6;
      doc.text(`VE: ${row.veComment}`, 20, yPos, { maxWidth: 170 });
      yPos += 10;
    }
  }

  // Сохраняем
  const timestamp = new Date().toISOString().split("T")[0];
  doc.save(`tender-report-${timestamp}.pdf`);
}
