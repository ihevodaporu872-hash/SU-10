// Типы ошибок
export type ErrorSeverity = "Критическая" | "Экономическая";

// Статус проверки ошибки
export type ErrorStatus = "pending" | "confirmed" | "rejected";

// Виды работ и ответственные инженеры
export const WORK_TYPES = {
  "Архитектура": "Инженер 1",
  "Конструктив": "Инженер 1",
  "Электрика": "Инженер 2",
  "Вентиляция": "Инженер 2",
  "Водоснабжение": "Инженер 5",
  "Канализация": "Инженер 5",
  "Отопление": "Инженер 5",
} as const;

export type WorkType = keyof typeof WORK_TYPES;
export type Engineer = (typeof WORK_TYPES)[WorkType];

// Список инженеров
export const ENGINEERS: Engineer[] = ["Инженер 1", "Инженер 2", "Инженер 5"];

// Ошибка на чертеже
export interface DrawingError {
  id: string;
  x: number; // координата X в процентах (0-100)
  y: number; // координата Y в процентах (0-100)
  page: number; // номер страницы PDF
  severity: ErrorSeverity;
  description: string;
  workType: WorkType;
  engineer: Engineer;
  status: ErrorStatus;
}

// Структура JSON-файла с ошибками
export interface ErrorsReport {
  documentName: string;
  analyzedAt: string;
  errors: DrawingError[];
}

// Пример JSON для тестирования
export const EXAMPLE_JSON: ErrorsReport = {
  documentName: "План_этаж_1.pdf",
  analyzedAt: "2024-02-01T10:30:00Z",
  errors: [
    {
      id: "err-001",
      x: 25,
      y: 30,
      page: 1,
      severity: "Критическая",
      description: "Отсутствует пожарный выход согласно СНиП 21-01-97",
      workType: "Архитектура",
      engineer: "Инженер 1",
      status: "pending",
    },
    {
      id: "err-002",
      x: 60,
      y: 45,
      page: 1,
      severity: "Экономическая",
      description: "Избыточное количество розеток в помещении",
      workType: "Электрика",
      engineer: "Инженер 2",
      status: "pending",
    },
    {
      id: "err-003",
      x: 40,
      y: 70,
      page: 1,
      severity: "Критическая",
      description: "Недостаточный диаметр трубы водоснабжения",
      workType: "Водоснабжение",
      engineer: "Инженер 5",
      status: "pending",
    },
  ],
};
