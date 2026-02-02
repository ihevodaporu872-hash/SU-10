"use server";

// Логика определения ответственного инженера по виду работ
function getResponsibleEngineer(workType: string): string {
  const normalizedType = workType.toLowerCase();

  // Каменная кладка, Фасады → Инженер 2
  if (
    normalizedType.includes("каменн") ||
    normalizedType.includes("кладк") ||
    normalizedType.includes("кирпич") ||
    normalizedType.includes("блок") ||
    normalizedType.includes("фасад") ||
    normalizedType.includes("облицов")
  ) {
    return "Инженер 2";
  }

  // Монолит → Инженер 1
  if (
    normalizedType.includes("монолит") ||
    normalizedType.includes("бетон") ||
    normalizedType.includes("армат") ||
    normalizedType.includes("фундамент")
  ) {
    return "Инженер 1";
  }

  // Земляные работы → Инженер 2
  if (
    normalizedType.includes("земл") ||
    normalizedType.includes("котлован") ||
    normalizedType.includes("грунт")
  ) {
    return "Инженер 2";
  }

  // Технология → Инженер 2
  if (normalizedType.includes("технолог")) {
    return "Инженер 2";
  }

  // По умолчанию
  return "Инженер 2";
}

interface NotificationPayload {
  type: "drawing" | "tender";
  workType: string;
  description: string;
  engineers?: string[];
  severity?: string;
}

// Отправка уведомления в Telegram
export async function sendCriticalNotification(
  payload: NotificationPayload
): Promise<{ success: boolean; message: string }> {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!botToken || botToken === "YOUR_BOT_TOKEN_HERE") {
    console.log("[Telegram] Бот не настроен, пропускаем уведомление");
    return { success: false, message: "Telegram бот не настроен" };
  }

  if (!chatId || chatId === "YOUR_CHAT_ID_HERE") {
    console.log("[Telegram] Chat ID не настроен, пропускаем уведомление");
    return { success: false, message: "Telegram chat ID не настроен" };
  }

  // Определяем ответственного инженера
  const responsibleEngineer = getResponsibleEngineer(payload.workType);

  // Формируем сообщение
  const typeLabel = payload.type === "drawing" ? "🔍 Анализ чертежей" : "📋 Тендеры";
  const severityLabel = payload.severity === "Критическая" ? "🔴 КРИТИЧЕСКАЯ" : "⚠️ ВАЖНО";

  const message = `
${severityLabel} | ${typeLabel}

📌 Вид работ: ${payload.workType}
📝 Описание: ${payload.description}

👷 Ответственный: ${responsibleEngineer}
${payload.engineers?.length ? `👥 Назначенные инженеры: ${payload.engineers.join(", ")}` : ""}

⏰ ${new Date().toLocaleString("ru-RU")}
`.trim();

  try {
    const response = await fetch(
      `https://api.telegram.org/bot${botToken}/sendMessage`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
          parse_mode: "HTML",
        }),
      }
    );

    const data = await response.json();

    if (data.ok) {
      console.log("[Telegram] Уведомление отправлено успешно");
      return { success: true, message: "Уведомление отправлено" };
    } else {
      console.error("[Telegram] Ошибка:", data.description);
      return { success: false, message: data.description || "Ошибка отправки" };
    }
  } catch (error) {
    console.error("[Telegram] Ошибка сети:", error);
    return { success: false, message: "Ошибка сети при отправке" };
  }
}

// API route для отправки уведомлений (можно вызывать с клиента через fetch)
export async function notifyOnCriticalChange(
  type: "drawing" | "tender",
  workType: string,
  description: string,
  engineers: string[] = []
): Promise<void> {
  await sendCriticalNotification({
    type,
    workType,
    description,
    engineers,
    severity: "Критическая",
  });
}
