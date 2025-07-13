import FindAllUsers from '@context/users/application/use_cases/find-all-users.use-case';
import FindUserById from '@context/users/application/use_cases/find-user-by-id.use-case';
import { Module } from '@nestjs/common';
import { UserRepository } from '../repositories/user.repository';
import { UsersService } from '../services/users.service';

@Module({
  providers: [
    { provide: 'UserRepository', useClass: UserRepository },
    FindAllUsers,
    FindUserById,
    UsersService,
  ],
  exports: [UsersService],
})
export class UsersModule {}
