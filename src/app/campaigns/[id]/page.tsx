import prisma from "@/lib/prisma";
import Link from "next/link";
import { MapPin, ExternalLink, Mail, Phone, Database, Search, LayoutGrid } from "lucide-react";
import { notFound } from "next/navigation";

export default async function CampaignResultsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const campaign = await prisma.campaign.findUnique({
    where: { id },
    include: {
      leads: {
        include: { audit: true },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!campaign) notFound();

  return (
    <div>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", paddingBottom: 32, borderBottom: "1px solid #1a1b21", marginBottom: 40 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
            <div style={{ height: 3, width: 32, backgroundColor: "#00f5ff", borderRadius: 4 }} />
            <span style={{ fontSize: 10, fontWeight: 900, color: "#00f5ff", letterSpacing: "0.4em", textTransform: "uppercase" as const }}>Mission.Results</span>
          </div>
          <h1 style={{ fontSize: 36, fontWeight: 900, color: "#fff", letterSpacing: -2, lineHeight: 1, textTransform: "capitalize" as const }}>
            {campaign.niche} <span style={{ color: "#3d4150" }}>//</span> {campaign.location}
          </h1>
          <p style={{ fontSize: 13, fontWeight: 700, color: "#3d4150", marginTop: 8 }}>
            Discovered {campaign.leads.length} business nodes. Target: {campaign.count}.
          </p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="btn-ghost"><Search style={{ width: 14, height: 14, display: "inline", marginRight: 8 }} />REFRESH</button>
          <button className="btn-primary"><Mail style={{ width: 14, height: 14, display: "inline", marginRight: 8 }} />BULK OUTREACH</button>
        </div>
      </div>

      {/* Table */}
      <div className="panel" style={{ overflow: "hidden" }}>
        <table>
          <thead>
            <tr>
              <th>Entity</th>
              <th>Priority</th>
              <th>Location</th>
              <th>Contact</th>
              <th>Rating</th>
              <th>Score</th>
              <th>Status</th>
              <th style={{ textAlign: "right" }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {campaign.leads.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ textAlign: "center", padding: 60, color: "#3d4150", fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase" as const }}>
                  No entities found. System may still be processing.
                </td>
              </tr>
            ) : (
              campaign.leads.map((lead) => (
                <tr key={lead.id}>
                  <td>
                    <div style={{ fontWeight: 800, color: "#fff", fontSize: 13 }}>{lead.businessName}</div>
                    <div style={{ display: "flex", gap: 12, marginTop: 4 }}>
                      {lead.webUrl && (
                        <a href={lead.webUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: 10, fontWeight: 700, color: "#3d4150", display: "flex", alignItems: "center", gap: 4, textDecoration: "none" }}>
                          <ExternalLink style={{ width: 12, height: 12 }} /> WEB
                        </a>
                      )}
                      {lead.mapsLink && (
                        <a href={lead.mapsLink} target="_blank" rel="noopener noreferrer" style={{ fontSize: 10, fontWeight: 700, color: "#00f5ff", display: "flex", alignItems: "center", gap: 4, textDecoration: "none" }}>
                          <MapPin style={{ width: 12, height: 12 }} /> GMB
                        </a>
                      )}
                    </div>
                  </td>
                  <td>
                    <span style={{
                      fontSize: 9, fontWeight: 900, padding: "4px 10px", borderRadius: 6,
                      backgroundColor: lead.priority === "HOT" ? "rgba(244,63,94,0.15)" : "#15171e",
                      color: lead.priority === "HOT" ? "#f43f5e" : "#6b7280",
                      letterSpacing: "0.1em",
                    }}>
                      {lead.priority}
                    </span>
                  </td>
                  <td>
                    <div style={{ fontSize: 11, fontWeight: 800, color: "#6b7280", display: "flex", alignItems: "center", gap: 6 }}>
                      <MapPin style={{ width: 12, height: 12, color: "#3d4150" }} />
                      {lead.address || campaign.location}
                    </div>
                  </td>
                  <td>
                    {lead.email && <div style={{ fontSize: 10, fontWeight: 700, color: "#9ca3af", display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}><Mail style={{ width: 12, height: 12, color: "#00f5ff" }} /> {lead.email}</div>}
                    {lead.phone && <div style={{ fontSize: 10, fontWeight: 700, color: "#9ca3af", display: "flex", alignItems: "center", gap: 6 }}><Phone style={{ width: 12, height: 12, color: "#00f5ff" }} /> {lead.phone}</div>}
                  </td>
                  <td>
                    <div style={{ fontSize: 12, fontWeight: 800, color: "#f59e0b" }}>
                      ★ {lead.rating ? Number(lead.rating).toFixed(1) : "—"}
                      <span style={{ fontSize: 9, color: "#3d4150", marginLeft: 4 }}>({lead.reviewCount || 0})</span>
                    </div>
                  </td>
                  <td>
                    <div style={{
                      fontSize: 18, fontWeight: 900, fontFamily: "var(--font-mono)",
                      color: (lead.audit?.overallScore || 0) > 70 ? "#10b981" : (lead.audit?.overallScore || 0) > 40 ? "#f59e0b" : "#6b7280",
                    }}>
                      {(lead.audit?.overallScore || 0).toString().padStart(2, "0")}
                    </div>
                  </td>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <div style={{
                        width: 5, height: 5, borderRadius: "50%",
                        backgroundColor: lead.status === "DONE" ? "#10b981" : lead.status === "FAILED" ? "#f43f5e" : "#3b82f6",
                      }} />
                      <span style={{ fontSize: 9, fontWeight: 900, letterSpacing: "0.15em", color: lead.status === "DONE" ? "#10b981" : lead.status === "FAILED" ? "#f43f5e" : "#3b82f6" }}>
                        {lead.status === "DONE" ? "READY" : lead.status}
                      </span>
                    </div>
                  </td>
                  <td style={{ textAlign: "right" }}>
                    <Link href={`/leads/${lead.id}`} className="btn-ghost" style={{ padding: "8px 14px", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6 }}>
                      <LayoutGrid style={{ width: 14, height: 14 }} /> VIEW
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
