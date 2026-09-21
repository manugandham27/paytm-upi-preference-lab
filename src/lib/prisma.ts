import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

function getDatabaseUrl(): string {
  if (process.env.VERCEL || process.env.NODE_ENV === "production") {
    const tmpDbPath = "/tmp/dev.db";
    const cwdDbPath = path.join(process.cwd(), "prisma", "dev.db");

    if (!fs.existsSync(tmpDbPath)) {
      if (fs.existsSync(cwdDbPath)) {
        try {
          fs.copyFileSync(cwdDbPath, tmpDbPath);
        } catch (e) {
          console.error("Error copying dev.db to /tmp:", e);
        }
      }
    }
    return `file:${tmpDbPath}`;
  }
  return "file:./dev.db";
}

const dbUrl = getDatabaseUrl();

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    datasources: {
      db: {
        url: dbUrl,
      },
    },
    log: ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export async function ensureInitialData() {
  try {
    const count = await prisma.vocResponse.count();
    if (count === 0) {
      const { seedDemoData } = await import("./demoData");
      await seedDemoData();
    }
  } catch (e) {
    console.error("Auto-seed error:", e);
  }
}
