"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import ZoarLogo from "./ZoarLogo";

interface Product {
  id: string;
  name: string;
  subtitle?: string | null;
  category: string;
  size: string;
  price: number;
  color?: string | null;
  images: string[];
  exclusive: boolean;
  type?: string;
}

export default function ProductCard({
  product,
  index = 0,
  isMember,
  isWished,
  onToggleWishlist,
}: {
  product: Product;
  index?: number;
  isMember: boolean;
  isWished?: boolean;
  onToggleWishlist?: (id: string) => void;
}) {
  const [imgError, setImgError] = useState(false);
  const hasImage = product.images && product.images.length > 0 && !imgError;
  const isMerch = product.category === "ZÖAR Merch";
  const delayClass = `fade-up-d${Math.min((index % 4) + 1, 4)}`;

  return (
    <div
      className={`hover-scale ${delayClass}`}
      style={{
        border: "1px solid var(--border)",
        background: "var(--bg-alt)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Link href={`/vault/${product.id}`} style={{ display: "block" }}>
        {product.exclusive && (
          <span
            style={{
              position: "absolute",
              top: 12,
              right: 12,
              zIndex: 2,
              fontSize: 9,
              letterSpacing: 2,
              textTransform: "uppercase",
              color: "var(--gold)",
              background: "rgba(10,10,10,0.85)",
              padding: "4px 10px",
              border: "1px solid var(--gold-dim)",
            }}
          >
            Exclusive
          </span>
        )}

        <div
          style={{
            aspectRatio: "1",
            background: product.color
              ? `radial-gradient(ellipse at center, ${product.color}22 0%, var(--bg) 70%)`
              : "#111",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
            position: "relative",
          }}
        >
          {hasImage ? (
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              style={{ objectFit: "contain", padding: "12px" }}
              sizes="(max-width: 768px) 100vw, 280px"
              onError={() => setImgError(true)}
            />
          ) : isMerch ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
              <ZoarLogo
                size={48}
                color={
                  product.color === "#0a0a0a" || product.color === "#333" || product.color === "#0d0d0d"
                    ? "#F5F0E8"
                    : "#0A0A0A"
                }
              />
              <span
                style={{
                  fontSize: 10,
                  letterSpacing: 3,
                  color: "var(--text-dim)",
                  textTransform: "uppercase",
                }}
              >
                {product.subtitle}
              </span>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, padding: 24 }}>
              <div style={{
                width: 80,
                height: 80,
                borderRadius: "50%",
                background: product.color
                  ? `linear-gradient(135deg, ${product.color}66, ${product.color}22)`
                  : "rgba(207,181,59,0.08)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "1px solid rgba(207,181,59,0.15)",
              }}>
                <span style={{
                  fontSize: 11,
                  letterSpacing: 3,
                  textTransform: "uppercase",
                  color: "var(--gold-dim)",
                  fontFamily: "var(--sans)",
                  fontWeight: 500,
                  textAlign: "center",
                  lineHeight: 1.3,
                }}>
                  {product.category.split(" ").map(w => w[0]).join("")}
                </span>
              </div>
              <span style={{
                fontSize: 9,
                letterSpacing: 3,
                textTransform: "uppercase",
                color: "var(--text-dim)",
              }}>
                Photo Coming Soon
              </span>
            </div>
          )}
        </div>

        <div style={{ padding: "18px 20px" }}>
          <p
            style={{
              fontSize: 10,
              letterSpacing: 2,
              textTransform: "uppercase",
              color: "var(--gold)",
              marginBottom: 6,
            }}
          >
            {product.category}
          </p>
          <h3
            style={{
              fontFamily: "var(--serif)",
              fontSize: 17,
              fontWeight: 400,
              marginBottom: 4,
              color: "var(--cream)",
              lineHeight: 1.3,
            }}
          >
            {product.name}
          </h3>
          <p style={{ fontSize: 12, color: "var(--text-dim)", marginBottom: 10 }}>
            {product.subtitle}
          </p>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            {isMember ? (
              <span style={{ fontFamily: "var(--serif)", fontSize: 18, fontWeight: 500, color: "var(--cream)" }}>
                ${(product.price / 100).toLocaleString()}
              </span>
            ) : (
              <span style={{ fontSize: 11, letterSpacing: 1.5, color: "var(--text-dim)", fontStyle: "italic" }}>
                Members Only
              </span>
            )}
            <span style={{ fontSize: 11, color: "var(--text-dim)" }}>Size {product.size}</span>
          </div>
        </div>
      </Link>

      {onToggleWishlist && (
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onToggleWishlist(product.id);
          }}
          style={{
            position: "absolute",
            top: 12,
            left: 12,
            zIndex: 2,
            fontSize: 18,
            cursor: "pointer",
            color: isWished ? "var(--gold)" : "var(--text-dim)",
            transition: "color 0.3s",
            background: "none",
            border: "none",
          }}
        >
          {isWished ? "♥" : "♡"}
        </button>
      )}
    </div>
  );
}
