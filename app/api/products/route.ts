import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");
  const search = searchParams.get("search");
  const listing = searchParams.get("listing");

  const where: any = { status: "ACTIVE" };
  if (category) where.category = category;
  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { subtitle: { contains: search, mode: "insensitive" } },
      { category: { contains: search, mode: "insensitive" } },
    ];
  }
  if (listing === "vault") {
    where.seller = { role: "ADMIN" };
  } else if (listing === "marketplace") {
    where.seller = { role: "MEMBER" };
  }

  const products = await prisma.product.findMany({
    where,
    include: { seller: { select: { role: true } } },
    orderBy: { createdAt: "desc" },
  });

  // Strip seller from response
  const cleaned = products.map(({ seller, ...rest }) => rest);

  return NextResponse.json({ products: cleaned });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();

  const product = await prisma.product.create({
    data: {
      sellerId: session.user.id,
      name: body.name,
      subtitle: body.subtitle || null,
      category: body.category,
      type: body.type || "Footwear",
      size: body.size,
      price: body.price,
      condition: body.condition || "New / DS",
      color: body.color || null,
      images: body.images || [],
      exclusive: body.exclusive || false,
      negotiable: body.negotiable ?? true,
      silentBid: body.silentBid || false,
    },
  });

  return NextResponse.json({ product }, { status: 201 });
}
