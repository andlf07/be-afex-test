import { Inject, Injectable } from '@nestjs/common';
import { ITransactionRepository } from '../../domain/interfaces/transaction-repository.interface';
import { ITransaction } from '../../domain/interfaces/transaction.interface';

@Injectable()
export default class FindTransactionById {
  private readonly repository: ITransactionRepository;

  constructor(
    @Inject('TransactionRepository')
    repository: ITransactionRepository,
  ) {
    this.repository = repository;
  }

  public async run(id: string): Promise<ITransaction | null> {
    if (!id || id.trim() === '') {
      throw new Error('Transaction ID is required');
    }

    return await this.repository.findById(id);
  }
}
