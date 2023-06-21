import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientsModule } from '@nestjs/microservices';
import { authGrpcOptions } from 'src/grpcOption';
import { AuthService } from './auth.service';
import {AUTH_SERVICE_NAME} from "../stubs/auth/v1alpha/service";

@Module({
  imports: [
    ClientsModule.register([authGrpcOptions() as any],
    ),
  ],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
