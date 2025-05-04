import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ServicesController } from "./controller";
import { ServicesService } from "./service";
import { Service } from "./entity";
import { WebhooksModule } from "../webhooks/module";
import { SearchModule } from "../search/search.module";
import { NotificationsModule } from "../notifications/module";

@Module({
  imports: [
    TypeOrmModule.forFeature([Service]),
    WebhooksModule,
    SearchModule,
    NotificationsModule,
  ],
  controllers: [ServicesController],
  providers: [ServicesService],
  exports: [ServicesService],
})
export class ServicesModule {}
