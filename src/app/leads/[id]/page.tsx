import prisma from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Globe, Mail, Phone, MapPin, Star, ShieldCheck,
  Search, Target, Rocket, CheckCircle2,
  ExternalLink, FileText, Send, Sparkles,
  Zap, XCircle, Clock, ArrowLeft, Cpu, Copy
} from "lucide-react";

export default async function LeadDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const lead = await prisma.lead.findUnique({
    where: { id },
    include: { campaign: true, audit: true, report: true },
  });

  if (!lead) notFound();

  const audit = lead.audit || {
    seoScore: 0, croScore: 0, trustScore: 0, technicalScore: 0,
    localSeoScore: 0, overallScore: 0, loadTimeMs: 0, isOutdatedUI: false,
    title: "", metaDescription: "", h1Count: 0, h2Count: 0,
    hasSsl: false, hasContactForm: false, hasCta: false,
    hasSchema: false, hasSocialLinks: false, hasReviews: false,
  };

  const service = (lead.report?.serviceOffer as any) || {};

  const scoreColor = (v: number) => v >= 70 ? "#10b981" : v >= 40 ? "#f59e0b" : "#f43f5e";

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", paddingBottom: 32, borderBottom: "1px solid #1a1b21", marginBottom: 40 }}>
        <div>
          <Link href={`/campaigns/${lead.campaignId}`} style={{ fontSize: 10, fontWeight: 900, color: "#3d4150", letterSpacing: "0.3em", textDecoration: "none", display: "flex", alignItems: "center", gap: 6, marginBottom: 16 }}>
            <ArrowLeft style={{ width: 12, height: 12 }} /> BACK TO MISSION
          </Link>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 8 }}>
            <h1 style={{ fontSize: 32, fontWeight: 900, color: "#fff", letterSpacing: -1 }}>{lead.businessName}</h1>
            <span style={{
              fontSize: 9, fontWeight: 900, padding: "4px 12px", borderRadius: 6,
              backgroundColor: lead.priority === "HOT" ? "rgba(244,63,94,0.15)" : "#15171e",
              color: lead.priority === "HOT" ? "#f43f5e" : "#6b7280",
              letterSpacing: "0.15em",
            }}>
              {lead.priority}
            </span>
          </div>
          <div style={{ display: "flex", gap: 20, fontSize: 12, fontWeight: 700, color: "#6b7280" }}>
            <span style={{ display: "flex", alignItems: "center", gap: 6 }}><MapPin style={{ width: 14, height: 14, color: "#f43f5e" }} /> {lead.address || "Local"}</span>
            {lead.rating && <span style={{ display: "flex", alignItems: "center", gap: 6, color: "#f59e0b" }}><Star style={{ width: 14, height: 14 }} /> {lead.rating} ({lead.reviewCount})</span>}
          </div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {lead.slug && <Link href={`/report/${lead.slug}`} target="_blank" className="btn-ghost" style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6 }}><Rocket style={{ width: 14, height: 14 }} /> REPORT</Link>}
          <button className="btn-primary" style={{ display: "flex", alignItems: "center", gap: 8 }}><Send style={{ width: 14, height: 14 }} /> OUTREACH</button>
        </div>
      </div>

      {/* OVERVIEW: 3 Column Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 24, marginBottom: 40 }}>
        {/* Contact Info */}
        <div className="panel" style={{ padding: 28 }}>
          <div style={{ fontSize: 9, fontWeight: 900, color: "#3d4150", letterSpacing: "0.2em", marginBottom: 20 }}>CONTACT DATA</div>
          {[
            { l: "Website", v: lead.webUrl || "N/A", i: Globe, c: "#3b82f6" },
            { l: "Email", v: lead.email || "Pending", i: Mail, c: "#10b981" },
            { l: "Phone", v: lead.phone || "N/A", i: Phone, c: "#f59e0b" },
          ].map((item) => (
            <div key={item.l} style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 0", borderBottom: "1px solid #1a1b21" }}>
              <div style={{ padding: 8, borderRadius: 10, backgroundColor: `${item.c}15`, color: item.c, display: "flex" }}>
                <item.i style={{ width: 16, height: 16 }} />
              </div>
              <div>
                <div style={{ fontSize: 9, fontWeight: 900, color: "#3d4150", letterSpacing: "0.15em" }}>{item.l.toUpperCase()}</div>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#fff", wordBreak: "break-all" as const }}>{item.v}</div>
              </div>
            </div>
          ))}
        </div>

        {/* GMB Status */}
        <div style={{ backgroundColor: "#15171e", border: "1px solid #1a1b21", borderRadius: 20, padding: 28 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
            <span style={{ fontSize: 9, fontWeight: 900, color: "#3d4150", letterSpacing: "0.2em" }}>GMB PROFILE</span>
            {lead.mapsLink && (
              <a href={lead.mapsLink} target="_blank" rel="noopener noreferrer" style={{ fontSize: 9, fontWeight: 900, color: "#00f5ff", textDecoration: "none", letterSpacing: "0.1em" }}>
                OPEN ↗
              </a>
            )}
          </div>
          {[
            { l: "Claimed", v: lead.isClaimed },
            { l: "Optimized", v: lead.isGmbOptimized },
            { l: "Photos", v: lead.hasGmbPhotos },
            { l: "Rating OK", v: !lead.hasLowRating },
          ].map((item) => (
            <div key={item.l} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: "1px solid #222531" }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: "#9ca3af" }}>{item.l}</span>
              {item.v ? (
                <CheckCircle2 style={{ width: 16, height: 16, color: "#10b981" }} />
              ) : (
                <XCircle style={{ width: 16, height: 16, color: "#f43f5e" }} />
              )}
            </div>
          ))}
          {lead.mapsLink && (
            <a href={lead.mapsLink} target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 20, width: "100%", textDecoration: "none" }}>
              <MapPin style={{ width: 14, height: 14 }} /> GOOGLE MAPS
            </a>
          )}
        </div>

        {/* Score Ring */}
        <div className="panel" style={{ padding: 28, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <div style={{ position: "relative", width: 140, height: 140, marginBottom: 16 }}>
            <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%", transform: "rotate(-90deg)" }}>
              <circle cx="50" cy="50" r="40" fill="none" stroke="#1a1b21" strokeWidth="8" />
              <circle cx="50" cy="50" r="40" fill="none" stroke={scoreColor(audit.overallScore)} strokeWidth="8"
                strokeDasharray={2 * Math.PI * 40}
                strokeDashoffset={2 * Math.PI * 40 * (1 - audit.overallScore / 100)}
                strokeLinecap="round"
                style={{ filter: `drop-shadow(0 0 6px ${scoreColor(audit.overallScore)}66)` }}
              />
            </svg>
            <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", textAlign: "center" }}>
              <div style={{ fontSize: 36, fontWeight: 900, color: "#fff", fontFamily: "var(--font-mono)" }}>{audit.overallScore}</div>
            </div>
          </div>
          <div style={{ fontSize: 9, fontWeight: 900, color: "#3d4150", letterSpacing: "0.2em" }}>OVERALL HEALTH</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 8, width: "100%", marginTop: 20 }}>
            {[
              { l: "SEO", v: audit.seoScore },
              { l: "CRO", v: audit.croScore },
              { l: "TRUST", v: audit.trustScore },
              { l: "TECH", v: audit.technicalScore },
              { l: "LOCAL", v: audit.localSeoScore },
            ].map((s) => (
              <div key={s.l} style={{ textAlign: "center", padding: "8px 0", backgroundColor: "#0c0d12", borderRadius: 10, border: "1px solid #1a1b21" }}>
                <div style={{ fontSize: 8, fontWeight: 900, color: "#3d4150", letterSpacing: "0.1em", marginBottom: 2 }}>{s.l}</div>
                <div style={{ fontSize: 14, fontWeight: 900, color: scoreColor(s.v), fontFamily: "var(--font-mono)" }}>{s.v}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Priority Reason */}
      <div style={{ backgroundColor: "#0c0d12", border: "1px solid #1a1b21", borderRadius: 20, padding: 32, marginBottom: 40 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Target style={{ width: 20, height: 20, color: "#00f5ff" }} />
            <span style={{ fontSize: 14, fontWeight: 900, color: "#fff" }}>PRIORITY ANALYSIS</span>
          </div>
          <div style={{ padding: "8px 16px", backgroundColor: "#15171e", borderRadius: 10, border: "1px solid #222531" }}>
            <span style={{ fontSize: 9, fontWeight: 900, color: "#3d4150", letterSpacing: "0.15em" }}>INTENT SCORE: </span>
            <span style={{ fontSize: 16, fontWeight: 900, color: "#00f5ff", fontFamily: "var(--font-mono)" }}>{lead.priorityScore}/100</span>
          </div>
        </div>
        <div style={{ padding: 24, backgroundColor: "#15171e", borderRadius: 14, border: "1px solid #222531" }}>
          <p style={{ fontSize: 15, fontWeight: 600, color: "#9ca3af", lineHeight: 1.8, fontStyle: "italic" }}>
            &quot;{lead.priorityReason}&quot;
          </p>
        </div>
      </div>

      {/* Audit Checks */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 40 }}>
        <div className="panel" style={{ padding: 28 }}>
          <div style={{ fontSize: 9, fontWeight: 900, color: "#3d4150", letterSpacing: "0.2em", marginBottom: 20 }}>CONTENT & SEO</div>
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 9, fontWeight: 900, color: "#3d4150", letterSpacing: "0.15em", marginBottom: 4 }}>TITLE TAG</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: audit.title ? "#fff" : "#f43f5e" }}>{audit.title || "Missing"}</div>
          </div>
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 9, fontWeight: 900, color: "#3d4150", letterSpacing: "0.15em", marginBottom: 4 }}>META DESCRIPTION</div>
            <div style={{ fontSize: 12, fontWeight: 600, color: "#6b7280", lineHeight: 1.6 }}>{audit.metaDescription || "Not found"}</div>
          </div>
          <div style={{ display: "flex", gap: 16 }}>
            <div><span style={{ fontSize: 9, fontWeight: 900, color: "#3d4150" }}>H1: </span><span style={{ fontSize: 14, fontWeight: 900, color: audit.h1Count === 1 ? "#10b981" : "#f43f5e" }}>{audit.h1Count}</span></div>
            <div><span style={{ fontSize: 9, fontWeight: 900, color: "#3d4150" }}>H2: </span><span style={{ fontSize: 14, fontWeight: 900, color: "#6b7280" }}>{audit.h2Count}</span></div>
          </div>
        </div>

        <div className="panel" style={{ padding: 28 }}>
          <div style={{ fontSize: 9, fontWeight: 900, color: "#3d4150", letterSpacing: "0.2em", marginBottom: 20 }}>TECH CHECKS</div>
          {[
            { l: "SSL Encryption", v: audit.hasSsl, i: ShieldCheck },
            { l: "Fast Page Load", v: audit.loadTimeMs < 3000, i: Clock },
            { l: "Lead Capture Form", v: audit.hasContactForm, i: Mail },
            { l: "Call-to-Action", v: audit.hasCta, i: Rocket },
            { l: "Schema Markup", v: audit.hasSchema, i: FileText },
            { l: "Social Proof", v: audit.hasReviews, i: Star },
          ].map((item) => (
            <div key={item.l} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid #1a1b21" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <item.i style={{ width: 14, height: 14, color: "#3d4150" }} />
                <span style={{ fontSize: 12, fontWeight: 700, color: "#9ca3af" }}>{item.l}</span>
              </div>
              <span style={{ fontSize: 9, fontWeight: 900, padding: "3px 10px", borderRadius: 6, backgroundColor: item.v ? "rgba(16,185,129,0.15)" : "rgba(244,63,94,0.15)", color: item.v ? "#10b981" : "#f43f5e", letterSpacing: "0.1em" }}>
                {item.v ? "PASS" : "FAIL"}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* AI Report */}
      {lead.report && (
        <div className="panel" style={{ padding: 32, marginBottom: 40 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
            <Sparkles style={{ width: 20, height: 20, color: "#6366f1" }} />
            <span style={{ fontSize: 14, fontWeight: 900, color: "#fff" }}>AI GROWTH STRATEGY</span>
          </div>
          <div style={{ padding: 24, backgroundColor: "#15171e", borderRadius: 14, border: "1px solid #222531", marginBottom: 24 }}>
            <p style={{ fontSize: 14, fontWeight: 600, color: "#9ca3af", lineHeight: 1.8, fontStyle: "italic" }}>
              &quot;{lead.report.summary}&quot;
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
            <div>
              <div style={{ fontSize: 9, fontWeight: 900, color: "#f43f5e", letterSpacing: "0.2em", marginBottom: 12 }}>REVENUE GAPS</div>
              {(lead.report.topGaps as string[] || []).map((g, i) => (
                <div key={i} style={{ fontSize: 12, fontWeight: 700, color: "#9ca3af", padding: "8px 0", borderBottom: "1px solid #1a1b21" }}>
                  <span style={{ color: "#f43f5e", fontWeight: 900, marginRight: 8 }}>{i + 1}.</span>{g}
                </div>
              ))}
            </div>
            <div>
              <div style={{ fontSize: 9, fontWeight: 900, color: "#6366f1", letterSpacing: "0.2em", marginBottom: 12 }}>FIXES</div>
              <div style={{ fontSize: 12, fontWeight: 600, color: "#6b7280", lineHeight: 1.8 }}>{lead.report.recommendedFixes}</div>
            </div>
          </div>
        </div>
      )}

      {/* Outreach Templates */}
      {lead.report && (
        <div style={{ marginBottom: 40 }}>
          <div style={{ fontSize: 9, fontWeight: 900, color: "#3d4150", letterSpacing: "0.2em", marginBottom: 20, display: "flex", alignItems: "center", gap: 8 }}>
            <Send style={{ width: 14, height: 14 }} /> OUTREACH TEMPLATES
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {[
              { t: "COLD EMAIL", v: lead.report.coldEmail },
              { t: "FOLLOW UP", v: lead.report.followUpEmail },
              { t: "SOCIAL DM", v: lead.report.shortDm },
            ].map((item) => (
              <div key={item.t} className="panel" style={{ overflow: "hidden" }}>
                <div style={{ padding: "14px 24px", borderBottom: "1px solid #1a1b21", display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: "#0c0d12" }}>
                  <span style={{ fontSize: 9, fontWeight: 900, color: "#3d4150", letterSpacing: "0.3em" }}>{item.t}</span>
                  <button className="btn-ghost" style={{ padding: "6px 12px", fontSize: 9 }}>
                    <Copy style={{ width: 12, height: 12, display: "inline", marginRight: 6 }} />COPY
                  </button>
                </div>
                <div style={{ padding: 24, fontSize: 13, fontWeight: 500, color: "#6b7280", lineHeight: 1.8, fontFamily: "var(--font-mono)", whiteSpace: "pre-wrap" as const }}>
                  {item.v}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
