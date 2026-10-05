import type { Metadata } from "next";
import ServiceWorkerRegister from "./sw-register";
import "./globals.css";

export const metadata: Metadata = {
  title: "KS Digital — Development × Design",
  description: "KS Digital — a premium desktop-installable experience for development, design and digital products.",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: "/ks-nexus-icon.svg",
    shortcut: "/ks-nexus-icon.svg",
    apple: "/ks-nexus-icon.svg",
  },
  themeColor: "#08090d",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <ServiceWorkerRegister />
        {children}
      </body>
    </html>
  );
}
