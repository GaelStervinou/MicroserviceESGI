import { GrpcOptions, Transport } from '@nestjs/microservices';
import {ACCOUNT_V1ALPHA_PACKAGE_NAME} from "./stubs/account/account";
import { join } from 'path';
import { addReflectionToGrpcConfig } from 'nestjs-grpc-reflection';

export const grpcConfig = addReflectionToGrpcConfig({
  transport: Transport.GRPC,
  options: {
    url: '0.0.0.0:6000',
    package: ACCOUNT_V1ALPHA_PACKAGE_NAME,
    loader: {
      includeDirs: [join(__dirname, './proto')]
    },
    protoPath: join(__dirname, 'proto/account/account.proto'),
  },
}) as GrpcOptions;
