"use server";

import prisma from "@/lib/prisma";
import { leadDiscoveryQueue } from "@/lib/bullmq/queues";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createCampaign(formData: FormData) {
  const niche = formData.get("niche") as string;
  const location = formData.get("location") as string;
  const count = parseInt(formData.get("count") as string) || 10;
  
  // In a real app, get the userId from the session
  // For demo, we'll use a placeholder or create a default user if none exists
  let user = await prisma.user.findFirst();
  if (!user) {
    user = await prisma.user.create({
      data: {
        email: "demo@example.com",
        name: "Demo User",
      },
    });
  }

  const campaign = await prisma.campaign.create({
    data: {
      niche,
      location,
      count,
      userId: user.id,
      status: "PENDING",
    },
  });

  // Add job to BullMQ
  await leadDiscoveryQueue.add(`campaign-${campaign.id}`, {
    campaignId: campaign.id,
    niche,
    location,
    count,
  });

  revalidatePath("/dashboard");
  redirect(`/campaigns/${campaign.id}`);
}
