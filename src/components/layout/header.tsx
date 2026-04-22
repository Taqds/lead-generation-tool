"use client";

import { Bell, Search, Power } from "lucide-react";

export default function Header() {
  return (
    <header style={{
      height: 64,
      backgroundColor: "#050608",
      borderBottom: "1px solid #1a1b21",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0 40px",
      flexShrink: 0,
    }}>
      {/* Search */}
      <div style={{ position: "relative", maxWidth: 480, width: "100%" }}>
        <Search style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", width: 16, height: 16, color: "#3d4150" }} />
        <input
          className="input-dark"
          placeholder="Query leads, campaigns, niches..."
          style={{ paddingLeft: 44, height: 40, fontSize: 12, borderRadius: 12 }}
        />
      </div>

      {/* Controls */}
      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
        <div style={{ textAlign: "right", paddingRight: 20, borderRight: "1px solid #1a1b21" }}>
          <div style={{ fontSize: 9, fontWeight: 900, color: "#3d4150", letterSpacing: "0.2em", textTransform: "uppercase" as const }}>Latency</div>
          <div style={{ fontSize: 12, fontWeight: 900, color: "#00f5ff" }}>24ms</div>
        </div>
        <button style={{
          width: 40,
          height: 40,
          borderRadius: 12,
          backgroundColor: "#0c0d12",
          border: "1px solid #222531",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
        }}>
          <Bell style={{ width: 18, height: 18, color: "#6b7280" }} />
          <div style={{
            position: "absolute", top: 8, right: 8, width: 7, height: 7,
            borderRadius: "50%", backgroundColor: "#00f5ff",
            boxShadow: "0 0 8px rgba(0,245,255,0.8)",
          }} />
        </button>
        <button style={{
          width: 40,
          height: 40,
          borderRadius: 12,
          backgroundColor: "rgba(244,63,94,0.1)",
          border: "1px solid rgba(244,63,94,0.2)",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}>
          <Power style={{ width: 18, height: 18, color: "#f43f5e" }} />
        </button>
      </div>
    </header>
  );
}
