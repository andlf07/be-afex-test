import { Inject, Injectable } from '@nestjs/common';
import { IUserRepository } from '../../domain/interfaces/user-repository.interface';
import { IUser } from '../../domain/interfaces/user.interface';

@Injectable()
export default class FindUserById {
  private readonly repository: IUserRepository;

  constructor(
    @Inject('UserRepository')
    repository: IUserRepository,
  ) {
    this.repository = repository;
  }

  /**
   * Execute the use case to find a user by ID
   * @param id - The user ID to search for
   * @returns Promise<IUser | null>
   * @description Find a specific user by their unique identifier
   */
  public async run(id: string): Promise<IUser | null> {
    if (!id || id.trim() === '') {
      throw new Error('User ID is required');
    }

    return await this.repository.findById(id);
  }
}
