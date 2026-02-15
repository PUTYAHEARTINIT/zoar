import { prisma } from "@/lib/prisma";
import Nav from "@/components/Nav";
import Link from "next/link";
import ZoarLogo from "@/components/ZoarLogo";

async function getMerch() {
  try {
    return await prisma.product.findMany({
      where: { category: "ZÖAR Merch", status: "ACTIVE" },
      orderBy: { price: "asc" },
    });
  } catch {
    return [];
  }
}

export default async function MerchPage() {
  const products = await getMerch();

  return (
    <div>
      <Nav />
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "48px 32px 120px" }}>
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <p style={{ fontSize: 11, letterSpacing: 6, textTransform: "uppercase", color: "var(--accent)", marginBottom: 12 }}>
            Official Branded Goods
          </p>
          <h1 style={{ fontFamily: "var(--serif)", fontSize: 48, fontWeight: 300, color: "var(--cream)", letterSpacing: 4 }}>
            ZÖAR Merch
          </h1>
          <p style={{ marginTop: 12, fontSize: 13, color: "var(--text-dim)" }}>Represent the network. Wear the symbol.</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 20 }}>
          {products.map((p, i) => (
            <Link
              key={p.id}
              href={`/vault/${p.id}`}
              className={`hover-scale fade-up-d${Math.min(i + 1, 4)}`}
              style={{
                border: "1px solid var(--border)",
                background: "var(--bg-alt)",
                position: "relative",
                overflow: "hidden",
                display: "block",
              }}
            >
              {p.exclusive && (
                <span
                  style={{
                    position: "absolute",
                    top: 12,
                    right: 12,
                    zIndex: 2,
                    fontSize: 9,
                    letterSpacing: 2,
                    textTransform: "uppercase",
                    color: "var(--accent)",
                    background: "rgba(10,10,10,0.85)",
                    padding: "4px 10px",
                    border: "1px solid var(--accent-dim)",
                  }}
                >
                  Exclusive
                </span>
              )}
              <div
                style={{
                  aspectRatio: "1",
                  background: p.color ? `linear-gradient(135deg, ${p.color}33, var(--bg))` : "#151515",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                }}
              >
                <ZoarLogo
                  size={48}
                  color={p.color === "#0a0a0a" || p.color === "#333" || p.color === "#0d0d0d" ? "#F5F0E8" : "#0A0A0A"}
                />
                <span style={{ fontSize: 10, letterSpacing: 3, color: "var(--text-dim)", textTransform: "uppercase" }}>
                  {p.subtitle}
                </span>
              </div>
              <div style={{ padding: "18px 20px" }}>
                <p style={{ fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: "var(--accent)", marginBottom: 6 }}>
                  ZÖAR Merch
                </p>
                <h3 style={{ fontFamily: "var(--serif)", fontSize: 17, fontWeight: 400, marginBottom: 4, color: "var(--cream)", lineHeight: 1.3 }}>
                  {p.name}
                </h3>
                <p style={{ fontSize: 12, color: "var(--text-dim)", marginBottom: 10 }}>{p.subtitle}</p>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontFamily: "var(--serif)", fontSize: 18, fontWeight: 500, color: "var(--cream)" }}>
                    ${(p.price / 100).toLocaleString()}
                  </span>
                  <span style={{ fontSize: 11, color: "var(--text-dim)" }}>Size {p.size}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
