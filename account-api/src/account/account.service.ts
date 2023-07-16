import {Inject, Injectable, OnModuleInit} from '@nestjs/common';
import {PrismaService} from '../prisma.service';
import {Prisma, Account} from '@prisma/client';
import {PrismaClientExceptionFilter} from "./exception/prisma-exception.filter";
import {ClientGrpc} from '@nestjs/microservices';
import {TransactionServiceClient} from "../stubs/transaction/transaction";
import {TRANSACTION_V1ALPHA_PACKAGE_NAME} from "../stubs/transaction/transaction";
import {firstValueFrom} from "rxjs";

@Injectable()
export class AccountService implements OnModuleInit {

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
        userId: string;
    }): Promise<Account> {
        const {sender, receiver, amount, userId} = params;
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
                userId: userId,
            });
            firstValueFrom(transaction).then((value) => {
                console.log(value);
            });


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
