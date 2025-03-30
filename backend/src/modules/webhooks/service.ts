import { Injectable, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Webhook } from './entity';
import { CreateWebhookDto } from './dto';
import { HttpService } from '@nestjs/axios';
import * as crypto from 'crypto';
import * as url from 'url';

@Injectable()
export class WebhooksService {
  constructor(
    @InjectRepository(Webhook) private webhookRepository: Repository<Webhook>,
    private readonly httpService: HttpService,
  ) {}

  async findAll(): Promise<Webhook[]> {
    return this.webhookRepository.find();
  }

  async register(createWebhookDto: CreateWebhookDto): Promise<Webhook> { 
    const webhook = this.webhookRepository.create(createWebhookDto); 
    return this.webhookRepository.save(webhook); 
  }

  async triggerWebhook(data: any) {
    if (!data?.event) {
      throw new BadRequestException('Event is required');
    }

    const webhooks = await this.webhookRepository
      .createQueryBuilder("webhook")
      .where("webhook.events @> :event", { event: JSON.stringify([data.event]) })
      .getMany();

    if (webhooks.length === 0) {
      return;
    }

    const secret = process.env.WEBHOOK_SECRET;
    if (!secret) {
      throw new InternalServerErrorException('WEBHOOK_SECRET is not defined');
    }

    const signature = this.generateHmacSignature(JSON.stringify(data), secret);

    const requests = webhooks.map(async (webhook) => {
      if (!this.isValidWebhookUrl(webhook.url)) {
        console.warn(`Blocked potentially unsafe webhook URL: ${webhook.url}`);
        return;
      }

      try {
        await this.httpService.post(webhook.url, data, { 
          headers: { 'X-Signature': signature },
        }).toPromise();
      } catch (error) {
        console.error(`Failed to send webhook to ${webhook.url}:`, error.message);
      }
    });

    await Promise.allSettled(requests);
  }

  private generateHmacSignature(payload: string, secret: string): string {
    return crypto.createHmac('sha256', secret).update(payload).digest('hex');
  }

  private isValidWebhookUrl(webhookUrl: string): boolean {
    try {
      const parsedUrl = new url.URL(webhookUrl);
      const unsafeHosts = ['localhost', '127.0.0.1', '0.0.0.0'];
      return !unsafeHosts.includes(parsedUrl.hostname);
    } catch {
      return false;
    }
  }

  async handleHasuraEvent(payload: any): Promise<boolean> {
    const { table, event } = payload;
  
    if (!table?.name || !event?.op) return false;
  
    const operation = event.op; // 'INSERT' | 'UPDATE' | 'DELETE'
    const newData = event.data.new;
    const oldData = event.data.old;
  
    switch (table.name) {
      case 'transactions':
        switch (operation) {
          case 'INSERT':
            console.log('🟢 New transaction inserted:', newData);
            // Trigger balance updates, notifications, etc. here
            break;
          case 'UPDATE':
            console.log('📝 Transaction updated:');
            console.log('Previous:', oldData);
            console.log('Current:', newData);
            break;
          default:
            console.warn(`⚠️ Unhandled operation for transactions: ${operation}`);
        }
        break;
  
      case 'services':
        switch (operation) {
          case 'INSERT':
            console.log('🆕 New service created:', newData);
            // Optionally notify the freelancer or log the action
            break;
          case 'DELETE':
            console.log('❌ Service deleted:', oldData);
            break;
          default:
            console.warn(`⚠️ Unhandled operation for services: ${operation}`);
        }
        break;
  
      default:
        console.warn(`⚠️ Event received for unsupported table: ${table.name}`);
        return false;
    }
  
    return true;
  }
  
}
