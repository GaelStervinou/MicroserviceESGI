import {Inject, Injectable, OnModuleInit, UseFilters} from '@nestjs/common';
import {PrismaService} from '../prisma.service';
import {Prisma, Account} from '@prisma/client';
import {PrismaClientExceptionFilter} from "./exception/prisma-exception.filter";
import {Client} from "@grpc/grpc-js";
import {Transport, ClientGrpc} from '@nestjs/microservices';
import {TransactionServiceClient} from "../stubs/transaction/transaction";
import {join} from "path";
import {TRANSACTION_V1ALPHA_PACKAGE_NAME} from "../stubs/transaction/transaction";

@Injectable()
export class AccountService implements OnModuleInit {

    /*
    @Client({
        transport: Transport.GRPC,
        options: {
            package: 'TransactionService',
            protoPath: join(__dirname, 'proto/transaction/transaction.proto')
        },
    })
    client: ClientGrpc;

    private heroesService: HeroesService;

    onModuleInit() {
        this.heroesService = this.client.getService<HeroesService>('HeroesService');
    }*/
    private transactionService: TransactionServiceClient;

    constructor(@Inject(TRANSACTION_V1ALPHA_PACKAGE_NAME) private client: ClientGrpc, private prisma: PrismaService) {
    }

    onModuleInit() {
        this.transactionService = this.client.getService<TransactionServiceClient>('TransactionService');
    }

    create(data: Prisma.AccountCreateInput): Promise<Account> {
        return this.prisma.account.create({data});
    }

    findAll() {
        return this.prisma.account.findMany();
    }

    findByLabel(data: Prisma.AccountWhereUniqueInput): Promise<Account> {
        return this.prisma.account.findUnique({
            where: data,
        });
    }

    delete(label: string): Promise<Account> {
        return this.prisma.account.delete({
            where: {label},
        });
    }

    async update(params: {
        label: string;
        data: Prisma.AccountUpdateInput;
    }): Promise<Account> {
        const {label, data} = params;
        let account;

        try {
            account = await this.prisma.account.update({
                where: {label},
                data: data,
            });
        } catch (e) {
            throw new PrismaClientExceptionFilter();
        }

        return account;
    }

    async countAccountByUser(userId: string) {
        return await this.prisma.account.aggregate({
            where: {
                userId: userId,
            },
            _count: {
                _all: true
            },
        });
    }

    async findAccountsByUser(userId: string) {
        return await this.prisma.account.findMany({
            where: {userId}
        });
    }

    async credit(params: {
        label: string;
        amount: number;
    }): Promise<Account> {
        const {label, amount} = params;
        let account;

        try {
            account = await this.prisma.account.update({
                where: {label},
                data: {
                    balance: {
                        increment: amount
                    }
                },
            });
        } catch (e) {
            throw new PrismaClientExceptionFilter();
        }

        return account;
    }

    async debit(params: {
        label: string;
        amount: number;
    }): Promise<Account> {
        const {label, amount} = params;
        let account;

        try {
            account = await this.prisma.account.update({
                where: {label},
                data: {
                    balance: {
                        decrement: amount
                    }
                },
            });
        } catch (e) {
            throw new PrismaClientExceptionFilter();
        }

        return account;
    }

    async sendMoney(params: {
        sender: string;
        receiver: string;
        amount: number;
    }): Promise<Account> {
        const {sender, receiver, amount} = params;
        let senderAccount;
        let receiverAccount;

        try {
            senderAccount = await this.prisma.account.update({
                where: {label: sender},
                data: {
                    balance: {
                        decrement: amount
                    }
                },
            });


            receiverAccount = await this.prisma.account.update({
                where: {label: receiver},
                data: {
                    balance: {
                        increment: amount
                    }
                },
            });

            const transaction = await this.transactionService.createTransaction({
                amount: amount,
                senderAccountLabel: sender,
                receiverAccountLabel: receiver,
            });

            console.log(transaction[0])

        } catch (e) {
            if (senderAccount) {
                await this.prisma.account.update({
                    where: {label: sender},
                    data: {
                        balance: {
                            increment: amount
                        }
                    },
                });
            }
            throw new PrismaClientExceptionFilter();
        }

        return senderAccount;
    }
}
