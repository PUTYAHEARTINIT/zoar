import twilio from "twilio";

function getClient() {
  if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN) return null;
  return twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
}

export async function sendSms(to: string, body: string) {
  const client = getClient();
  if (!client || !process.env.TWILIO_PHONE_NUMBER) return;

  return client.messages.create({
    body,
    from: process.env.TWILIO_PHONE_NUMBER,
    to,
  });
}

export async function sendMembershipNotification(phone: string, name: string) {
  return sendSms(
    phone,
    `${name} — You've been granted access to ZÖAR. The vault is now open. For eyes that know.`
  );
}

export async function sendOrderConfirmation(phone: string, productName: string) {
  return sendSms(
    phone,
    `ZÖAR — Your acquisition of "${productName}" has been confirmed. Private. Authenticated. Protected.`
  );
}

export async function sendMembershipWarning(phone: string, name: string) {
  return sendSms(
    phone,
    `${name} — ACCESS AT RISK. Your ZÖAR membership requires a purchase within the next 60 days. No activity, no access. The vault doesn't wait.`
  );
}

export async function sendInquiryConfirmation(phone: string, productName: string) {
  return sendSms(
    phone,
    `ZÖAR — Your inquiry for "${productName}" has been received. A member of our team will respond within 24 hours. For eyes that know.`
  );
}

export async function sendInquiryNotificationToSteve(details: {
  buyerName: string;
  buyerEmail: string;
  buyerPhone?: string;
  productName: string;
  sizeNeeded: string;
  offerAmount?: number;
  message?: string;
}) {
  const adminPhone = process.env.ADMIN_PHONE;
  if (!adminPhone) return;

  let msg = `ZÖAR INQUIRY\n${details.buyerName} (${details.buyerEmail})\nProduct: ${details.productName}\nSize: ${details.sizeNeeded}`;
  if (details.offerAmount) msg += `\nOffer: $${(details.offerAmount / 100).toLocaleString()}`;
  if (details.message) msg += `\nMsg: ${details.message}`;

  return sendSms(adminPhone, msg);
}
