"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Nav from "@/components/Nav";
import InfinityPattern from "@/components/InfinityPattern";
import ZoarLogo from "@/components/ZoarLogo";

interface WishlistItem {
  id: string;
  product: {
    id: string;
    name: string;
    subtitle: string | null;
    category: string;
    price: number;
  };
}

export default function ProfilePage() {
  const { data: session } = useSession();
  const isMember =
    (session?.user as any)?.membershipStatus === "ACTIVE" &&
    ((session?.user as any)?.role === "MEMBER" || (session?.user as any)?.role === "ADMIN");

  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);

  useEffect(() => {
    if (!session) return;
    fetch("/api/wishlist")
      .then((r) => r.json())
      .then((data) => setWishlist(data.wishlist || []))
      .catch(() => {});
  }, [session]);

  if (!isMember) {
    return (
      <div>
        <Nav />
        <div style={{ maxWidth: 600, margin: "0 auto", padding: "120px 32px", textAlign: "center" }}>
          <h1 style={{ fontFamily: "var(--serif)", fontSize: 42, fontWeight: 300, color: "var(--cream)", marginBottom: 16 }}>
            Sign In Required
          </h1>
          <Link href="/apply" className="btn-gold">
            Apply for Membership
          </Link>
        </div>
      </div>
    );
  }

  const tier = (session?.user as any)?.membershipTier?.replace("_", " ") || "Member";

  return (
    <div>
      <Nav />
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "48px 32px 120px" }}>
        {/* VIP Card */}
        <div
          className="fade-up"
          style={{
            padding: "40px 48px",
            border: "1px solid rgba(207,181,59,0.2)",
            background: "linear-gradient(135deg, var(--bg-alt), var(--bg))",
            marginBottom: 48,
            position: "relative",
            overflow: "hidden",
          }}
        >
          <InfinityPattern opacity={0.03} />
          <div style={{ position: "relative", zIndex: 1 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <p style={{ fontSize: 11, letterSpacing: 4, textTransform: "uppercase", color: "var(--gold)", marginBottom: 8 }}>
                  VIP Access
                </p>
                <h2 style={{ fontFamily: "var(--serif)", fontSize: 28, fontWeight: 400, color: "var(--cream)", marginBottom: 4 }}>
                  {session?.user?.name || "ZÖAR MEMBER"}
                </h2>
                <p style={{ fontSize: 13, color: "var(--text-dim)" }}>NO. 01292</p>
              </div>
              <ZoarLogo size={48} color="var(--gold)" />
            </div>
            <div style={{ marginTop: 32, display: "flex", gap: 40 }}>
              <div>
                <p style={{ fontSize: 10, letterSpacing: 2, color: "var(--text-dim)", textTransform: "uppercase" }}>Status</p>
                <p style={{ color: "var(--gold)", fontSize: 14 }}>Active</p>
              </div>
              <div>
                <p style={{ fontSize: 10, letterSpacing: 2, color: "var(--text-dim)", textTransform: "uppercase" }}>Tier</p>
                <p style={{ color: "var(--cream)", fontSize: 14, textTransform: "capitalize" }}>{tier}</p>
              </div>
              <div>
                <p style={{ fontSize: 10, letterSpacing: 2, color: "var(--text-dim)", textTransform: "uppercase" }}>Since</p>
                <p style={{ color: "var(--cream)", fontSize: 14 }}>2026</p>
              </div>
            </div>
            <p style={{ marginTop: 24, fontSize: 12, fontStyle: "italic", color: "var(--cream-dim)", fontFamily: "var(--serif)", letterSpacing: 2 }}>
              For Eyes That Know.
            </p>

            {/* 12-month warning */}
            <div style={{ marginTop: 24, padding: "12px 16px", border: "1px solid var(--border)", background: "rgba(139,32,32,0.1)" }}>
              <p style={{ fontSize: 11, color: "var(--text-dim)", letterSpacing: 1 }}>
                <span style={{ color: "var(--gold)" }}>⚡</span> Membership requires at least one purchase every 12 months. Inactive memberships are automatically revoked.
              </p>
            </div>
          </div>
        </div>

        {/* Wishlist */}
        <div style={{ marginBottom: 48 }}>
          <h3 style={{ fontFamily: "var(--serif)", fontSize: 24, fontWeight: 300, color: "var(--cream)", marginBottom: 24 }}>
            Your Wishlist ({wishlist.length})
          </h3>
          {wishlist.length === 0 ? (
            <p style={{ fontSize: 13, color: "var(--text-dim)" }}>
              No items in your wishlist yet. Browse the{" "}
              <Link href="/vault" style={{ color: "var(--gold)" }}>
                vault
              </Link>{" "}
              to add pieces.
            </p>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 16 }}>
              {wishlist.map((w) => (
                <Link
                  key={w.id}
                  href={`/vault/${w.product.id}`}
                  style={{ padding: 16, border: "1px solid var(--border)", background: "var(--bg-alt)", display: "block" }}
                >
                  <p style={{ fontSize: 10, letterSpacing: 2, color: "var(--gold)", marginBottom: 4 }}>{w.product.category}</p>
                  <p style={{ fontSize: 14, color: "var(--cream)" }}>{w.product.name}</p>
                  <p style={{ fontSize: 12, color: "var(--text-dim)" }}>{w.product.subtitle}</p>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Digital Closet */}
        <div style={{ padding: 40, border: "1px solid var(--border)", textAlign: "center" }}>
          <p style={{ fontFamily: "var(--serif)", fontSize: 20, color: "var(--cream)", marginBottom: 8 }}>Digital Closet</p>
          <p style={{ fontSize: 13, color: "var(--text-dim)" }}>Your collection archive. Purchased items will appear here.</p>
        </div>
      </div>
    </div>
  );
}
