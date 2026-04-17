import { CrawlResult } from "./crawler";

export interface AuditScores {
  seoScore: number;
  croScore: number;
  trustScore: number;
  technicalScore: number;
  localSeoScore: number;
  overallScore: number;
}

export function calculateAuditScores(crawlData: CrawlResult, businessData: any): AuditScores {
  let seoScore = 0;
  let croScore = 0;
  let trustScore = 0;
  let technicalScore = 0;
  let localSeoScore = 0;

  // SEO Basics (25 pts)
  if (crawlData.title) seoScore += 10;
  if (crawlData.metaDescription) seoScore += 5;
  if (crawlData.h1Count > 0) seoScore += 5;
  if (crawlData.h2Count > 0) seoScore += 5;

  // Conversion/CRO (20 pts)
  if (crawlData.hasContactForm) croScore += 10;
  if (crawlData.hasCta) croScore += 10;

  // Trust (15 pts)
  if (crawlData.hasReviewsSection) trustScore += 8;
  if (crawlData.hasSocialLinks) trustScore += 7;

  // Local SEO (15 pts)
  if (businessData.mapsLink) localSeoScore += 8;
  if (businessData.address) localSeoScore += 7;

  // Technical (15 pts)
  if (crawlData.hasSsl) technicalScore += 10;
  if (crawlData.hasSchema) technicalScore += 5;

  // UX/Design placeholders (10 pts) - simplified for automated audit
  const designScore = 8; // Default base score for modern sites

  const overallScore = seoScore + croScore + trustScore + technicalScore + localSeoScore + designScore;

  return {
    seoScore,
    croScore,
    trustScore,
    technicalScore,
    localSeoScore,
    overallScore: Math.min(overallScore, 100),
  };
}
