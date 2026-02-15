import { NextRequest, NextResponse } from "next/server";
import { classifyIntent, generateReply } from "@/lib/ai";
import { sendSms } from "@/lib/sms";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const params = new URLSearchParams(body);
  const from = params.get("From") || "";
  const message = params.get("Body") || "";

  if (!from || !message) {
    return new NextResponse("<Response></Response>", {
      headers: { "Content-Type": "text/xml" },
    });
  }

  try {
    const intent = await classifyIntent(message);
    const reply = await generateReply(message, intent);
    await sendSms(from, reply);
  } catch {
    // Silent fail — don't break webhook
  }

  return new NextResponse("<Response></Response>", {
    headers: { "Content-Type": "text/xml" },
  });
}
