import { Injectable } from '@nestjs/common';
import FindAllTransactions from '../../application/use_cases/find-all-transactions.use-case';
import FindTransactionById from '../../application/use_cases/find-transaction-by-id.use-case';
import { SearchFilters, PaginatedResult } from '../../domain/interfaces/transaction-repository.interface';
import { ITransaction } from '../../domain/interfaces/transaction.interface';

@Injectable()
export class TransactionsService {
  constructor(
    private readonly findAllTransactions: FindAllTransactions,
    private readonly findTransactionById: FindTransactionById,
  ) {}

  async findAll(filters?: SearchFilters): Promise<PaginatedResult<ITransaction>> {
    return await this.findAllTransactions.run(filters);
  }

  async findById(id: string): Promise<ITransaction | null> {
    return await this.findTransactionById.run(id);
  }
}
