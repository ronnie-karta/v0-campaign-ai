import { NextResponse } from "next/server";
import db from "@/lib/db";
import { z } from "zod";

const paramsSchema = z.object({
  id: z.string().uuid(),
  recipientId: z.string().uuid(),
});

const updateRecipientSchema = z.object({
  email: z.string().email().optional().nullable(),
  phone: z.string().optional().nullable(),
  name: z.string().optional().nullable(),
  status: z.enum(["Pending", "Sent", "Failed"]).optional(),
});

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string; recipientId: string }> }
) {
  try {
    const { id, recipientId } = await params;
    const validatedParams = paramsSchema.parse({ id, recipientId });
    const body = await req.json();
    const validatedData = updateRecipientSchema.parse(body);

    const recipient = await db.campaignRecipient.findUnique({
      where: { id: validatedParams.recipientId },
    });

    if (!recipient || recipient.campaignId !== validatedParams.id) {
      return NextResponse.json({ error: "Recipient not found" }, { status: 404 });
    }

    const updatedRecipient = await db.campaignRecipient.update({
      where: { id: validatedParams.recipientId },
      data: validatedData,
    });

    return NextResponse.json(updatedRecipient);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    console.error("PATCH /api/campaigns/[id]/recipients/[recipientId] error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string; recipientId: string }> }
) {
  try {
    const { id, recipientId } = await params;
    const validatedParams = paramsSchema.parse({ id, recipientId });

    const recipient = await db.campaignRecipient.findUnique({
      where: { id: validatedParams.recipientId },
    });

    if (!recipient || recipient.campaignId !== validatedParams.id) {
      return NextResponse.json({ error: "Recipient not found" }, { status: 404 });
    }

    await db.$transaction(async (tx: any) => {
      await tx.campaignRecipient.delete({
        where: { id: validatedParams.recipientId },
      });

      // Update recipientCount
      const count = await tx.campaignRecipient.count({
        where: { campaignId: validatedParams.id },
      });

      await tx.campaign.update({
        where: { id: validatedParams.id },
        data: { recipientCount: count },
      });
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    console.error("DELETE /api/campaigns/[id]/recipients/[recipientId] error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
