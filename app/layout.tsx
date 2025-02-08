// app/layout.tsx

import type { Metadata } from "next";
import './styles/globals.css';

// Importing fonts from @next/font/google (more efficient approach)
import { Inter } from "next/font/google";

const interFont = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Flight Now",
  description: "Travel Agency",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${interFont.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
