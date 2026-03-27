-- CreateEnum
CREATE TYPE "CampaignStatus" AS ENUM ('Draft', 'Scheduled', 'Sent', 'Completed');

-- CreateEnum
CREATE TYPE "Channel" AS ENUM ('Email', 'SMS', 'Both');

-- CreateEnum
CREATE TYPE "AudienceType" AS ENUM ('All', 'Segment', 'Custom');

-- CreateEnum
CREATE TYPE "DeliveryStatus" AS ENUM ('Pending', 'Scheduled', 'Sent', 'Failed');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('Pending', 'Paid', 'Failed', 'Refunded');

-- CreateEnum
CREATE TYPE "RecipientStatus" AS ENUM ('Pending', 'Sent', 'Failed');

-- CreateTable
CREATE TABLE "Campaign" (
    "id" UUID NOT NULL,
    "name" TEXT,
    "description" TEXT,
    "status" "CampaignStatus" NOT NULL DEFAULT 'Draft',
    "step" INTEGER NOT NULL DEFAULT 1,
    "template" TEXT,
    "theme" TEXT,
    "channel" "Channel",
    "audienceType" "AudienceType" NOT NULL DEFAULT 'Custom',
    "recipientCount" INTEGER NOT NULL DEFAULT 0,
    "sendDate" TIMESTAMP(3),
    "sendTime" TEXT,
    "timezone" TEXT NOT NULL DEFAULT 'UTC',
    "deliveryStatus" "DeliveryStatus" NOT NULL DEFAULT 'Pending',
    "budget" DECIMAL(12,2),
    "cost" DECIMAL(12,2),
    "paymentStatus" "PaymentStatus" NOT NULL DEFAULT 'Pending',
    "isDraft" BOOLEAN NOT NULL DEFAULT true,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Campaign_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CampaignRecipient" (
    "id" UUID NOT NULL,
    "campaignId" UUID NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "name" TEXT,
    "status" "RecipientStatus" NOT NULL DEFAULT 'Pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CampaignRecipient_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Campaign_status_idx" ON "Campaign"("status");

-- CreateIndex
CREATE INDEX "Campaign_createdAt_idx" ON "Campaign"("createdAt");

-- CreateIndex
CREATE INDEX "Campaign_isDeleted_idx" ON "Campaign"("isDeleted");

-- CreateIndex
CREATE INDEX "CampaignRecipient_campaignId_idx" ON "CampaignRecipient"("campaignId");

-- CreateIndex
CREATE INDEX "CampaignRecipient_status_idx" ON "CampaignRecipient"("status");

-- CreateIndex
CREATE INDEX "CampaignRecipient_email_idx" ON "CampaignRecipient"("email");

-- CreateIndex
CREATE INDEX "CampaignRecipient_phone_idx" ON "CampaignRecipient"("phone");

-- AddForeignKey
ALTER TABLE "CampaignRecipient" ADD CONSTRAINT "CampaignRecipient_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign"("id") ON DELETE CASCADE ON UPDATE CASCADE;
