"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Nav from "@/components/Nav";
import ProductCard from "@/components/ProductCard";

const CATEGORIES = [
  "All",
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
  "ZÖAR Merch",
];

interface Product {
  id: string;
  name: string;
  subtitle: string | null;
  category: string;
  size: string;
  price: number;
  color: string | null;
  images: string[];
  exclusive: boolean;
  type: string;
}

export default function VaultPage() {
  const { data: session } = useSession();
  const isMember =
    (session?.user as any)?.membershipStatus === "ACTIVE" &&
    ((session?.user as any)?.role === "MEMBER" || (session?.user as any)?.role === "ADMIN");

  const [products, setProducts] = useState<Product[]>([]);
  const [filterCat, setFilterCat] = useState("All");
  const [searchQ, setSearchQ] = useState("");
  const [wishlist, setWishlist] = useState<string[]>([]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (filterCat !== "All") params.set("category", filterCat);
    if (searchQ) params.set("search", searchQ);

    fetch(`/api/products?${params}`)
      .then((r) => r.json())
      .then((data) => setProducts(data.products || []))
      .catch(() => {});
  }, [filterCat, searchQ]);

  useEffect(() => {
    if (!session) return;
    fetch("/api/wishlist")
      .then((r) => r.json())
      .then((data) => setWishlist((data.wishlist || []).map((w: any) => w.productId)))
      .catch(() => {});
  }, [session]);

  const toggleWishlist = async (id: string) => {
    const isWished = wishlist.includes(id);
    if (isWished) {
      setWishlist((prev) => prev.filter((x) => x !== id));
      await fetch("/api/wishlist", { method: "DELETE", body: JSON.stringify({ productId: id }) });
    } else {
      setWishlist((prev) => [...prev, id]);
      await fetch("/api/wishlist", { method: "POST", body: JSON.stringify({ productId: id }) });
    }
  };

  const visibleProducts = isMember ? products : products.slice(0, 12);

  return (
    <div>
      <Nav />
      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "48px 32px 120px" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <p style={{ fontSize: 11, letterSpacing: 6, textTransform: "uppercase", color: "var(--accent)", marginBottom: 12 }}>
            {isMember ? "Full Access Granted" : "Limited Preview"}
          </p>
          <h1 style={{ fontFamily: "var(--serif)", fontSize: 48, fontWeight: 300, color: "var(--cream)", letterSpacing: 4 }}>
            The Vault
          </h1>
          {!isMember && (
            <p style={{ marginTop: 16, fontSize: 13, color: "var(--text-dim)" }}>
              Viewing curated preview only.{" "}
              <Link href="/apply" style={{ color: "var(--accent)", textDecoration: "underline" }}>
                Apply for full access.
              </Link>
            </p>
          )}
        </div>

        {/* Search */}
        <div style={{ maxWidth: 480, margin: "0 auto 32px" }}>
          <input
            className="input-lux"
            placeholder="Search brand, model, colorway..."
            value={searchQ}
            onChange={(e) => setSearchQ(e.target.value)}
            style={{ textAlign: "center", letterSpacing: 1 }}
          />
        </div>

        {/* Filters */}
        <div style={{ display: "flex", justifyContent: "center", gap: 8, flexWrap: "wrap", marginBottom: 48 }}>
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setFilterCat(c)}
              style={{
                padding: "8px 18px",
                fontSize: 11,
                letterSpacing: 1.5,
                textTransform: "uppercase",
                cursor: "pointer",
                border: `1px solid ${filterCat === c ? "var(--accent)" : "var(--border)"}`,
                background: filterCat === c ? "rgba(255,255,255,0.06)" : "transparent",
                color: filterCat === c ? "var(--accent)" : "var(--text-dim)",
                transition: "all 0.3s",
              }}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Count */}
        <p style={{ fontSize: 12, color: "var(--text-dim)", marginBottom: 24, letterSpacing: 1 }}>
          {products.length} pieces {!isMember && "(limited view)"}
        </p>

        {/* Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 20 }}>
          {visibleProducts.map((p, i) => (
            <ProductCard
              key={p.id}
              product={p}
              index={i}
              isMember={isMember}
              isWished={wishlist.includes(p.id)}
              onToggleWishlist={isMember ? toggleWishlist : undefined}
            />
          ))}
        </div>

        {!isMember && products.length > 12 && (
          <div
            style={{
              textAlign: "center",
              marginTop: 64,
              padding: 48,
              border: "1px solid var(--border)",
              background: "var(--bg-alt)",
            }}
          >
            <p style={{ fontFamily: "var(--serif)", fontSize: 24, fontWeight: 300, color: "var(--cream)", marginBottom: 12 }}>
              {products.length - 12}+ More Pieces Inside
            </p>
            <p style={{ fontSize: 13, color: "var(--text-dim)", marginBottom: 24 }}>Full inventory is members only.</p>
            <Link href="/apply" className="btn-accent">
              Request Access
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
