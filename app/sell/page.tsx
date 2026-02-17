"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Nav from "@/components/Nav";
import MemberGate from "@/components/MemberGate";

const CATEGORIES = [
  "Rick Owens",
  "Balenciaga",
  "Jordan",
  "Bapesta",
  "Nike SB",
  "Bottega Veneta",
  "Maison Margiela",
  "Marni",
  "Gucci",
  "Prada",
  "Mihara",
  "Other",
];

export default function SellPage() {
  const { data: session } = useSession();
  const isMember =
    (session?.user as any)?.membershipStatus === "ACTIVE" &&
    ((session?.user as any)?.role === "MEMBER" || (session?.user as any)?.role === "ADMIN");

  const [form, setForm] = useState({
    name: "",
    subtitle: "",
    category: "",
    size: "",
    condition: "New / DS",
    price: "",
    negotiable: true,
    silentBid: false,
  });
  const [images, setImages] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages(Array.from(e.target.files).slice(0, 6));
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // Upload images first
      const imagePaths: string[] = [];
      for (const img of images) {
        const formData = new FormData();
        formData.append("file", img);
        const res = await fetch("/api/upload", { method: "POST", body: formData });
        const data = await res.json();
        if (data.path) imagePaths.push(data.path);
      }

      await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          price: Math.round(parseFloat(form.price) * 100),
          images: imagePaths,
        }),
      });
      setSuccess(true);
    } catch {
      alert("Error submitting listing.");
    }
    setLoading(false);
  };

  if (!isMember) {
    return (
      <div>
        <Nav />
        <div style={{ maxWidth: 600, margin: "0 auto", padding: "120px 32px", textAlign: "center" }}>
          <p style={{ fontSize: 11, letterSpacing: 6, textTransform: "uppercase", color: "var(--accent)", marginBottom: 24 }}>
            Sell on ZÖAR
          </p>
          <h1 style={{ fontFamily: "var(--serif)", fontSize: 42, fontWeight: 300, color: "var(--cream)", marginBottom: 16 }}>
            Members Only
          </h1>
          <p style={{ fontSize: 14, color: "var(--text-dim)", marginBottom: 32 }}>
            Only approved members can list items on the ZÖAR marketplace.
          </p>
          <Link href="/apply" className="btn-accent">
            Apply for Membership
          </Link>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div>
        <Nav />
        <div style={{ maxWidth: 600, margin: "0 auto", padding: "120px 32px", textAlign: "center" }}>
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
            <span style={{ fontFamily: "var(--serif)", fontSize: 28, color: "var(--accent)" }}>✓</span>
          </div>
          <h2 style={{ fontFamily: "var(--serif)", fontSize: 28, fontWeight: 300, color: "var(--cream)", marginBottom: 16 }}>
            Listed Successfully
          </h2>
          <p style={{ fontSize: 14, color: "var(--text-dim)", marginBottom: 32 }}>
            Your item is now live on the Marketplace.
          </p>
          <div style={{ display: "flex", gap: 16, justifyContent: "center" }}>
            <button className="btn-accent" onClick={() => { setSuccess(false); setForm({ name: "", subtitle: "", category: "", size: "", condition: "New / DS", price: "", negotiable: true, silentBid: false }); setImages([]); }}>
              List Another
            </button>
            <Link href="/marketplace" className="btn-lux">
              View Marketplace
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Nav />
      <div style={{ maxWidth: 700, margin: "0 auto", padding: "48px 32px 120px" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <p style={{ fontSize: 11, letterSpacing: 6, textTransform: "uppercase", color: "var(--accent)", marginBottom: 12 }}>
            Sell to the Network
          </p>
          <h1 style={{ fontFamily: "var(--serif)", fontSize: 42, fontWeight: 300, color: "var(--cream)" }}>List on Marketplace</h1>
        </div>

        {/* Seller Tiers */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 40 }}>
          {[
            { tier: "Member Seller", desc: "Standard listing access", icon: "○" },
            { tier: "Verified Collector", desc: "Priority + badge", icon: "◎" },
            { tier: "Elite Curator", desc: "Featured + concierge", icon: "◉" },
          ].map((t, i) => (
            <div
              key={i}
              style={{
                padding: 20,
                border: `1px solid ${i === 2 ? "var(--accent)" : "var(--border)"}`,
                textAlign: "center",
                background: i === 2 ? "rgba(255,255,255,0.02)" : "transparent",
              }}
            >
              <p style={{ fontSize: 24, marginBottom: 8 }}>{t.icon}</p>
              <p
                style={{
                  fontSize: 12,
                  fontWeight: 500,
                  letterSpacing: 1.5,
                  color: i === 2 ? "var(--accent)" : "var(--cream)",
                  marginBottom: 4,
                  textTransform: "uppercase",
                }}
              >
                {t.tier}
              </p>
              <p style={{ fontSize: 11, color: "var(--text-dim)" }}>{t.desc}</p>
            </div>
          ))}
        </div>

        <div className="fade-up" style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <select
            className="input-lux"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
          >
            <option value="">Select Brand / Category</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <input
            className="input-lux"
            placeholder="Item Name (e.g. Ramones High)"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <input
            className="input-lux"
            placeholder="Subtitle / Colorway (e.g. Black Leather)"
            value={form.subtitle}
            onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
          />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <input
              className="input-lux"
              placeholder="Size"
              value={form.size}
              onChange={(e) => setForm({ ...form, size: e.target.value })}
            />
            <select
              className="input-lux"
              value={form.condition}
              onChange={(e) => setForm({ ...form, condition: e.target.value })}
            >
              <option value="New / DS">New / Deadstock</option>
              <option value="Like New">Like New</option>
              <option value="Gently Used">Gently Used</option>
              <option value="Used">Used</option>
            </select>
          </div>
          <input
            className="input-lux"
            placeholder="Price ($)"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
          />

          <div>
            <label
              style={{
                padding: "40px",
                border: "2px dashed var(--border)",
                textAlign: "center",
                cursor: "pointer",
                display: "block",
              }}
            >
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                style={{ display: "none" }}
              />
              {images.length > 0 ? (
                <p style={{ color: "var(--cream)" }}>{images.length} image(s) selected</p>
              ) : (
                <>
                  <p style={{ color: "var(--text-dim)", marginBottom: 4 }}>Drop images here or click to upload</p>
                  <p style={{ fontSize: 11, color: "var(--text-dim)" }}>Up to 6 photos recommended</p>
                </>
              )}
            </label>
          </div>

          <div style={{ display: "flex", gap: 12 }}>
            <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "var(--cream-dim)", cursor: "pointer" }}>
              <input
                type="checkbox"
                checked={form.negotiable}
                onChange={(e) => setForm({ ...form, negotiable: e.target.checked })}
                style={{ accentColor: "var(--accent)" }}
              />
              Accept offers
            </label>
            <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "var(--cream-dim)", cursor: "pointer" }}>
              <input
                type="checkbox"
                checked={form.silentBid}
                onChange={(e) => setForm({ ...form, silentBid: e.target.checked })}
                style={{ accentColor: "var(--accent)" }}
              />
              Silent bidding
            </label>
          </div>

          <button
            className="btn-accent"
            style={{ width: "100%" }}
            onClick={handleSubmit}
            disabled={loading || !form.name || !form.category || !form.size || !form.price}
          >
            {loading ? "Submitting..." : "Submit Listing"}
          </button>
        </div>
      </div>
    </div>
  );
}
