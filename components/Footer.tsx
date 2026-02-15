import Link from "next/link";
import ZoarLogo from "./ZoarLogo";

const FOOTER_COLS = [
  {
    title: "Platform",
    links: [
      { label: "The Vault", href: "/vault" },
      { label: "ISO Feed", href: "/iso" },
      { label: "Sell", href: "/sell" },
      { label: "Merch", href: "/merch" },
    ],
  },
  {
    title: "Membership",
    links: [
      { label: "Apply", href: "/apply" },
      { label: "Honor Code", href: "/#honor-code" },
      { label: "Profile", href: "/profile" },
    ],
  },
];

export default function Footer() {
  return (
    <footer style={{ borderTop: "1px solid var(--border)", padding: "64px 32px 40px" }}>
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          flexWrap: "wrap",
          gap: 40,
        }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
            <ZoarLogo size={32} />
            <span
              style={{
                fontFamily: "var(--serif)",
                fontSize: 20,
                fontWeight: 300,
                letterSpacing: 6,
                color: "var(--cream)",
              }}
            >
              ZÖAR
            </span>
          </div>
          <p
            style={{
              fontSize: 13,
              fontStyle: "italic",
              color: "var(--text-dim)",
              fontFamily: "var(--serif)",
              letterSpacing: 2,
            }}
          >
            For Eyes That Know.
          </p>
        </div>
        <div style={{ display: "flex", gap: 48 }}>
          {FOOTER_COLS.map((col) => (
            <div key={col.title}>
              <p
                style={{
                  fontSize: 10,
                  letterSpacing: 3,
                  textTransform: "uppercase",
                  color: "var(--accent)",
                  marginBottom: 16,
                }}
              >
                {col.title}
              </p>
              {col.links.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  style={{
                    display: "block",
                    fontSize: 13,
                    color: "var(--text-dim)",
                    marginBottom: 10,
                    transition: "color 0.3s",
                  }}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          ))}
        </div>
      </div>
      <div
        style={{
          maxWidth: 1200,
          margin: "40px auto 0",
          paddingTop: 24,
          borderTop: "1px solid var(--border)",
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 8,
        }}
      >
        <p style={{ fontSize: 11, color: "var(--text-dim)" }}>© 2026 ZÖAR / PUTYAHEARTINIT</p>
        <p style={{ fontSize: 11, color: "var(--text-dim)" }}>Private Membership Ecosystem</p>
      </div>
    </footer>
  );
}
