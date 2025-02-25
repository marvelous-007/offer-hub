import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ActivityLogs } from "./entities/activity-logs.entity";
import { ActivityLogsController } from "./controllers";
import { ActivityLogsService } from "./services";

@Module({
    imports: [ TypeOrmModule.forFeature([ ActivityLogs ])],
    controllers: [ ActivityLogsController ],
    providers: [ ActivityLogsService ]
})
export class ActivityLogsModule {}