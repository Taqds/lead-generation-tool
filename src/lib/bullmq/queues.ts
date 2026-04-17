import { Queue } from "bullmq";
import { connection } from "../redis";

export const leadDiscoveryQueue = new Queue("lead-discovery", { connection });
export const leadAuditQueue = new Queue("lead-audit", { connection });
export const aiReportQueue = new Queue("ai-report", { connection });

export const QUEUE_NAMES = {
  LEAD_DISCOVERY: "lead-discovery",
  LEAD_AUDIT: "lead-audit",
  AI_REPORT: "ai-report",
};
