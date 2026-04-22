import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { ShieldCheck, Zap, Target, CheckCircle2, XCircle, AlertTriangle, ArrowRight, MessageSquare, Clock, ArrowUpRight } from "lucide-react";

export default async function PublicReportPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  const lead = await prisma.lead.findUnique({
    where: { slug },
    include: { audit: true, report: true },
  });

  if (!lead || !lead.audit || !lead.report) notFound();

  const scores = lead.audit;
  const topGaps = (lead.report.topGaps as string[]) || [];
  const scoreColor = (s: number) => s >= 80 ? "#10b981" : s >= 50 ? "#f59e0b" : "#f43f5e";

  const criticalIssues = [
    { label: "SSL Security", value: scores.hasSsl, desc: "Essential for data protection and Google rankings.", i: ShieldCheck },
    { label: "Conversion Forms", value: scores.hasContactForm, desc: "Captures potential customers automatically.", i: MessageSquare },
    { label: "Call to Action", value: scores.hasCta, desc: "Tells visitors exactly what to do next.", i: Target },
    { label: "Page Load Speed", value: scores.loadTimeMs < 3000, desc: "Visitors leave if pages take >3s to load.", i: Zap },
    { label: "Modern Layout", value: !scores.isOutdatedUI, desc: "Outdated designs often drive customers away.", i: ArrowRight }
  ];

  return (
    <div style={{ backgroundColor: "#030712", minHeight: "100vh", color: "#fff", fontFamily: "var(--font-sans)" }}>
      {/* Hero */}
      <header style={{ padding: "80px 40px", maxWidth: 1200, margin: "0 auto", position: "relative" }}>
        <div style={{ position: "absolute", top: 0, right: 0, width: 400, height: 400, backgroundColor: "rgba(0,245,255,0.1)", filter: "blur(100px)", borderRadius: "50%", pointerEvents: "none" }} />
        
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 40, position: "relative", zIndex: 10 }}>
          <div style={{ maxWidth: 600 }}>
            <div style={{ padding: "6px 14px", backgroundColor: "rgba(0,245,255,0.1)", border: "1px solid rgba(0,245,255,0.2)", borderRadius: 999, fontSize: 10, fontWeight: 900, color: "#00f5ff", letterSpacing: "0.15em", textTransform: "uppercase" as const, display: "inline-block", marginBottom: 24 }}>
              Exclusive Growth Audit
            </div>
            <h1 style={{ fontSize: 56, fontWeight: 900, letterSpacing: -2, lineHeight: 1.1, marginBottom: 24 }}>
              We found <span style={{ color: "#00f5ff" }}>{topGaps.length} critical gaps</span> in your digital presence.
            </h1>
            <p style={{ fontSize: 18, fontWeight: 500, color: "#9ca3af", lineHeight: 1.6, marginBottom: 40 }}>
              {lead.businessName}, your overall health score is <strong style={{ color: "#fff" }}>{scores.overallScore}/100</strong>. We've identified exactly what's blocking you from higher revenue.
            </p>
            <div style={{ display: "flex", gap: 16 }}>
              <button className="btn-primary" style={{ padding: "16px 32px", fontSize: 12, borderRadius: 999 }}>
                BOOK FREE CONSULTATION
              </button>
            </div>
          </div>

          <div style={{ position: "relative", width: 280, height: 280, display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#0a0c10", borderRadius: "50%", border: "1px solid #1a1b21", boxShadow: "0 20px 40px rgba(0,0,0,0.5)" }}>
            <svg viewBox="0 0 100 100" style={{ position: "absolute", width: "100%", height: "100%", transform: "rotate(-90deg)" }}>
              <circle cx="50" cy="50" r="44" fill="none" stroke="#1a1b21" strokeWidth="6" />
              <circle cx="50" cy="50" r="44" fill="none" stroke={scoreColor(scores.overallScore)} strokeWidth="6"
                strokeDasharray={2 * Math.PI * 44}
                strokeDashoffset={2 * Math.PI * 44 * (1 - scores.overallScore / 100)}
                strokeLinecap="round"
                style={{ filter: `drop-shadow(0 0 10px ${scoreColor(scores.overallScore)})` }}
              />
            </svg>
            <div style={{ textAlign: "center", position: "relative", zIndex: 10 }}>
              <div style={{ fontSize: 64, fontWeight: 900, fontFamily: "var(--font-mono)", lineHeight: 1, color: "#fff" }}>{scores.overallScore}</div>
              <div style={{ fontSize: 10, fontWeight: 900, color: "#6b7280", letterSpacing: "0.2em", textTransform: "uppercase" as const, marginTop: 4 }}>Total Score</div>
            </div>
          </div>
        </div>
      </header>

      {/* Critical Issues */}
      <section style={{ padding: "80px 40px", maxWidth: 1200, margin: "0 auto", borderTop: "1px solid #1a1b21" }}>
        <div style={{ textAlign: "center", marginBottom: 60 }}>
          <h2 style={{ fontSize: 32, fontWeight: 900, marginBottom: 12, color: "#fff" }}>Technical Performance Summary</h2>
          <p style={{ fontSize: 14, fontWeight: 600, color: "#6b7280" }}>Automated extraction based on modern conversion architecture.</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
          {criticalIssues.map((issue, idx) => (
            <div key={idx} style={{ backgroundColor: "#0c0d12", border: "1px solid #1a1b21", borderRadius: 24, padding: 32 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                <div style={{ padding: 10, backgroundColor: issue.value ? "rgba(16,185,129,0.1)" : "rgba(244,63,94,0.1)", borderRadius: 12, color: issue.value ? "#10b981" : "#f43f5e" }}>
                  {issue.value ? <CheckCircle2 style={{ width: 24, height: 24 }} /> : <XCircle style={{ width: 24, height: 24 }} />}
                </div>
                <span style={{ fontSize: 9, fontWeight: 900, padding: "4px 10px", borderRadius: 6, backgroundColor: issue.value ? "rgba(16,185,129,0.1)" : "rgba(244,63,94,0.1)", color: issue.value ? "#10b981" : "#f43f5e", letterSpacing: "0.1em", textTransform: "uppercase" as const }}>
                  {issue.value ? "Optimized" : "Action Req"}
                </span>
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 900, color: "#fff", marginBottom: 8 }}>{issue.label}</h3>
              <p style={{ fontSize: 13, fontWeight: 500, color: "#6b7280", lineHeight: 1.6 }}>{issue.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Analysis */}
      <section style={{ padding: "100px 40px", backgroundColor: "#050608", borderTop: "1px solid #1a1b21", borderBottom: "1px solid #1a1b21" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 40 }}>
            <div style={{ padding: 16, backgroundColor: "rgba(0,245,255,0.1)", borderRadius: 16, color: "#00f5ff" }}>
              <MessageSquare style={{ width: 24, height: 24 }} />
            </div>
            <div>
              <h2 style={{ fontSize: 28, fontWeight: 900, color: "#fff" }}>AI Strategy Analysis</h2>
              <p style={{ fontSize: 14, fontWeight: 600, color: "#6b7280" }}>Custom insights for {lead.businessName}.</p>
            </div>
          </div>

          <div style={{ backgroundColor: "#0c0d12", border: "1px solid #1a1b21", borderRadius: 32, padding: 48, position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 0, right: 0, padding: 24, fontSize: 80, fontWeight: 900, color: "rgba(255,255,255,0.02)", lineHeight: 0.8, pointerEvents: "none" }}>01</div>
            
            <p style={{ fontSize: 20, fontWeight: 500, color: "#d1d5db", lineHeight: 1.8, fontStyle: "italic", borderLeft: "3px solid rgba(0,245,255,0.4)", paddingLeft: 24, marginBottom: 40 }}>
              &quot;{lead.report.summary}&quot;
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }}>
              <div>
                <h5 style={{ fontSize: 10, fontWeight: 900, color: "#6b7280", letterSpacing: "0.2em", textTransform: "uppercase" as const, marginBottom: 16 }}>Revenue Gaps</h5>
                <ul style={{ listStyle: "none", padding: 0 }}>
                  {topGaps.map((gap, i) => (
                    <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 12, fontSize: 13, fontWeight: 600, color: "#d1d5db" }}>
                      <ArrowRight style={{ width: 16, height: 16, color: "#f43f5e", marginTop: 2, flexShrink: 0 }} />
                      {gap}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h5 style={{ fontSize: 10, fontWeight: 900, color: "#6b7280", letterSpacing: "0.2em", textTransform: "uppercase" as const, marginBottom: 16 }}>Impact Estimation</h5>
                <p style={{ fontSize: 13, fontWeight: 500, color: "#9ca3af", lineHeight: 1.8 }}>
                  {lead.report.whyGapsMatter}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "100px 40px", maxWidth: 1200, margin: "0 auto", textAlign: "center" }}>
        <div style={{ backgroundColor: "#00f5ff", borderRadius: 48, padding: "80px 40px", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "relative", zIndex: 10, maxWidth: 640, margin: "0 auto" }}>
            <h2 style={{ fontSize: 48, fontWeight: 900, color: "#000", letterSpacing: -2, marginBottom: 24, lineHeight: 1.1 }}>
              Stop leaving revenue on the table.
            </h2>
            <p style={{ fontSize: 18, fontWeight: 700, color: "rgba(0,0,0,0.7)", marginBottom: 40, lineHeight: 1.5 }}>
              We've mapped out exactly how to fix these flaws. Ready to scale {lead.businessName}?
            </p>
            <button style={{ padding: "20px 48px", backgroundColor: "#000", color: "#fff", border: "none", borderRadius: 999, fontSize: 14, fontWeight: 900, letterSpacing: "0.1em", textTransform: "uppercase" as const, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 12 }}>
              CLAIM YOUR ROADMAP <ArrowUpRight style={{ width: 18, height: 18 }} />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding: "40px", textAlign: "center", borderTop: "1px solid #1a1b21" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 16 }}>
          <Zap style={{ width: 16, height: 16, color: "#00f5ff" }} />
          <span style={{ fontSize: 12, fontWeight: 900, color: "#fff" }}>STELV INTELLIGENCE</span>
        </div>
        <p style={{ fontSize: 11, fontWeight: 600, color: "#6b7280" }}>
          © 2026 Audit Protocol. Encrypted Report for {lead.businessName}.
        </p>
      </footer>
    </div>
  );
}
