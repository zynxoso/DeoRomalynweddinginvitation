import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { wedding } from "@/config/wedding";
import "./globals.css";
const serif = localFont({ src: [
  { path: "../node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-latin-400-normal.woff2", weight: "400", style: "normal" },
  { path: "../node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-latin-400-italic.woff2", weight: "400", style: "italic" },
  { path: "../node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-latin-500-normal.woff2", weight: "500", style: "normal" }
], variable: "--font-serif", display: "swap" });
const sans = localFont({ src: "../node_modules/@fontsource/manrope/files/manrope-latin-400-normal.woff2", variable: "--font-sans", display: "swap" });
const origin = process.env.NEXT_PUBLIC_SITE_URL || (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:3000");
export const metadata: Metadata = {
  metadataBase: new URL(origin), title: `${wedding.names.first} & ${wedding.names.second} | A garden wedding · ${wedding.dateLabel}`,
  description: `Together with our families, we invite you to celebrate our wedding on ${wedding.dateLabel} at ${wedding.ceremony.name}. Open your invitation.`,
  openGraph: { title: `You're invited | ${wedding.names.first} & ${wedding.names.second}`, description: `A celebration of love. ${wedding.dateLabel} · ${wedding.ceremony.name}`, type: "website", locale: "en_PH", images: [{ url: "/images/share.jpg", width: 1200, height: 630, alt: `${wedding.names.first} and ${wedding.names.second}, ${wedding.dateLabel}` }] },
  twitter: { card: "summary_large_image" }, robots: { index: false, follow: false }
};
export const viewport: Viewport = { themeColor: "#FFF9F2", width: "device-width", initialScale: 1 };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" className={`${serif.variable} ${sans.variable}`}><body>{children}</body></html>;
}
