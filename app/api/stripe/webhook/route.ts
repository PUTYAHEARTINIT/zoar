import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2026-01-28.clover" });

  let event: Stripe.Event;
  try {
    event = stripeInstance.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const { type, applicationId, productId, offerId } = session.metadata || {};

    if (type === "application" && applicationId) {
      // Approve application
      const app = await prisma.membershipApplication.update({
        where: { id: applicationId },
        data: { status: "APPROVED", stripePaymentId: session.payment_intent as string },
      });

      // Activate membership
      const memberCount = await prisma.user.count({ where: { role: "MEMBER" } });
      await prisma.user.update({
        where: { id: app.userId },
        data: {
          role: "MEMBER",
          membershipStatus: "ACTIVE",
          membershipTier: "MEMBER_SELLER",
          memberNumber: `Z-${String(memberCount + 1).padStart(5, "0")}`,
          memberSince: new Date(),
        },
      });
    }

    if (type === "product" && productId) {
      // Create order
      await prisma.order.create({
        data: {
          buyerId: session.client_reference_id || "",
          productId,
          amount: session.amount_total || 0,
          status: "PAID",
          stripePaymentId: session.payment_intent as string,
        },
      });

      // Mark product as sold + update buyer's lastPurchaseAt
      await prisma.product.update({ where: { id: productId }, data: { status: "SOLD" } });
      if (session.client_reference_id) {
        await prisma.user.update({
          where: { id: session.client_reference_id },
          data: { lastPurchaseAt: new Date() },
        });
      }
    }

    if (type === "offer" && offerId) {
      const offer = await prisma.offer.findUnique({ where: { id: offerId } });
      if (offer) {
        await prisma.order.create({
          data: {
            buyerId: offer.buyerId,
            productId: offer.productId,
            amount: offer.amount,
            status: "PAID",
            stripePaymentId: session.payment_intent as string,
          },
        });
        await prisma.product.update({ where: { id: offer.productId }, data: { status: "SOLD" } });
        await prisma.user.update({
          where: { id: offer.buyerId },
          data: { lastPurchaseAt: new Date() },
        });
      }
    }
  }

  return NextResponse.json({ received: true });
}
