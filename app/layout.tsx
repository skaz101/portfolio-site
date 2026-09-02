import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Serge",
  description: "Software, robotics, servers, networking, and the things Serge builds with them.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
