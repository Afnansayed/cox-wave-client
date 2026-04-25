import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Provider from "@/components/Provider/MainProvider";
import "./globals.css";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CoxWave - Seamless Travel Booking Experience",
  description: "CoxWave is your ultimate travel companion, offering a seamless booking experience for events, hotels, and more. Explore the world with ease and confidence.",
    icons: {
    icon: "/cox-wave-icon.png",
    shortcut: "/cox-wave-icon.png",
    apple: "/cox-wave-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
