import { Inject, Injectable } from '@nestjs/common';
import { IUserRepository, SearchFilters, PaginatedResult } from '../../domain/interfaces/user-repository.interface';
import { IUser } from '../../domain/interfaces/user.interface';

@Injectable()
export default class FindAllUsers {
  private readonly repository: IUserRepository;

  constructor(
    @Inject('UserRepository')
    repository: IUserRepository,
  ) {
    this.repository = repository;
  }

  public async run(filters?: SearchFilters): Promise<PaginatedResult<IUser>> {
    return await this.repository.findAll(filters);
  }
}
