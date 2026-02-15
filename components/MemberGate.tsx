import Link from "next/link";

export default function MemberGate({ message }: { message?: string }) {
  return (
    <div
      style={{
        padding: 32,
        border: "1px solid var(--border)",
        background: "var(--bg-alt)",
        textAlign: "center",
      }}
    >
      <p
        style={{
          fontFamily: "var(--serif)",
          fontSize: 20,
          color: "var(--cream)",
          marginBottom: 8,
        }}
      >
        Members Only Access Required
      </p>
      <p style={{ fontSize: 13, color: "var(--text-dim)", marginBottom: 20 }}>
        {message || "Pricing and purchasing available to members only."}
      </p>
      <Link href="/apply" className="btn-gold">
        Apply for Membership
      </Link>
    </div>
  );
}
