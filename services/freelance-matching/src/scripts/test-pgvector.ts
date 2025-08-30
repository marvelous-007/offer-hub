import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function testPgVector() {
  const prisma = new PrismaClient();
  
  try {
    // Check if pgvector extension is enabled
    const extensionResult = await prisma.$queryRaw`
      SELECT * FROM pg_extension WHERE extname = 'vector';
    `;
    
    console.log('pgvector extension status:', extensionResult);
    
    if (Array.isArray(extensionResult) && extensionResult.length > 0) {
      console.log('pgvector extension is enabled!');
      
      // Test vector operations
      const vectorResult = await prisma.$queryRaw`
        SELECT '[1,2,3]'::vector <-> '[4,5,6]'::vector AS distance;
      `;
      
      console.log('Vector operation test result:', vectorResult);
      return { success: true, extensionResult, vectorResult };
    } else {
      console.error('pgvector extension is not enabled.');
      return { success: false, error: 'Extension not enabled' };
    }
  } catch (error) {
    console.error('Error testing pgvector:', error);
    return { success: false, error };
  } finally {
    await prisma.$disconnect();
  }
}

testPgVector()
  .then((result) => {
    if (result.success) {
      process.exit(0);
    } else {
      process.exit(1);
    }
  })
  .catch((error) => {
    console.error('Unexpected error:', error);
    process.exit(1);
  });
