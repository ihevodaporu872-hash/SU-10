// Виды работ и сопоставление с инженерами
export const WORK_TYPE_ENGINEERS = {
  "Земляные работы": ["Инженер 2"],
  "Монолитные работы": ["Инженер 1", "Инженер 2"],
  "Технология": ["Инженер 2"],
  "Каменная кладка": ["Инженер 2"],
  "Фасады": ["Инженер 2"],
  "Монолит": ["Инженер 1"],
  "Кровля": ["Инженер 2"],
  "Отделочные работы": ["Инженер 2"],
  "Электромонтажные работы": ["Инженер 2"],
  "Сантехнические работы": ["Инженер 5"],
  "Вентиляция": ["Инженер 2"],
} as const;

export type TenderWorkType = keyof typeof WORK_TYPE_ENGINEERS;

// Статус проверки строки
export type CheckStatus = "unchecked" | "checked" | "critical";

// Строка тендерного чек-листа
export interface TenderRow {
  id: string;
  rowNumber: number;
  workType: string;
  description: string;
  unit: string;
  quantity: number;
  price: number;
  total: number;
  engineers: string[];
  checked: boolean;
  isCritical: boolean;
  veComment: string; // Value Engineering комментарий
}

// Тендерный документ
export interface TenderDocument {
  id: string;
  fileName: string;
  uploadedAt: string;
  rows: TenderRow[];
}

// Функция определения инженеров по виду работ
export function getEngineersForWorkType(workType: string): string[] {
  // Ищем совпадение по ключевым словам
  const normalizedType = workType.toLowerCase();

  for (const [type, engineers] of Object.entries(WORK_TYPE_ENGINEERS)) {
    if (normalizedType.includes(type.toLowerCase())) {
      return [...engineers];
    }
  }

  // Дополнительные правила
  if (
    normalizedType.includes("земл") ||
    normalizedType.includes("котлован") ||
    normalizedType.includes("грунт")
  ) {
    return ["Инженер 2"];
  }

  if (
    normalizedType.includes("монолит") ||
    normalizedType.includes("бетон") ||
    normalizedType.includes("армат")
  ) {
    return ["Инженер 1", "Инженер 2"];
  }

  if (
    normalizedType.includes("кладк") ||
    normalizedType.includes("кирпич") ||
    normalizedType.includes("блок")
  ) {
    return ["Инженер 2"];
  }

  if (
    normalizedType.includes("фасад") ||
    normalizedType.includes("облицов") ||
    normalizedType.includes("утепл")
  ) {
    return ["Инженер 2"];
  }

  if (
    normalizedType.includes("электр") ||
    normalizedType.includes("кабел") ||
    normalizedType.includes("освещ")
  ) {
    return ["Инженер 2"];
  }

  if (
    normalizedType.includes("сантех") ||
    normalizedType.includes("водопровод") ||
    normalizedType.includes("канализ")
  ) {
    return ["Инженер 5"];
  }

  // По умолчанию
  return ["Инженер 2"];
}

// Пример данных для демонстрации
export const EXAMPLE_TENDER_DATA: TenderRow[] = [
  {
    id: "row-1",
    rowNumber: 1,
    workType: "Земляные работы",
    description: "Разработка котлована экскаватором",
    unit: "м³",
    quantity: 5000,
    price: 450,
    total: 2250000,
    engineers: ["Инженер 2"],
    checked: false,
    isCritical: false,
    veComment: "",
  },
  {
    id: "row-2",
    rowNumber: 2,
    workType: "Монолитные работы",
    description: "Устройство монолитного фундамента",
    unit: "м³",
    quantity: 800,
    price: 12500,
    total: 10000000,
    engineers: ["Инженер 1", "Инженер 2"],
    checked: false,
    isCritical: false,
    veComment: "",
  },
  {
    id: "row-3",
    rowNumber: 3,
    workType: "Каменная кладка",
    description: "Кладка наружных стен из газобетонных блоков",
    unit: "м³",
    quantity: 1200,
    price: 8500,
    total: 10200000,
    engineers: ["Инженер 2"],
    checked: false,
    isCritical: false,
    veComment: "",
  },
  {
    id: "row-4",
    rowNumber: 4,
    workType: "Фасады",
    description: "Устройство навесного вентилируемого фасада",
    unit: "м²",
    quantity: 3500,
    price: 4200,
    total: 14700000,
    engineers: ["Инженер 2"],
    checked: false,
    isCritical: false,
    veComment: "",
  },
  {
    id: "row-5",
    rowNumber: 5,
    workType: "Технология",
    description: "Монтаж технологического оборудования",
    unit: "компл.",
    quantity: 1,
    price: 5500000,
    total: 5500000,
    engineers: ["Инженер 2"],
    checked: false,
    isCritical: false,
    veComment: "",
  },
];
