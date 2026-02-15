import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createApplicationCheckout } from "@/lib/stripe";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, email, instagram, referralCode, bio } = body;

  if (!name || !email) {
    return NextResponse.json({ error: "Name and email required" }, { status: 400 });
  }

  // Create user account (or find existing)
  let user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    const tempPassword = await bcrypt.hash(Math.random().toString(36).slice(2), 10);
    user = await prisma.user.create({
      data: {
        email,
        name,
        password: tempPassword,
        role: "APPLICANT",
        membershipStatus: "PENDING",
        referralCode: `ZOAR-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
        referredBy: referralCode || null,
      },
    });
  }

  // Create application
  const application = await prisma.membershipApplication.create({
    data: {
      userId: user.id,
      name,
      email,
      instagram: instagram || null,
      referralCode: referralCode || null,
      bio: bio || null,
    },
  });

  // Create Stripe checkout for $25 fee
  try {
    const checkout = await createApplicationCheckout(application.id, email);
    return NextResponse.json({ checkoutUrl: checkout.url });
  } catch {
    // If Stripe not configured, still accept the application
    return NextResponse.json({ success: true, applicationId: application.id });
  }
}
