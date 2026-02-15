import Stripe from "stripe";

let _stripe: Stripe | null = null;

function getStripe(): Stripe {
  if (!_stripe) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error("STRIPE_SECRET_KEY not configured");
    }
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2026-01-28.clover",
    });
  }
  return _stripe;
}

export const stripe = { get instance() { return getStripe(); } };

export async function createApplicationCheckout(applicationId: string, email: string) {
  const session = await getStripe().checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: "ZÖAR Membership Application Fee",
            description: "Non-refundable application fee for ZÖAR private membership",
          },
          unit_amount: 2500,
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    customer_email: email,
    metadata: { type: "application", applicationId },
    success_url: `${process.env.NEXTAUTH_URL}/apply?success=true`,
    cancel_url: `${process.env.NEXTAUTH_URL}/apply?canceled=true`,
  });
  return session;
}

export async function createProductCheckout(
  productId: string,
  productName: string,
  amount: number,
  buyerEmail: string
) {
  const session = await getStripe().checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: { name: productName },
          unit_amount: amount,
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    customer_email: buyerEmail,
    metadata: { type: "product", productId },
    success_url: `${process.env.NEXTAUTH_URL}/vault/${productId}?purchased=true`,
    cancel_url: `${process.env.NEXTAUTH_URL}/vault/${productId}`,
  });
  return session;
}

export async function createOfferPaymentLink(
  offerId: string,
  productName: string,
  amount: number,
  buyerEmail: string
) {
  const session = await getStripe().checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: { name: `${productName} — Accepted Offer` },
          unit_amount: amount,
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    customer_email: buyerEmail,
    metadata: { type: "offer", offerId },
    success_url: `${process.env.NEXTAUTH_URL}/profile?offer_paid=true`,
    cancel_url: `${process.env.NEXTAUTH_URL}/profile`,
  });
  return session;
}
