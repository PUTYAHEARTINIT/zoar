import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { sendInquiryConfirmation, sendInquiryNotificationToSteve } from "@/lib/sms";
import { sendInquiryConfirmationEmail, sendInquiryNotificationToSteve as sendInquiryEmailToSteve } from "@/lib/email";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const inquiries = await prisma.purchaseInquiry.findMany({
    where: { userId: session.user.id },
    include: { product: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ inquiries });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Check membership
  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (
    !user ||
    user.membershipStatus !== "ACTIVE" ||
    (user.role !== "MEMBER" && user.role !== "ADMIN")
  ) {
    return NextResponse.json(
      { error: "Active membership required", requiresMembership: true },
      { status: 403 }
    );
  }

  const body = await req.json();
  const { productId, name, email, phone, sizeNeeded, offerAmount, message } = body;

  if (!productId || !name || !email || !sizeNeeded) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  const inquiry = await prisma.purchaseInquiry.create({
    data: {
      userId: session.user.id,
      productId,
      name,
      email,
      phone: phone || null,
      sizeNeeded,
      offerAmount: offerAmount ? Math.round(offerAmount * 100) : null,
      message: message || null,
    },
  });

  // Fire off async notifications (don't block response)
  const notificationDetails = {
    buyerName: name,
    buyerEmail: email,
    buyerPhone: phone || undefined,
    productName: product.name,
    sizeNeeded,
    offerAmount: offerAmount ? Math.round(offerAmount * 100) : undefined,
    message: message || undefined,
  };

  // Send buyer confirmations
  Promise.allSettled([
    phone ? sendInquiryConfirmation(phone, product.name) : Promise.resolve(),
    sendInquiryConfirmationEmail(email, name, product.name, sizeNeeded),
    // Send admin notifications
    sendInquiryNotificationToSteve(notificationDetails),
    sendInquiryEmailToSteve(notificationDetails),
  ]).catch(() => {});

  return NextResponse.json({ inquiry }, { status: 201 });
}
