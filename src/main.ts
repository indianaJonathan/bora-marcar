import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { addSwagger } from './app/config/swagger/swagger.config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get<ConfigService>(ConfigService);
  const PORT = configService.get<number>('PORT');
  addSwagger(app);

  app.useGlobalPipes(new ValidationPipe());

  await app.listen(PORT, () => {
    console.warn(`Server running at port ${PORT}`);
  });
}
bootstrap();
