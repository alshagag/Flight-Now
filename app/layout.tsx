// app/layout.tsx

import type { Metadata } from "next";
import 'bootstrap/dist/css/bootstrap.css';
import './styles/globals.css';
import { Inter } from "next/font/google"; // Importing fonts from @next/font/google


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
