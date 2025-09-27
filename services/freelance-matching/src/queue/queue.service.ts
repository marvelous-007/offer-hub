import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Injectable()
export class QueueService {
  constructor(
    @InjectQueue('embeddings') private readonly embeddingsQueue: Queue,
  ) {}

  /**
   * Add a job to the embeddings queue
   * @param name Job name
   * @param data Job data
   * @param opts Job options
   * @returns Job ID
   */
  async addEmbeddingJob(name: string, data: any, opts?: any) {
    const job = await this.embeddingsQueue.add(name, data, opts);
    return job.id;
  }

  /**
   * Add a test job to the embeddings queue
   * @returns Job ID
   */
  async addTestJob() {
    return this.addEmbeddingJob('test', { message: 'Test job' }, {
      attempts: 2,
      backoff: { type: 'fixed', delay: 5000 },
    });
  }
}
