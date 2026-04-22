import { PrismaClient } from '@prisma/client';
import { crawlWebsite } from './src/lib/services/crawler';
import { calculateAuditScores } from './src/lib/utils/scoring';
import { slugify } from './src/lib/utils';
import crypto from 'crypto';

const prisma = new PrismaClient();

async function run() {
  const lead = await prisma.lead.findUnique({
    where: { slug: 'plumbing-services-services-10-37db1eeb' },
  });

  if (!lead) {
    console.log("Lead not found");
    return;
  }

  console.log("Processing lead:", lead.id);

  try {
    let crawlData = {
      title: "", metaDescription: "", h1Count: 0, h2Count: 0, 
      hasSsl: false, hasContactForm: false, hasCta: false, 
      hasSchema: false, hasSocialLinks: false, hasReviewsSection: false,
      emailAddresses: [] as string[], phoneNumbers: [] as string[], loadTimeMs: 0, isOutdatedUI: false
    };

    if (lead.webUrl) {
      console.log("Crawling URL:", lead.webUrl);
      crawlData = await crawlWebsite(lead.webUrl);
    }

    console.log("Calculated scores...");
    const scores = calculateAuditScores(crawlData as any, lead);

    console.log("Creating website audit...");
    await prisma.websiteAudit.create({
      data: {
        leadId: lead.id,
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
    console.log("Audit created.");
  } catch (err: any) {
    console.error("Worker Error:", err.message);
  }
}

run().catch(console.error).finally(() => prisma.$disconnect());
