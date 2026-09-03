import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Serge",
  description: "Software, robotics, servers, networking, and the things Serge builds with them.",
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
