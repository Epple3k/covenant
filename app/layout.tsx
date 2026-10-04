import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "COVENANT — Financial Authority",
  description: "Forward-looking financial policy and authorization for autonomous agents.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
