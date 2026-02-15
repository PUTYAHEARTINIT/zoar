import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import ZoarLogo from "@/components/ZoarLogo";

export default async function AdminDashboard() {
  const session = await auth();
  if (!session || (session.user as any).role !== "ADMIN") {
    redirect("/admin/login");
  }

  let stats = { users: 0, products: 0, orders: 0, applications: 0 };
  let recentApplications: any[] = [];
  let recentOrders: any[] = [];

  try {
    const [users, products, orders, applications] = await Promise.all([
      prisma.user.count(),
      prisma.product.count(),
      prisma.order.count(),
      prisma.membershipApplication.count({ where: { status: "PENDING" } }),
    ]);
    stats = { users, products, orders, applications };

    recentApplications = await prisma.membershipApplication.findMany({
      take: 10,
      orderBy: { createdAt: "desc" },
      include: { user: true },
    });

    recentOrders = await prisma.order.findMany({
      take: 10,
      orderBy: { createdAt: "desc" },
      include: { buyer: true, product: true },
    });
  } catch {}

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "48px 32px 120px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 48 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <ZoarLogo size={36} color="var(--accent)" />
          <h1 style={{ fontFamily: "var(--serif)", fontSize: 28, fontWeight: 300, color: "var(--cream)", letterSpacing: 4 }}>
            Admin Dashboard
          </h1>
        </div>
        <Link href="/" style={{ fontSize: 12, color: "var(--text-dim)", letterSpacing: 2, textTransform: "uppercase" }}>
          ← Back to Site
        </Link>
      </div>

      {/* Stats Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 48 }}>
        {[
          { label: "Total Members", value: stats.users, color: "var(--cream)" },
          { label: "Active Products", value: stats.products, color: "var(--cream)" },
          { label: "Total Orders", value: stats.orders, color: "var(--cream)" },
          { label: "Pending Applications", value: stats.applications, color: "var(--accent)" },
        ].map((s, i) => (
          <div key={i} style={{ padding: 24, border: "1px solid var(--border)", background: "var(--bg-alt)", textAlign: "center" }}>
            <p style={{ fontSize: 10, letterSpacing: 2, color: "var(--text-dim)", textTransform: "uppercase", marginBottom: 8 }}>
              {s.label}
            </p>
            <p style={{ fontFamily: "var(--serif)", fontSize: 32, fontWeight: 500, color: s.color }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Pending Applications */}
      <div style={{ marginBottom: 48 }}>
        <h2 style={{ fontFamily: "var(--serif)", fontSize: 22, fontWeight: 300, color: "var(--cream)", marginBottom: 24 }}>
          Recent Applications
        </h2>
        <div style={{ border: "1px solid var(--border)" }}>
          {recentApplications.length === 0 ? (
            <p style={{ padding: 24, color: "var(--text-dim)", fontSize: 13 }}>No applications yet.</p>
          ) : (
            recentApplications.map((app, i) => (
              <div
                key={app.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "16px 24px",
                  borderBottom: i < recentApplications.length - 1 ? "1px solid var(--border)" : "none",
                  background: i % 2 === 0 ? "var(--bg-alt)" : "transparent",
                }}
              >
                <div>
                  <p style={{ fontSize: 14, color: "var(--cream)" }}>{app.name}</p>
                  <p style={{ fontSize: 12, color: "var(--text-dim)" }}>{app.email} · {app.instagram || "No IG"}</p>
                </div>
                <span
                  style={{
                    fontSize: 10,
                    letterSpacing: 2,
                    textTransform: "uppercase",
                    padding: "4px 12px",
                    border: `1px solid ${app.status === "PENDING" ? "var(--accent)" : app.status === "APPROVED" ? "#2d6a4f" : "var(--danger)"}`,
                    color: app.status === "PENDING" ? "var(--accent)" : app.status === "APPROVED" ? "#2d6a4f" : "var(--danger)",
                  }}
                >
                  {app.status}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Recent Orders */}
      <div>
        <h2 style={{ fontFamily: "var(--serif)", fontSize: 22, fontWeight: 300, color: "var(--cream)", marginBottom: 24 }}>
          Recent Orders
        </h2>
        <div style={{ border: "1px solid var(--border)" }}>
          {recentOrders.length === 0 ? (
            <p style={{ padding: 24, color: "var(--text-dim)", fontSize: 13 }}>No orders yet.</p>
          ) : (
            recentOrders.map((order, i) => (
              <div
                key={order.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "16px 24px",
                  borderBottom: i < recentOrders.length - 1 ? "1px solid var(--border)" : "none",
                  background: i % 2 === 0 ? "var(--bg-alt)" : "transparent",
                }}
              >
                <div>
                  <p style={{ fontSize: 14, color: "var(--cream)" }}>{order.product?.name}</p>
                  <p style={{ fontSize: 12, color: "var(--text-dim)" }}>
                    {order.buyer?.name} · ${(order.amount / 100).toLocaleString()}
                  </p>
                </div>
                <span
                  style={{
                    fontSize: 10,
                    letterSpacing: 2,
                    textTransform: "uppercase",
                    color: "var(--text-dim)",
                  }}
                >
                  {order.status}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
