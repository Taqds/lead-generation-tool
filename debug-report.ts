import { PrismaClient } from '@prisma/client';
import { generateLeadReport } from './src/lib/services/openai';

const prisma = new PrismaClient();

async function run() {
  const lead = await prisma.lead.findUnique({
    where: { slug: 'plumbing-services-services-10-37db1eeb' },
    include: { audit: true, campaign: true },
  });

  if (!lead || !lead.audit) {
    console.log("Lead or Audit not found");
    return;
  }

  console.log("Generating report...");
  const reportData = await generateLeadReport(lead.audit, {
    businessName: lead.businessName,
    category: lead.category,
    slug: lead.slug,
  });

  await prisma.leadReport.upsert({
    where: { leadId: lead.id },
    create: {
      leadId: lead.id,
      ...reportData,
    },
    update: {
      ...reportData,
    }
  });

  await prisma.lead.update({
    where: { id: lead.id },
    data: { status: "DONE" },
  });

  console.log("Report generated and saved!");
}

run().catch(console.error).finally(() => prisma.$disconnect());
