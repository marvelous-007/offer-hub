import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { NotificationsController } from "./controller";
import { NotificationsService } from "./service";
import { Notification } from "./entity";
import { User } from "../users/entity";
import { NotificationsGateway } from "./notification.gateway";
import { BullModule } from "@nestjs/bull";
import { NotificationsProcessor } from "./notifications.processor";

@Module({
  imports: [
    BullModule.registerQueue({
      name: "notifications",
    }),
    TypeOrmModule.forFeature([Notification, User]),
  ],
  controllers: [NotificationsController],
  providers: [
    NotificationsService,
    NotificationsGateway,
    NotificationsProcessor,
  ],
  exports: [NotificationsService, NotificationsGateway, NotificationsProcessor],
})
export class NotificationsModule {}
