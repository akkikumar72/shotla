import { GeistSans } from "geist/font/sans";
import type { Metadata } from "next";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";

export const metadata: Metadata = {
  title: "Shotla Studio · Beautiful screenshots",
  description:
    "A thoughtful workspace for your screenshots. Style backgrounds, add annotations, and export polished visuals right in your browser.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={GeistSans.variable}>
      <body className={`${GeistSans.className} antialiased`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
