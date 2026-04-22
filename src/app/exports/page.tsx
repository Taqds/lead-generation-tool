"use client";

import { useState } from "react";
import { Download, FileText, Loader2, CheckCircle2, Calendar } from "lucide-react";

export default function ExportsPage() {
  const [isExporting, setIsExporting] = useState(false);
  const [exportDone, setExportDone] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    setExportDone(false);
    try {
      const response = await fetch("/api/exports/csv");
      if (!response.ok) throw new Error("Export failed");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `STELV-intelligence-${new Date().toISOString().split("T")[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      setExportDone(true);
    } catch (err) {
      console.error("Export error:", err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", paddingBottom: 32, borderBottom: "1px solid #1a1b21", marginBottom: 40 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
            <div style={{ height: 3, width: 32, backgroundColor: "#00f5ff", borderRadius: 4 }} />
            <span style={{ fontSize: 10, fontWeight: 900, color: "#00f5ff", letterSpacing: "0.4em", textTransform: "uppercase" as const }}>Data.Extraction</span>
          </div>
          <h1 style={{ fontSize: 36, fontWeight: 900, color: "#fff", letterSpacing: -2, lineHeight: 1 }}>EXPORT CENTER</h1>
          <p style={{ fontSize: 13, fontWeight: 700, color: "#3d4150", marginTop: 8 }}>Extract your database into localized CSV formats.</p>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24, marginBottom: 40 }}>
        {/* All Leads Export */}
        <div className="panel" style={{ padding: 32 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
            <div style={{ padding: 12, backgroundColor: "rgba(0,245,255,0.1)", borderRadius: 14 }}>
              <FileText style={{ width: 20, height: 20, color: "#00f5ff" }} />
            </div>
            <span style={{ padding: "4px 10px", backgroundColor: "#15171e", borderRadius: 8, border: "1px solid #222531", fontSize: 9, fontWeight: 900, color: "#6b7280", letterSpacing: "0.15em" }}>.CSV</span>
          </div>
          <h3 style={{ fontSize: 20, fontWeight: 900, color: "#fff", marginBottom: 8 }}>Global Database</h3>
          <p style={{ fontSize: 12, fontWeight: 600, color: "#6b7280", lineHeight: 1.6, marginBottom: 24 }}>
            Extract entire node list including contact data, audit scores, and statuses.
          </p>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 10, fontWeight: 800, color: "#3d4150", marginBottom: 24, textTransform: "uppercase" as const }}>
            <span>Columns: 14</span>
            <span style={{ color: "#10b981" }}>READY</span>
          </div>
          <button 
            className="btn-primary" 
            style={{ width: "100%", padding: "16px 0", fontSize: 11, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, opacity: isExporting ? 0.6 : 1 }}
            onClick={handleExport} 
            disabled={isExporting}
          >
            {isExporting ? (
              <><Loader2 style={{ width: 14, height: 14, animation: "spin 1s linear infinite" }} /> EXTRACTING...</>
            ) : exportDone ? (
              <><CheckCircle2 style={{ width: 14, height: 14 }} /> ACQUIRED</>
            ) : (
              <><Download style={{ width: 14, height: 14 }} /> DOWNLOAD PACKAGE</>
            )}
          </button>
        </div>

        {/* Audit Reports Export */}
        <div className="panel" style={{ padding: 32, opacity: 0.5 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
            <div style={{ padding: 12, backgroundColor: "rgba(245,158,11,0.1)", borderRadius: 14 }}>
              <FileText style={{ width: 20, height: 20, color: "#f59e0b" }} />
            </div>
            <span style={{ padding: "4px 10px", backgroundColor: "#15171e", borderRadius: 8, border: "1px solid #222531", fontSize: 9, fontWeight: 900, color: "#6b7280", letterSpacing: "0.15em" }}>.CSV</span>
          </div>
          <h3 style={{ fontSize: 20, fontWeight: 900, color: "#fff", marginBottom: 8 }}>Audit Metrics</h3>
          <p style={{ fontSize: 12, fontWeight: 600, color: "#6b7280", lineHeight: 1.6, marginBottom: 24 }}>
            Individual technical, SEO, and CRO scores for all processed entities.
          </p>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 10, fontWeight: 800, color: "#3d4150", marginBottom: 24, textTransform: "uppercase" as const }}>
            <span>Columns: 24</span>
            <span style={{ color: "#f59e0b" }}>PENDING</span>
          </div>
          <button className="btn-ghost" style={{ width: "100%", padding: "16px 0", fontSize: 11 }} disabled>
             LOCKED PROTOCOL
          </button>
        </div>

        {/* Outreach Templates Export */}
        <div className="panel" style={{ padding: 32, opacity: 0.5 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
            <div style={{ padding: 12, backgroundColor: "rgba(99,102,241,0.1)", borderRadius: 14 }}>
              <FileText style={{ width: 20, height: 20, color: "#6366f1" }} />
            </div>
            <span style={{ padding: "4px 10px", backgroundColor: "#15171e", borderRadius: 8, border: "1px solid #222531", fontSize: 9, fontWeight: 900, color: "#6b7280", letterSpacing: "0.15em" }}>.CSV</span>
          </div>
          <h3 style={{ fontSize: 20, fontWeight: 900, color: "#fff", marginBottom: 8 }}>AI Templates</h3>
          <p style={{ fontSize: 12, fontWeight: 600, color: "#6b7280", lineHeight: 1.6, marginBottom: 24 }}>
            Export all generated cold emails and follow-ups.
          </p>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 10, fontWeight: 800, color: "#3d4150", marginBottom: 24, textTransform: "uppercase" as const }}>
            <span>Columns: 6</span>
            <span style={{ color: "#f59e0b" }}>PENDING</span>
          </div>
          <button className="btn-ghost" style={{ width: "100%", padding: "16px 0", fontSize: 11 }} disabled>
             LOCKED PROTOCOL
          </button>
        </div>
      </div>

      {/* Export History */}
      <div className="panel" style={{ padding: 32 }}>
        <h3 style={{ fontSize: 16, fontWeight: 900, color: "#fff", marginBottom: 8 }}>Transfer Logs</h3>
        <p style={{ fontSize: 12, fontWeight: 600, color: "#6b7280" }}>Historical record of data extractions.</p>
        
        <div style={{ textAlign: "center", padding: "60px 0" }}>
          <Calendar style={{ width: 32, height: 32, color: "#1a1b21", margin: "0 auto 16px" }} />
          <p style={{ fontSize: 11, fontWeight: 800, color: "#3d4150", letterSpacing: "0.15em", textTransform: "uppercase" as const }}>
            No transfers logged in current cycle.
          </p>
        </div>
      </div>
    </div>
  );
}
