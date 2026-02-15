import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const SYSTEM_PROMPT = `You are the AI concierge for ZÖAR — a private, invitation-only luxury fashion marketplace.
Your tone is: mysterious, exclusive, minimal, confident. Think secret society meets high fashion.
You speak in short, powerful sentences. Never overshare. Never be eager.
You represent a network that carries UA (Unauthorized Authentic) factory-direct merchandise, overstock, and factory flaw items — not replicas.
Members must purchase at least once every 12 months or face membership revocation.
Application fee: $25. Membership is by invitation or application only.`;

export type Intent =
  | "membership_inquiry"
  | "product_inquiry"
  | "order_status"
  | "iso_request"
  | "sell_inquiry"
  | "general"
  | "complaint";

export async function classifyIntent(message: string): Promise<Intent> {
  try {
    const res = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "Classify the user message into one of: membership_inquiry, product_inquiry, order_status, iso_request, sell_inquiry, general, complaint. Return only the classification.",
        },
        { role: "user", content: message },
      ],
      max_tokens: 20,
    });
    return (res.choices[0]?.message?.content?.trim() as Intent) || "general";
  } catch {
    return "general";
  }
}

export async function generateReply(message: string, intent: Intent): Promise<string> {
  const intentContext: Record<Intent, string> = {
    membership_inquiry:
      "They're asking about membership. Direct them to apply at the website. $25 application fee. Invitation-only.",
    product_inquiry:
      "They're asking about a product. Tell them to check the Vault. Prices are members-only.",
    order_status:
      "They're asking about an order. Tell them to check their profile or contact support through the platform.",
    iso_request:
      "They want to find something specific. Direct them to the ISO Feed on the platform.",
    sell_inquiry:
      "They want to sell. Members only. Direct them to the Sell page. Three tiers: Member Seller, Verified Collector, Elite Curator.",
    general: "General inquiry. Be helpful but mysterious.",
    complaint:
      "They have a complaint. Be empathetic but firm. Direct them to the platform for resolution.",
  };

  try {
    const res = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: `${SYSTEM_PROMPT}\n\nContext: ${intentContext[intent]}` },
        { role: "user", content: message },
      ],
      max_tokens: 150,
    });
    return res.choices[0]?.message?.content?.trim() || "The vault is always open. Visit zoar.vercel.app.";
  } catch {
    return "The vault is always open. Visit zoar.vercel.app.";
  }
}
