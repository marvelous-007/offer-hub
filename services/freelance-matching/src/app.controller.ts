import { Controller, Get, Post } from "@nestjs/common";
import { AppService } from "./app.service";
import { QueueService } from "./queue/queue.service";

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly queueService: QueueService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('test-queue')
  async testQueue() {
    const jobId = await this.queueService.addTestJob();
    return { success: true, jobId };
  }
}
