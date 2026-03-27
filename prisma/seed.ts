import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient, CampaignStatus, Channel, AudienceType, DeliveryStatus, PaymentStatus, RecipientStatus } from '@prisma/client';
import 'dotenv/config';

async function main() {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error('DATABASE_URL is not set');
  }

  const pool = new Pool({ connectionString });
  const adapter = new PrismaPg(pool as any);
  const prisma = new PrismaClient({ adapter });

  console.log('🌱 Starting database seeding...');

  // Clean up existing data
  await prisma.campaignRecipient.deleteMany({});
  await prisma.campaign.deleteMany({});

  // Seed Campaigns
  const campaign1 = await prisma.campaign.create({
    data: {
      name: 'Summer Sale 2026',
      description: 'Big summer discount for all customers.',
      status: CampaignStatus.Draft,
      step: 1,
      channel: Channel.Email,
      audienceType: AudienceType.Custom,
      budget: 500.00,
      isDraft: true,
      recipients: {
        create: [
          {
            name: 'John Doe',
            email: 'john@example.com',
            status: RecipientStatus.Pending,
          },
          {
            name: 'Jane Smith',
            email: 'jane@example.com',
            status: RecipientStatus.Pending,
          },
        ],
      },
    },
  });

  const campaign2 = await prisma.campaign.create({
    data: {
      name: 'Flash SMS Promo',
      description: 'Quick flash sale via SMS.',
      status: CampaignStatus.Scheduled,
      step: 4,
      channel: Channel.SMS,
      audienceType: AudienceType.All,
      budget: 200.00,
      cost: 150.00,
      isDraft: false,
      sendDate: new Date('2026-06-01T10:00:00Z'),
      sendTime: '10:00 AM',
      deliveryStatus: DeliveryStatus.Scheduled,
      paymentStatus: PaymentStatus.Paid,
    },
  });

  console.log('✅ Seeding finished successfully.');
  console.log(`Seeded campaigns: ${campaign1.name}, ${campaign2.name}`);

  await prisma.$disconnect();
}

main().catch((e) => {
  console.error('❌ Seeding failed:', e);
  process.exit(1);
});
