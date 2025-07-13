import { AgentType, TransactionStatus } from '../class/Transaction';
import { ITransaction } from './transaction.interface';

export interface SearchFilters {
  status?: TransactionStatus;
  agentType?: AgentType;
  country?: string;
  amount?: number;
  name?: string;
  dateFrom?: Date;
  dateTo?: Date;
  page?: number;
  limit?: number;
}

export interface PaginationMeta {
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface PaginatedResult<T> {
  data: T[];
  meta: PaginationMeta;
}

export interface ITransactionRepository {
  findAll(filters?: SearchFilters): Promise<PaginatedResult<ITransaction>>;
  findById(id: string): Promise<ITransaction | null>;
}
