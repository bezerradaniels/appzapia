import type { Metadata } from "next";
import { Red_Hat_Display } from "next/font/google";
import "./globals.css";

const redHatDisplay = Red_Hat_Display({
  variable: "--font-redhat",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Zapia — Uma marca que vende com sorriso",
    template: "%s | Zapia",
  },
  description:
    "Catálogos bonitos, prontos para mandar no WhatsApp, sem loja virtual complicada. Do catálogo ao pedido confirmado na conversa que o cliente já usa.",
  icons: {
    icon: [
      { url: "/logos/zapia-simbolo.svg", type: "image/svg+xml" },
      { url: "/logos/zapia-icone-app-192px.png", sizes: "192x192", type: "image/png" },
      { url: "/logos/zapia-icone-app-512px.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/logos/zapia-icone-app-192px.png", sizes: "192x192", type: "image/png" },
    ],
  },
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="pt-BR"
      className={`${redHatDisplay.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-rosa-500 selection:text-slate-900">
        {children}
      </body>
    </html>
  );
}
