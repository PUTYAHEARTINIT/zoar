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

export async function sendAdminOrderNotification(details: {
  buyerName: string;
  buyerEmail: string;
  productName: string;
  amount: number;
  orderType: "product" | "offer";
}) {
  const adminPhone = process.env.ADMIN_PHONE;
  if (!adminPhone) return;

  const typeLabel = details.orderType === "offer" ? "SILENT OFFER" : "DIRECT PURCHASE";
  const msg = `ZÖAR ORDER (${typeLabel})\nBuyer: ${details.buyerName} (${details.buyerEmail})\nProduct: ${details.productName}\nAmount: $${(details.amount / 100).toLocaleString()}`;

  return sendSms(adminPhone, msg);
}

export async function sendApplicationNotificationToAdmin(details: {
  applicantName: string;
  applicantEmail: string;
  instagram?: string;
  referralCode?: string;
}) {
  const adminPhone = process.env.ADMIN_PHONE;
  if (!adminPhone) return;

  let msg = `ZÖAR APPLICATION\n${details.applicantName} (${details.applicantEmail})`;
  if (details.instagram) msg += `\nIG: ${details.instagram}`;
  if (details.referralCode) msg += `\nReferral: ${details.referralCode}`;

  return sendSms(adminPhone, msg);
}

export async function sendVaultRequestToAdmin(details: {
  name: string;
  email: string;
  brand: string;
  style: string;
  color: string;
  size: string;
}) {
  const adminPhone = process.env.ADMIN_PHONE;
  if (!adminPhone) return;

  const msg = `ZÖAR VAULT REQUEST\n${details.brand} ${details.style}, Size ${details.size}\n${details.name} — ${details.email}\nColor: ${details.color}`;

  return sendSms(adminPhone, msg);
}

export async function sendInquiryNotificationToAdmin(details: {
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
