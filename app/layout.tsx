import type { Metadata } from "next";
import { Cormorant_Garamond, Outfit } from "next/font/google";
import SessionProvider from "@/components/SessionProvider";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ZÖAR — For Eyes That Know",
  description:
    "An invitation-only luxury fashion network where access is the primary product. Curated collections. Private marketplace. Sacred exclusivity.",
  openGraph: {
    title: "ZÖAR — For Eyes That Know",
    description:
      "Private luxury marketplace and membership ecosystem. Curated collections. Sacred exclusivity.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${cormorant.variable} ${outfit.variable}`}>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
