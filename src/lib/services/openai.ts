import OpenAI from "openai";
import { AUDIT_REPORT_PROMPT } from "../utils/prompts";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateLeadReport(auditData: any, businessData: any) {
  if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === "sk-your-openai-api-key") {
    console.warn("OpenAI API Key not set. Returning mock report.");
    return generateMockReport(businessData);
  }

  const reportUrl = `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/report/${businessData.slug || "view"}`;

  const prompt = AUDIT_REPORT_PROMPT
    .replace("{{businessName}}", businessData.businessName)
    .replace("{{niche}}", businessData.category || "n/a")
    .replace("{{overallScore}}", auditData.overallScore.toString())
    .replace("{{reportUrl}}", reportUrl)
    .replace("{{seoScore}}", auditData.seoScore.toString())
    .replace("{{croScore}}", auditData.croScore.toString())
    .replace("{{trustScore}}", auditData.trustScore.toString())
    .replace("{{technicalScore}}", auditData.technicalScore.toString())
    .replace("{{localSeoScore}}", auditData.localSeoScore.toString())
    .replace("{{findings}}", JSON.stringify(auditData, null, 2));

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        { role: "system", content: "You are a lead generation assistant." },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" },
    });

    return JSON.parse(response.choices[0].message.content || "{}");
  } catch (error) {
    console.error("OpenAI Error:", error);
    return generateMockReport(businessData);
  }
}

function generateMockReport(businessData: any) {
  const reportUrl = `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/report/${businessData.slug || "view"}`;
  return {
    summary: `The website for ${businessData.businessName} has some fundamental gaps in SEO and conversion optimization that are common for local businesses in this niche.`,
    topGaps: [
      "Missing Meta Descriptions",
      "No clear Call-to-Action (CTA) on homepage",
      "Broken or missing social media links",
      "Slow page load speed on mobile",
      "Lack of customer testimonials section"
    ],
    whyGapsMatter: "These gaps mean the business is likely losing 40-60% of potential leads who visit the site but don't know how to take the next step or don't trust the brand.",
    recommendedFixes: "Implement a sticky CTA, optimize images for mobile, and add a Google Reviews widget to the homepage.",
    serviceOffer: {
       type: "Conversion Engine Setup",
       problem: "The website lacks a clear funnel, causing 60% of visitors to bounce without taking action.",
       solution: "We will implement high-converting CTAs, a sticky contact bar, and a lead capture system.",
       impact: "Projected 30-50% increase in inbound inquiries within 30 days.",
       price: "$1,200 - $1,800"
    },
    outreachAngle: "Focus on 'Missing Revenue' - show them exactly where their website is leaking money.",
    coldEmail: `Subject: I found a few issues with ${businessData.businessName}'s website\n\nHi ${businessData.businessName} team, I was looking at your site and noticed it's missing a few key conversion elements. You can see the full breakdown I made for you here: ${reportUrl}...`,
    followUpEmail: `Just following up on my previous email with your custom audit: ${reportUrl}`,
    shortDm: `Hey! Love what you guys are doing. Noticed a quick fix for your site that could double your lead flow. I made a custom report for you here: ${reportUrl}. Interested?`
  };
}
