import { Process, Processor } from "@nestjs/bull";
import { Job } from "bull";
import { NotificationsGateway } from "./notification.gateway";

@Processor("notifications")
export class NotificationsProcessor {
  constructor(private readonly gateway: NotificationsGateway) {}

  @Process("send")
  async handleNotification(job: Job) {
    const { user_id, message } = job.data;
    console.log("Sending notification to:", user_id);
    this.gateway.notify_user(user_id, message);
  }
}
