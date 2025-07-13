import { Module } from '@nestjs/common';
import { RoutesModule } from '@app/routes/routes.module';

@Module({
  imports: [RoutesModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
