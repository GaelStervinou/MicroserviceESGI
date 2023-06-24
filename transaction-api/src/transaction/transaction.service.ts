import {Injectable, UseFilters} from '@nestjs/common';
import {PrismaService} from '../prisma.service';
import {Prisma, Transaction} from '@prisma/client';
import {PrismaClientExceptionFilter} from "./exception/prisma-exception.filter";
import {RpcException} from "@nestjs/microservices";

@Injectable()
export class TransactionService {
    constructor(private prisma: PrismaService) {
    }

    create(data: Prisma.TransactionCreateInput): any {
        throw new RpcException("test");
        return {
            transaction: [{
                id: 1,
                amount: 1,
                senderAccountLabel: "1",
                receiverAccountLabel: "1",
            }],
        }
        try {
            return this.prisma.transaction.create({data});

        } catch (e) {
            throw new PrismaClientExceptionFilter();
        }
    }

    findAll() {
        return this.prisma.transaction.findMany();
    }
}
