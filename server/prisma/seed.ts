import { PrismaClient } from "@prisma/client";
import "dotenv/config";
import argon2 from "argon2";

const prisma = new PrismaClient();

async function main() {
  const existingAdmin = await prisma.adminUser.findFirst();

  if (!existingAdmin) {
    const password = process.env.ADMIN_INITIAL_PASSWORD;
    const email = process.env.ADMIN_INITIAL_EMAIL?.trim().toLowerCase();
    if (!password || password.length < 14 || !email) { console.log("No administrator provisioned. Use the trusted security operator CLI to create the first account."); return; }
    const passwordHash = await argon2.hash(password, { type: argon2.argon2id, memoryCost: 19456, timeCost: 3, parallelism: 1 });
    await prisma.adminUser.create({
      data: {
        username: "admin",
        passwordHash,
        role: "superadmin", email, status: "Pending", credentialMode: "secured", mustChangePassword: true,
        requireGoogle: true, requireTotp: true, googleAccounts: { create: { email, requireTotp: true } }
      }
    });
    console.log("Created pending administrator; password change, Google verification and authenticator enrollment are required.");
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
