import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";

export const metadata: Metadata = {
  title: "STELV — Lead Intelligence Terminal",
  description: "Advanced lead discovery, website auditing and AI-driven outreach platform.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
          <Sidebar />
          <div style={{ display: "flex", flexDirection: "column", flex: 1, minWidth: 0, overflow: "hidden" }}>
            <Header />
            <main style={{ flex: 1, overflowY: "auto", padding: "32px 40px" }}>
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
