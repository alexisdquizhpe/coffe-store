import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DomainExceptionFilter } from './shared/filters/domain-execption.filter';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const allowedOrigins = process.env.CORS_ORIGIN?.split(",") || [];
  const corsOptions = {
    origin: allowedOrigins.length > 0 ? allowedOrigins : true,
    credentials: true,
  };

  app.enableCors(corsOptions);
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.useGlobalFilters(new DomainExceptionFilter());


  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
