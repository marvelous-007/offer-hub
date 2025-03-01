import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateTransactionDto, UpdateTransactionDto } from "./dto";
import { Transaction } from "./entity";
import { User } from "../users/entity";
import { Project } from "../projects/entity";

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction) private readonly repo: Repository<Transaction>,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(Project) private readonly projectRepo: Repository<Project>
  ) {}

  async findAll(): Promise<Transaction[]> {
    return this.repo.find({ relations: ["fromUser", "toUser", "project"] });
  }

  async create(dto: CreateTransactionDto): Promise<Transaction> {
    const fromUser = await this.userRepo.findOne({ where: { user_id: dto.from_user_id } });
    if (!fromUser) throw new NotFoundException(`User with ID ${dto.from_user_id} not found.`);

    const toUser = await this.userRepo.findOne({ where: { user_id: dto.to_user_id } });
    if (!toUser) throw new NotFoundException(`User with ID ${dto.to_user_id} not found.`);

    const project = await this.projectRepo.findOne({ where: { project_id: dto.project_id } });
    if (!project) throw new NotFoundException(`Project with ID ${dto.project_id} not found.`);

    const transaction = this.repo.create({ ...dto, fromUser, toUser, project });
    return this.repo.save(transaction);
  }

  async findById(transaction_id: string): Promise<Transaction> {
    const transaction = await this.repo.findOne({ where: { transaction_id }, relations: ["fromUser", "toUser", "project"] });
    if (!transaction) throw new NotFoundException(`Transaction with ID ${transaction_id} not found.`);
    return transaction;
  }

  async update(transaction_id: string, dto: UpdateTransactionDto): Promise<Transaction> {
    const transaction = await this.findById(transaction_id);
    Object.assign(transaction, dto);
    return this.repo.save(transaction);
  }

  async delete(transaction_id: string): Promise<void> {
    const result = await this.repo.delete(transaction_id);
    if (result.affected === 0) throw new NotFoundException(`Transaction with ID ${transaction_id} not found.`);
  }
}
