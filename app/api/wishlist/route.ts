import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const wishlist = await prisma.wishlist.findMany({
    where: { userId: session.user.id },
    include: {
      product: {
        select: { id: true, name: true, subtitle: true, category: true, price: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ wishlist });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();

  const wishlist = await prisma.wishlist.upsert({
    where: {
      userId_productId: {
        userId: session.user.id,
        productId: body.productId,
      },
    },
    update: {},
    create: {
      userId: session.user.id,
      productId: body.productId,
    },
  });

  return NextResponse.json({ wishlist }, { status: 201 });
}

export async function DELETE(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();

  await prisma.wishlist.deleteMany({
    where: {
      userId: session.user.id,
      productId: body.productId,
    },
  });

  return NextResponse.json({ success: true });
}
