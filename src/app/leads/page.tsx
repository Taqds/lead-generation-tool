import prisma from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ExternalLink, Mail, Phone, MapPin, Star, CheckCircle2, Clock, AlertCircle, Search, Download, Flame, Zap, Thermometer } from "lucide-react";
import Link from "next/link";

export default async function LeadsPage() {
  const leads = await prisma.lead.findMany({
    include: {
      campaign: true,
      audit: true,
    },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "DONE": return <Badge className="bg-green-500/90 text-white"><CheckCircle2 className="mr-1 h-3 w-3" /> Done</Badge>;
      case "AUDITING": return <Badge className="bg-blue-500 animate-pulse text-white"><Clock className="mr-1 h-3 w-3" /> Auditing</Badge>;
      case "REPORTING": return <Badge className="bg-purple-500 animate-pulse text-white"><Clock className="mr-1 h-3 w-3" /> AI Report</Badge>;
      case "FAILED": return <Badge variant="destructive"><AlertCircle className="mr-1 h-3 w-3" /> Failed</Badge>;
      default: return <Badge variant="secondary"><Clock className="mr-1 h-3 w-3" /> Pending</Badge>;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 70) return "text-green-600 bg-green-50 border-green-200";
    if (score >= 40) return "text-amber-600 bg-amber-50 border-amber-200";
    return "text-red-600 bg-red-50 border-red-200";
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "HOT": return <Badge className="bg-red-500 hover:bg-red-600 text-white border-none"><Flame className="mr-1 h-3 w-3" /> HOT</Badge>;
      case "WARM": return <Badge className="bg-orange-400 hover:bg-orange-500 text-white border-none"><Zap className="mr-1 h-3 w-3" /> WARM</Badge>;
      default: return <Badge variant="secondary"><Thermometer className="mr-1 h-3 w-3" /> COLD</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">All Leads</h1>
          <p className="text-muted-foreground">{leads.length} total leads across all campaigns.</p>
        </div>
        <div className="flex gap-2">
          <div className="relative w-64">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search leads..." className="pl-10" />
          </div>
          <Button variant="outline" asChild>
            <Link href="/exports">
              <Download className="mr-2 h-4 w-4" /> Export CSV
            </Link>
          </Button>
        </div>
      </div>

      <Card className="shadow-sm border-none bg-white dark:bg-slate-900">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/50 dark:bg-slate-800/50">
                <TableHead className="w-[180px]">Business</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Campaign</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Audit Score</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leads.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-32 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <Search className="h-8 w-8 text-muted-foreground/50" />
                      <p className="text-muted-foreground">No leads yet. Start a new campaign to discover leads.</p>
                      <Button size="sm" asChild>
                        <Link href="/campaigns/new">Create Campaign</Link>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                leads.map((lead) => (
                  <TableRow key={lead.id} className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                    <TableCell>
                      <div className="flex flex-col gap-0.5">
                        <Link href={`/leads/${lead.id}`} className="font-semibold text-slate-900 dark:text-slate-100 hover:text-primary transition-colors">
                          {lead.businessName}
                        </Link>
                        {lead.webUrl && (
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <ExternalLink className="h-3 w-3" />
                            <span className="truncate max-w-[160px]">{lead.webUrl.replace(/^https?:\/\//, "")}</span>
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {getPriorityBadge(lead.priority)}
                    </TableCell>
                    <TableCell>
                      <span className="text-xs px-2 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                        {lead.campaign.niche}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        {lead.email && (
                          <span className="text-xs flex items-center gap-1 text-slate-600">
                            <Mail className="h-3 w-3 text-slate-400" /> {lead.email}
                          </span>
                        )}
                        {lead.phone && (
                          <span className="text-xs flex items-center gap-1 text-slate-600">
                            <Phone className="h-3 w-3 text-slate-400" /> {lead.phone}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {lead.rating ? (
                        <div className="flex items-center gap-1 text-sm">
                          <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
                          <span className="font-medium">{lead.rating.toFixed(1)}</span>
                          <span className="text-xs text-muted-foreground">({lead.reviewCount})</span>
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {lead.audit ? (
                        <div className={`inline-flex items-center justify-center h-8 w-12 rounded-md border text-sm font-bold ${getScoreColor(lead.audit.overallScore)}`}>
                          {lead.audit.overallScore}
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground italic">—</span>
                      )}
                    </TableCell>
                    <TableCell>{getStatusBadge(lead.status)}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" asChild className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link href={`/leads/${lead.id}`}>View Details →</Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
