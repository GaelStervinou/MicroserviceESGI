import { Module } from '@nestjs/common';
import { AccountController } from './account.controller';
import { AccountService } from './account.service';
import { PrismaService } from '../prisma.service';
import { GrpcReflectionModule } from 'nestjs-grpc-reflection';
import { grpcConfig } from '../grpc.config';
import {AuthModule} from "../auth/auth.module";

@Module({
  imports: [GrpcReflectionModule.register(grpcConfig), AuthModule],
  controllers: [AccountController],
  providers: [AccountService, PrismaService],
})
export class AccountModule {}
