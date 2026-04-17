import { Worker, Job } from "bullmq";
import { connection } from "../redis";
import prisma from "../prisma";
import { discoverLeads } from "../services/discovery";
import { crawlWebsite } from "../services/crawler";
import { calculateAuditScores } from "../utils/scoring";
import { generateLeadReport } from "../services/openai";
import { QUEUE_NAMES, leadAuditQueue, aiReportQueue } from "./queues";

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
        const lead = await prisma.lead.create({
          data: {
            ...leadData,
            campaignId,
            status: "PENDING",
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
      if (!webUrl) throw new Error("No website URL provided");
      
      const crawlData = await crawlWebsite(webUrl);
      const lead = await prisma.lead.findUnique({ where: { id: leadId } });
      const scores = calculateAuditScores(crawlData, lead);

      await prisma.websiteAudit.create({
        data: {
          leadId,
          ...crawlData,
          ...scores,
          rawDataJson: crawlData as any,
          emailAddresses: undefined, // Separated logic
          phoneNumbers: undefined,
        } as any,
      });

      // Update lead with any found emails/phones if they were missing
      await prisma.lead.update({
        where: { id: leadId },
        data: {
          email: lead?.email || crawlData.emailAddresses[0],
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
