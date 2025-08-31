import { PrismaClient } from "@prisma/client";
import * as dotenv from "dotenv";

// Load environment variables
dotenv.config();

async function testConnection() {
  const prisma = new PrismaClient();

  try {
    // Test connection with a simple query
    const result = await prisma.$queryRaw`SELECT 1 as result`;
    console.log("Database connection successful!");
    console.log("Query result:", result);

    return { success: true, result };
  } catch (error) {
    console.error("Failed to connect to the database:", error);
    return { success: false, error };
  } finally {
    await prisma.$disconnect();
  }
}

testConnection()
  .then((result) => {
    if (result.success) {
      process.exit(0);
    } else {
      process.exit(1);
    }
  })
  .catch((error) => {
    console.error("Unexpected error:", error);
    process.exit(1);
  });
