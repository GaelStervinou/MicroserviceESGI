import {Module} from '@nestjs/common';
import {TransactionController} from './transaction.controller';
import {TransactionService} from './transaction.service';
import {PrismaService} from '../prisma.service';
import {GrpcReflectionModule} from 'nestjs-grpc-reflection';
import {grpcConfig} from '../grpc.config';
import {AuthModule} from "../auth/auth.module";
import {join} from "path";
import {ClientsModule, Transport} from "@nestjs/microservices";
import {ACCOUNT_V1ALPHA_PACKAGE_NAME} from "../stubs/account/account";

@Module({
    imports: [
        GrpcReflectionModule.register(grpcConfig),
        AuthModule,
        ClientsModule.register([
            {
                name: ACCOUNT_V1ALPHA_PACKAGE_NAME,
                transport: Transport.GRPC,
                options: {
                    url: '0.0.0.0:6000',
                    package: 'account.v1alpha',
                    protoPath: join(__dirname, '../proto/account/account.proto'),
                },
            },
        ]),
    ],
    controllers: [TransactionController],
    providers: [TransactionService, PrismaService],
})
export class TransactionModule {
}
