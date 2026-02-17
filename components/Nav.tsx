"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import ZoarLogo from "./ZoarLogo";

const NAV_ITEMS = [
  { label: "Home", href: "/" },
  { label: "Vault", href: "/vault" },
  { label: "Marketplace", href: "/marketplace" },
  { label: "Merch", href: "/merch" },
  { label: "ISO Feed", href: "/iso" },
  { label: "Sell", href: "/sell" },
  { label: "Profile", href: "/profile" },
];

export default function Nav() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const isMember =
    (session?.user as any)?.membershipStatus === "ACTIVE" &&
    ((session?.user as any)?.role === "MEMBER" || (session?.user as any)?.role === "ADMIN");
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav
      style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        background: "rgba(10,10,10,0.92)",
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid var(--border)",
        padding: "0 32px",
      }}
    >
      <div
        style={{
          maxWidth: 1400,
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: 70,
        }}
      >
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <ZoarLogo size={36} />
          <span
            style={{
              fontFamily: "var(--serif)",
              fontSize: 22,
              fontWeight: 300,
              letterSpacing: 6,
              color: "var(--cream)",
            }}
          >
            ZÖAR
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="nav-links" style={{ display: "flex", alignItems: "center", gap: 28 }}>
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  fontSize: 11,
                  letterSpacing: 2.5,
                  textTransform: "uppercase",
                  fontWeight: 400,
                  color: active ? "var(--accent)" : "var(--cream-dim)",
                  transition: "color 0.3s",
                  borderBottom: active ? "1px solid var(--accent)" : "1px solid transparent",
                  paddingBottom: 2,
                }}
              >
                {item.label}
              </Link>
            );
          })}
          {!session ? (
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginLeft: 8 }}>
              <Link
                href="/login"
                style={{
                  fontSize: 11,
                  letterSpacing: 2,
                  textTransform: "uppercase",
                  color: "var(--cream-dim)",
                  transition: "color 0.3s",
                }}
              >
                Login
              </Link>
              <Link href="/apply" className="btn-accent btn-sm">
                Apply
              </Link>
            </div>
          ) : !isMember ? (
            <Link href="/apply" className="btn-accent btn-sm" style={{ marginLeft: 8 }}>
              Apply
            </Link>
          ) : (
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginLeft: 8 }}>
              <span
                style={{
                  fontSize: 10,
                  letterSpacing: 2,
                  color: "var(--accent)",
                  textTransform: "uppercase",
                  border: "1px solid var(--accent-dim)",
                  padding: "4px 12px",
                }}
              >
                Member
              </span>
              <span
                onClick={() => signOut({ callbackUrl: "/" })}
                style={{
                  fontSize: 10,
                  color: "var(--text-dim)",
                  cursor: "pointer",
                  letterSpacing: 1,
                }}
              >
                Sign Out
              </span>
            </div>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          className="mobile-menu-btn"
          onClick={() => setMobileOpen(!mobileOpen)}
          style={{
            display: "none",
            background: "none",
            border: "none",
            color: "var(--cream)",
            fontSize: 24,
            cursor: "pointer",
          }}
        >
          {mobileOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div
          style={{
            padding: "16px 0 24px",
            display: "flex",
            flexDirection: "column",
            gap: 16,
            borderTop: "1px solid var(--border)",
          }}
        >
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              style={{
                fontSize: 12,
                letterSpacing: 2,
                textTransform: "uppercase",
                color: pathname === item.href ? "var(--accent)" : "var(--cream-dim)",
                padding: "4px 0",
              }}
            >
              {item.label}
            </Link>
          ))}
          {!session && (
            <Link
              href="/login"
              onClick={() => setMobileOpen(false)}
              style={{
                fontSize: 12,
                letterSpacing: 2,
                textTransform: "uppercase",
                color: "var(--cream-dim)",
                padding: "4px 0",
              }}
            >
              Login
            </Link>
          )}
          {!isMember && (
            <Link
              href="/apply"
              className="btn-accent btn-sm"
              onClick={() => setMobileOpen(false)}
              style={{ alignSelf: "flex-start", marginTop: 8 }}
            >
              Apply
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}
