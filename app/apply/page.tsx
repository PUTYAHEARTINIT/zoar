"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Nav from "@/components/Nav";

export default function ApplyPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name: "",
    email: "",
    instagram: "",
    referralCode: "",
    bio: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/membership/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else {
        setStep(2);
      }
    } catch {
      setStep(2);
    }
    setLoading(false);
  };

  return (
    <div>
      <Nav />
      <div style={{ maxWidth: 600, margin: "0 auto", padding: "80px 32px 120px" }}>
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <p style={{ fontSize: 11, letterSpacing: 6, textTransform: "uppercase", color: "var(--accent)", marginBottom: 16 }}>
            Membership Application
          </p>
          <h1 style={{ fontFamily: "var(--serif)", fontSize: 42, fontWeight: 300, color: "var(--cream)", marginBottom: 12 }}>
            Request Access
          </h1>
          <p style={{ fontSize: 14, color: "var(--text-dim)", lineHeight: 1.8 }}>
            ZÖAR is not for everyone — only those invited. Submit your application for review.
          </p>
        </div>

        {/* UA / Factory Direct Declaration */}
        <div
          style={{
            padding: "24px 28px",
            border: "1px solid var(--accent)",
            background: "rgba(255,255,255,0.04)",
            marginBottom: 40,
          }}
        >
          <p
            style={{
              fontSize: 10,
              letterSpacing: 3,
              textTransform: "uppercase",
              color: "var(--accent)",
              marginBottom: 12,
            }}
          >
            Inventory Disclosure
          </p>
          <p style={{ fontSize: 13, color: "var(--cream-dim)", lineHeight: 1.8, marginBottom: 12 }}>
            ZÖAR carries <strong style={{ color: "var(--cream)" }}>UA (Unauthorized Authentic)</strong> merchandise — product manufactured in the same factories as major fashion houses, using identical materials and construction, sold factory-direct without brand authorization.
          </p>
          <p style={{ fontSize: 13, color: "var(--cream-dim)", lineHeight: 1.8, marginBottom: 12 }}>
            This is <strong style={{ color: "var(--cream)" }}>not replica</strong>. These are the same shoes, same leather, same stitching — just without the retail markup and brand middleman. We also carry <strong style={{ color: "var(--cream)" }}>overstock</strong> and <strong style={{ color: "var(--cream)" }}>factory flaw</strong> pieces at significant discount.
          </p>
          <p style={{ fontSize: 12, color: "var(--text-dim)", fontStyle: "italic" }}>
            By applying, you acknowledge and accept the nature of our inventory.
          </p>
        </div>

        {/* 12-Month Activity Requirement */}
        <div
          style={{
            padding: "20px 28px",
            border: "1px solid var(--border)",
            marginBottom: 40,
          }}
        >
          <p style={{ fontSize: 10, letterSpacing: 3, textTransform: "uppercase", color: "var(--accent)", marginBottom: 8 }}>
            Membership Terms
          </p>
          <p style={{ fontSize: 13, color: "var(--text-dim)", lineHeight: 1.8 }}>
            Active membership requires at least <strong style={{ color: "var(--cream)" }}>one purchase every 12 months</strong>. Members who do not transact within a year of their last purchase will have membership automatically revoked. No exceptions. This is a marketplace — not a museum.
          </p>
        </div>

        {step === 1 && (
          <div className="fade-up" style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <input
              className="input-lux"
              placeholder="Full Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <input
              className="input-lux"
              placeholder="Email Address"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            <input
              className="input-lux"
              placeholder="Instagram Handle"
              value={form.instagram}
              onChange={(e) => setForm({ ...form, instagram: e.target.value })}
            />
            <input
              className="input-lux"
              placeholder="Referral Code (if applicable)"
              value={form.referralCode}
              onChange={(e) => setForm({ ...form, referralCode: e.target.value })}
            />
            <textarea
              className="input-lux"
              placeholder="Tell us about yourself. What brands define your style? What are you searching for?"
              rows={4}
              value={form.bio}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
              style={{ resize: "vertical" }}
            />
            <div style={{ borderTop: "1px solid var(--border)", paddingTop: 24, marginTop: 8 }}>
              <p style={{ fontSize: 12, color: "var(--text-dim)", marginBottom: 16 }}>
                Application Fee: <span style={{ color: "var(--accent)" }}>$25</span> (non-refundable)
              </p>
              <button
                className="btn-accent"
                style={{ width: "100%" }}
                onClick={handleSubmit}
                disabled={loading || !form.name || !form.email}
              >
                {loading ? "Processing..." : "Submit Application"}
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="fade-up" style={{ textAlign: "center", padding: "48px 32px", border: "1px solid rgba(255,255,255,0.2)" }}>
            <div
              style={{
                width: 60,
                height: 60,
                border: "2px solid var(--accent)",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 24px",
              }}
            >
              <span style={{ fontFamily: "var(--serif)", fontSize: 28, color: "var(--accent)" }}>∞</span>
            </div>
            <h2 style={{ fontFamily: "var(--serif)", fontSize: 28, fontWeight: 300, color: "var(--cream)", marginBottom: 16 }}>
              Application Received
            </h2>
            <p style={{ fontSize: 14, color: "var(--text-dim)", lineHeight: 1.8, marginBottom: 32 }}>
              Your application is under review. Approved members receive access within 24-48 hours.
            </p>
            <button className="btn-lux" onClick={() => router.push("/")}>
              Return Home
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
