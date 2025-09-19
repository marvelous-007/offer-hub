import Redis from "ioredis";
import * as dotenv from "dotenv";

// Load environment variables
dotenv.config();

async function testRedisConnection() {
  const redis = new Redis({
    host: process.env.REDIS_HOST || "localhost",
    port: parseInt(process.env.REDIS_PORT || "6379", 10),
    password: process.env.REDIS_PASSWORD || undefined,
    retryStrategy: (times) => {
      const delay = Math.min(times * 50, 2000);
      return delay;
    },
  });

  try {
    // Test connection with ping
    const pong = await redis.ping();
    console.log(`Redis connection successful: ${pong}`);

    // Test set and get operations
    await redis.set("test_key", "Hello from freelance-matching service!");
    const value = await redis.get("test_key");
    console.log("Retrieved test value:", value);

    // Clean up
    await redis.del("test_key");
    console.log("Test key deleted");

    await redis.quit();
    console.log("Redis connection closed");

    return { success: true };
  } catch (error) {
    console.error("Redis connection failed:", error);

    try {
      await redis.quit();
    } catch (e) {
      // Ignore errors during quit
    }

    return { success: false, error };
  }
}

testRedisConnection()
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
