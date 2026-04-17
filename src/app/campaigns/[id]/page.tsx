import prisma from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, MapPin, ExternalLink, Mail, Phone, Clock, CheckCircle2, AlertCircle, Flame, Zap, Thermometer } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function CampaignResultsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const campaign = await prisma.campaign.findUnique({
    where: { id },
    include: {
      leads: {
        include: {
          audit: true,
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!campaign) {
    notFound();
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "HOT": return <Badge className="bg-red-500 hover:bg-red-600 text-white border-none shadow-md shadow-red-500/20"><Flame className="mr-1 h-3 w-3" /> HOT</Badge>;
      case "WARM": return <Badge className="bg-orange-400 hover:bg-orange-500 text-white border-none"><Zap className="mr-1 h-3 w-3" /> WARM</Badge>;
      default: return <Badge variant="secondary"><Thermometer className="mr-1 h-3 w-3" /> COLD</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "DONE": return <Badge className="bg-green-500"><CheckCircle2 className="mr-1 h-3 w-3" /> Ready</Badge>;
      case "AUDITING": return <Badge className="bg-blue-500 animate-pulse"><Clock className="mr-1 h-3 w-3" /> Auditing</Badge>;
      case "REPORTING": return <Badge className="bg-purple-500 animate-pulse"><Clock className="mr-1 h-3 w-3" /> AI Report</Badge>;
      case "FAILED": return <Badge variant="destructive"><AlertCircle className="mr-1 h-3 w-3" /> Failed</Badge>;
      default: return <Badge variant="secondary"><Clock className="mr-1 h-3 w-3" /> Pending</Badge>;
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link href="/dashboard" className="text-muted-foreground hover:text-primary transition-colors text-sm">Dashboard</Link>
            <span className="text-muted-foreground text-sm">/</span>
            <span className="text-sm font-medium">Campaign Results</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            {campaign.niche} in {campaign.location}
          </h1>
          <p className="text-muted-foreground">Found {campaign.leads.length} relevant businesses.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Search className="mr-2 h-4 w-4" /> Refresh Status
          </Button>
          <Button>
            <Mail className="mr-2 h-4 w-4" /> Bulk Outreach
          </Button>
        </div>
      </div>

      <Card className="shadow-sm border-none bg-white">
        <CardHeader>
          <CardTitle>Discovered Leads</CardTitle>
          <CardDescription>Click on a lead to view the full audit and AI-generated report.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">Business Name</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Location/Address</TableHead>
                <TableHead>Contact Info</TableHead>
                <TableHead>Audit Score</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {campaign.leads.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    No leads discovered yet. The system might still be processing.
                  </TableCell>
                </TableRow>
              ) : (
                campaign.leads.map((lead) => (
                  <TableRow key={lead.id} className="group cursor-pointer hover:bg-slate-50 transition-colors">
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-semibold text-slate-900">{lead.businessName}</span>
                        <div className="flex items-center text-xs text-muted-foreground mt-1">
                          <ExternalLink className="h-3 w-3 mr-1" />
                          <span className="truncate max-w-[150px]">{lead.webUrl || "No website"}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getPriorityBadge(lead.priority)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center text-sm text-slate-600">
                        <MapPin className="h-3 w-3 mr-1 text-slate-400" />
                        <span className="truncate max-w-[200px]">{lead.address || campaign.location}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        {lead.email ? (
                          <div className="flex items-center text-xs text-slate-600">
                            <Mail className="h-3 w-3 mr-1 text-slate-400" />
                            <span>{lead.email}</span>
                          </div>
                        ) : null}
                        {lead.phone ? (
                          <div className="flex items-center text-xs text-slate-600">
                            <Phone className="h-3 w-3 mr-1 text-slate-400" />
                            <span>{lead.phone}</span>
                          </div>
                        ) : null}
                      </div>
                    </TableCell>
                    <TableCell>
                      {lead.audit ? (
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-full border-2 border-primary/20 flex items-center justify-center font-bold text-xs text-primary">
                            {lead.audit.overallScore}
                          </div>
                          <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden hidden md:block">
                            <div className="bg-primary h-full" style={{ width: `${lead.audit.overallScore}%` }}></div>
                          </div>
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-xs italic">Calculating...</span>
                      )}
                    </TableCell>
                    <TableCell>{getStatusBadge(lead.status)}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/leads/${lead.id}`}>View Audit</Link>
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
