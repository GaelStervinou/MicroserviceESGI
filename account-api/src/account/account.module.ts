import {Module} from '@nestjs/common';
import {AccountController} from './account.controller';
import {AccountService} from './account.service';
import {PrismaService} from '../prisma.service';
import {GrpcReflectionModule} from 'nestjs-grpc-reflection';
import {grpcConfig} from '../grpc.config';
import {AuthModule} from "../auth/auth.module";
import {ClientsModule, Transport} from "@nestjs/microservices";
import {join} from "path";
import {TRANSACTION_V1ALPHA_PACKAGE_NAME} from "../stubs/transaction/transaction";

@Module({
    imports: [
        GrpcReflectionModule.register(grpcConfig),
        AuthModule,

        ClientsModule.register([
            {
                name: TRANSACTION_V1ALPHA_PACKAGE_NAME,
                transport: Transport.GRPC,
                options: {
                    package: 'transaction.v1alpha',
                    protoPath: join(__dirname, '../proto/transaction/transaction.proto'),
                },
            },
        ]),
    ],
    controllers: [AccountController],
    providers: [AccountService, PrismaService],
})
export class AccountModule {}
