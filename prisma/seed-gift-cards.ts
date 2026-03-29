import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import 'dotenv/config';
import giftCardData from './data/gift-cards.json';

interface ApiCategory {
  id: number;
  name: string;
  description: string | null;
  status: string;
  icon: string | null;
}

interface ApiProfile {
  id: number;
  name: string;
  frontsideImage: string;
  backsideImage: string;
  merchantId: number | null;
  referenceId: string;
  colour: string;
  starOneColour: string;
  starTwoColour: string;
  lastFourDigitsColour: string;
  programProfileType: string;
  programProfileStatus: string;
}

interface ApiProgram {
  id: number;
  referenceId: string;
  giftCardProgramType: string;
  merchantId: number;
  displayAffiliationText: boolean;
  name: string;
  specialCategories: ApiCategory[];
  programProfiles: ApiProfile[];
}

interface ApiResult {
  giftCardProgram: ApiProgram;
  merchants: unknown[];
}

interface ApiResponse {
  take: number;
  skip: number;
  total: number;
  results: ApiResult[];
}

async function main() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error('DATABASE_URL is not set');
  }

  const pool = new Pool({ connectionString });
  const adapter = new PrismaPg(pool as any);
  const prisma = new PrismaClient({ adapter });

  const data = giftCardData as ApiResponse;

  console.log(`🎁 Seeding ${data.total} gift card programs...`);

  // Clean existing gift card data (order matters for FK constraints)
  await prisma.giftCardProgramCategory.deleteMany({});
  await prisma.giftCardProfile.deleteMany({});
  await prisma.giftCardProgram.deleteMany({});
  await prisma.giftCardCategory.deleteMany({});

  // Collect unique categories across all programs
  const categoryMap = new Map<number, ApiCategory>();
  for (const result of data.results) {
    for (const cat of result.giftCardProgram.specialCategories) {
      categoryMap.set(cat.id, cat);
    }
  }

  // Seed categories
  for (const cat of categoryMap.values()) {
    await prisma.giftCardCategory.create({
      data: {
        id: cat.id,
        name: cat.name,
        description: cat.description,
        status: cat.status,
        icon: cat.icon,
      },
    });
  }
  console.log(`  ✅ ${categoryMap.size} categories`);

  // Seed programs, profiles, and category links
  for (const result of data.results) {
    const prog = result.giftCardProgram;

    await prisma.giftCardProgram.create({
      data: {
        id: prog.id,
        referenceId: prog.referenceId,
        name: prog.name,
        giftCardProgramType: prog.giftCardProgramType,
        merchantId: prog.merchantId,
        displayAffiliationText: prog.displayAffiliationText,
      },
    });

    // Link categories
    for (const cat of prog.specialCategories) {
      await prisma.giftCardProgramCategory.create({
        data: {
          programId: prog.id,
          categoryId: cat.id,
        },
      });
    }

    // Seed profiles
    for (const profile of prog.programProfiles) {
      await prisma.giftCardProfile.create({
        data: {
          id: profile.id,
          programId: prog.id,
          name: profile.name,
          referenceId: profile.referenceId,
          colour: profile.colour,
          starOneColour: profile.starOneColour,
          starTwoColour: profile.starTwoColour,
          lastFourDigitsColour: profile.lastFourDigitsColour,
          frontsideImage: profile.frontsideImage,
          backsideImage: profile.backsideImage,
          programProfileType: profile.programProfileType,
          programProfileStatus: profile.programProfileStatus,
        },
      });
    }

    console.log(`  ✅ ${prog.referenceId} — ${prog.programProfiles.length} profiles`);
  }

  console.log(`\n🎉 Gift card seeding complete! ${data.total} programs, ${data.results.reduce((sum, r) => sum + r.giftCardProgram.programProfiles.length, 0)} profiles`);

  await prisma.$disconnect();
}

main().catch((e) => {
  console.error('❌ Gift card seeding failed:', e);
  process.exit(1);
});
