import { Resend } from "resend";

let _resend: Resend | null = null;
function getResend() {
  if (!_resend) _resend = new Resend(process.env.RESEND_API_KEY || "");
  return _resend;
}
const FROM = "ZÖAR <noreply@zoar.app>";

export async function sendApplicationReceived(email: string, name: string) {
  return getResend().emails.send({
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
        <p style="color:#F5F0E8;font-style:italic;">For Eyes That Know.</p>
      </div>
    `,
  });
}

export async function sendMembershipApproved(email: string, name: string, memberNumber: string) {
  return getResend().emails.send({
    from: FROM,
    to: email,
    subject: "ZÖAR — Access Granted",
    html: `
      <div style="background:#0A0A0A;color:#F5F0E8;padding:48px;font-family:'Georgia',serif;">
        <h1 style="font-size:28px;font-weight:300;letter-spacing:6px;margin-bottom:24px;">ZÖAR</h1>
        <p style="color:#C8C2B8;margin-bottom:16px;">${name},</p>
        <p style="color:#888;line-height:1.8;margin-bottom:24px;">
          You've been granted access to the ZÖAR private network.
          Your member number is <strong style="color:#F5F0E8;">${memberNumber}</strong>.
        </p>
        <p style="color:#888;line-height:1.8;margin-bottom:24px;">
          The vault is now open. Remember: at least one purchase every 12 months
          to maintain your membership. No activity, no access.
        </p>
        <p style="color:#F5F0E8;font-style:italic;">For Eyes That Know.</p>
      </div>
    `,
  });
}

export async function sendOrderConfirmation(email: string, name: string, productName: string, amount: number) {
  return getResend().emails.send({
    from: FROM,
    to: email,
    subject: "ZÖAR — Acquisition Confirmed",
    html: `
      <div style="background:#0A0A0A;color:#F5F0E8;padding:48px;font-family:'Georgia',serif;">
        <h1 style="font-size:28px;font-weight:300;letter-spacing:6px;margin-bottom:24px;">ZÖAR</h1>
        <p style="color:#C8C2B8;margin-bottom:16px;">${name},</p>
        <p style="color:#888;line-height:1.8;margin-bottom:24px;">
          Your acquisition of <strong style="color:#F5F0E8;">${productName}</strong>
          for <strong style="color:#F5F0E8;">$${(amount / 100).toLocaleString()}</strong>
          has been confirmed and authenticated.
        </p>
        <p style="color:#888;line-height:1.8;margin-bottom:24px;">
          Private. Authenticated. Protected by the ZÖAR network.
        </p>
        <p style="color:#F5F0E8;font-style:italic;">For Eyes That Know.</p>
      </div>
    `,
  });
}

export async function sendInquiryConfirmationEmail(
  email: string,
  name: string,
  productName: string,
  sizeNeeded: string
) {
  return getResend().emails.send({
    from: FROM,
    to: email,
    subject: "ZÖAR — Purchase Inquiry Received",
    html: `
      <div style="background:#0A0A0A;color:#F5F0E8;padding:48px;font-family:'Georgia',serif;">
        <h1 style="font-size:28px;font-weight:300;letter-spacing:6px;margin-bottom:24px;">ZÖAR</h1>
        <p style="color:#C8C2B8;margin-bottom:16px;">${name},</p>
        <p style="color:#888;line-height:1.8;margin-bottom:24px;">
          Your inquiry for <strong style="color:#F5F0E8;">${productName}</strong>
          (Size: ${sizeNeeded}) has been received.
          A member of our team will respond within 24 hours.
        </p>
        <p style="color:#888;line-height:1.8;margin-bottom:24px;">
          Private. Authenticated. Protected by the ZÖAR network.
        </p>
        <p style="color:#F5F0E8;font-style:italic;">For Eyes That Know.</p>
      </div>
    `,
  });
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
  const adminEmail = process.env.ADMIN_EMAIL;
  if (!adminEmail) return;

  const offerLine = details.offerAmount
    ? `<p style="color:#F5F0E8;margin-bottom:8px;"><strong>Silent Offer:</strong> $${(details.offerAmount / 100).toLocaleString()}</p>`
    : "";
  const msgLine = details.message
    ? `<p style="color:#888;margin-bottom:8px;"><strong style="color:#F5F0E8;">Message:</strong> ${details.message}</p>`
    : "";

  return getResend().emails.send({
    from: FROM,
    to: adminEmail,
    subject: `ZÖAR INQUIRY — ${details.productName} from ${details.buyerName}`,
    html: `
      <div style="background:#0A0A0A;color:#F5F0E8;padding:48px;font-family:'Georgia',serif;">
        <h1 style="font-size:28px;font-weight:300;letter-spacing:6px;margin-bottom:24px;">NEW INQUIRY</h1>
        <p style="color:#F5F0E8;margin-bottom:8px;"><strong>Buyer:</strong> ${details.buyerName}</p>
        <p style="color:#888;margin-bottom:8px;"><strong style="color:#F5F0E8;">Email:</strong> ${details.buyerEmail}</p>
        ${details.buyerPhone ? `<p style="color:#888;margin-bottom:8px;"><strong style="color:#F5F0E8;">Phone:</strong> ${details.buyerPhone}</p>` : ""}
        <hr style="border:none;border-top:1px solid #222;margin:16px 0;" />
        <p style="color:#F5F0E8;margin-bottom:8px;"><strong>Product:</strong> ${details.productName}</p>
        <p style="color:#888;margin-bottom:8px;"><strong style="color:#F5F0E8;">Size:</strong> ${details.sizeNeeded}</p>
        ${offerLine}
        ${msgLine}
      </div>
    `,
  });
}

export async function sendAdminOrderNotification(details: {
  buyerName: string;
  buyerEmail: string;
  productName: string;
  amount: number;
  orderType: "product" | "offer";
}) {
  const adminEmail = process.env.ADMIN_EMAIL;
  if (!adminEmail) return;

  const typeLabel = details.orderType === "offer" ? "SILENT OFFER" : "DIRECT PURCHASE";

  return getResend().emails.send({
    from: FROM,
    to: adminEmail,
    subject: `ZÖAR ORDER — ${details.productName} by ${details.buyerName}`,
    html: `
      <div style="background:#0A0A0A;color:#F5F0E8;padding:48px;font-family:'Georgia',serif;">
        <h1 style="font-size:28px;font-weight:300;letter-spacing:6px;margin-bottom:24px;">NEW ORDER — ${typeLabel}</h1>
        <p style="color:#F5F0E8;margin-bottom:8px;"><strong>Buyer:</strong> ${details.buyerName}</p>
        <p style="color:#888;margin-bottom:8px;"><strong style="color:#F5F0E8;">Email:</strong> ${details.buyerEmail}</p>
        <hr style="border:none;border-top:1px solid #222;margin:16px 0;" />
        <p style="color:#F5F0E8;margin-bottom:8px;"><strong>Product:</strong> ${details.productName}</p>
        <p style="color:#888;margin-bottom:8px;"><strong style="color:#F5F0E8;">Amount Paid:</strong> $${(details.amount / 100).toLocaleString()}</p>
      </div>
    `,
  });
}

export async function sendApplicationNotificationToAdmin(details: {
  applicantName: string;
  applicantEmail: string;
  instagram?: string;
  referralCode?: string;
}) {
  const adminEmail = process.env.ADMIN_EMAIL;
  if (!adminEmail) return;

  const igLine = details.instagram
    ? `<p style="color:#888;margin-bottom:8px;"><strong style="color:#F5F0E8;">Instagram:</strong> ${details.instagram}</p>`
    : "";
  const refLine = details.referralCode
    ? `<p style="color:#888;margin-bottom:8px;"><strong style="color:#F5F0E8;">Referral Code:</strong> ${details.referralCode}</p>`
    : "";

  return getResend().emails.send({
    from: FROM,
    to: adminEmail,
    subject: `ZÖAR APPLICATION — ${details.applicantName}`,
    html: `
      <div style="background:#0A0A0A;color:#F5F0E8;padding:48px;font-family:'Georgia',serif;">
        <h1 style="font-size:28px;font-weight:300;letter-spacing:6px;margin-bottom:24px;">NEW APPLICATION</h1>
        <p style="color:#F5F0E8;margin-bottom:8px;"><strong>Name:</strong> ${details.applicantName}</p>
        <p style="color:#888;margin-bottom:8px;"><strong style="color:#F5F0E8;">Email:</strong> ${details.applicantEmail}</p>
        ${igLine}
        ${refLine}
      </div>
    `,
  });
}

export async function sendVaultRequestToAdmin(details: {
  name: string;
  email: string;
  phone?: string;
  brand: string;
  style: string;
  color: string;
  size: string;
}) {
  const adminEmail = process.env.ADMIN_EMAIL;
  if (!adminEmail) return;

  return getResend().emails.send({
    from: FROM,
    to: adminEmail,
    subject: `ZÖAR VAULT REQUEST — ${details.brand} ${details.style} from ${details.name}`,
    html: `
      <div style="background:#0A0A0A;color:#F5F0E8;padding:48px;font-family:'Georgia',serif;">
        <h1 style="font-size:28px;font-weight:300;letter-spacing:6px;margin-bottom:24px;">NEW VAULT REQUEST</h1>
        <p style="color:#F5F0E8;margin-bottom:8px;"><strong>Name:</strong> ${details.name}</p>
        <p style="color:#888;margin-bottom:8px;"><strong style="color:#F5F0E8;">Email:</strong> ${details.email}</p>
        ${details.phone ? `<p style="color:#888;margin-bottom:8px;"><strong style="color:#F5F0E8;">Phone:</strong> ${details.phone}</p>` : ""}
        <hr style="border:none;border-top:1px solid #222;margin:16px 0;" />
        <p style="color:#F5F0E8;margin-bottom:8px;"><strong>Brand:</strong> ${details.brand}</p>
        <p style="color:#888;margin-bottom:8px;"><strong style="color:#F5F0E8;">Style / Model:</strong> ${details.style}</p>
        <p style="color:#888;margin-bottom:8px;"><strong style="color:#F5F0E8;">Color:</strong> ${details.color}</p>
        <p style="color:#888;margin-bottom:8px;"><strong style="color:#F5F0E8;">Size:</strong> ${details.size}</p>
      </div>
    `,
  });
}

export async function sendVaultRequestConfirmation(
  to: string,
  name: string,
  brand: string,
  style: string
) {
  return getResend().emails.send({
    from: FROM,
    to,
    subject: "ZÖAR — Vault Request Received",
    html: `
      <div style="background:#0A0A0A;color:#F5F0E8;padding:48px;font-family:'Georgia',serif;">
        <h1 style="font-size:28px;font-weight:300;letter-spacing:6px;margin-bottom:24px;">ZÖAR</h1>
        <p style="color:#C8C2B8;margin-bottom:16px;">${name},</p>
        <p style="color:#888;line-height:1.8;margin-bottom:24px;">
          Your request for <strong style="color:#F5F0E8;">${brand} ${style}</strong> has been received.
          A ZÖAR specialist will be in touch within 24 hours to confirm availability.
        </p>
        <p style="color:#888;line-height:1.8;margin-bottom:24px;">
          Private. Authenticated. Protected by the ZÖAR network.
        </p>
        <p style="color:#F5F0E8;font-style:italic;">For Eyes That Know.</p>
      </div>
    `,
  });
}

export async function sendAccessAtRisk(email: string, name: string) {
  return getResend().emails.send({
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
        <p style="color:#F5F0E8;font-style:italic;">The vault doesn't wait.</p>
      </div>
    `,
  });
}
