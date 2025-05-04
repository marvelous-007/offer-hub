import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsersController } from "./controller";
import { UsersService } from "./service";
import { User } from "./entity";
import { SearchModule } from "../search/search.module";

@Module({
  imports: [TypeOrmModule.forFeature([User]), SearchModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
