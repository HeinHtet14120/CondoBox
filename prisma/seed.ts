import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("admin123", 10);

  await prisma.user.upsert({
    where: { username: "admin" },
    update: {},
    create: {
      username: "admin",
      passwordHash,
      name: "Condo Office",
      role: "admin",
    },
  });

  await prisma.condoConfig.upsert({
    where: { id: 1 },
    update: {},
    create: { id: 1, totalRooms: 0, isInitialized: false },
  });

  console.log("Seed complete: default admin (admin / admin123) ready.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
