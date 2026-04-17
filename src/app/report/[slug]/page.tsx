import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { 
  ShieldCheck, AlertTriangle, Zap, ArrowRight, 
  CheckCircle2, XCircle, Clock, Smartphone,
  BarChart, Target, Calendar, MessageSquare
} from "lucide-react";

export default async function PublicReportPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  const lead = await prisma.lead.findUnique({
    where: { slug },
    include: {
      audit: true,
      report: true,
    },
  });

  if (!lead || !lead.audit || !lead.report) {
    notFound();
  }

  const scores = lead.audit;
  
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-500";
    if (score >= 50) return "text-orange-500";
    return "text-red-500";
  };

  const criticalIssues = [
    { label: "SSL Security", value: scores.hasSsl, desc: "Essential for data protection and Google rankings." },
    { label: "Conversion Forms", value: scores.hasContactForm, desc: "Captures potential customers automatically." },
    { label: "Call to Action", value: scores.hasCta, desc: "Tells visitors exactly what to do next." },
    { label: "Page Load Speed", value: scores.loadTimeMs < 3000, desc: "Visitors leave if pages take >3s to load." },
    { label: "Modern Layout", value: !scores.isOutdatedUI, desc: "Outdated designs often drive customers away." }
  ];

  return (
    <div className="min-h-screen bg-[#030712] text-white selection:bg-primary/30">
      {/* Hero / Header */}
      <header className="px-6 py-12 md:py-20 max-w-7xl mx-auto relative overflow-hidden">
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[500px] h-[500px] bg-primary/20 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-12">
          <div className="max-w-2xl">
            <Badge variant="outline" className="text-primary border-primary bg-primary/5 px-3 py-1 mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
              Exclusive Growth Audit for {lead.businessName}
            </Badge>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 leading-tight">
              We found <span className="text-primary">{(lead.report.topGaps as string[]).length} critical gaps</span> in your online presence.
            </h1>
            <p className="text-xl text-slate-400 mb-8 leading-relaxed">
              Your overall digital health score is <span className="text-white font-bold">{scores.overallScore}/100</span>. We've identified exactly what's holding you back from more customers.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button size="lg" className="rounded-full shadow-lg shadow-primary/25 px-8">
                <Calendar className="mr-2 h-4 w-4" /> Book Free Consultation
              </Button>
              <Button size="lg" variant="outline" className="rounded-full border-white/10 hover:bg-white/5">
                <BarChart className="mr-2 h-4 w-4" /> Full Audit Report
              </Button>
            </div>
          </div>

          <div className="relative flex-shrink-0">
            <div className="relative h-64 w-64 md:h-80 md:w-80 flex items-center justify-center p-8 bg-white/5 rounded-full border border-white/10 backdrop-blur-xl">
              <svg className="h-full w-full transform -rotate-90" viewBox="0 0 100 100">
                <circle className="text-white/5" strokeWidth="8" stroke="currentColor" fill="transparent" r="42" cx="50" cy="50" />
                <circle className="text-primary" strokeWidth="8" strokeDasharray={2 * Math.PI * 42} strokeDashoffset={2 * Math.PI * 42 * (1 - scores.overallScore / 100)} strokeLinecap="round" stroke="currentColor" fill="transparent" r="42" cx="50" cy="50" />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-6xl md:text-7xl font-black tracking-tighter">{scores.overallScore}</span>
                <span className="text-sm font-bold uppercase tracking-widest text-slate-400">Total Score</span>
              </div>
            </div>
            {/* Decorative orbit dots */}
            <div className="absolute top-0 right-0 h-4 w-4 bg-primary rounded-full animate-pulse shadow-[0_0_15px_rgba(var(--primary),0.5)]" />
            <div className="absolute bottom-10 left-0 h-3 w-3 bg-red-500 rounded-full animate-pulse opacity-50" />
          </div>
        </div>
      </header>

      {/* Issues Grid */}
      <section className="px-6 py-20 max-w-7xl mx-auto border-t border-white/5">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Critical Technical Summary</h2>
          <p className="text-slate-400">Our automated system audited your site based on conversion best-practices.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {criticalIssues.map((issue, idx) => (
            <Card key={idx} className="bg-white/5 border-white/10 text-white overflow-hidden group hover:bg-white/10 transition-all">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  {issue.value ? (
                    <div className="bg-green-500/20 p-2 rounded-lg"><CheckCircle2 className="text-green-500 h-6 w-6" /></div>
                  ) : (
                    <div className="bg-red-500/20 p-2 rounded-lg animate-pulse"><XCircle className="text-red-500 h-6 w-6" /></div>
                  )}
                  {issue.value ? (
                      <Badge className="bg-green-500/10 text-green-500 border-green-500/20">Optimized</Badge>
                  ) : (
                      <Badge variant="destructive" className="animate-bounce">Requires Action</Badge>
                  )}
                </div>
                <h3 className="text-lg font-bold mb-2">{issue.label}</h3>
                <p className="text-sm text-slate-400 mb-4">{issue.desc}</p>
                <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between">
                   <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Status</span>
                   <span className={issue.value ? "text-green-500 text-xs font-bold" : "text-red-500 text-xs font-bold"}>
                     {issue.value ? "Passed" : "Action Required"}
                   </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Before/After Visualization */}
      <section className="px-6 py-24 max-w-7xl mx-auto border-t border-white/5">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <div className="flex-1">
            <h2 className="text-4xl font-bold mb-6">The Competitive Impact</h2>
            <p className="text-xl text-slate-400 leading-relaxed mb-8">
              Based on your audit, your website is likely leaking revenue to competitors with more optimized digital funnels. Here is a visualization of the improvements we recommend.
            </p>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="bg-primary/20 p-2 rounded-full mt-1.5"><ShieldCheck className="h-4 w-4 text-primary" /></div>
                <div>
                  <h4 className="font-bold text-lg">Fix Security Gaps</h4>
                  <p className="text-slate-400 text-sm">Update SSL certificates and patch vulnerabilities to protect customers.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-primary/20 p-2 rounded-full mt-1.5"><Zap className="h-4 w-4 text-primary" /></div>
                <div>
                  <h4 className="font-bold text-lg">Modernize Experience</h4>
                  <p className="text-slate-400 text-sm">A refreshed, mobile-responsive layout increases trust by up to 75%.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-primary/20 p-2 rounded-full mt-1.5"><Target className="h-4 w-4 text-primary" /></div>
                <div>
                  <h4 className="font-bold text-lg">Conversion Optimization</h4>
                  <p className="text-slate-400 text-sm">Strategic CTAs turn browsers into booked calls and customers.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1 w-full relative">
            <div className="grid grid-cols-2 gap-4">
              {/* CURRENT */}
              <div className="space-y-4">
                <div className="text-center font-bold text-slate-500 uppercase tracking-widest text-xs">Current Presence</div>
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 h-[400px] overflow-hidden opacity-50 grayscale flex flex-col gap-4">
                  <div className="w-2/3 h-4 bg-slate-700/50 rounded" />
                  <div className="w-full h-32 bg-slate-700/30 rounded" />
                  <div className="space-y-2">
                    <div className="w-full h-3 bg-slate-800 rounded" />
                    <div className="w-full h-3 bg-slate-800 rounded" />
                    <div className="w-4/5 h-3 bg-slate-800 rounded" />
                  </div>
                  <div className="mt-4 w-1/3 h-8 bg-slate-700/50 rounded" />
                  <div className="mt-auto border-t border-white/10 pt-4">
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 text-red-500"><AlertTriangle className="h-full w-full" /></div>
                      <span className="text-[10px] text-red-500 font-bold uppercase">Missing Security</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* OPTIMIZED */}
              <div className="space-y-4 relative">
                <div className="text-center font-bold text-primary uppercase tracking-widest text-xs">Optimized presence</div>
                <div className="bg-white/10 border-2 border-primary/40 rounded-2xl p-6 h-[400px] overflow-hidden flex flex-col gap-4 relative shadow-[0_0_50px_rgba(var(--primary),0.1)]">
                   <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
                  <div className="w-1/2 h-5 bg-primary/20 rounded shadow-inner" />
                  <div className="w-full h-32 bg-primary/10 rounded overflow-hidden relative">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Zap className="text-primary/50 h-12 w-12" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="w-full h-3 bg-primary/10 rounded" />
                    <div className="w-full h-3 bg-primary/10 rounded" />
                    <div className="w-2/3 h-3 bg-primary/10 rounded" />
                  </div>
                  <div className="mt-4 w-full h-10 bg-primary rounded-lg flex items-center justify-center text-[10px] font-black uppercase tracking-tighter">
                    Book Your Quote Now
                  </div>
                  <div className="mt-auto border-t border-white/10 pt-4 flex items-center justify-between uppercase tracking-widest text-[8px] font-bold">
                    <div className="flex items-center gap-1 text-green-500">
                      <CheckCircle2 className="h-2 w-2" /> Fully Optimized
                    </div>
                    <div className="text-primary font-black">+250% ROI Possible</div>
                  </div>
                </div>
                <div className="absolute -top-4 -right-4 bg-primary text-black px-3 py-1 rounded-full text-xs font-black rotate-12 shadow-lg">WINNING</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AI Analysis Detail */}
      <section className="px-6 py-24 bg-white/5 border-t border-b border-white/10">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-12">
            <div className="bg-primary/20 p-4 rounded-2xl">
              <MessageSquare className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h2 className="text-3xl font-bold">Deep Strategy Analysis</h2>
              <p className="text-slate-400">Our AI analyzed your unique business context.</p>
            </div>
          </div>

          <div className="space-y-12">
            <div className="p-8 bg-[#030712] rounded-3xl border border-white/5 relative group overflow-hidden">
               <div className="absolute top-0 right-0 p-4 text-[60px] font-black text-white/5 pointer-events-none">01</div>
              <h4 className="text-xl font-bold text-primary mb-4 flex items-center gap-2 uppercase tracking-widest text-xs">Analysis Summary</h4>
              <p className="text-lg text-slate-300 leading-relaxed italic border-l-2 border-primary/40 pl-6 mb-8">
                "{lead.report.summary}"
              </p>
              
              <div className="grid md:grid-cols-2 gap-8 mt-12">
                <div>
                  <h5 className="font-bold text-sm text-slate-500 uppercase tracking-widest mb-4">Urgent Fixes Required</h5>
                  <ul className="space-y-3">
                    {(lead.report.topGaps as string[]).map((gap, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm">
                        <ArrowRight className="h-4 w-4 text-red-500 mt-0.5" />
                        <span>{gap}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                   <h5 className="font-bold text-sm text-slate-500 uppercase tracking-widest mb-4">Impact Estimation</h5>
                   <p className="text-sm leading-relaxed text-slate-400">
                     {lead.report.whyGapsMatter}
                   </p>
                </div>
              </div>
            </div>

            {/* Recommended Service Package */}
            <div className="mt-16 p-8 bg-white/5 border border-white/10 rounded-[2rem] overflow-hidden relative group transition-all hover:bg-white/[0.07]">
               <div className="absolute top-0 right-0 p-6">
                 <Badge className="bg-primary/20 text-primary border-primary/20">Tailored Fix</Badge>
               </div>
               <div className="flex flex-col md:flex-row gap-8 items-center">
                  <div className="flex-1">
                     <span className="text-[10px] font-black uppercase text-primary tracking-[0.2em] mb-4 block">Recommended Solution</span>
                     <h3 className="text-3xl font-black mb-4">{(lead.report.serviceOffer as any)?.type || "Full Recovery Package"}</h3>
                     <div className="space-y-4">
                        <p className="text-sm text-slate-400">
                          <span className="text-white font-bold block mb-1">Identified Problem:</span>
                          {(lead.report.serviceOffer as any)?.problem}
                        </p>
                        <p className="text-sm text-slate-400">
                           <span className="text-white font-bold block mb-1">Proposed Intervention:</span>
                           {(lead.report.serviceOffer as any)?.solution}
                        </p>
                     </div>
                  </div>
                  <div className="w-full md:w-72 p-6 bg-primary rounded-2xl text-black flex flex-col items-center justify-center text-center shadow-xl shadow-primary/20">
                     <span className="text-[10px] font-bold uppercase opacity-60 mb-2 whitespace-nowrap">Projected Business Impact</span>
                     <span className="text-3xl font-black mb-4 leading-none">{(lead.report.serviceOffer as any)?.impact}</span>
                     <Separator className="bg-black/10 mb-4" />
                     <div className="flex flex-col items-center">
                        <span className="text-[10px] font-bold uppercase opacity-60">Investment</span>
                        <span className="text-2xl font-black italic">{(lead.report.serviceOffer as any)?.price || "N/A"}</span>
                     </div>
                  </div>
               </div>
            </div>

            {/* Strategic Call to Action Section */}
            <div className="relative p-12 bg-primary rounded-[3rem] text-black overflow-hidden shadow-2xl shadow-primary/40">
              <div className="absolute top-0 right-0 p-8">
                <BarChart className="h-32 w-32 opacity-10 -rotate-12 translate-x-12 translate-y-12" />
              </div>
              <div className="relative z-10 max-w-xl">
                 <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-6">Stop leaving revenue on the table.</h2>
                 <p className="text-lg font-medium mb-8 opacity-80 leading-relaxed">
                   We've prepared a full roadmap to fix these { (lead.report.topGaps as string[]).length } issues and increase your leads by {(scores.overallScore < 50) ? "3-5x" : "2x"} this quarter.
                 </p>
                 <Button size="lg" variant="default" className="bg-black text-white hover:bg-black/90 rounded-full px-12 py-6 text-lg font-bold shadow-2xl">
                    Claim Your Roadmap & Fixing Plan
                 </Button>
                 <p className="mt-6 text-xs font-bold opacity-60 uppercase tracking-widest flex items-center gap-2">
                    <Clock className="h-3 w-3" /> Offer expires in 48 hours for {lead.businessName}
                 </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-12 text-center text-slate-500 text-sm">
        <div className="mb-6 flex items-center justify-center gap-2">
           <Zap className="h-4 w-4 text-primary" />
           <span className="font-bold text-white">LeadAudit PRO</span>
        </div>
        <p>© 2026 Audit Automation Engine. Confidential Report for {lead.businessName}.</p>
      </footer>
    </div>
  );
}
