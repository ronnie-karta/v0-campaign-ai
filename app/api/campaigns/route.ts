import { NextResponse } from "next/server";
import db from "@/lib/db";
import { z } from "zod";
import { serializeCampaign } from "@/lib/api-utils";

const campaignSchema = z.object({
  name: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  status: z.enum(["Draft", "Scheduled", "Sent", "Completed"]).optional(),
  step: z.number().int().optional(),
  template: z.string().optional().nullable(),
  theme: z.string().optional().nullable(),
  channel: z.enum(["Email", "SMS", "Both"]).optional().nullable(),
  senderName: z.string().optional().nullable(),
  senderEmail: z.string().optional().nullable(),
  senderPhone: z.string().optional().nullable(),
  subject: z.string().optional().nullable(),
  previewText: z.string().optional().nullable(),
  messageContent: z.string().optional().nullable(),
  audienceType: z.enum(["All", "Segment", "Custom"]).optional(),
  recipientCount: z.number().int().optional(),
  sendDate: z.string().datetime().optional().nullable(),
  sendTime: z.string().optional().nullable(),
  timezone: z.string().optional(),
  deliveryStatus: z.enum(["Pending", "Scheduled", "Sent", "Failed"]).optional(),
  budget: z.number().optional().nullable(),
  cost: z.number().optional().nullable(),
  paymentStatus: z.enum(["Pending", "Paid", "Failed", "Refunded"]).optional(),
  isDraft: z.boolean().optional(),
});

export async function GET() {
  try {
    const campaigns = await db.cempaign.findMany({
      where: { isDeleted: false },
      orderBy: { createdAt: "desc" },
    });

    const serializedCampaigns = campaigns.map(serializeCampaign);

    return NextResponse.json(serializedCampaigns);
  } catch (error) {
    console.error("GET /api/campaigns error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validatedData = campaignSchema.parse(body);

    const cempaign = await db.cempaign.create({
      data: {
        ...validatedData,
        status: validatedData.status || "Draft",
        step: validatedData.step ?? 1,
        isDraft: validatedData.isDraft ?? true,
      },
    });

    return NextResponse.json(serializeCampaign(cempaign), { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    console.error("POST /api/campaigns error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
