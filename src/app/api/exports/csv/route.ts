import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { stringify } from "csv-stringify/sync";

export async function GET() {
  try {
    const leads = await prisma.lead.findMany({
      include: {
        campaign: true,
        audit: true,
        report: true,
      },
      orderBy: { createdAt: "desc" },
    });

    const records = leads.map((lead) => ({
      "Business Name": lead.businessName,
      "Category": lead.category || "",
      "Website": lead.webUrl || "",
      "Email": lead.email || "",
      "Phone": lead.phone || "",
      "Address": lead.address || "",
      "Maps Link": lead.mapsLink || "",
      "Rating": lead.rating || "",
      "Review Count": lead.reviewCount || "",
      "Source": lead.source || "",
      "Campaign Niche": lead.campaign.niche,
      "Campaign Location": lead.campaign.location,
      "SEO Score": lead.audit?.seoScore ?? "",
      "CRO Score": lead.audit?.croScore ?? "",
      "Trust Score": lead.audit?.trustScore ?? "",
      "Technical Score": lead.audit?.technicalScore ?? "",
      "Local SEO Score": lead.audit?.localSeoScore ?? "",
      "Overall Score": lead.audit?.overallScore ?? "",
      "Has SSL": lead.audit?.hasSsl ?? "",
      "Has Contact Form": lead.audit?.hasContactForm ?? "",
      "Has CTA": lead.audit?.hasCta ?? "",
      "Has Schema": lead.audit?.hasSchema ?? "",
      "Status": lead.status,
    }));

    const csv = stringify(records, { header: true });

    return new NextResponse(csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="leads-export-${new Date().toISOString().split("T")[0]}.csv"`,
      },
    });
  } catch (error) {
    console.error("CSV export error:", error);
    return NextResponse.json({ error: "Export failed" }, { status: 500 });
  }
}
