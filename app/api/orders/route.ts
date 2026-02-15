import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { createProductCheckout } from "@/lib/stripe";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const orders = await prisma.order.findMany({
    where: { buyerId: session.user.id },
    include: { product: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ orders });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id || !session.user.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();

  const product = await prisma.product.findUnique({ where: { id: body.productId } });
  if (!product || product.status !== "ACTIVE") {
    return NextResponse.json({ error: "Product unavailable" }, { status: 400 });
  }

  try {
    const checkout = await createProductCheckout(
      product.id,
      product.name,
      product.price,
      session.user.email
    );

    return NextResponse.json({ checkoutUrl: checkout.url });
  } catch {
    return NextResponse.json({ error: "Payment setup failed" }, { status: 500 });
  }
}
