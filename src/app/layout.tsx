import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { UserProvider } from "@/components/UserProvider";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PossAbilities Portal",
  description: "A platform for adults with learning disabilities to stay updated.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}>
        <UserProvider>
          <div className="flex flex-col min-h-screen">
            <header className="p-4 md:p-6 sticky top-0 z-50">
              <Navbar />
            </header>
            <main className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-8 pb-12 flex flex-col gap-8">
              {children}
            </main>
            <Footer />
          </div>
        </UserProvider>
      </body>
    </html>
  );
}
