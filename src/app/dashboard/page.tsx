import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Users, Search, Target, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import Link from "next/link";
import prisma from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";

export default async function DashboardPage() {
  const campaigns = await prisma.campaign.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  const totalLeads = await prisma.lead.count();
  const activeSearches = await prisma.campaign.count({ where: { status: "PROCESSING" } });
  const auditsDone = await prisma.lead.count({ where: { status: "DONE" } });
  
  const stats = [
    { name: "Total Leads", value: totalLeads.toString(), icon: Users, color: "text-blue-500" },
    { name: "Active Searches", value: activeSearches.toString(), icon: Search, color: "text-orange-500" },
    { name: "Audits Done", value: auditsDone.toString(), icon: CheckCircle2, color: "text-green-500" },
    { name: "Conversion Rate", value: "12.5%", icon: Target, color: "text-purple-500" },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "COMPLETED": return <Badge className="bg-green-500">Done</Badge>;
      case "PROCESSING": return <Badge className="bg-blue-500 animate-pulse">Running</Badge>;
      case "FAILED": return <Badge variant="destructive">Failed</Badge>;
      default: return <Badge variant="secondary">Pending</Badge>;
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
          <p className="text-muted-foreground">Monitor your lead generation and audit campaigns.</p>
        </div>
        <Button asChild className="shadow-md">
          <Link href="/campaigns/new">
            <Plus className="mr-2 h-4 w-4" /> New Campaign
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.name} className="shadow-sm border-none bg-white/50 dark:bg-slate-900/50 backdrop-blur">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.name}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                Updated just now
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 shadow-sm border-none bg-white dark:bg-slate-900 border border-slate-100">
          <CardHeader>
            <CardTitle>Recent Campaigns</CardTitle>
            <CardDescription>Your latest lead generation efforts.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {campaigns.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
                  <p>No campaigns yet.</p>
                  <Button variant="link" asChild>
                    <Link href="/campaigns/new">Create your first one</Link>
                  </Button>
                </div>
              ) : (
                campaigns.map((campaign) => (
                  <div key={campaign.id} className="flex items-center justify-between p-4 rounded-lg border border-slate-100 bg-slate-50/30 dark:bg-slate-800/20 hover:bg-slate-50 transition-colors">
                    <div className="space-y-1">
                      <p className="font-semibold text-sm">{campaign.niche} in {campaign.location}</p>
                      <p className="text-xs text-muted-foreground">Target: {campaign.count} leads • Created: {new Date(campaign.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      {getStatusBadge(campaign.status)}
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/campaigns/${campaign.id}`}>View Results</Link>
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3 shadow-sm border-none bg-white dark:bg-slate-900 border border-slate-100">
          <CardHeader>
            <CardTitle>High Potential Leads</CardTitle>
            <CardDescription>Leads with significant audit gaps.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center py-8 text-muted-foreground text-sm italic">
                Start a campaign to see top opportunities here.
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
