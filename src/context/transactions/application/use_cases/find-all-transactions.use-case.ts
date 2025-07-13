import { Inject, Injectable } from '@nestjs/common';
import { ITransactionRepository, SearchFilters, PaginatedResult } from '../../domain/interfaces/transaction-repository.interface';
import { ITransaction } from '../../domain/interfaces/transaction.interface';

@Injectable()
export default class FindAllTransactions {
  private readonly repository: ITransactionRepository;

  constructor(
    @Inject('TransactionRepository')
    repository: ITransactionRepository,
  ) {
    this.repository = repository;
  }

  public async run(filters?: SearchFilters): Promise<PaginatedResult<ITransaction>> {
    return await this.repository.findAll(filters);
  }
}
