"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Search, Target, FileCheck, Database, ShieldCheck, Zap, Cpu } from "lucide-react";

const navItems = [
  { name: "Terminal", href: "/dashboard", icon: LayoutDashboard },
  { name: "Discovery", href: "/campaigns/new", icon: Search },
  { name: "Missions", href: "/campaigns", icon: Target },
  { name: "Intelligence", href: "/leads", icon: FileCheck },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside style={{
      width: 260,
      backgroundColor: "#050608",
      borderRight: "1px solid #1a1b21",
      display: "flex",
      flexDirection: "column",
      flexShrink: 0,
      height: "100vh",
      overflow: "hidden",
    }}>
      {/* Logo */}
      <div style={{ padding: "32px 24px 40px", display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ 
          padding: 10, 
          backgroundColor: "#00f5ff", 
          borderRadius: 14, 
          display: "flex",
          boxShadow: "0 0 20px rgba(0,245,255,0.3)" 
        }}>
          <Cpu style={{ width: 22, height: 22, color: "#000" }} />
        </div>
        <div>
          <div style={{ fontSize: 20, fontWeight: 900, color: "#fff", letterSpacing: -1, lineHeight: 1 }}>STELV</div>
          <div style={{ fontSize: 8, fontWeight: 900, color: "#00f5ff", letterSpacing: "0.35em", textTransform: "uppercase" as const }}>LEAD.AUDIT</div>
        </div>
      </div>

      {/* Nav */}
      <div style={{ flex: 1, padding: "0 16px", overflow: "auto" }}>
        <div style={{ fontSize: 9, fontWeight: 900, color: "#3d4150", letterSpacing: "0.3em", textTransform: "uppercase" as const, padding: "0 12px", marginBottom: 16 }}>
          COMMAND
        </div>
        <nav style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.name}
                href={item.href}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  padding: "12px 16px",
                  borderRadius: 14,
                  fontSize: 12,
                  fontWeight: 800,
                  textDecoration: "none",
                  letterSpacing: "0.05em",
                  textTransform: "uppercase" as const,
                  transition: "all 0.2s",
                  backgroundColor: isActive ? "#15171e" : "transparent",
                  color: isActive ? "#00f5ff" : "#6b7280",
                  border: isActive ? "1px solid rgba(0,245,255,0.15)" : "1px solid transparent",
                }}
              >
                <item.icon style={{ width: 18, height: 18 }} />
                {item.name}
                {isActive && (
                  <div style={{
                    marginLeft: "auto",
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    backgroundColor: "#00f5ff",
                    boxShadow: "0 0 10px rgba(0,245,255,0.8)",
                  }} />
                )}
              </Link>
            );
          })}
        </nav>


      </div>

      {/* Status Footer */}
      <div style={{ padding: 16 }}>
        <div style={{
          backgroundColor: "#15171e",
          border: "1px solid #222531",
          borderRadius: 16,
          padding: 20,
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <span style={{ fontSize: 9, fontWeight: 900, color: "#3d4150", letterSpacing: "0.2em", textTransform: "uppercase" as const }}>STATUS</span>
            <span style={{ fontSize: 9, fontWeight: 900, color: "#10b981", display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: "#10b981" }} /> ONLINE
            </span>
          </div>
          <div style={{ height: 4, backgroundColor: "#0c0d12", borderRadius: 999, overflow: "hidden" }}>
            <div style={{ height: "100%", width: "75%", backgroundColor: "#00f5ff", borderRadius: 999, boxShadow: "0 0 10px rgba(0,245,255,0.5)" }} />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 14 }}>
            <div style={{ width: 32, height: 32, borderRadius: 10, backgroundColor: "#000", border: "1px solid #222531", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 900, color: "#00f5ff" }}>AD</div>
            <div>
              <div style={{ fontSize: 10, fontWeight: 900, color: "#fff", letterSpacing: "0.1em" }}>ADMIN</div>
              <div style={{ fontSize: 8, fontWeight: 700, color: "#3d4150", letterSpacing: "0.15em" }}>ACCESS LVL 9</div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
