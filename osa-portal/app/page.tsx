import { LayoutDashboard } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <LayoutDashboard className="h-8 w-8" />
        <h1 className="text-3xl font-bold">Рабочий стол</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Карточки статистики */}
        <div className="rounded-lg border border-border bg-card p-6">
          <p className="text-sm text-muted-foreground">Активные проекты</p>
          <p className="text-2xl font-bold">12</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-6">
          <p className="text-sm text-muted-foreground">Чертежей на анализе</p>
          <p className="text-2xl font-bold">48</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-6">
          <p className="text-sm text-muted-foreground">Открытые тендеры</p>
          <p className="text-2xl font-bold">7</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-6">
          <p className="text-sm text-muted-foreground">Документов в базе</p>
          <p className="text-2xl font-bold">156</p>
        </div>
      </div>

      <div className="rounded-lg border border-border bg-card p-6">
        <h2 className="mb-4 text-xl font-semibold">Последняя активность</h2>
        <p className="text-muted-foreground">
          Здесь будет отображаться лента последних действий и обновлений.
        </p>
      </div>
    </div>
  );
}
