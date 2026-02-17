import Link from "next/link";
import Nav from "@/components/Nav";

export default function MarketplacePage() {
  return (
    <div>
      <Nav />
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "80px 32px 120px" }}>
        {/* Hero */}
        <div style={{ textAlign: "center", marginBottom: 72 }}>
          <div style={{ width: 80, height: 1, background: "var(--accent)", margin: "0 auto 32px" }} />
          <p style={{ fontSize: 11, letterSpacing: 6, textTransform: "uppercase", color: "var(--accent)", marginBottom: 16 }}>
            Coming Soon
          </p>
          <h1 style={{ fontFamily: "var(--serif)", fontSize: "clamp(36px, 6vw, 56px)", fontWeight: 300, color: "var(--cream)", letterSpacing: 4, marginBottom: 20 }}>
            The Marketplace
          </h1>
          <p style={{ fontFamily: "var(--serif)", fontSize: 20, fontWeight: 300, fontStyle: "italic", color: "var(--cream-dim)", letterSpacing: 2, marginBottom: 32 }}>
            Member-to-Member. Peer-to-Peer. Private by Design.
          </p>
          <div style={{ width: 60, height: 1, background: "rgba(245,240,232,0.13)", margin: "0 auto" }} />
        </div>

        {/* What Is the Marketplace */}
        <div className="fade-up" style={{ marginBottom: 64 }}>
          <p style={{ fontSize: 14, lineHeight: 2, color: "var(--text-dim)", marginBottom: 24 }}>
            The ZÖAR Marketplace is a private exchange built exclusively for verified members of the network. Unlike the Vault — where ZÖAR curates and sources every piece directly — the Marketplace puts the power in your hands. List what you own. Find what you want. Move pieces within a trusted circle of collectors, enthusiasts, and tastemakers who operate on the same level.
          </p>
          <p style={{ fontSize: 14, lineHeight: 2, color: "var(--text-dim)" }}>
            No algorithms deciding what you see. No bots sniping your listings. No public storefronts exposing your business. Every transaction is facilitated through ZÖAR — anonymous, authenticated, and protected. The seller never knows the buyer. The buyer never knows the seller. ZÖAR handles the handoff so both sides walk away clean.
          </p>
        </div>

        {/* How It Works */}
        <div className="fade-up-d1" style={{ marginBottom: 64 }}>
          <p style={{ fontSize: 11, letterSpacing: 6, textTransform: "uppercase", color: "var(--accent)", marginBottom: 24 }}>
            How It Works
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {[
              {
                num: "01",
                title: "Submit Your Listing",
                desc: "Upload your piece, set your price, and submit for review. Our team personally verifies every listing before it goes live — photos, description, condition, and authenticity. Once approved, your item is visible to the entire network. You control the price, the condition notes, and whether you accept offers.",
              },
              {
                num: "02",
                title: "Stay Anonymous",
                desc: "Your identity is never revealed to buyers. Listings show your membership tier badge only — no name, no handle, no profile link. All inquiries and offers are routed through ZÖAR. Your business stays your business.",
              },
              {
                num: "03",
                title: "ZÖAR Facilitates Everything",
                desc: "When a buyer wants your piece, ZÖAR handles the entire transaction. Communication, payment processing, authentication verification, and shipping coordination all go through us. Both parties are protected by the ZÖAR Guarantee.",
              },
              {
                num: "04",
                title: "Get Paid Securely",
                desc: "Funds are held in escrow until the buyer confirms receipt and authenticity. Once confirmed, payment is released directly to you. No chargebacks. No disputes handled outside the network. Clean money, clean transactions.",
              },
            ].map((step) => (
              <div
                key={step.num}
                style={{
                  padding: "28px 32px",
                  border: "1px solid var(--border)",
                  position: "relative",
                }}
              >
                <span style={{ fontFamily: "var(--serif)", fontSize: 13, color: "var(--accent)", letterSpacing: 3, marginBottom: 8, display: "block" }}>
                  {step.num}
                </span>
                <h3 style={{ fontFamily: "var(--serif)", fontSize: 20, fontWeight: 400, color: "var(--cream)", marginBottom: 10, letterSpacing: 1 }}>
                  {step.title}
                </h3>
                <p style={{ fontSize: 13, lineHeight: 1.9, color: "var(--text-dim)" }}>
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* What You Can Sell */}
        <div className="fade-up-d2" style={{ marginBottom: 64 }}>
          <p style={{ fontSize: 11, letterSpacing: 6, textTransform: "uppercase", color: "var(--accent)", marginBottom: 24 }}>
            What You Can List
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 16 }}>
            {[
              "Designer Footwear",
              "Streetwear & Hype",
              "Limited Jordans",
              "Nike SB Dunks",
              "Air Force 1 Collabs",
              "Air Max Exclusives",
              "Rick Owens",
              "Balenciaga",
              "Bottega Veneta",
              "Maison Margiela",
              "Bapesta & A Bathing Ape",
              "Accessories & Bags",
            ].map((cat) => (
              <div
                key={cat}
                style={{
                  padding: "16px 20px",
                  border: "1px solid var(--border)",
                  fontSize: 12,
                  letterSpacing: 1.5,
                  color: "var(--cream-dim)",
                  textAlign: "center",
                  textTransform: "uppercase",
                }}
              >
                {cat}
              </div>
            ))}
          </div>
        </div>

        {/* The Rules */}
        <div
          className="fade-up-d3"
          style={{
            padding: "40px 48px",
            border: "1px solid var(--accent)",
            background: "rgba(255,255,255,0.02)",
            marginBottom: 64,
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
            Marketplace Standards
          </span>
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <p style={{ fontSize: 14, lineHeight: 1.9, color: "var(--text-dim)" }}>
              <strong style={{ color: "var(--cream)" }}>Authenticity is non-negotiable.</strong> Every item listed on the Marketplace must be genuine, accurately described, and photographed by the seller. Misrepresentation results in immediate and permanent removal from the network.
            </p>
            <p style={{ fontSize: 14, lineHeight: 1.9, color: "var(--text-dim)" }}>
              <strong style={{ color: "var(--cream)" }}>Pricing is yours to set.</strong> There are no price floors or ceilings. List at retail, list below, list above — the market decides. Buyers can submit private offers if you allow it. Silent bidding is available for high-value pieces.
            </p>
            <p style={{ fontSize: 14, lineHeight: 1.9, color: "var(--text-dim)" }}>
              <strong style={{ color: "var(--cream)" }}>ZÖAR takes a 20% consignment fee.</strong> This covers listing verification, authentication support, escrow, payment processing, and full buyer/seller protection. No hidden fees. No subscription charges beyond your membership. You keep 80% — we handle everything else.
            </p>
          </div>
        </div>

        {/* Why This Matters */}
        <div className="fade-up-d4" style={{ textAlign: "center", marginBottom: 72 }}>
          <p style={{ fontSize: 11, letterSpacing: 6, textTransform: "uppercase", color: "var(--accent)", marginBottom: 24 }}>
            Why This Matters
          </p>
          <p style={{ fontFamily: "var(--serif)", fontSize: 24, fontWeight: 300, color: "var(--cream)", lineHeight: 1.6, maxWidth: 650, margin: "0 auto 24px" }}>
            Every resale platform is public. Every marketplace is flooded. Every transaction is a gamble.
          </p>
          <p style={{ fontSize: 14, lineHeight: 2, color: "var(--text-dim)", maxWidth: 600, margin: "0 auto" }}>
            The ZÖAR Marketplace exists because the community asked for it. Members wanted a way to move pieces within the network — privately, securely, and without the noise of public platforms. No fake listings. No scam accounts. No lowball bots. Just verified members exchanging verified pieces through a system designed to protect both sides.
          </p>
        </div>

        {/* CTA */}
        <div
          style={{
            textAlign: "center",
            padding: "56px 40px",
            border: "1px solid var(--border)",
            background: "var(--bg-alt)",
          }}
        >
          <p style={{ fontFamily: "var(--serif)", fontSize: 32, fontWeight: 300, color: "var(--cream)", marginBottom: 12 }}>
            Launching Soon
          </p>
          <p style={{ fontSize: 14, color: "var(--text-dim)", marginBottom: 32, maxWidth: 480, margin: "0 auto 32px" }}>
            The Marketplace is currently in development. Members will be the first to know when it goes live. Not a member yet? Now is the time.
          </p>
          <div style={{ display: "flex", gap: 20, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/apply" className="btn-accent">
              Apply for Membership
            </Link>
            <Link href="/vault" className="btn-lux">
              Browse the Vault
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
