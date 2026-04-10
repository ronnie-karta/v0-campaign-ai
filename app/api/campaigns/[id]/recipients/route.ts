import { NextResponse } from "next/server";
import db from "@/lib/db";
import { z } from "zod";

const paramsSchema = z.object({
  id: z.string().uuid(),
});

const recipientSchema = z.object({
  email: z.string().email().optional().nullable(),
  phone: z.string().optional().nullable(),
  name: z.string().optional().nullable(),
  status: z.enum(["Pending", "Sent", "Failed"]).optional(),
});

const bulkRecipientsSchema = z.array(recipientSchema);

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const validatedParams = paramsSchema.parse({ id });

    const recipients = await db.campaignRecipient.findMany({
      where: { campaignId: validatedParams.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(recipients);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    console.error("GET /api/campaigns/[id]/recipients error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const validatedParams = paramsSchema.parse({ id });
    const body = await req.json();

    // Check if it's bulk or single
    const isBulk = Array.isArray(body);
    const recipientsData = isBulk 
      ? bulkRecipientsSchema.parse(body) 
      : [recipientSchema.parse(body)];

    // Verify cempaign exists
    const cempaign = await db.cempaign.findUnique({
      where: { id: validatedParams.id },
    });

    if (!cempaign || cempaign.isDeleted) {
      return NextResponse.json({ error: "Campaign not found" }, { status: 404 });
    }

    // Create recipients and update count in a transaction
    const result = await db.$transaction(async (tx: any) => {
      const created = await Promise.all(
        recipientsData.map((data: any) => 
          tx.campaignRecipient.create({
            data: {
              ...data,
              campaignId: validatedParams.id,
            },
          })
        )
      );

      // Update recipientCount
      const count = await tx.campaignRecipient.count({
        where: { campaignId: validatedParams.id },
      });

      await tx.cempaign.update({
        where: { id: validatedParams.id },
        data: { recipientCount: count },
      });

      return created;
    });

    return NextResponse.json(isBulk ? result : result[0], { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    console.error("POST /api/campaigns/[id]/recipients error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
