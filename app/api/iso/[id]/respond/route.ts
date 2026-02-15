import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();

  const response = await prisma.isoResponse.create({
    data: {
      isoPostId: id,
      responderId: session.user.id,
      message: body.message,
    },
  });

  return NextResponse.json({ response }, { status: 201 });
}
