import { Module } from '@nestjs/common';
import { UsersModule } from '@context/users/infrastructure/modules/users.module';
import { UsersController } from '../controllers/users/users.controller';

@Module({
  imports: [UsersModule],
  controllers: [UsersController],
  providers: [],
})
export class RoutesModule {}
