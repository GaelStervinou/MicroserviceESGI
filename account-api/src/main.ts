import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions } from '@nestjs/microservices';
import { grpcConfig } from './grpc.config';
import { PrismaClientExceptionFilter } from './account/exception/prisma-exception.filter';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    grpcConfig,
  );
  app.useGlobalFilters(new PrismaClientExceptionFilter());

  await app.listen();
}
bootstrap();
