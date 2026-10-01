import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Lora } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HashlessAnchors from "@/components/HashlessAnchors";
import RevealObserver from "@/components/RevealObserver";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const lora = Lora({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-lora",
  display: "swap",
});

const description =
  "ARAM Logistics Inc is a trucking company based in Elmwood Park, Illinois. We hire drivers who want steady freight, clear settlements and a dispatch team that knows them by name.";

const REVEAL_BOOT =
  "var d=document.documentElement;d.setAttribute('data-js','');" +
  "setTimeout(function(){if(!d.hasAttribute('data-reveal-ready'))d.removeAttribute('data-js')},3000)";

export const metadata: Metadata = {
  title: {
    default: "ARAM Logistics Inc",
    template: "%s | ARAM Logistics Inc",
  },
  description,
  openGraph: {
    title: "ARAM Logistics Inc",
    description,
    type: "website",
    images: [
      "https://images.unsplash.com/photo-1720811559395-3ed8d1b16649?fm=jpg&q=90&w=1200&auto=format&fit=crop",
    ],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#f3f2f2",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${cormorant.variable} ${lora.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Reveal styles apply only while JS runs. Fail-safe: if the reveal script hasn't
            started within 3s (error, slow network), drop the hidden state so all content shows. */}
        <script dangerouslySetInnerHTML={{ __html: REVEAL_BOOT }} />
      </head>
      <body>
        <RevealObserver />
        <HashlessAnchors />
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
