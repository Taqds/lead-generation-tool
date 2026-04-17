import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createCampaign } from "@/app/actions/campaign";
import { Search, MapPin, Hash, Sparkles } from "lucide-react";

export default function NewCampaignPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Start New Search</h1>
        <p className="text-muted-foreground">Define your target niche and location to discover high-potential leads.</p>
      </div>

      <Card className="shadow-lg border-none">
        <CardHeader className="bg-primary/5 border-b">
          <CardTitle className="text-lg flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Campaign Parameters
          </CardTitle>
          <CardDescription>Our AI will discover and audit businesses based on these inputs.</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <form action={createCampaign} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="niche" className="text-sm font-medium leading-none">Business Niche</label>
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  id="niche" 
                  name="niche" 
                  placeholder="e.g. Plumbing, HVAC, Dental Clinic, Legal Services" 
                  className="pl-10"
                  required
                />
              </div>
              <p className="text-xs text-muted-foreground">The specific industry you want to target.</p>
            </div>

            <div className="space-y-2">
              <label htmlFor="location" className="text-sm font-medium leading-none">Location</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  id="location" 
                  name="location" 
                  placeholder="e.g. Chicago, IL or London, UK" 
                  className="pl-10"
                  required
                />
              </div>
              <p className="text-xs text-muted-foreground">Target city or region for local business discovery.</p>
            </div>

            <div className="space-y-2">
              <label htmlFor="count" className="text-sm font-medium leading-none">Number of Leads</label>
              <div className="relative">
                <Hash className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  id="count" 
                  name="count" 
                  type="number" 
                  defaultValue="10" 
                  min="1" 
                  max="50" 
                  className="pl-10"
                  required
                />
              </div>
              <p className="text-xs text-muted-foreground">Max number of leads to discover and audit (1-50).</p>
            </div>

            <Button type="submit" className="w-full text-md py-6 shadow-md hover:shadow-lg transition-all">
              Launch Discovery Campaign
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
        {[
          { title: "1. Discover", desc: "Find businesses from web listings" },
          { title: "2. Audit", desc: "Technical & SEO gap analysis" },
          { title: "3. Generate", desc: "AI reports & outreach emails" },
        ].map((step, i) => (
          <div key={i} className="p-4 rounded-xl bg-white/50 border border-slate-100 shadow-sm">
            <h3 className="font-semibold text-sm">{step.title}</h3>
            <p className="text-xs text-muted-foreground">{step.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
