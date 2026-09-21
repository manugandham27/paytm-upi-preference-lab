import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export async function ensureInitialData() {
  try {
    const count = await prisma.vocResponse.count();
    if (count === 0) {
      // Dynamic import to avoid circular dependency
      const { seedDemoData } = await import("./demoData");
      await seedDemoData();
    }
  } catch (e) {
    console.error("Auto-seed on serverless error:", e);
  }
}
