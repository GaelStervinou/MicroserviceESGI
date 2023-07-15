import {Inject, Injectable, OnModuleInit} from '@nestjs/common';
import {PrismaService} from '../prisma.service';
import {Prisma, Transaction} from '@prisma/client';
import {PrismaClientExceptionFilter} from "./exception/prisma-exception.filter";
import {ClientGrpc, RpcException} from "@nestjs/microservices";
import {ACCOUNT_V1ALPHA_PACKAGE_NAME, AccountServiceClient} from "../stubs/account/account";
import {firstValueFrom} from "rxjs";
import {UserRole} from "../stubs/user/v1alpha/message";
import { status } from '@grpc/grpc-js';

@Injectable()
export class TransactionService implements OnModuleInit {
    private accountServiceClient: AccountServiceClient;

    constructor(@Inject(ACCOUNT_V1ALPHA_PACKAGE_NAME) private client: ClientGrpc, private prisma: PrismaService) {
    }

    onModuleInit() {
        this.accountServiceClient = this.client.getService<AccountServiceClient>('AccountService');
    }

    create(data: Prisma.TransactionCreateInput): any {
        try {
            return this.prisma.transaction.create({data});

        } catch (e) {
            throw new PrismaClientExceptionFilter();
        }
    }

    findAll() {
        return this.prisma.transaction.findMany();
    }

    async findByAccountLabel(label: string, metadata): Promise<Transaction[]> {
        if (
            metadata['user'].role !== UserRole.USER_ROLE_ADMIN ||
            await this.checkUserAccess(label, metadata) === false
        ) {
            throw new RpcException({
                statusCode: status.PERMISSION_DENIED,
                message: 'Permission denied',
            });
        }
        return this.prisma.transaction.findMany({
            where: {
                OR: [
                    {senderAccountLabel: label},
                    {receiverAccountLabel: label},
                ],
            },
        });
    }

    async checkUserAccess(accountLabel: string, metadata): Promise<boolean> {
        const accounts = await this.accountServiceClient.getAllUserAccountsById(
            {userId: metadata['user'].id}, metadata
        );
        return firstValueFrom(accounts).then((accounts) => {
            return !(accounts.account.find(account => account.label === accountLabel) === undefined);
        });
    }

    async findByUserId(userId: string): Promise<Transaction[]> {
        return this.prisma.transaction.findMany({
            where: {
                userId: userId,
            }
        })
    }
}
