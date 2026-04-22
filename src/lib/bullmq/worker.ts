import { Worker, Job } from "bullmq";
import { connection } from "@/lib/redis";
import prisma from "@/lib/prisma";
import { discoverLeads } from "@/lib/services/discovery";
import { crawlWebsite, CrawlResult } from "@/lib/services/crawler";
import { calculateAuditScores } from "@/lib/utils/scoring";
import { generateLeadReport } from "@/lib/services/openai";
import { QUEUE_NAMES, leadAuditQueue, aiReportQueue } from "./queues";
import { slugify } from "@/lib/utils";
import crypto from "crypto";

// 1. Discovery Worker
const discoveryWorker = new Worker(
  QUEUE_NAMES.LEAD_DISCOVERY,
  async (job: Job) => {
    const { campaignId, niche, location, count } = job.data;
    
    await prisma.campaign.update({
      where: { id: campaignId },
      data: { status: "PROCESSING" },
    });

    try {
      const discoveredLeads = await discoverLeads(niche, location, count);
      
      for (const leadData of discoveredLeads) {
        const leadSlug = `${slugify(leadData.businessName)}-${crypto.randomBytes(4).toString("hex")}`;
        
        const lead = await prisma.lead.create({
          data: {
            ...leadData,
            campaignId,
            slug: leadSlug,
            status: "PENDING",
            isClaimed: leadData.isClaimed ?? true,
            hasGmbPhotos: leadData.hasGmbPhotos ?? true,
            isGmbOptimized: leadData.isGmbOptimized ?? true,
            hasLowRating: leadData.hasLowRating ?? false,
          },
        });

        // Trigger Audit for each lead
        await leadAuditQueue.add(`audit-${lead.id}`, { leadId: lead.id, webUrl: lead.webUrl });
      }

      await prisma.campaign.update({
        where: { id: campaignId },
        data: { status: "COMPLETED" },
      });
    } catch (error) {
      console.error("Discovery Worker Error:", error);
      await prisma.campaign.update({
        where: { id: campaignId },
        data: { status: "FAILED" },
      });
    }
  },
  { connection }
);

// 2. Audit Worker
const auditWorker = new Worker(
  QUEUE_NAMES.LEAD_AUDIT,
  async (job: Job) => {
    const { leadId, webUrl } = job.data;
    
    await prisma.lead.update({
      where: { id: leadId },
      data: { status: "AUDITING" },
    });

    try {
      let crawlData: CrawlResult = {
        title: "", metaDescription: "", h1Count: 0, h2Count: 0, 
        hasSsl: false, hasContactForm: false, hasCta: false, 
        hasSchema: false, hasSocialLinks: false, hasReviewsSection: false,
        emailAddresses: [], phoneNumbers: [], loadTimeMs: 0, isOutdatedUI: false
      };

      if (webUrl) {
        crawlData = await crawlWebsite(webUrl);
      }
      
      const lead = await prisma.lead.findUnique({ where: { id: leadId } });
      const scores = calculateAuditScores(crawlData as any, lead);

      await prisma.websiteAudit.create({
        data: {
          leadId,
          title: crawlData.title,
          metaDescription: crawlData.metaDescription,
          h1Count: crawlData.h1Count,
          h2Count: crawlData.h2Count,
          hasSsl: crawlData.hasSsl,
          hasContactForm: crawlData.hasContactForm,
          hasCta: crawlData.hasCta,
          hasSchema: crawlData.hasSchema,
          hasSocialLinks: crawlData.hasSocialLinks,
          hasReviews: crawlData.hasReviewsSection,
          loadTimeMs: crawlData.loadTimeMs,
          isOutdatedUI: crawlData.isOutdatedUI || false,
          seoScore: scores.seoScore,
          croScore: scores.croScore,
          trustScore: scores.trustScore,
          technicalScore: scores.technicalScore,
          localSeoScore: scores.localSeoScore,
          overallScore: scores.overallScore,
          rawDataJson: crawlData as any,
        },
      });

      // Update lead with any found emails/phones if they were missing, plus priority and slug
      const randomId = crypto.randomBytes(3).toString("hex");
      const generatedSlug = `${slugify(lead?.businessName || "business")}-${randomId}`;

      await prisma.lead.update({
        where: { id: leadId },
        data: {
          email: lead?.email || crawlData.emailAddresses[0],
          phone: lead?.phone || crawlData.phoneNumbers[0],
          priority: scores.priority,
          priorityScore: scores.priorityScore,
          priorityReason: scores.priorityReason,
          slug: lead?.slug || generatedSlug,
          status: "REPORTING",
        },
      });

      // Trigger AI Report
      await aiReportQueue.add(`report-${leadId}`, { leadId });
    } catch (error) {
      console.error(`Audit Worker Error for ${leadId}:`, error);
      await prisma.lead.update({
        where: { id: leadId },
        data: { status: "FAILED" },
      });
    }
  },
  { connection }
);

// 3. AI Report Worker
const aiReportWorker = new Worker(
  QUEUE_NAMES.AI_REPORT,
  async (job: Job) => {
    const { leadId } = job.data;

    try {
      const lead = await prisma.lead.findUnique({
        where: { id: leadId },
        include: { audit: true, campaign: true },
      });

      if (!lead || !lead.audit) throw new Error("Lead or Audit not found");

      const reportData = await generateLeadReport(lead.audit, {
        businessName: lead.businessName,
        category: lead.category,
      });

      await prisma.leadReport.create({
        data: {
          leadId,
          ...reportData,
        },
      });

      await prisma.lead.update({
        where: { id: leadId },
        data: { status: "DONE" },
      });
    } catch (error) {
      console.error(`AI Report Worker Error for ${leadId}:`, error);
      await prisma.lead.update({
        where: { id: leadId },
        data: { status: "FAILED" },
      });
    }
  },
  { connection }
);

console.log("BullMQ Workers Started Successfully");

export { discoveryWorker, auditWorker, aiReportWorker };
