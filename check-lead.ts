import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const lead = await prisma.lead.findUnique({
    where: { slug: 'plumbing-services-services-10-37db1eeb' },
    include: { audit: true, report: true },
  });

  console.log("Lead found:", !!lead);
  if (lead) {
    console.log("Audit exists:", !!lead.audit);
    console.log("Report exists:", !!lead.report);
  } else {
    console.log("Lead does not exist in DB for this slug");
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
