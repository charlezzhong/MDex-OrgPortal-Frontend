import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import SessionWrapper from "./components/wrappers/SessionWrapper";

//components
import Navbar from "./components/Navbar";
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MDex Organization",
  description: "Uniting Umich students with campus connections",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <SessionWrapper>
        <html lang="en">
          <body suppressHydrationWarning={true} className={inter.className}>
            <div className="min-h-screen">
              <Navbar/>
              <div className="min-h-[90vh]">
                {children}
              </div>
            </div>
            <Toaster/>
          </body>
        </html>
      </SessionWrapper>
  );
}
