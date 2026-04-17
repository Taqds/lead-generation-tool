import { CrawlResult } from "./crawler";

export interface AuditScores {
  seoScore: number;
  croScore: number;
  trustScore: number;
  technicalScore: number;
  localSeoScore: number;
  overallScore: number;
  priority: "HOT" | "WARM" | "COLD";
  priorityScore: number;
  priorityReason: string;
}

export function calculateAuditScores(crawlData: CrawlResult, businessData: any): AuditScores {
  let seoScore = 0;
  let croScore = 0;
  let trustScore = 0;
  let technicalScore = 0;
  let localSeoScore = 0;

  // Priority logic
  let priorityScore = 0;
  const reasons: string[] = [];

  // 1. SSL Check
  if (!crawlData.hasSsl) {
    priorityScore += 20;
    reasons.push("No SSL security (major trust gap)");
  } else {
    technicalScore += 10;
  }

  // 2. CTA/CRO Check
  if (!crawlData.hasCta) {
    priorityScore += 20;
    reasons.push("Missing Call-to-Action (lost conversions)");
  } else {
    croScore += 10;
  }

  // 3. Forms Check
  if (!crawlData.hasContactForm) {
    priorityScore += 15;
    reasons.push("No contact form discovered");
  } else {
    croScore += 10;
  }

  // 4. SEO Structure
  if (!crawlData.title || !crawlData.metaDescription) {
    priorityScore += 15;
    reasons.push("Poor SEO structure (missing tags)");
  }
  if (crawlData.title) seoScore += 10;
  if (crawlData.metaDescription) seoScore += 5;
  if (crawlData.h1Count > 0) seoScore += 5;
  if (crawlData.h2Count > 0) seoScore += 5;

  // 5. Performance
  if (crawlData.loadTimeMs > 3000) {
    priorityScore += 15;
    reasons.push("Slow website performance (>3s)");
  }

  // 6. UI Outdated
  if (crawlData.isOutdatedUI) {
    priorityScore += 15;
    reasons.push("Outdated website design/UI");
  }

  // 7. GMB & Website presence
  if (!businessData.webUrl) {
    priorityScore += 40; // High Value: Needs a website!
    reasons.push("No website discovered (High urgency for web design)");
  }
  if (!businessData.isClaimed) {
    priorityScore += 15;
    reasons.push("GMB listing is unclaimed");
  }
  if (businessData.hasLowRating) {
    priorityScore += 15;
    reasons.push("Low GMB rating (Requires reputation management)");
  }

  // Standard scoring继续
  if (crawlData.hasReviewsSection) trustScore += 8;
  if (crawlData.hasSocialLinks) trustScore += 7;
  if (businessData.mapsLink) localSeoScore += 8;
  if (businessData.address) localSeoScore += 7;
  if (crawlData.hasSchema) technicalScore += 5;

  const designScore = crawlData.isOutdatedUI ? 2 : (businessData.webUrl ? 10 : 0);
  const overallScore = seoScore + croScore + trustScore + technicalScore + localSeoScore + designScore;

  // Classification
  let priority: "HOT" | "WARM" | "COLD" = "COLD";
  if (priorityScore >= 60 || !businessData.webUrl) priority = "HOT";
  else if (priorityScore >= 30) priority = "WARM";

  return {
    seoScore,
    croScore,
    trustScore,
    technicalScore,
    localSeoScore,
    overallScore: Math.min(overallScore, 100),
    priority,
    priorityScore,
    priorityReason: reasons.join(". ") + ".",
  };
}
