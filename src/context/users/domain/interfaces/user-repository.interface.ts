import { AgentType, UserStatus } from '../class/User';
import { IUser } from './user.interface';

export interface SearchFilters {
  status?: UserStatus;
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

export interface IUserRepository {
  findAll(filters?: SearchFilters): Promise<PaginatedResult<IUser>>;
  findById(id: string): Promise<IUser | null>;
}
