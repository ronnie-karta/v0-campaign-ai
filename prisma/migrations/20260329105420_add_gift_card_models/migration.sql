-- CreateTable
CREATE TABLE "GiftCardCategory" (
    "id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Active',
    "icon" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GiftCardCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GiftCardProgram" (
    "id" INTEGER NOT NULL,
    "referenceId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "giftCardProgramType" TEXT NOT NULL DEFAULT 'Category',
    "merchantId" INTEGER NOT NULL DEFAULT 0,
    "displayAffiliationText" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GiftCardProgram_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GiftCardProgramCategory" (
    "programId" INTEGER NOT NULL,
    "categoryId" INTEGER NOT NULL,

    CONSTRAINT "GiftCardProgramCategory_pkey" PRIMARY KEY ("programId","categoryId")
);

-- CreateTable
CREATE TABLE "GiftCardProfile" (
    "id" INTEGER NOT NULL,
    "programId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "referenceId" TEXT NOT NULL,
    "colour" TEXT,
    "starOneColour" TEXT,
    "starTwoColour" TEXT,
    "lastFourDigitsColour" TEXT,
    "frontsideImage" TEXT,
    "backsideImage" TEXT,
    "programProfileType" TEXT NOT NULL DEFAULT 'Category',
    "programProfileStatus" TEXT NOT NULL DEFAULT 'Active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GiftCardProfile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "GiftCardCategory_name_key" ON "GiftCardCategory"("name");

-- CreateIndex
CREATE UNIQUE INDEX "GiftCardProgram_referenceId_key" ON "GiftCardProgram"("referenceId");

-- CreateIndex
CREATE INDEX "GiftCardProgram_referenceId_idx" ON "GiftCardProgram"("referenceId");

-- CreateIndex
CREATE UNIQUE INDEX "GiftCardProfile_referenceId_key" ON "GiftCardProfile"("referenceId");

-- CreateIndex
CREATE INDEX "GiftCardProfile_programId_idx" ON "GiftCardProfile"("programId");

-- CreateIndex
CREATE INDEX "GiftCardProfile_referenceId_idx" ON "GiftCardProfile"("referenceId");

-- AddForeignKey
ALTER TABLE "GiftCardProgramCategory" ADD CONSTRAINT "GiftCardProgramCategory_programId_fkey" FOREIGN KEY ("programId") REFERENCES "GiftCardProgram"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GiftCardProgramCategory" ADD CONSTRAINT "GiftCardProgramCategory_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "GiftCardCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GiftCardProfile" ADD CONSTRAINT "GiftCardProfile_programId_fkey" FOREIGN KEY ("programId") REFERENCES "GiftCardProgram"("id") ON DELETE CASCADE ON UPDATE CASCADE;
