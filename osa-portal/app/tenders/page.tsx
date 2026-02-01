import { FileSpreadsheet } from "lucide-react";

export default function TendersPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <FileSpreadsheet className="h-8 w-8" />
        <h1 className="text-3xl font-bold">Тендерный отдел</h1>
      </div>

      <div className="rounded-lg border border-border bg-card p-6">
        <h2 className="mb-4 text-xl font-semibold">Активные тендеры</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="pb-3 font-medium text-muted-foreground">Номер</th>
                <th className="pb-3 font-medium text-muted-foreground">Название</th>
                <th className="pb-3 font-medium text-muted-foreground">Статус</th>
                <th className="pb-3 font-medium text-muted-foreground">Дедлайн</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-border">
                <td className="py-3">T-2024-001</td>
                <td className="py-3">Поставка оборудования</td>
                <td className="py-3">
                  <span className="rounded-full bg-yellow-500/20 px-2 py-1 text-xs text-yellow-500">
                    В работе
                  </span>
                </td>
                <td className="py-3">15.02.2024</td>
              </tr>
              <tr className="border-b border-border">
                <td className="py-3">T-2024-002</td>
                <td className="py-3">Монтажные работы</td>
                <td className="py-3">
                  <span className="rounded-full bg-green-500/20 px-2 py-1 text-xs text-green-500">
                    Подготовлен
                  </span>
                </td>
                <td className="py-3">20.02.2024</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="rounded-lg border border-border bg-card p-6">
        <h2 className="mb-4 text-xl font-semibold">Чек-листы</h2>
        <p className="text-muted-foreground">
          Здесь будут отображаться тендерные чек-листы из папки /data-source/checklists
        </p>
      </div>
    </div>
  );
}
