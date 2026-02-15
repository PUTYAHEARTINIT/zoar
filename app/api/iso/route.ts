import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET() {
  const isos = await prisma.isoPost.findMany({
    where: { status: "ACTIVE" },
    include: {
      user: { select: { handle: true, name: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return NextResponse.json({ isos });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();

  const iso = await prisma.isoPost.create({
    data: {
      userId: session.user.id,
      description: body.description,
    },
    include: {
      user: { select: { handle: true, name: true } },
    },
  });

  return NextResponse.json({ iso }, { status: 201 });
}
