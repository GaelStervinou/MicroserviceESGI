import { Module } from '@nestjs/common';
import { AccountModule } from './account/account.module';
import { APP_FILTER } from '@nestjs/core';
import { GrpcServerExceptionFilter } from 'nestjs-grpc-exceptions';
import {GrpcReflectionModule} from "nestjs-grpc-reflection";
import {grpcConfig} from "./grpc.config";
import {AuthModule} from "./auth/auth.module";

@Module({
  imports: [
      GrpcReflectionModule.register(grpcConfig),
      AuthModule,
      AccountModule,

  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: GrpcServerExceptionFilter,
    },
  ],
})
export class AppModule {}
