import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      role: true,
      membershipTier: true,
      membershipStatus: true,
      memberNumber: true,
      memberSince: true,
      lastPurchaseAt: true,
    },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  // Check 12-month activity requirement
  let atRisk = false;
  if (user.lastPurchaseAt) {
    const monthsSince = (Date.now() - user.lastPurchaseAt.getTime()) / (1000 * 60 * 60 * 24 * 30);
    atRisk = monthsSince > 10; // Warn at 10 months
  }

  return NextResponse.json({
    membership: {
      ...user,
      atRisk,
    },
  });
}
