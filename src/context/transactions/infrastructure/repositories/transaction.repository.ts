import { AgentType, TransactionStatus } from '../../domain/class/Transaction';
import { DATASET } from '../../domain/data/dataset';
import { ITransactionRepository, SearchFilters, PaginatedResult, PaginationMeta } from '../../domain/interfaces/transaction-repository.interface';
import { ITransaction } from '../../domain/interfaces/transaction.interface';

export class TransactionRepository implements ITransactionRepository {
  private transactions: ITransaction[] = DATASET;

  async findAll(filters?: SearchFilters): Promise<PaginatedResult<ITransaction>> {
    let filteredTransactions = [...this.transactions];

    if (filters) {
      if (filters.status) {
        filteredTransactions = filteredTransactions.filter(transaction => transaction.status === filters.status);
      }

      if (filters.agentType) {
        filteredTransactions = filteredTransactions.filter(transaction => transaction.agentType === filters.agentType);
      }

      if (filters.country) {
        filteredTransactions = filteredTransactions.filter(transaction => 
          transaction.country.toLowerCase().includes(filters.country!.toLowerCase())
        );
      }

      if (filters.amount !== undefined) {
        filteredTransactions = filteredTransactions.filter(transaction => transaction.amount === filters.amount);
      }

      if (filters.name) {
        filteredTransactions = filteredTransactions.filter(transaction => 
          transaction.name.toLowerCase().includes(filters.name!.toLowerCase())
        );
      }

      if (filters.dateFrom) {
        filteredTransactions = filteredTransactions.filter(transaction => {
          const transactionDate = new Date(transaction.data);
          return transactionDate >= filters.dateFrom!;
        });
      }

      if (filters.dateTo) {
        filteredTransactions = filteredTransactions.filter(transaction => {
          const transactionDate = new Date(transaction.data);
          return transactionDate <= filters.dateTo!;
        });
      }
    }

    const page = filters?.page || 1;
    const limit = filters?.limit || 10;
    const totalItems = filteredTransactions.length;
    const totalPages = Math.ceil(totalItems / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    const paginatedData = filteredTransactions.slice(startIndex, endIndex);

    const meta: PaginationMeta = {
      currentPage: page,
      itemsPerPage: limit,
      totalItems,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    };

    return Promise.resolve({
      data: paginatedData,
      meta,
    });
  }

  async findById(id: string): Promise<ITransaction | null> {
    const transaction = this.transactions.find((transaction) => transaction.id === id);
    return Promise.resolve(transaction || null);
  }
}
