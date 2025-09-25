import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';

@Processor('embeddings')
export class EmbeddingsProcessor extends WorkerHost {
  private readonly logger = new Logger(EmbeddingsProcessor.name);

  async process(job: Job): Promise<any> {
    this.logger.log(`Processing job ${job.id} of type ${job.name}`);
    
    try {
      // Handle different job types
      switch (job.name) {
        case 'test':
          return this.processTestJob(job);
        // Add more job types here as needed
        default:
          this.logger.warn(`Unknown job type: ${job.name}`);
          return { success: false, error: 'Unknown job type' };
      }
    } catch (error) {
      this.logger.error(`Error processing job ${job.id}: ${error.message}`);
      throw error;
    }
  }

  private async processTestJob(job: Job): Promise<any> {
    this.logger.log(`Processing test job with data: ${JSON.stringify(job.data)}`);
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { success: true, message: 'Test job processed successfully' };
  }
}
