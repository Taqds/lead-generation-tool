import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const lead = await prisma.lead.findUnique({
    where: { slug: 'plumbing-services-services-10-37db1eeb' },
  });

  console.log("Lead Status:", lead?.status);
}

main().catch(console.error).finally(() => prisma.$disconnect());
