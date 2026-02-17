import { NextRequest, NextResponse } from "next/server";
import { sendVaultRequestToAdmin, sendVaultRequestConfirmation } from "@/lib/email";
import { sendVaultRequestToAdmin as sendVaultRequestSmsToAdmin } from "@/lib/sms";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { brand, style, color, size, name, email, phone } = body;

  if (!brand || !style || !size || !name || !email) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const details = { name, email, phone: phone || undefined, brand, style, color: color || "", size };

  Promise.allSettled([
    sendVaultRequestToAdmin(details),
    sendVaultRequestSmsToAdmin(details),
    sendVaultRequestConfirmation(email, name, brand, style),
  ]).catch(() => {});

  return NextResponse.json({ success: true });
}
