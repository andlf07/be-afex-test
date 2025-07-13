import { AgentType, UserStatus } from '../../domain/class/User';
import { DATASET } from '../../domain/data/dataset';
import { IUserRepository, SearchFilters, PaginatedResult, PaginationMeta } from '../../domain/interfaces/user-repository.interface';
import { IUser } from '../../domain/interfaces/user.interface';

export class UserRepository implements IUserRepository {
  private users: IUser[] = DATASET;

  async findAll(filters?: SearchFilters): Promise<PaginatedResult<IUser>> {
    let filteredUsers = [...this.users];

    if (filters) {
      if (filters.status) {
        filteredUsers = filteredUsers.filter(user => user.status === filters.status);
      }

      if (filters.agentType) {
        filteredUsers = filteredUsers.filter(user => user.agentType === filters.agentType);
      }

      if (filters.country) {
        filteredUsers = filteredUsers.filter(user => 
          user.country.toLowerCase().includes(filters.country!.toLowerCase())
        );
      }

      if (filters.amount !== undefined) {
        filteredUsers = filteredUsers.filter(user => user.amount === filters.amount);
      }

      if (filters.name) {
        filteredUsers = filteredUsers.filter(user => 
          user.name.toLowerCase().includes(filters.name!.toLowerCase())
        );
      }

      if (filters.dateFrom) {
        filteredUsers = filteredUsers.filter(user => {
          const userDate = new Date(user.data);
          return userDate >= filters.dateFrom!;
        });
      }

      if (filters.dateTo) {
        filteredUsers = filteredUsers.filter(user => {
          const userDate = new Date(user.data);
          return userDate <= filters.dateTo!;
        });
      }
    }

    const page = filters?.page || 1;
    const limit = filters?.limit || 10;
    const totalItems = filteredUsers.length;
    const totalPages = Math.ceil(totalItems / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    const paginatedData = filteredUsers.slice(startIndex, endIndex);

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

  async findById(id: string): Promise<IUser | null> {
    const user = this.users.find((user) => user.id === id);
    return Promise.resolve(user || null);
  }
}
