import FindAllTransactions from '@context/transactions/application/use_cases/find-all-transactions.use-case';
import FindTransactionById from '@context/transactions/application/use_cases/find-transaction-by-id.use-case';
import { Module } from '@nestjs/common';
import { TransactionRepository } from '../repositories/transaction.repository';
import { TransactionsService } from '../services/transactions.service';

@Module({
  providers: [
    { provide: 'TransactionRepository', useClass: TransactionRepository },
    FindAllTransactions,
    FindTransactionById,
    TransactionsService,
  ],
  exports: [TransactionsService],
})
export class TransactionsModule {}
