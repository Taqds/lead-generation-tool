"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
      a.download = `leads-export-${new Date().toISOString().split("T")[0]}.csv`;
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
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Data Exports</h1>
        <p className="text-muted-foreground">Download your lead and audit data as CSV files.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* All Leads Export */}
        <Card className="shadow-sm border-none bg-white dark:bg-slate-900 hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="h-10 w-10 rounded-lg bg-blue-50 dark:bg-blue-950 flex items-center justify-center">
                <FileText className="h-5 w-5 text-blue-500" />
              </div>
              <Badge variant="secondary">CSV</Badge>
            </div>
            <CardTitle className="mt-3">All Leads</CardTitle>
            <CardDescription>Export all leads with business details, contact info, and audit scores.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Includes:</span>
                <span className="font-medium">Name, Email, Phone, Score, Status</span>
              </div>
              <Button className="w-full" onClick={handleExport} disabled={isExporting}>
                {isExporting ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating...</>
                ) : exportDone ? (
                  <><CheckCircle2 className="mr-2 h-4 w-4" /> Downloaded!</>
                ) : (
                  <><Download className="mr-2 h-4 w-4" /> Export All Leads</>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Audit Reports Export */}
        <Card className="shadow-sm border-none bg-white dark:bg-slate-900 hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="h-10 w-10 rounded-lg bg-purple-50 dark:bg-purple-950 flex items-center justify-center">
                <FileText className="h-5 w-5 text-purple-500" />
              </div>
              <Badge variant="secondary">CSV</Badge>
            </div>
            <CardTitle className="mt-3">Audit Reports</CardTitle>
            <CardDescription>Export audit results with individual category scores and findings.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Includes:</span>
                <span className="font-medium">SEO, CRO, Trust, Tech Scores</span>
              </div>
              <Button className="w-full" variant="outline" disabled>
                <Download className="mr-2 h-4 w-4" /> Coming Soon
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Outreach Templates Export */}
        <Card className="shadow-sm border-none bg-white dark:bg-slate-900 hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="h-10 w-10 rounded-lg bg-green-50 dark:bg-green-950 flex items-center justify-center">
                <FileText className="h-5 w-5 text-green-500" />
              </div>
              <Badge variant="secondary">CSV</Badge>
            </div>
            <CardTitle className="mt-3">Outreach Templates</CardTitle>
            <CardDescription>Export cold emails and DMs for all processed leads.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Includes:</span>
                <span className="font-medium">Cold Email, Follow-up, Short DM</span>
              </div>
              <Button className="w-full" variant="outline" disabled>
                <Download className="mr-2 h-4 w-4" /> Coming Soon
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Export History */}
      <Card className="shadow-sm border-none bg-white dark:bg-slate-900">
        <CardHeader>
          <CardTitle>Export History</CardTitle>
          <CardDescription>Your recent file downloads.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Calendar className="h-8 w-8 mx-auto mb-2 opacity-40" />
            <p className="text-sm">Export history will appear here after your first download.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
