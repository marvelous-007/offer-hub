import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TransactionsController } from "./controller";
import { TransactionsService } from "./service";
import { Transaction } from "./entity";
import { User } from "../users/entity";
import { Project } from "../projects/entity";

@Module({
  imports: [TypeOrmModule.forFeature([Transaction, User, Project])],
  controllers: [TransactionsController],
  providers: [TransactionsService],
  exports: [TransactionsService],
})
export class TransactionsModule {}
