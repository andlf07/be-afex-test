import { SearchFilters } from '@context/transactions/domain/interfaces/transaction-repository.interface';
import { TransactionsService } from '@context/transactions/infrastructure/services/transactions.service';
import { Controller, Get, Param, Query } from '@nestjs/common';
import { AgentType, TransactionStatus } from '@context/transactions/domain/class/Transaction';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Get()
  async getTransactions(
    @Query('status') status?: TransactionStatus,
    @Query('agentType') agentType?: AgentType,
    @Query('country') country?: string,
    @Query('amount') amount?: string,
    @Query('name') name?: string,
    @Query('dateFrom') dateFrom?: string,
    @Query('dateTo') dateTo?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const filters: SearchFilters = {};

    if (status) filters.status = status;
    if (agentType) filters.agentType = agentType;
    if (country) filters.country = country;
    if (amount) filters.amount = parseFloat(amount);
    if (name) filters.name = name;
    if (dateFrom) filters.dateFrom = new Date(dateFrom);
    if (dateTo) filters.dateTo = new Date(dateTo);
    if (page) filters.page = parseInt(page, 10);
    if (limit) filters.limit = parseInt(limit, 10);

    return await this.transactionsService.findAll(Object.keys(filters).length > 0 ? filters : undefined);
  }

  @Get(':id')
  async getTransactionById(@Param('id') id: string) {
    return await this.transactionsService.findById(id);
  }
}
