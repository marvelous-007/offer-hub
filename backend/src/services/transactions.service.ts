import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Transaction } from "@/entities/transactions.entity";
import { CreateTransactionDto, UpdateTransactionDto } from "@/dtos/transactions.dto";

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionsRepository: Repository<Transaction>
  ) {}

  /**
   * Creates a new transaction
   * @param dto CreateTransactionDto
   * @returns Promise<Transaction>
   */
  async createTransaction(dto: CreateTransactionDto): Promise<Transaction> {
    const transaction = this.transactionsRepository.create(dto);
    return await this.transactionsRepository.save(transaction);
  }

  /**
   * Finds all transactions
   * @returns Promise<Transaction[]>
   */
  async getAllTransactions(): Promise<Transaction[]> {
    return await this.transactionsRepository.find();
  }

  /**
   * Finds a transaction by ID
   * @param transactionId UUID
   * @returns Promise<Transaction>
   */
  async getTransactionById(transactionId: string): Promise<Transaction> {
    const transaction = await this.transactionsRepository.findOne({
      where: { transactionId },
    });

    if (!transaction) {
      throw new NotFoundException("Transaction not found");
    }

    return transaction;
  }

  /**
   * Updates a transaction
   * @param transactionId UUID
   * @param dto UpdateTransactionDto
   * @returns Promise<Transaction>
   */
  async updateTransaction(
    transactionId: string,
    dto: UpdateTransactionDto
  ): Promise<Transaction> {
    const transaction = await this.getTransactionById(transactionId);
    const updatedTransaction = Object.assign(transaction, dto);
    return await this.transactionsRepository.save(updatedTransaction);
  }

  /**
   * Deletes a transaction by ID
   * @param transactionId UUID
   */
  async deleteTransaction(transactionId: string): Promise<void> {
    const transaction = await this.getTransactionById(transactionId);
    await this.transactionsRepository.remove(transaction);
  }
}
