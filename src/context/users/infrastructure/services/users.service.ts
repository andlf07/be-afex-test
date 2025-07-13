import { Injectable } from '@nestjs/common';
import FindAllUsers from '../../application/use_cases/find-all-users.use-case';
import FindUserById from '../../application/use_cases/find-user-by-id.use-case';
import { SearchFilters, PaginatedResult } from '../../domain/interfaces/user-repository.interface';
import { IUser } from '../../domain/interfaces/user.interface';

@Injectable()
export class UsersService {
  constructor(
    private readonly findAllUsers: FindAllUsers,
    private readonly findUserById: FindUserById,
  ) {}

  /**
   * Find all users
   * @param filters - Search filters
   * @returns Promise<PaginatedResult<IUser>>
   */
  async findAll(filters?: SearchFilters): Promise<PaginatedResult<IUser>> {
    return await this.findAllUsers.run(filters);
  }

  /**
   * Find user by id
   * @param id - User id
   * @returns Promise<IUser | null>
   */
  async findById(id: string): Promise<IUser | null> {
    return await this.findUserById.run(id);
  }
}
