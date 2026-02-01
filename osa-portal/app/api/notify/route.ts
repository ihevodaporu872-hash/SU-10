import { NextRequest, NextResponse } from "next/server";
import { sendCriticalNotification } from "@/lib/notifications";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { type, workType, description, engineers, severity } = body;

    if (!type || !workType || !description) {
      return NextResponse.json(
        { success: false, error: "Отсутствуют обязательные поля" },
        { status: 400 }
      );
    }

    const result = await sendCriticalNotification({
      type,
      workType,
      description,
      engineers: engineers || [],
      severity: severity || "Критическая",
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Ошибка обработки запроса:", error);
    return NextResponse.json(
      { success: false, error: "Внутренняя ошибка сервера" },
      { status: 500 }
    );
  }
}

// GET для проверки статуса
export async function GET() {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  const isConfigured =
    botToken &&
    botToken !== "YOUR_BOT_TOKEN_HERE" &&
    chatId &&
    chatId !== "YOUR_CHAT_ID_HERE";

  return NextResponse.json({
    configured: isConfigured,
    message: isConfigured
      ? "Telegram уведомления настроены"
      : "Telegram уведомления не настроены. Добавьте TELEGRAM_BOT_TOKEN и TELEGRAM_CHAT_ID в .env.local",
  });
}
