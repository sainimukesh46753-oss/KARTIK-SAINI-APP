import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kartik — Creative Digital Studio",
  description: "A standalone app for exploring Kartik's work, services, process and project enquiries.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
