import { GrpcOptions, Transport } from '@nestjs/microservices';
import {TRANSACTION_V1ALPHA_PACKAGE_NAME} from "./stubs/transaction/transaction";
import { join } from 'path';
import { addReflectionToGrpcConfig } from 'nestjs-grpc-reflection';

export const grpcConfig = addReflectionToGrpcConfig({
  transport: Transport.GRPC,
  options: {
    url: '0.0.0.0:6001',
    package: TRANSACTION_V1ALPHA_PACKAGE_NAME,
    loader: {
      includeDirs: [join(__dirname, './proto')]
    },
    protoPath: join(__dirname, 'proto/transaction/transaction.proto'),
  },
}) as GrpcOptions;
