"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Nav from "@/components/Nav";

function ConciergeForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    brand: "",
    style: "",
    color: "",
    size: "",
    name: "",
    email: "",
    phone: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const brand = searchParams.get("brand");
    if (brand && brand !== "All") {
      setForm((prev) => ({ ...prev, brand }));
    }
  }, [searchParams]);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await fetch("/api/concierge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      setStep(2);
    } catch {
      setStep(2);
    }
    setLoading(false);
  };

  const isValid = form.brand && form.style && form.size && form.name && form.email;

  return (
    <div>
      <Nav />
      <div style={{ maxWidth: 600, margin: "0 auto", padding: "80px 32px 120px" }}>
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <p style={{ fontSize: 11, letterSpacing: 6, textTransform: "uppercase", color: "var(--accent)", marginBottom: 16 }}>
            Specialist Request
          </p>
          <h1 style={{ fontFamily: "var(--serif)", fontSize: 42, fontWeight: 300, color: "var(--cream)", marginBottom: 12 }}>
            Access Our Elite Vault
          </h1>
          <p style={{ fontSize: 14, color: "var(--text-dim)", lineHeight: 1.8 }}>
            Don&apos;t see exactly what you&apos;re looking for? Our specialists have access to extended inventory. Submit your request and we&apos;ll source it for you.
          </p>
        </div>

        {step === 1 && (
          <div className="fade-up" style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div>
              <p style={{ fontSize: 10, letterSpacing: 3, textTransform: "uppercase", color: "var(--accent)", marginBottom: 12 }}>
                Item Details
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <input
                  className="input-lux"
                  placeholder="Brand (e.g. Rick Owens, Jordan)"
                  value={form.brand}
                  onChange={(e) => setForm({ ...form, brand: e.target.value })}
                />
                <input
                  className="input-lux"
                  placeholder="Style / Model (e.g. Geobasket High)"
                  value={form.style}
                  onChange={(e) => setForm({ ...form, style: e.target.value })}
                />
                <input
                  className="input-lux"
                  placeholder="Color (e.g. White Milk)"
                  value={form.color}
                  onChange={(e) => setForm({ ...form, color: e.target.value })}
                />
                <input
                  className="input-lux"
                  placeholder="Size (e.g. US 10 / EU 43)"
                  value={form.size}
                  onChange={(e) => setForm({ ...form, size: e.target.value })}
                />
              </div>
            </div>

            <div style={{ borderTop: "1px solid var(--border)", paddingTop: 20 }}>
              <p style={{ fontSize: 10, letterSpacing: 3, textTransform: "uppercase", color: "var(--accent)", marginBottom: 12 }}>
                Your Information
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <input
                  className="input-lux"
                  placeholder="Full Name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
                <input
                  className="input-lux"
                  placeholder="Email Address"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
                <input
                  className="input-lux"
                  placeholder="Phone (optional)"
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
              </div>
            </div>

            <div style={{ borderTop: "1px solid var(--border)", paddingTop: 24 }}>
              <button
                className="btn-accent"
                style={{ width: "100%" }}
                onClick={handleSubmit}
                disabled={loading || !isValid}
              >
                {loading ? "Submitting..." : "Connect Me With a Specialist"}
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
              Request Received
            </h2>
            <p style={{ fontSize: 14, color: "var(--text-dim)", lineHeight: 1.8, marginBottom: 32 }}>
              A ZÖAR specialist will be in touch within 24 hours to confirm availability.
            </p>
            <button className="btn-lux" onClick={() => router.push("/vault")}>
              Return to Vault
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ConciergePage() {
  return (
    <Suspense fallback={<div />}>
      <ConciergeForm />
    </Suspense>
  );
}
