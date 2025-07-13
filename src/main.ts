import { NestFactory } from '@nestjs/core';
import { AppModule } from './context/shared/infrastructure/modules/app.modules';
import { config } from './context/shared/utils/config';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();
  app.setGlobalPrefix('api');

  await app.listen(config.port);
}
bootstrap();
