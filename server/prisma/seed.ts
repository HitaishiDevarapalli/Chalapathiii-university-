import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const existingAdmin = await prisma.adminUser.findUnique({
    where: { username: "admin" }
  });

  if (!existingAdmin) {
    const password = process.env.ADMIN_INITIAL_PASSWORD;
    if (!password || password.length < 12) throw new Error("Set ADMIN_INITIAL_PASSWORD (12+ characters) to create the first admin");
    const passwordHash = await bcrypt.hash(password, 12);
    await prisma.adminUser.create({
      data: {
        username: "admin",
        passwordHash,
        role: "superadmin"
      }
    });
    console.log("Created admin user");
  } else {
    console.log("Admin user already exists");
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
