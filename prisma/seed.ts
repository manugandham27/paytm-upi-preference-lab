import { seedDemoData } from "../src/lib/demoData";

async function main() {
  console.log("Seeding demo research data...");
  const res = await seedDemoData();
  console.log("Seed result:", res);
}

main().catch((e) => {
  console.error("Seed error:", e);
  process.exit(1);
});
