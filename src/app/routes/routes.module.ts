import { Module } from '@nestjs/common';
import { TransactionsModule } from '@context/transactions/infrastructure/modules/transactions.module';
import { TransactionsController } from '../controllers/transactions/transactions.controller';

@Module({
  imports: [TransactionsModule],
  controllers: [TransactionsController],
  providers: [],
})
export class RoutesModule {}
