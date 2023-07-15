import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { authGrpcOptions } from 'src/grpcOption';
import { AuthService } from './auth.service';

@Module({
  imports: [
    ClientsModule.register([authGrpcOptions() as any],
    ),
  ],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
