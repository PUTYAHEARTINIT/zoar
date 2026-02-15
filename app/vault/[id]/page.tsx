"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Nav from "@/components/Nav";
import MemberGate from "@/components/MemberGate";
import ZoarLogo from "@/components/ZoarLogo";

interface Product {
  id: string;
  name: string;
  subtitle: string | null;
  category: string;
  type: string;
  size: string;
  price: number;
  condition: string;
  color: string | null;
  images: string[];
  exclusive: boolean;
  negotiable: boolean;
  seller: { name: string; membershipTier: string | null };
}

export default function ProductDetailPage() {
  const { id } = useParams();
  const { data: session } = useSession();
  const isMember =
    (session?.user as any)?.membershipStatus === "ACTIVE" &&
    ((session?.user as any)?.role === "MEMBER" || (session?.user as any)?.role === "ADMIN");

  const [product, setProduct] = useState<Product | null>(null);
  const [showOffer, setShowOffer] = useState(false);
  const [offerAmount, setOfferAmount] = useState("");
  const [offerMessage, setOfferMessage] = useState("");
  const [isWished, setIsWished] = useState(false);

  useEffect(() => {
    fetch(`/api/products/${id}`)
      .then((r) => r.json())
      .then((data) => setProduct(data.product))
      .catch(() => {});
  }, [id]);

  if (!product) {
    return (
      <div>
        <Nav />
        <div style={{ textAlign: "center", padding: "120px 32px" }}>
          <p style={{ color: "var(--text-dim)", animation: "pulse 1.5s infinite" }}>Loading...</p>
        </div>
      </div>
    );
  }

  const hasImage = product.images && product.images.length > 0;
  const isMerch = product.category === "ZÖAR Merch";
  const sellerTier = product.seller?.membershipTier?.replace("_", " ") || "Member Seller";

  const handleOffer = async () => {
    await fetch("/api/offers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        productId: product.id,
        amount: Math.round(parseFloat(offerAmount) * 100),
        message: offerMessage,
      }),
    });
    setShowOffer(false);
    setOfferAmount("");
    setOfferMessage("");
    alert("Offer submitted privately.");
  };

  return (
    <div>
      <Nav />
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "48px 32px 120px" }}>
        <Link
          href="/vault"
          style={{
            background: "none",
            border: "none",
            color: "var(--text-dim)",
            fontSize: 12,
            letterSpacing: 2,
            textTransform: "uppercase",
            marginBottom: 32,
            display: "inline-block",
          }}
        >
          ← Back to Vault
        </Link>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "start", marginTop: 24 }}>
          {/* Image */}
          <div
            style={{
              aspectRatio: "1",
              background: product.color ? `linear-gradient(135deg, ${product.color}33, var(--bg))` : "#151515",
              border: "1px solid var(--border)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
              position: "relative",
            }}
          >
            {product.exclusive && (
              <span
                style={{
                  position: "absolute",
                  top: 16,
                  right: 16,
                  fontSize: 10,
                  letterSpacing: 2,
                  color: "var(--gold)",
                  background: "rgba(10,10,10,0.9)",
                  padding: "6px 14px",
                  border: "1px solid var(--gold-dim)",
                  textTransform: "uppercase",
                  zIndex: 2,
                }}
              >
                Exclusive
              </span>
            )}
            {hasImage ? (
              <Image src={product.images[0]} alt={product.name} fill style={{ objectFit: "cover" }} sizes="550px" />
            ) : isMerch ? (
              <ZoarLogo size={80} />
            ) : (
              <span style={{ fontFamily: "var(--serif)", fontSize: 120, color: "rgba(245,240,232,0.06)" }}>Z</span>
            )}
          </div>

          {/* Info */}
          <div className="fade-up">
            <p style={{ fontSize: 11, letterSpacing: 4, textTransform: "uppercase", color: "var(--gold)", marginBottom: 16 }}>
              {product.category}
            </p>
            <h1 style={{ fontFamily: "var(--serif)", fontSize: 36, fontWeight: 400, marginBottom: 8, color: "var(--cream)", lineHeight: 1.2 }}>
              {product.name}
            </h1>
            <p style={{ fontSize: 16, color: "var(--cream-dim)", marginBottom: 24, fontFamily: "var(--serif)", fontStyle: "italic" }}>
              {product.subtitle}
            </p>

            <div
              style={{
                borderTop: "1px solid var(--border)",
                borderBottom: "1px solid var(--border)",
                padding: "20px 0",
                marginBottom: 24,
                display: "flex",
                gap: 40,
              }}
            >
              <div>
                <p style={{ fontSize: 10, letterSpacing: 2, color: "var(--text-dim)", textTransform: "uppercase", marginBottom: 4 }}>Size</p>
                <p style={{ fontSize: 16, color: "var(--cream)" }}>{product.size}</p>
              </div>
              <div>
                <p style={{ fontSize: 10, letterSpacing: 2, color: "var(--text-dim)", textTransform: "uppercase", marginBottom: 4 }}>Seller</p>
                <p style={{ fontSize: 16, color: "var(--cream)" }}>{sellerTier}</p>
              </div>
              <div>
                <p style={{ fontSize: 10, letterSpacing: 2, color: "var(--text-dim)", textTransform: "uppercase", marginBottom: 4 }}>Condition</p>
                <p style={{ fontSize: 16, color: "var(--cream)" }}>{product.condition}</p>
              </div>
            </div>

            {isMember ? (
              <>
                <p style={{ fontFamily: "var(--serif)", fontSize: 42, fontWeight: 500, color: "var(--cream)", marginBottom: 32 }}>
                  ${(product.price / 100).toLocaleString()}
                </p>
                <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 24 }}>
                  <button className="btn-gold">Add to Cart</button>
                  <button className="btn-lux" onClick={() => setShowOffer(!showOffer)}>
                    Make Private Offer
                  </button>
                  <button
                    onClick={() => setIsWished(!isWished)}
                    style={{
                      padding: "14px 20px",
                      border: `1px solid ${isWished ? "var(--gold)" : "var(--border)"}`,
                      background: "transparent",
                      color: isWished ? "var(--gold)" : "var(--cream-dim)",
                      cursor: "pointer",
                      fontSize: 18,
                      transition: "all 0.3s",
                    }}
                  >
                    {isWished ? "♥" : "♡"}
                  </button>
                </div>

                {showOffer && (
                  <div className="fade-up" style={{ padding: 24, border: "1px solid var(--border)", background: "var(--bg-alt)", marginBottom: 24 }}>
                    <p style={{ fontSize: 12, letterSpacing: 2, textTransform: "uppercase", color: "var(--gold)", marginBottom: 16 }}>
                      Private Offer
                    </p>
                    <input
                      className="input-lux"
                      placeholder="Your offer amount ($)"
                      value={offerAmount}
                      onChange={(e) => setOfferAmount(e.target.value)}
                      style={{ marginBottom: 12 }}
                    />
                    <textarea
                      className="input-lux"
                      placeholder="Message to seller (optional)"
                      rows={3}
                      value={offerMessage}
                      onChange={(e) => setOfferMessage(e.target.value)}
                      style={{ marginBottom: 16, resize: "vertical" }}
                    />
                    <button className="btn-gold btn-sm" onClick={handleOffer}>
                      Submit Offer
                    </button>
                  </div>
                )}
              </>
            ) : (
              <MemberGate />
            )}

            <div style={{ marginTop: 24, padding: 20, border: "1px solid var(--border)", fontSize: 12, color: "var(--text-dim)", lineHeight: 1.8 }}>
              <p style={{ color: "var(--cream-dim)", marginBottom: 8, letterSpacing: 1 }}>ZÖAR GUARANTEE</p>
              <p>Every item authenticated. Every transaction private. Every exchange protected by the ZÖAR network.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
