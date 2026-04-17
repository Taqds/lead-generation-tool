import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash("password123", 10);

  const user = await prisma.user.upsert({
    where: { email: "admin@leadaudit.com" },
    update: {},
    create: {
      email: "admin@leadaudit.com",
      name: "Admin User",
      password: hashedPassword,
    },
  });

  console.log({ user });

  // Create a sample campaign
  const campaign = await prisma.campaign.create({
    data: {
      niche: "Plumbing Services",
      location: "Chicago, IL",
      count: 5,
      userId: user.id,
      status: "COMPLETED",
    },
  });

  // Create a sample lead
  const lead = await prisma.lead.create({
    data: {
      campaignId: campaign.id,
      businessName: "Chicago Pro Plumbing",
      category: "Plumbing",
      webUrl: "https://chicagoproplumbing.com",
      email: "contact@chicagoproplumbing.com",
      phone: "+1 312-555-0123",
      address: "456 Water St, Chicago, IL",
      rating: 4.8,
      reviewCount: 156,
      status: "DONE",
      audit: {
        create: {
          title: "Plumbing Services Chicago - Licensed Plumbers",
          metaDescription: "Best local plumbing services in Chicago. Licensed and insured.",
          h1Count: 1,
          h2Count: 4,
          hasSsl: true,
          hasContactForm: true,
          hasCta: true,
          hasSchema: true,
          hasSocialLinks: true,
          hasReviews: true,
          seoScore: 85,
          croScore: 90,
          trustScore: 95,
          technicalScore: 88,
          localSeoScore: 92,
          overallScore: 90,
        }
      },
      report: {
        create: {
          summary: "Chicago Pro Plumbing has a strong online presence but is missing key local intent landing pages.",
          topGaps: ["Missing specific city-neighborhood pages", "Page speed on mobile is slow (65/100)", "No video testimonials"],
          whyGapsMatter: "These gaps mean they are missing out on ultra-local search traffic from nearby neighborhoods.",
          recommendedFixes: "Create neighborhood content silos and compress images.",
          outreachAngle: "Hyper-local dominance angle.",
          coldEmail: "Hi team, noticed you're ranking well for Chicago but missing out on neighborhood-specific searches...",
          followUpEmail: "Following up on the local SEO plan I sent...",
          shortDm: "Hey! Loved your recent project. Quick tip for your local SEO...",
        }
      }
    },
  });

  console.log("Seed data created successfully");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
