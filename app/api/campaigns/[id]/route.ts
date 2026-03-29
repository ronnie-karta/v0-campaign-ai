import { NextResponse } from "next/server";
import db from "@/lib/db";
import { z } from "zod";
import { serializeCampaign } from "@/lib/api-utils";

const paramsSchema = z.object({
  id: z.string().uuid(),
});

const updateCampaignSchema = z.object({
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

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const validatedParams = paramsSchema.parse({ id });

    const campaign = await db.campaign.findUnique({
      where: { id: validatedParams.id },
    });

    if (!campaign || campaign.isDeleted) {
      return NextResponse.json({ error: "Campaign not found" }, { status: 404 });
    }

    return NextResponse.json(serializeCampaign(campaign));
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    console.error("GET /api/campaigns/[id] error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const validatedParams = paramsSchema.parse({ id });
    const body = await req.json();
    const validatedData = updateCampaignSchema.parse(body);

    const campaign = await db.campaign.findUnique({
      where: { id: validatedParams.id },
    });

    if (!campaign || campaign.isDeleted) {
      return NextResponse.json({ error: "Campaign not found" }, { status: 404 });
    }

    const updatedCampaign = await db.campaign.update({
      where: { id: validatedParams.id },
      data: validatedData,
    });

    return NextResponse.json(serializeCampaign(updatedCampaign));
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    console.error("PATCH /api/campaigns/[id] error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const validatedParams = paramsSchema.parse({ id });

    const campaign = await db.campaign.findUnique({
      where: { id: validatedParams.id },
    });

    if (!campaign || campaign.isDeleted) {
      return NextResponse.json({ error: "Campaign not found" }, { status: 404 });
    }

    await db.campaign.update({
      where: { id: validatedParams.id },
      data: { isDeleted: true },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    console.error("DELETE /api/campaigns/[id] error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
