import Link from "next/link";
import { prisma } from "@/lib/prisma";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import InfinityPattern from "@/components/InfinityPattern";
import ZoarLogo from "@/components/ZoarLogo";
import Image from "next/image";

const FEATURED_BRANDS = [
  "Rick Owens",
  "Balenciaga",
  "Lanvin",
  "Bapesta",
  "Nike SB",
  "Jordan",
  "Louis Vuitton",
  "Gucci",
];

async function getFeaturedProducts() {
  try {
    const results = await Promise.all(
      FEATURED_BRANDS.map((brand) =>
        prisma.product.findFirst({
          where: { status: "ACTIVE", seller: { role: "ADMIN" }, category: brand },
          orderBy: { createdAt: "desc" },
        })
      )
    );
    return results.filter((p): p is NonNullable<typeof p> => p !== null);
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const featured = await getFeaturedProducts();

  return (
    <div>
      <Nav />

      {/* HERO */}
      <section
        style={{
          position: "relative",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          overflow: "hidden",
        }}
      >
        <InfinityPattern opacity={0.04} />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "radial-gradient(ellipse at center, rgba(255,255,255,0.02) 0%, transparent 70%)",
          }}
        />

        <div className="fade-up" style={{ position: "relative", zIndex: 1 }}>
          <div style={{ width: 80, height: 1, background: "var(--accent)", margin: "0 auto 40px" }} />
          <p style={{ fontSize: 11, letterSpacing: 6, textTransform: "uppercase", color: "var(--accent)", marginBottom: 32 }}>
            Private Membership Ecosystem
          </p>
          <h1
            style={{
              fontFamily: "var(--serif)",
              fontSize: "clamp(60px, 10vw, 140px)",
              fontWeight: 300,
              letterSpacing: 12,
              lineHeight: 1,
              marginBottom: 24,
              color: "var(--cream)",
            }}
          >
            ZÖAR
          </h1>
          <p
            style={{
              fontFamily: "var(--serif)",
              fontSize: 20,
              fontWeight: 300,
              fontStyle: "italic",
              color: "var(--cream-dim)",
              marginBottom: 48,
              letterSpacing: 4,
            }}
          >
            For Eyes That Know.
          </p>
          <div style={{ width: 60, height: 1, background: "rgba(245,240,232,0.13)", margin: "0 auto 48px" }} />
          <p
            style={{
              maxWidth: 520,
              margin: "0 auto 56px",
              fontSize: 14,
              lineHeight: 1.9,
              color: "var(--text-dim)",
              letterSpacing: 0.5,
            }}
          >
            An invitation-only luxury fashion network where access is the primary product. Curated collections. Private
            marketplace. Sacred exclusivity.
          </p>
          <div style={{ display: "flex", gap: 20, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/apply" className="btn-accent">
              Request Access
            </Link>
            <Link href="/vault" className="btn-lux">
              View Collection
            </Link>
          </div>
        </div>

        <div style={{ position: "absolute", bottom: 40, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
          <div style={{ width: 1, height: 40, background: "linear-gradient(to bottom, transparent, rgba(245,240,232,0.2))" }} />
          <span style={{ fontSize: 9, letterSpacing: 4, textTransform: "uppercase", color: "var(--text-dim)" }}>Scroll</span>
        </div>
      </section>

      {/* HONOR CODE */}
      <section id="honor-code" style={{ padding: "120px 32px", maxWidth: 800, margin: "0 auto", textAlign: "center" }}>
        <div className="fade-up-d1">
          <p style={{ fontSize: 11, letterSpacing: 6, textTransform: "uppercase", color: "var(--accent)", marginBottom: 24 }}>
            Membership Honor Code
          </p>
          <h2 style={{ fontFamily: "var(--serif)", fontSize: 42, fontWeight: 300, marginBottom: 48, color: "var(--cream)" }}>
            The Rules of Belonging
          </h2>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 40 }}>
          {[
            {
              num: "I",
              title: "KEEP IT QUIET",
              desc: "ZÖAR is not for everyone — only those invited. Don\u2019t post, don\u2019t tag, don\u2019t talk. Respect the silence.",
            },
            {
              num: "II",
              title: "ASK BEFORE YOU ADD",
              desc: "All referrals must be cleared. No one gets in without being vetted. You don\u2019t hand out keys to the vault.",
            },
            {
              num: "III",
              title: "DON\u2019T JACK THE JUICE",
              desc: "This is personal access, not a hustle plug. No reselling. No screenshots. No boosting. What\u2019s here is for you.",
            },
            {
              num: "IV",
              title: "USE IT OR LOSE IT",
              desc: "Members must make at least one purchase within every 12-month period. No activity, no access. If no purchase is made within a year of your last transaction, your membership is automatically revoked. This isn\u2019t a museum — it\u2019s a marketplace for those who move.",
            },
          ].map((r, i) => (
            <div
              key={i}
              className={`fade-up-d${Math.min(i + 2, 4)}`}
              style={{ padding: "32px 40px", border: "1px solid var(--border)", position: "relative", textAlign: "left" }}
            >
              <span
                style={{
                  position: "absolute",
                  top: -12,
                  left: 32,
                  background: "var(--bg)",
                  padding: "0 12px",
                  fontFamily: "var(--serif)",
                  fontSize: 16,
                  color: "var(--accent)",
                  letterSpacing: 4,
                }}
              >
                {r.num}
              </span>
              <h3
                style={{
                  fontFamily: "var(--serif)",
                  fontSize: 20,
                  fontWeight: 600,
                  letterSpacing: 3,
                  marginBottom: 12,
                  color: "var(--cream)",
                }}
              >
                {r.title}
              </h3>
              <p style={{ fontSize: 14, lineHeight: 1.8, color: "var(--text-dim)" }}>{r.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* UA / FACTORY DIRECT DECLARATION */}
      <section style={{ padding: "0 32px 80px", maxWidth: 800, margin: "0 auto" }}>
        <div
          className="fade-up-d2"
          style={{
            padding: "40px 48px",
            border: "1px solid var(--accent)",
            background: "rgba(255,255,255,0.02)",
            position: "relative",
          }}
        >
          <span
            style={{
              position: "absolute",
              top: -12,
              left: 32,
              background: "var(--bg)",
              padding: "0 12px",
              fontFamily: "var(--serif)",
              fontSize: 12,
              color: "var(--accent)",
              letterSpacing: 4,
              textTransform: "uppercase",
            }}
          >
            Inventory Disclosure
          </span>
          <h3 style={{ fontFamily: "var(--serif)", fontSize: 22, fontWeight: 400, color: "var(--cream)", marginBottom: 16, letterSpacing: 2 }}>
            What We Carry
          </h3>
          <p style={{ fontSize: 14, lineHeight: 1.9, color: "var(--text-dim)", marginBottom: 16 }}>
            ZÖAR carries <strong style={{ color: "var(--cream)" }}>UA (Unauthorized Authentic)</strong> merchandise —
            product manufactured in the same factories as major fashion houses, using identical materials, patterns, and
            construction methods. These pieces are sold factory-direct without brand authorization.{" "}
            <strong style={{ color: "var(--cream)" }}>This is not replica.</strong> Same factory. Same materials. Same quality.
            No retail middleman.
          </p>
          <p style={{ fontSize: 14, lineHeight: 1.9, color: "var(--text-dim)", marginBottom: 16 }}>
            We also carry <strong style={{ color: "var(--cream)" }}>overstock</strong> — excess inventory from authorized
            production runs — and <strong style={{ color: "var(--cream)" }}>factory flaw</strong> pieces that didn&apos;t pass
            QC for minor cosmetic imperfections but are structurally identical to retail.
          </p>
          <p style={{ fontSize: 12, color: "var(--cream-dim)", fontStyle: "italic", fontFamily: "var(--serif)", letterSpacing: 1 }}>
            Every piece authenticated by the network. Every flaw disclosed. Every price honest.
          </p>
        </div>
      </section>

      {/* FEATURED DROPS */}
      <section style={{ padding: "80px 32px 120px", maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <p style={{ fontSize: 11, letterSpacing: 6, textTransform: "uppercase", color: "var(--accent)", marginBottom: 16 }}>
            New Heat Just Landed
          </p>
          <h2 style={{ fontFamily: "var(--serif)", fontSize: 36, fontWeight: 300, color: "var(--cream)" }}>Featured Drops</h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 24 }}>
          {featured.map((p, i) => (
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
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden",
                  position: "relative",
                }}
              >
                {p.images.length > 0 ? (
                  <Image src={p.images[0]} alt={p.name} fill style={{ objectFit: "cover" }} sizes="280px" />
                ) : (
                  <span style={{ fontFamily: "var(--serif)", fontSize: 48, fontWeight: 300, color: "rgba(245,240,232,0.08)" }}>Z</span>
                )}
              </div>
              <div style={{ padding: "18px 20px" }}>
                <p style={{ fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: "var(--accent)", marginBottom: 6 }}>
                  {p.category}
                </p>
                <h3 style={{ fontFamily: "var(--serif)", fontSize: 17, fontWeight: 400, marginBottom: 4, color: "var(--cream)", lineHeight: 1.3 }}>
                  {p.name}
                </h3>
                <p style={{ fontSize: 12, color: "var(--text-dim)" }}>{p.subtitle}</p>
              </div>
            </Link>
          ))}
        </div>
        <div style={{ textAlign: "center", marginTop: 56, display: "flex", gap: 20, justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/vault" className="btn-lux">
            View Full Vault
          </Link>
          <Link href="/marketplace" className="btn-lux">
            Browse Marketplace
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
