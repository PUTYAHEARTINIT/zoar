import { NextRequest, NextResponse } from "next/server";
import { classifyIntent, generateReply } from "@/lib/ai";

// Meta webhook verification
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  if (mode === "subscribe" && token === process.env.META_VERIFY_TOKEN) {
    return new NextResponse(challenge, { status: 200 });
  }
  return NextResponse.json({ error: "Forbidden" }, { status: 403 });
}

// Meta DM webhook
export async function POST(req: NextRequest) {
  const body = await req.json();

  const entries = body.entry || [];
  for (const entry of entries) {
    const messaging = entry.messaging || [];
    for (const event of messaging) {
      if (event.message?.text) {
        const senderId = event.sender?.id;
        const text = event.message.text;

        try {
          const intent = await classifyIntent(text);
          const reply = await generateReply(text, intent);

          // Send reply via Instagram Graph API
          await fetch(
            `https://graph.instagram.com/v21.0/me/messages?access_token=${process.env.META_PAGE_TOKEN}`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                recipient: { id: senderId },
                message: { text: reply },
              }),
            }
          );
        } catch {
          // Silent fail
        }
      }
    }
  }

  return NextResponse.json({ status: "ok" });
}
