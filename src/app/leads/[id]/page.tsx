import prisma from "@/lib/prisma";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  Globe, Mail, Phone, MapPin, Star, ShieldCheck, 
  Search, Target, Rocket, Copy, CheckCircle2, 
  ExternalLink, FileText, Send, Sparkles, AlertCircle,
  Flame, Zap, Thermometer, XCircle, Clock
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function LeadDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const lead = await prisma.lead.findUnique({
    where: { id },
    include: {
      campaign: true,
      audit: true,
      report: true,
    },
  });

  if (!lead) {
    notFound();
  }

  const scores = lead.audit || {
    seoScore: 0,
    croScore: 0,
    trustScore: 0,
    technicalScore: 0,
    localSeoScore: 0,
    overallScore: 0,
    loadTimeMs: 0,
    isOutdatedUI: false
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-500";
    if (score >= 50) return "text-orange-500";
    return "text-red-500";
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "HOT": return <Badge className="bg-red-500 hover:bg-red-600 text-white border-none shadow-lg shadow-red-500/20"><Flame className="mr-1 h-3 w-3" /> HOT LEAD</Badge>;
      case "WARM": return <Badge className="bg-orange-400 hover:bg-orange-500 text-white border-none"><Zap className="mr-1 h-3 w-3" /> WARM</Badge>;
      default: return <Badge variant="secondary"><Thermometer className="mr-1 h-3 w-3" /> COLD</Badge>;
    }
  };

  const service = (lead.report?.serviceOffer as any) || {};

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link href="/dashboard" className="text-muted-foreground hover:text-primary transition-colors text-sm">Dashboard</Link>
            <span className="text-muted-foreground text-sm">/</span>
            <Link href={`/campaigns/${lead.campaignId}`} className="text-muted-foreground hover:text-primary transition-colors text-sm">Campaign</Link>
            <span className="text-muted-foreground text-sm">/</span>
            <span className="text-sm font-medium">Lead Audit</span>
          </div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight">{lead.businessName}</h1>
            {getPriorityBadge(lead.priority)}
          </div>
          <div className="flex flex-wrap items-center gap-4 mt-2">
            <Badge variant="outline" className="bg-white/50">{lead.category}</Badge>
            <div className="flex items-center text-sm text-muted-foreground">
              <MapPin className="h-3.5 w-3.5 mr-1" /> {lead.address || "Local"}
            </div>
            {lead.rating && (
              <div className="flex items-center text-sm text-amber-500 font-medium">
                <Star className="h-3.5 w-3.5 mr-1 fill-current" /> {lead.rating} ({lead.reviewCount} reviews)
              </div>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href={`/report/${lead.slug}`} target="_blank">
              <Rocket className="mr-2 h-4 w-4" /> View Public Report
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <a href={lead.webUrl || "#"} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="mr-2 h-4 w-4" /> Visit Website
            </a>
          </Button>
          <Button>
            <Send className="mr-2 h-4 w-4" /> Start Outreach
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="bg-white/50 border">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="audit">Technical Audit</TabsTrigger>
          <TabsTrigger value="report">AI Strategy</TabsTrigger>
          <TabsTrigger value="outreach">Outreach</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="md:col-span-1 shadow-sm border-none bg-white">
              <CardHeader><CardTitle>Business Info</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <Globe className="h-4 w-4 text-blue-500 mt-1" />
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase">Website</span>
                    <span className="text-sm break-all">{lead.webUrl || "No Website Found"}</span>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail className="h-4 w-4 text-green-500 mt-1" />
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase">Email</span>
                    <span className="text-sm">{lead.email || "N/A"}</span>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="h-4 w-4 text-orange-500 mt-1" />
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase">Phone</span>
                    <span className="text-sm">{lead.phone || "N/A"}</span>
                  </div>
                </div>
                <Separator />
                <div>
                   <span className="text-[10px] font-bold text-muted-foreground uppercase block mb-2">GMB Status</span>
                   <div className="space-y-2">
                     {[
                       { l: "Claimed", v: lead.isClaimed },
                       { l: "Optimized", v: lead.isGmbOptimized },
                       { l: "Photos", v: lead.hasGmbPhotos },
                       { l: "Rating", v: !lead.hasLowRating }
                     ].map(i => (
                       <div key={i.l} className="flex items-center justify-between text-xs">
                         <span>{i.l}</span>
                         {i.v ? <CheckCircle2 className="h-3 w-3 text-green-500" /> : <XCircle className="h-3 w-3 text-red-500" />}
                       </div>
                     ))}
                   </div>
                </div>
              </CardContent>
            </Card>

            <Card className="md:col-span-3 shadow-sm border-none bg-white">
               <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="flex items-center gap-2"><Target className="h-5 w-5 text-primary" /> Priority Logic</CardTitle>
                  <div className="text-right">
                    <span className="text-[10px] font-bold uppercase text-muted-foreground block">Score</span>
                    <span className="text-xl font-bold text-primary">{lead.priorityScore}/100</span>
                  </div>
               </CardHeader>
               <CardContent className="space-y-6">
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 italic text-sm text-slate-600 leading-relaxed">
                    "{lead.priorityReason}"
                  </div>

                  <Separator />

                  <div className="flex flex-col md:flex-row items-center justify-around py-4 gap-8">
                     <div className="relative h-32 w-32 flex items-center justify-center">
                        <svg className="h-full w-full" viewBox="0 0 100 100">
                          <circle className="text-slate-100" strokeWidth="10" stroke="currentColor" fill="transparent" r="40" cx="50" cy="50" />
                          <circle className="text-primary" strokeWidth="10" strokeDasharray={2 * Math.PI * 40} strokeDashoffset={2 * Math.PI * 40 * (1 - scores.overallScore / 100)} strokeLinecap="round" stroke="currentColor" fill="transparent" r="40" cx="50" cy="50" />
                        </svg>
                        <span className="absolute text-3xl font-bold">{scores.overallScore}</span>
                     </div>
                     <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 w-full max-w-2xl">
                        {[
                          { l: "SEO", v: scores.seoScore },
                          { l: "CRO", v: scores.croScore },
                          { l: "Trust", v: scores.trustScore },
                          { l: "Tech", v: scores.technicalScore },
                          { l: "Local", v: scores.localSeoScore }
                        ].map((s) => (
                          <div key={s.l} className="flex flex-col items-center p-3 rounded-xl bg-slate-50/50 border">
                            <span className="text-[10px] font-bold uppercase text-muted-foreground mb-1">{s.l}</span>
                            <span className={`text-lg font-bold ${getScoreColor(s.v)}`}>{s.v}</span>
                          </div>
                        ))}
                     </div>
                  </div>
               </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="audit">
           <Card className="shadow-sm border-none bg-white">
              <CardHeader><CardTitle>Website Audit Snapshot</CardTitle></CardHeader>
              <CardContent className="grid md:grid-cols-2 gap-8">
                 <div className="space-y-4">
                    <div className="p-5 rounded-xl border bg-slate-50/30">
                       <h4 className="text-sm font-bold mb-4 uppercase tracking-widest text-slate-400">Content & Metadata</h4>
                       <div className="space-y-3">
                          <div>
                             <span className="text-[10px] font-bold uppercase text-muted-foreground">Title Tag</span>
                             <p className="text-sm font-medium">{scores.title || "Missing"}</p>
                          </div>
                          <div>
                             <span className="text-[10px] font-bold uppercase text-muted-foreground">Meta Description</span>
                             <p className="text-sm text-slate-600">{scores.metaDescription || "Missing"}</p>
                          </div>
                          <div className="flex gap-4">
                             <div>
                                <span className="text-[10px] font-bold uppercase text-muted-foreground mr-2">H1s:</span>
                                <Badge variant="outline">{scores.h1Count}</Badge>
                             </div>
                             <div>
                                <span className="text-[10px] font-bold uppercase text-muted-foreground mr-2">H2s:</span>
                                <Badge variant="outline">{scores.h2Count}</Badge>
                             </div>
                          </div>
                       </div>
                    </div>
                 </div>
                 <div className="space-y-3">
                    {[
                      { label: "SSL Security", value: scores.hasSsl, icon: ShieldCheck },
                      { label: "Modern & Fast", value: scores.loadTimeMs < 3000 && !scores.isOutdatedUI, icon: Clock, detail: `${(scores.loadTimeMs/1000).toFixed(1)}s load` },
                      { label: "Booking/Form", value: scores.hasContactForm, icon: Mail },
                      { label: "Direct CTA", value: scores.hasCta, icon: Rocket },
                      { label: "Schema Markup", value: scores.hasSchema, icon: FileText },
                      { label: "Social Proof", value: scores.hasReviews, icon: Star }
                    ].map(i => (
                       <div key={i.label} className="flex items-center justify-between p-3 border rounded-xl bg-white shadow-sm">
                          <div className="flex items-center gap-2">
                             <i.icon className="h-4 w-4 text-slate-400" />
                             <div>
                                <span className="text-sm font-medium block">{i.label}</span>
                                {i.detail && <span className="text-[10px] text-muted-foreground">{i.detail}</span>}
                             </div>
                          </div>
                          {i.value ? <Badge className="bg-green-500">YES</Badge> : <Badge variant="destructive">NO</Badge>}
                       </div>
                    ))}
                 </div>
              </CardContent>
           </Card>
        </TabsContent>

        <TabsContent value="report">
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-6">
                 <Card className="shadow-sm border-none bg-white">
                    <CardHeader className="flex flex-row items-center gap-3">
                       <Sparkles className="h-6 w-6 text-primary" />
                       <CardTitle>AI Strategic Insights</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-8">
                       <div className="bg-primary/5 border border-primary/20 p-6 rounded-2xl relative">
                          <h4 className="text-xs font-bold uppercase text-primary mb-2 tracking-widest">Executive Summary</h4>
                          <p className="text-slate-800 leading-relaxed italic">"{lead.report?.summary}"</p>
                       </div>
                       <div className="grid md:grid-cols-2 gap-8">
                          <div>
                             <h5 className="text-sm font-bold mb-4 flex items-center gap-2 text-red-600"><AlertCircle className="h-4 w-4" /> Priority Gaps</h5>
                             <ul className="space-y-2">
                                {(lead.report?.topGaps as string[] || []).map((g, i) => (
                                   <li key={i} className="text-sm flex items-start gap-2">
                                      <span className="text-red-500 font-bold">•</span> {g}
                                   </li>
                                ))}
                             </ul>
                          </div>
                          <div>
                             <h5 className="text-sm font-bold mb-4 flex items-center gap-2 text-blue-600"><Rocket className="h-4 w-4" /> Suggested Fixes</h5>
                             <p className="text-sm text-slate-600 leading-relaxed">{lead.report?.recommendedFixes}</p>
                          </div>
                       </div>
                    </CardContent>
                 </Card>
              </div>

              <div className="md:col-span-1">
                 <Card className="border-2 border-primary/20 shadow-xl shadow-primary/5 bg-white sticky top-24">
                    <CardHeader className="bg-primary/5 border-b pb-4">
                       <Badge className="mb-2 bg-primary hover:bg-primary">Top Opportunity</Badge>
                       <CardTitle className="text-xl font-black italic">{service.type || "Growth Package"}</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-5">
                       <div>
                          <span className="text-[10px] font-black uppercase text-slate-400">The Problem</span>
                          <p className="text-sm text-slate-800 font-medium">{service.problem}</p>
                       </div>
                       <Separator />
                       <div>
                          <span className="text-[10px] font-black uppercase text-slate-400">Our Solution</span>
                          <p className="text-sm text-slate-800 font-medium">{service.solution}</p>
                       </div>
                       <Separator />
                       <div className="bg-green-50 p-3 rounded-xl border border-green-100">
                          <span className="text-[10px] font-black uppercase text-green-600">Projected Impact</span>
                          <p className="text-lg font-bold text-green-700 leading-tight mt-1">{service.impact}</p>
                       </div>
                       <div className="pt-4 flex items-center justify-between">
                          <span className="text-[10px] font-black uppercase text-slate-400">Pricing</span>
                          <span className="text-xl font-black text-primary italic underline">{service.price || "Custom"}</span>
                       </div>
                    </CardContent>
                 </Card>
              </div>
           </div>
        </TabsContent>

        <TabsContent value="outreach">
           <div className="grid grid-cols-1 md:grid-cols-4 gap-6 h-fit">
              <Card className="md:col-span-1 shadow-sm border-none bg-white">
                 <CardHeader><CardTitle>Angle</CardTitle></CardHeader>
                 <CardContent>
                    <p className="text-sm italic text-slate-600 leading-relaxed">"{lead.report?.outreachAngle}"</p>
                 </CardContent>
              </Card>
              <div className="md:col-span-3 space-y-4">
                 {[
                   { t: "Cold Email", v: lead.report?.coldEmail },
                   { t: "Follow Up", v: lead.report?.followUpEmail },
                   { t: "Social DM", v: lead.report?.shortDm }
                 ].map(i => (
                    <Card key={i.t} className="shadow-sm border-none bg-white overflow-hidden">
                       <div className="bg-slate-50 px-4 py-2 border-b flex items-center justify-between text-[10px] font-black uppercase text-slate-400">
                          <span>{i.t}</span>
                          <Button variant="ghost" size="sm" className="h-6 text-[10px] font-black"><Copy className="h-3 w-3 mr-1" /> Copy</Button>
                       </div>
                       <CardContent className="p-4 bg-slate-50/20">
                          <div className="text-sm font-mono whitespace-pre-wrap text-slate-700 leading-relaxed">{i.v}</div>
                       </CardContent>
                    </Card>
                 ))}
              </div>
           </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
