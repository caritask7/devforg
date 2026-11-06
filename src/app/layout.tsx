import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "DEVFORGE — La régularité forge l'expertise",
    template: "%s · DEVFORGE",
  },
  description:
    "Parcours d'ingénierie logicielle structuré : leçons, missions concrètes, projets et validation objective des compétences.",
  applicationName: "DEVFORGE",
  authors: [{ name: "DEVFORGE" }],
  keywords: [
    "développement logiciel",
    "apprentissage",
    "Python",
    "ingénierie",
    "portfolio",
  ],
};

export const viewport: Viewport = {
  themeColor: "#f8f9fc",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" className={`${inter.variable} ${jetbrains.variable}`}>
      <body className="min-h-dvh antialiased">
        {children}
        <Toaster richColors position="top-right" closeButton />
      </body>
    </html>
  );
}
