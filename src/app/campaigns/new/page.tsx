import { createCampaign } from "@/app/actions/campaign";
import { Search, MapPin, Hash, Cpu, Zap, Target } from "lucide-react";

export default function NewCampaignPage() {
  return (
    <div style={{ maxWidth: 640, margin: "0 auto" }}>
      {/* Header */}
      <div style={{ marginBottom: 40, paddingBottom: 32, borderBottom: "1px solid #1a1b21" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
          <div style={{ height: 3, width: 32, backgroundColor: "#00f5ff", borderRadius: 4 }} />
          <span style={{ fontSize: 10, fontWeight: 900, color: "#00f5ff", letterSpacing: "0.4em", textTransform: "uppercase" as const }}>Mission.Initialize</span>
        </div>
        <h1 style={{ fontSize: 36, fontWeight: 900, color: "#fff", letterSpacing: -2, lineHeight: 1 }}>NEW DISCOVERY</h1>
        <p style={{ fontSize: 13, fontWeight: 700, color: "#3d4150", marginTop: 8 }}>Define target parameters. AI will discover, audit, and generate outreach.</p>
      </div>

      {/* Form Panel */}
      <div className="panel" style={{ overflow: "hidden" }}>
        <div style={{ padding: "20px 28px", borderBottom: "1px solid #1a1b21", display: "flex", alignItems: "center", gap: 10 }}>
          <Cpu style={{ width: 18, height: 18, color: "#00f5ff" }} />
          <span style={{ fontSize: 13, fontWeight: 900, color: "#fff" }}>Mission Parameters</span>
        </div>
        <form action={createCampaign} style={{ padding: 28 }}>
          <div style={{ marginBottom: 28 }}>
            <label style={{ display: "block", fontSize: 9, fontWeight: 900, color: "#6b7280", letterSpacing: "0.2em", textTransform: "uppercase" as const, marginBottom: 8 }}>
              Business Niche
            </label>
            <div style={{ position: "relative" }}>
              <Search style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", width: 16, height: 16, color: "#3d4150" }} />
              <input
                name="niche"
                className="input-dark"
                placeholder="e.g. Plumbing, HVAC, Dental, Legal..."
                required
                style={{ paddingLeft: 44 }}
              />
            </div>
            <p style={{ fontSize: 10, fontWeight: 600, color: "#3d4150", marginTop: 6 }}>The industry vertical you want to target.</p>
          </div>

          <div style={{ marginBottom: 28 }}>
            <label style={{ display: "block", fontSize: 9, fontWeight: 900, color: "#6b7280", letterSpacing: "0.2em", textTransform: "uppercase" as const, marginBottom: 8 }}>
              Target Location
            </label>
            <div style={{ position: "relative" }}>
              <MapPin style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", width: 16, height: 16, color: "#3d4150" }} />
              <input
                name="location"
                className="input-dark"
                placeholder="e.g. Chicago, IL or London, UK"
                required
                style={{ paddingLeft: 44 }}
              />
            </div>
            <p style={{ fontSize: 10, fontWeight: 600, color: "#3d4150", marginTop: 6 }}>City or region for local business extraction.</p>
          </div>

          <div style={{ marginBottom: 36 }}>
            <label style={{ display: "block", fontSize: 9, fontWeight: 900, color: "#6b7280", letterSpacing: "0.2em", textTransform: "uppercase" as const, marginBottom: 8 }}>
              Lead Count
            </label>
            <div style={{ position: "relative" }}>
              <Hash style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", width: 16, height: 16, color: "#3d4150" }} />
              <input
                name="count"
                type="number"
                defaultValue="10"
                min="1"
                max="50"
                className="input-dark"
                required
                style={{ paddingLeft: 44 }}
              />
            </div>
            <p style={{ fontSize: 10, fontWeight: 600, color: "#3d4150", marginTop: 6 }}>Max nodes to discover and audit (1-50).</p>
          </div>

          <button type="submit" className="btn-primary" style={{ width: "100%", padding: "16px 0", fontSize: 12 }}>
            LAUNCH DISCOVERY PROTOCOL
          </button>
        </form>
      </div>

      {/* Steps */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginTop: 32 }}>
        {[
          { n: "01", t: "DISCOVER", d: "Extract business nodes from web sources", i: Search, c: "#00f5ff" },
          { n: "02", t: "AUDIT", d: "Technical + SEO gap analysis per node", i: Target, c: "#f59e0b" },
          { n: "03", t: "GENERATE", d: "AI reports & cold outreach drafts", i: Zap, c: "#10b981" },
        ].map((step) => (
          <div key={step.n} className="panel" style={{ padding: 24, textAlign: "center" }}>
            <div style={{ fontSize: 28, fontWeight: 900, color: step.c, fontFamily: "var(--font-mono)", marginBottom: 8 }}>{step.n}</div>
            <div style={{ fontSize: 10, fontWeight: 900, color: "#fff", letterSpacing: "0.15em", marginBottom: 4 }}>{step.t}</div>
            <div style={{ fontSize: 10, fontWeight: 600, color: "#3d4150", lineHeight: 1.5 }}>{step.d}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
