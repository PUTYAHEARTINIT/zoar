import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { createOfferPaymentLink } from "@/lib/stripe";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { status } = body;

  const offer = await prisma.offer.update({
    where: { id },
    data: { status },
    include: { product: true, buyer: true },
  });

  // If accepted, create payment link for buyer
  if (status === "ACCEPTED" && offer.buyer.email) {
    try {
      const checkout = await createOfferPaymentLink(
        offer.id,
        offer.product.name,
        offer.amount,
        offer.buyer.email
      );
      return NextResponse.json({ offer, paymentUrl: checkout.url });
    } catch {
      return NextResponse.json({ offer });
    }
  }

  return NextResponse.json({ offer });
}
