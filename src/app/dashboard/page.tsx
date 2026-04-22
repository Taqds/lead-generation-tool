import prisma from "@/lib/prisma";
import Link from "next/link";
import { Plus, Database, Target, Search, CheckCircle2, Activity, Cpu, Zap } from "lucide-react";

export default async function DashboardPage() {
  const campaigns = await prisma.campaign.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  const totalLeads = await prisma.lead.count();
  const activeSearches = await prisma.campaign.count({ where: { status: "PROCESSING" } });
  const auditsDone = await prisma.lead.count({ where: { status: "DONE" } });

  const stats = [
    { name: "Leads Discovered", value: totalLeads, accent: "#00f5ff", icon: Database },
    { name: "Active Missions", value: activeSearches, accent: "#f59e0b", icon: Search },
    { name: "Audits Complete", value: auditsDone, accent: "#10b981", icon: CheckCircle2 },
    { name: "Hit Rate", value: "12.5%", accent: "#6366f1", icon: Activity },
  ];

  return (
    <div>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", paddingBottom: 32, borderBottom: "1px solid #1a1b21", marginBottom: 40 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
            <div style={{ height: 3, width: 32, backgroundColor: "#00f5ff", borderRadius: 4 }} />
            <span style={{ fontSize: 10, fontWeight: 900, color: "#00f5ff", letterSpacing: "0.4em", textTransform: "uppercase" as const }}>System.Overview</span>
          </div>
          <h1 style={{ fontSize: 40, fontWeight: 900, color: "#fff", letterSpacing: -2, lineHeight: 1 }}>COMMAND TERMINAL</h1>
          <p style={{ fontSize: 13, fontWeight: 700, color: "#3d4150", marginTop: 8, letterSpacing: "0.05em" }}>LEAD DISCOVERY PROTOCOLS ACTIVE. ALL SYSTEMS NOMINAL.</p>
        </div>
        <Link href="/campaigns/new" className="btn-primary" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          <Plus style={{ width: 18, height: 18, strokeWidth: 3 }} /> INITIALIZE MISSION
        </Link>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 24, marginBottom: 48 }}>
        {stats.map((stat) => (
          <div key={stat.name} className="panel" style={{ padding: 36 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
              <div style={{ padding: 8, borderRadius: 10, backgroundColor: `${stat.accent}15`, color: stat.accent, display: "flex" }}>
                <stat.icon style={{ width: 16, height: 16 }} />
              </div>
              <span className="label">{stat.name}</span>
            </div>
            <div style={{ fontSize: 48, fontWeight: 900, color: "#fff", fontFamily: "var(--font-mono)", letterSpacing: -2 }}>
              {typeof stat.value === "number" ? String(stat.value).padStart(3, "0") : stat.value}
            </div>
          </div>
        ))}
      </div>

      {/* Missions + Feed */}
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 32 }}>
        {/* Mission List */}
        <div className="panel" style={{ overflow: "hidden" }}>
          <div style={{ padding: "24px 32px", borderBottom: "1px solid #1a1b21", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h3 style={{ fontSize: 16, fontWeight: 900, color: "#fff", display: "flex", alignItems: "center", gap: 10 }}>
              <Target style={{ width: 18, height: 18, color: "#00f5ff" }} /> ACTIVE MISSIONS
            </h3>
            <span className="label" style={{ padding: "6px 16px", backgroundColor: "#15171e", borderRadius: 999, border: "1px solid #222531" }}>Live Protocols</span>
          </div>
          <div style={{ padding: 12 }}>
            {campaigns.length === 0 ? (
              <div style={{ padding: 60, textAlign: "center", color: "#3d4150", fontWeight: 800, fontSize: 13, letterSpacing: "0.1em", textTransform: "uppercase" as const }}>
                No active missions. Initialize a new search.
              </div>
            ) : (
              campaigns.map((c) => (
                <Link key={c.id} href={`/campaigns/${c.id}`} style={{ textDecoration: "none" }}>
                  <div style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "20px 24px", borderRadius: 16,
                    border: "1px solid #1a1b21", marginBottom: 8,
                    cursor: "pointer", transition: "all 0.2s",
                  }}
                  className="panel-elevated"
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                      <div style={{
                        width: 44, height: 44, borderRadius: 14,
                        backgroundColor: "#050608", border: "1px solid #222531",
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}>
                        <Database style={{ width: 18, height: 18, color: "#3d4150" }} />
                      </div>
                      <div>
                        <div style={{ fontSize: 15, fontWeight: 900, color: "#fff", textTransform: "capitalize" as const }}>{c.niche} — {c.location}</div>
                        <div style={{ fontSize: 9, fontWeight: 800, color: "#3d4150", letterSpacing: "0.2em", textTransform: "uppercase" as const, marginTop: 4 }}>
                          NODES: {c.count} • {new Date(c.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{
                        width: 6, height: 6, borderRadius: "50%",
                        backgroundColor: c.status === "COMPLETED" ? "#10b981" : c.status === "PROCESSING" ? "#f59e0b" : "#f43f5e",
                        boxShadow: `0 0 10px ${c.status === "COMPLETED" ? "rgba(16,185,129,0.6)" : c.status === "PROCESSING" ? "rgba(245,158,11,0.6)" : "rgba(244,63,94,0.6)"}`,
                      }} />
                      <span style={{ fontSize: 10, fontWeight: 900, color: c.status === "COMPLETED" ? "#10b981" : c.status === "PROCESSING" ? "#f59e0b" : "#f43f5e", letterSpacing: "0.1em" }}>
                        {c.status === "COMPLETED" ? "READY" : c.status === "PROCESSING" ? "ACTIVE" : c.status}
                      </span>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Feed */}
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div className="panel" style={{ padding: 28 }}>
            <h3 style={{ fontSize: 12, fontWeight: 900, color: "#fff", letterSpacing: "0.15em", textTransform: "uppercase" as const, marginBottom: 24 }}>
              <Zap style={{ width: 14, height: 14, display: "inline", marginRight: 8, color: "#f59e0b" }} />
              System Efficiency
            </h3>
            {[
              { l: "Engine Load", v: 78, c: "#6366f1" },
              { l: "Thread Priority", v: 92, c: "#00f5ff" },
              { l: "Audit Integrity", v: 99, c: "#10b981" },
            ].map((b) => (
              <div key={b.l} style={{ marginBottom: 20 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <span className="label">{b.l}</span>
                  <span className="label">{b.v}%</span>
                </div>
                <div style={{ height: 4, backgroundColor: "#050608", borderRadius: 999, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${b.v}%`, backgroundColor: b.c, borderRadius: 999, boxShadow: `0 0 10px ${b.c}66` }} />
                </div>
              </div>
            ))}
          </div>

          <div className="panel" style={{ padding: 28, flex: 1 }}>
            <h3 style={{ fontSize: 12, fontWeight: 900, color: "#fff", letterSpacing: "0.15em", textTransform: "uppercase" as const, marginBottom: 20 }}>Activity Log</h3>
            {[1, 2, 3].map((i) => (
              <div key={i} style={{ display: "flex", gap: 12, paddingBottom: 14, marginBottom: 14, borderBottom: i < 3 ? "1px solid #1a1b21" : "none" }}>
                <span style={{ fontSize: 10, fontWeight: 900, color: "#00f5ff", paddingTop: 2 }}>0{i}</span>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 800, color: "#6b7280" }}>Crawl sequence {i} completed</div>
                  <div style={{ fontSize: 9, fontWeight: 700, color: "#3d4150", marginTop: 2 }}>TS: 01:1{i}:22</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
