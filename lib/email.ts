import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = "ZÖAR <noreply@zoar.app>";

export async function sendApplicationReceived(email: string, name: string) {
  return resend.emails.send({
    from: FROM,
    to: email,
    subject: "ZÖAR — Application Received",
    html: `
      <div style="background:#0A0A0A;color:#F5F0E8;padding:48px;font-family:'Georgia',serif;">
        <h1 style="font-size:28px;font-weight:300;letter-spacing:6px;margin-bottom:24px;">ZÖAR</h1>
        <p style="color:#C8C2B8;margin-bottom:16px;">${name},</p>
        <p style="color:#888;line-height:1.8;margin-bottom:24px;">
          Your application has been received and is under review.
          Approved members receive access within 24-48 hours.
        </p>
        <p style="color:#cfb53b;font-style:italic;">For Eyes That Know.</p>
      </div>
    `,
  });
}

export async function sendMembershipApproved(email: string, name: string, memberNumber: string) {
  return resend.emails.send({
    from: FROM,
    to: email,
    subject: "ZÖAR — Access Granted",
    html: `
      <div style="background:#0A0A0A;color:#F5F0E8;padding:48px;font-family:'Georgia',serif;">
        <h1 style="font-size:28px;font-weight:300;letter-spacing:6px;margin-bottom:24px;">ZÖAR</h1>
        <p style="color:#C8C2B8;margin-bottom:16px;">${name},</p>
        <p style="color:#888;line-height:1.8;margin-bottom:24px;">
          You've been granted access to the ZÖAR private network.
          Your member number is <strong style="color:#cfb53b;">${memberNumber}</strong>.
        </p>
        <p style="color:#888;line-height:1.8;margin-bottom:24px;">
          The vault is now open. Remember: at least one purchase every 12 months
          to maintain your membership. No activity, no access.
        </p>
        <p style="color:#cfb53b;font-style:italic;">For Eyes That Know.</p>
      </div>
    `,
  });
}

export async function sendOrderConfirmation(email: string, name: string, productName: string, amount: number) {
  return resend.emails.send({
    from: FROM,
    to: email,
    subject: "ZÖAR — Acquisition Confirmed",
    html: `
      <div style="background:#0A0A0A;color:#F5F0E8;padding:48px;font-family:'Georgia',serif;">
        <h1 style="font-size:28px;font-weight:300;letter-spacing:6px;margin-bottom:24px;">ZÖAR</h1>
        <p style="color:#C8C2B8;margin-bottom:16px;">${name},</p>
        <p style="color:#888;line-height:1.8;margin-bottom:24px;">
          Your acquisition of <strong style="color:#F5F0E8;">${productName}</strong>
          for <strong style="color:#cfb53b;">$${(amount / 100).toLocaleString()}</strong>
          has been confirmed and authenticated.
        </p>
        <p style="color:#888;line-height:1.8;margin-bottom:24px;">
          Private. Authenticated. Protected by the ZÖAR network.
        </p>
        <p style="color:#cfb53b;font-style:italic;">For Eyes That Know.</p>
      </div>
    `,
  });
}

export async function sendAccessAtRisk(email: string, name: string) {
  return resend.emails.send({
    from: FROM,
    to: email,
    subject: "ZÖAR — ACCESS AT RISK",
    html: `
      <div style="background:#0A0A0A;color:#F5F0E8;padding:48px;font-family:'Georgia',serif;">
        <h1 style="font-size:28px;font-weight:300;letter-spacing:6px;margin-bottom:24px;color:#8b2020;">ZÖAR — ACCESS AT RISK</h1>
        <p style="color:#C8C2B8;margin-bottom:16px;">${name},</p>
        <p style="color:#888;line-height:1.8;margin-bottom:24px;">
          Your ZÖAR membership requires at least one purchase every 12 months.
          Your last transaction was over 10 months ago. You have 60 days
          to make a purchase before your access is automatically revoked.
        </p>
        <p style="color:#888;line-height:1.8;margin-bottom:24px;">
          This isn't a museum — it's a marketplace for those who move.
        </p>
        <p style="color:#cfb53b;font-style:italic;">The vault doesn't wait.</p>
      </div>
    `,
  });
}
