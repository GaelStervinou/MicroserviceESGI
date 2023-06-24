import { Module } from '@nestjs/common';
import { TransactionModule } from './transaction/transaction.module';
import { APP_FILTER } from '@nestjs/core';
import { GrpcServerExceptionFilter } from 'nestjs-grpc-exceptions';
import {GrpcReflectionModule} from "nestjs-grpc-reflection";
import {grpcConfig} from "./grpc.config";
import {GrpcAuthGuard} from "./auth/auth.guard";
import {AuthService} from "./auth/auth.service";
import {AuthModule} from "./auth/auth.module";

@Module({
  imports: [
      GrpcReflectionModule.register(grpcConfig),
      AuthModule,
      TransactionModule,

  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: GrpcServerExceptionFilter,
    },
  ],
})
export class AppModule {}
