import axios from "axios";
import * as cheerio from "cheerio";

export interface CrawlResult {
  title?: string;
  metaDescription?: string;
  h1Count: number;
  h2Count: number;
  hasSsl: boolean;
  hasContactForm: boolean;
  hasCta: boolean;
  hasSchema: boolean;
  hasSocialLinks: boolean;
  hasReviewsSection: boolean;
  emailAddresses: string[];
  phoneNumbers: string[];
  rawHtml?: string;
  loadTimeMs: number;
  isOutdatedUI?: boolean; // Can be manually flagged or AI inferred later
}

export async function crawlWebsite(url: string): Promise<CrawlResult> {
  const startTime = Date.now();
  try {
    const { data: html } = await axios.get(url, {
      timeout: 10000,
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      },
    });
    const loadTimeMs = Date.now() - startTime;

    const $ = cheerio.load(html);
    
    // ... same as before
    // Extract Metadata
    const title = $("title").text();
    const metaDescription = $('meta[name="description"]').attr("content");
    
    // Headings
    const h1Count = $("h1").length;
    const h2Count = $("h2").length;
    
    // SSL check (from URL)
    const hasSsl = url.startsWith("https");
    
    // Features
    const hasContactForm = $("form").length > 0;
    const hasCta = $("button, .button, a[href*='contact'], a[href*='get-started']").length > 0;
    const hasSchema = $("script[type='application/ld+json']").length > 0;
    
    const socialPatterns = ["facebook.com", "instagram.com", "linkedin.com", "twitter.com", "x.com"];
    const hasSocialLinks = $("a[href]").toArray().some(el => {
      const href = $(el).attr("href") || "";
      return socialPatterns.some(pattern => href.includes(pattern));
    });

    const reviewsPatterns = ["reviews", "testimonials", "what-clients-say"];
    const hasReviewsSection = $("section, div").toArray().some(el => {
      const text = $(el).text().toLowerCase();
      const id = $(el).attr("id") || "";
      const className = $(el).attr("class") || "";
      return reviewsPatterns.some(p => text.includes(p) || id.includes(p) || className.includes(p));
    });

    // Contact Extraction (Basic Regex)
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
    const phoneRegex = /(\+?\d{1,2}\s?)?(\(?\d{3}\)?[\s.-]?)?\d{3}[\s.-]?\d{4}/g;
    
    const pageText = $("body").text();
    const emailAddresses = Array.from(new Set(pageText.match(emailRegex) || []));
    const phoneNumbers = Array.from(new Set(pageText.match(phoneRegex) || []));

    return {
      title,
      metaDescription,
      h1Count,
      h2Count,
      hasSsl,
      hasContactForm,
      hasCta,
      hasSchema,
      hasSocialLinks,
      hasReviewsSection,
      emailAddresses,
      phoneNumbers,
      rawHtml: html.substring(0, 5000), 
      loadTimeMs,
      isOutdatedUI: html.includes("frameset") || html.includes("table border") || html.includes("<font") // Rough heuristic for legacy code
    };
  } catch (error) {
    console.error(`Error crawling ${url}:`, error);
    // Return empty results instead of throwing to keep the worker running
    return {
      title: "Unable to reach website",
      h1Count: 0,
      h2Count: 0,
      hasSsl: false,
      hasContactForm: false,
      hasCta: false,
      hasSchema: false,
      hasSocialLinks: false,
      hasReviewsSection: false,
      emailAddresses: [],
      phoneNumbers: [],
      loadTimeMs: 0,
      isOutdatedUI: false
    };
  }
}
