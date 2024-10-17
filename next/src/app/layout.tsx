import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/lib/components/Navbar";

export const metadata: Metadata = {
  title: "Football Util",
  description: "Tools for football data collection and analysis.",
};

const inter = Inter({
  weight: "variable",
  subsets: ["latin"],
  variable: "--font-inter",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={` ${inter.variable} font-sans`}>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
