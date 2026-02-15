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
