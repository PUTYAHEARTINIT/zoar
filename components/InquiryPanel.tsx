"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface InquiryPanelProps {
  isOpen: boolean;
  onClose: () => void;
  product: {
    id: string;
    name: string;
    subtitle?: string | null;
    category: string;
    price: number;
    images: string[];
  };
  user?: {
    name?: string | null;
    email?: string | null;
  } | null;
  isMember: boolean;
}

export default function InquiryPanel({ isOpen, onClose, product, user, isMember }: InquiryPanelProps) {
  const router = useRouter();
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState("");
  const [sizeNeeded, setSizeNeeded] = useState("");
  const [showOffer, setShowOffer] = useState(false);
  const [offerAmount, setOfferAmount] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!name || !email || !sizeNeeded) {
      setError("Name, email, and size are required.");
      return;
    }
    setError("");
    setSubmitting(true);

    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product.id,
          name,
          email,
          phone: phone || undefined,
          sizeNeeded,
          offerAmount: showOffer && offerAmount ? parseFloat(offerAmount) : undefined,
          message: message || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.requiresMembership) {
          router.push("/apply");
          return;
        }
        setError(data.error || "Something went wrong.");
        return;
      }

      setSuccess(true);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  // Non-member redirect
  if (!isMember) {
    return (
      <>
        <div
          onClick={onClose}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.7)",
            zIndex: 1000,
            backdropFilter: "blur(4px)",
          }}
        />
        <div
          style={{
            position: "fixed",
            top: 0,
            right: 0,
            bottom: 0,
            width: "100%",
            maxWidth: 500,
            background: "var(--bg)",
            borderLeft: "1px solid var(--border)",
            zIndex: 1001,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: 48,
            textAlign: "center",
            animation: "slideInRight 0.3s ease",
          }}
        >
          <p style={{ fontFamily: "var(--serif)", fontSize: 24, color: "var(--cream)", marginBottom: 16 }}>
            Members Only
          </p>
          <p style={{ fontSize: 14, color: "var(--text-dim)", marginBottom: 32, lineHeight: 1.8 }}>
            Purchase inquiries are available exclusively to ZOAR members.
          </p>
          <button className="btn-accent" onClick={() => router.push("/apply")}>
            Apply for Membership
          </button>
          <button
            onClick={onClose}
            style={{
              marginTop: 16,
              background: "none",
              border: "none",
              color: "var(--text-dim)",
              fontSize: 13,
              cursor: "pointer",
              letterSpacing: 1,
            }}
          >
            Close
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `}</style>

      {/* Overlay */}
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.7)",
          zIndex: 1000,
          backdropFilter: "blur(4px)",
        }}
      />

      {/* Panel */}
      <div
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          bottom: 0,
          width: "100%",
          maxWidth: 500,
          background: "var(--bg)",
          borderLeft: "1px solid var(--border)",
          zIndex: 1001,
          overflowY: "auto",
          animation: "slideInRight 0.3s ease",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "24px 32px",
            borderBottom: "1px solid var(--border)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <p
            style={{
              fontSize: 11,
              letterSpacing: 3,
              textTransform: "uppercase",
              color: "var(--accent)",
            }}
          >
            Purchase Inquiry
          </p>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              color: "var(--cream-dim)",
              fontSize: 20,
              cursor: "pointer",
            }}
          >
            ✕
          </button>
        </div>

        {success ? (
          /* Success State */
          <div style={{ padding: 48, textAlign: "center" }}>
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: "50%",
                border: "2px solid var(--accent)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 24px",
                fontSize: 28,
              }}
            >
              ✓
            </div>
            <h3
              style={{
                fontFamily: "var(--serif)",
                fontSize: 24,
                fontWeight: 300,
                color: "var(--cream)",
                marginBottom: 16,
              }}
            >
              Inquiry Submitted
            </h3>
            <p style={{ fontSize: 14, color: "var(--text-dim)", lineHeight: 1.8, marginBottom: 32 }}>
              Your inquiry for <strong style={{ color: "var(--cream)" }}>{product.name}</strong> has been
              received. We&apos;ll respond within 24 hours via email and SMS.
            </p>
            <button className="btn-accent" onClick={onClose}>
              Close
            </button>
          </div>
        ) : (
          <div style={{ padding: 32 }}>
            {/* Product Summary */}
            <div
              style={{
                display: "flex",
                gap: 16,
                marginBottom: 32,
                padding: 16,
                background: "var(--bg-alt)",
                border: "1px solid var(--border)",
              }}
            >
              <div
                style={{
                  width: 80,
                  height: 80,
                  flexShrink: 0,
                  position: "relative",
                  background: "#151515",
                  overflow: "hidden",
                }}
              >
                {product.images.length > 0 ? (
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    style={{ objectFit: "contain", padding: 4 }}
                    sizes="80px"
                  />
                ) : (
                  <div
                    style={{
                      width: "100%",
                      height: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontFamily: "var(--serif)",
                      fontSize: 24,
                      color: "rgba(245,240,232,0.1)",
                    }}
                  >
                    Z
                  </div>
                )}
              </div>
              <div>
                <p style={{ fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: "var(--accent)", marginBottom: 4 }}>
                  {product.category}
                </p>
                <p style={{ fontFamily: "var(--serif)", fontSize: 16, color: "var(--cream)", marginBottom: 2 }}>
                  {product.name}
                </p>
                <p style={{ fontSize: 13, color: "var(--text-dim)" }}>
                  {product.subtitle}
                </p>
                <p style={{ fontFamily: "var(--serif)", fontSize: 18, color: "var(--cream)", marginTop: 8 }}>
                  ${(product.price / 100).toLocaleString()}
                </p>
              </div>
            </div>

            {/* Form */}
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <label style={{ fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: "var(--cream-dim)", marginBottom: 6, display: "block" }}>
                  Name *
                </label>
                <input
                  className="input-lux"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your full name"
                />
              </div>

              <div>
                <label style={{ fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: "var(--cream-dim)", marginBottom: 6, display: "block" }}>
                  Email *
                </label>
                <input
                  className="input-lux"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label style={{ fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: "var(--cream-dim)", marginBottom: 6, display: "block" }}>
                  Phone
                </label>
                <input
                  className="input-lux"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (555) 000-0000"
                />
              </div>

              <div>
                <label style={{ fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: "var(--cream-dim)", marginBottom: 6, display: "block" }}>
                  Size Needed *
                </label>
                <input
                  className="input-lux"
                  value={sizeNeeded}
                  onChange={(e) => setSizeNeeded(e.target.value)}
                  placeholder="e.g. US 10, EU 43, L, One Size"
                />
              </div>

              {/* Silent Offer Toggle */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "12px 0",
                  cursor: "pointer",
                }}
                onClick={() => setShowOffer(!showOffer)}
              >
                <div
                  style={{
                    width: 18,
                    height: 18,
                    border: `1px solid ${showOffer ? "var(--accent)" : "var(--border-light)"}`,
                    background: showOffer ? "var(--accent)" : "transparent",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    transition: "all 0.2s",
                  }}
                >
                  {showOffer && <span style={{ fontSize: 12, color: "var(--bg)", lineHeight: 1 }}>✓</span>}
                </div>
                <span style={{ fontSize: 13, color: "var(--cream-dim)", letterSpacing: 0.5 }}>
                  Make a silent offer
                </span>
              </div>

              {showOffer && (
                <div style={{ animation: "fadeUp 0.3s ease" }}>
                  <label style={{ fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: "var(--cream-dim)", marginBottom: 6, display: "block" }}>
                    Your Offer ($)
                  </label>
                  <input
                    className="input-lux"
                    type="number"
                    value={offerAmount}
                    onChange={(e) => setOfferAmount(e.target.value)}
                    placeholder="Enter your offer amount"
                    min="1"
                    step="1"
                  />
                </div>
              )}

              <div>
                <label style={{ fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: "var(--cream-dim)", marginBottom: 6, display: "block" }}>
                  Message (Optional)
                </label>
                <textarea
                  className="input-lux"
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Any additional details or questions..."
                  style={{ resize: "vertical" }}
                />
              </div>

              {error && (
                <p style={{ fontSize: 13, color: "var(--danger)", marginTop: 4 }}>{error}</p>
              )}

              <button
                className="btn-accent btn-full"
                onClick={handleSubmit}
                disabled={submitting}
                style={{
                  marginTop: 8,
                  opacity: submitting ? 0.6 : 1,
                  cursor: submitting ? "not-allowed" : "pointer",
                }}
              >
                {submitting ? "Submitting..." : "Submit Inquiry"}
              </button>

              <p style={{ fontSize: 11, color: "var(--text-dim)", textAlign: "center", lineHeight: 1.6, marginTop: 4 }}>
                All inquiries are confidential. Response within 24 hours.
              </p>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
