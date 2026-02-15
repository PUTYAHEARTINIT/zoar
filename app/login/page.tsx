"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Nav from "@/components/Nav";
import ZoarLogo from "@/components/ZoarLogo";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.error) {
      setError("Invalid credentials. Access denied.");
      setLoading(false);
    } else {
      router.push("/vault");
      router.refresh();
    }
  };

  return (
    <div>
      <Nav />
      <div
        style={{
          maxWidth: 440,
          margin: "0 auto",
          padding: "80px 32px 120px",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <ZoarLogo size={48} />
          <p
            style={{
              fontSize: 11,
              letterSpacing: 6,
              textTransform: "uppercase",
              color: "var(--gold)",
              marginTop: 24,
              marginBottom: 12,
            }}
          >
            Member Access
          </p>
          <h1
            style={{
              fontFamily: "var(--serif)",
              fontSize: 36,
              fontWeight: 300,
              color: "var(--cream)",
              letterSpacing: 4,
            }}
          >
            Sign In
          </h1>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {error && (
            <div
              style={{
                padding: "14px 20px",
                border: "1px solid #cc2233",
                background: "rgba(204,34,51,0.08)",
                color: "#cc2233",
                fontSize: 13,
                letterSpacing: 0.5,
                textAlign: "center",
              }}
            >
              {error}
            </div>
          )}

          <div>
            <label
              style={{
                display: "block",
                fontSize: 10,
                letterSpacing: 2,
                textTransform: "uppercase",
                color: "var(--text-dim)",
                marginBottom: 8,
              }}
            >
              Email
            </label>
            <input
              className="input-lux"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
            />
          </div>

          <div>
            <label
              style={{
                display: "block",
                fontSize: 10,
                letterSpacing: 2,
                textTransform: "uppercase",
                color: "var(--text-dim)",
                marginBottom: 8,
              }}
            >
              Password
            </label>
            <input
              className="input-lux"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="btn-gold"
            disabled={loading}
            style={{ marginTop: 8, width: "100%", opacity: loading ? 0.6 : 1 }}
          >
            {loading ? "Verifying..." : "Enter"}
          </button>
        </form>

        <div style={{ textAlign: "center", marginTop: 40 }}>
          <p style={{ fontSize: 13, color: "var(--text-dim)" }}>
            Not a member?{" "}
            <Link href="/apply" style={{ color: "var(--gold)", textDecoration: "underline" }}>
              Apply for access
            </Link>
          </p>
        </div>

        <div
          style={{
            marginTop: 48,
            padding: "20px 24px",
            border: "1px solid var(--border)",
            background: "var(--bg-alt)",
            textAlign: "center",
          }}
        >
          <p style={{ fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: "var(--text-dim)" }}>
            Admin access →{" "}
            <Link href="/admin/login" style={{ color: "var(--gold-dim)" }}>
              /admin/login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
