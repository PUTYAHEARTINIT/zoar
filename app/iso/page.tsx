"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Nav from "@/components/Nav";

interface IsoEntry {
  id: string;
  description: string;
  user: { handle: string | null; name: string };
  createdAt: string;
}

export default function ISOPage() {
  const { data: session } = useSession();
  const isMember =
    (session?.user as any)?.membershipStatus === "ACTIVE" &&
    ((session?.user as any)?.role === "MEMBER" || (session?.user as any)?.role === "ADMIN");

  const [isos, setIsos] = useState<IsoEntry[]>([]);
  const [newIso, setNewIso] = useState("");

  useEffect(() => {
    fetch("/api/iso")
      .then((r) => r.json())
      .then((data) => setIsos(data.isos || []))
      .catch(() => {});
  }, []);

  const handlePost = async () => {
    if (!newIso.trim()) return;
    const res = await fetch("/api/iso", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ description: newIso }),
    });
    if (res.ok) {
      const data = await res.json();
      setIsos((prev) => [data.iso, ...prev]);
      setNewIso("");
    }
  };

  const timeAgo = (date: string) => {
    const mins = Math.floor((Date.now() - new Date(date).getTime()) / 60000);
    if (mins < 1) return "just now";
    if (mins < 60) return `${mins}m ago`;
    if (mins < 1440) return `${Math.floor(mins / 60)}h ago`;
    return `${Math.floor(mins / 1440)}d ago`;
  };

  return (
    <div>
      <Nav />
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "48px 32px 120px" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <p style={{ fontSize: 11, letterSpacing: 6, textTransform: "uppercase", color: "var(--gold)", marginBottom: 12 }}>
            Live Demand Feed
          </p>
          <h1 style={{ fontFamily: "var(--serif)", fontSize: 42, fontWeight: 300, color: "var(--cream)", letterSpacing: 4 }}>
            In Search Of
          </h1>
          <p style={{ marginTop: 12, fontSize: 13, color: "var(--text-dim)" }}>
            See what members are hunting. Got it? List it.
          </p>
        </div>

        {/* Live ticker */}
        {isos.length > 0 && (
          <div
            style={{
              overflow: "hidden",
              borderTop: "1px solid var(--border)",
              borderBottom: "1px solid var(--border)",
              padding: "14px 0",
              marginBottom: 40,
            }}
          >
            <div
              style={{
                display: "flex",
                gap: 60,
                animation: "marquee 30s linear infinite",
                whiteSpace: "nowrap",
              }}
            >
              {[...isos, ...isos].map((iso, i) => (
                <span key={i} style={{ fontSize: 12, color: "var(--cream-dim)", letterSpacing: 1 }}>
                  <span style={{ color: "var(--gold)" }}>●</span> {iso.user?.handle || iso.user?.name} — {iso.description}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Feed */}
        <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
          {isos.map((iso, i) => (
            <div
              key={iso.id}
              className={`fade-up-d${Math.min(i + 1, 4)}`}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "20px 24px",
                background: i % 2 === 0 ? "var(--bg-alt)" : "transparent",
                borderLeft: "2px solid rgba(207,181,59,0.2)",
              }}
            >
              <div>
                <p style={{ fontSize: 11, letterSpacing: 2, color: "var(--gold)", marginBottom: 4 }}>
                  {iso.user?.handle || iso.user?.name}
                </p>
                <p style={{ fontSize: 15, color: "var(--cream)" }}>{iso.description}</p>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <span style={{ fontSize: 11, color: "var(--text-dim)" }}>{timeAgo(iso.createdAt)}</span>
                {isMember && (
                  <Link href="/sell" className="btn-lux btn-sm">
                    I Have This
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Post ISO */}
        {isMember ? (
          <div style={{ marginTop: 48, padding: 32, border: "1px solid var(--border)", background: "var(--bg-alt)" }}>
            <p style={{ fontSize: 12, letterSpacing: 3, textTransform: "uppercase", color: "var(--gold)", marginBottom: 20 }}>
              Post Your ISO
            </p>
            <input
              className="input-lux"
              placeholder="What are you searching for? (e.g. Rick Owens Ramones Black 42)"
              value={newIso}
              onChange={(e) => setNewIso(e.target.value)}
              style={{ marginBottom: 16 }}
            />
            <button className="btn-gold btn-sm" onClick={handlePost}>
              Broadcast to Network
            </button>
          </div>
        ) : (
          <div style={{ marginTop: 48, textAlign: "center", padding: 40, border: "1px solid var(--border)" }}>
            <p style={{ fontFamily: "var(--serif)", fontSize: 20, color: "var(--cream)", marginBottom: 12 }}>
              Members can post and respond to ISOs
            </p>
            <Link href="/apply" className="btn-gold">
              Apply for Access
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
