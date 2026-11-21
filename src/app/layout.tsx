
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "bloggs",
  description: "Discover Stories Worth Sharing",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
