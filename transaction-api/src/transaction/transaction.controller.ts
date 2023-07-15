import {Controller, UseFilters, UseGuards} from '@nestjs/common';
import {RpcException} from '@nestjs/microservices';
import {GrpcAuthGuard} from 'src/auth/auth.guard';
import { status } from '@grpc/grpc-js';
import {
    CreateTransactionRequest,
    GetTransactionsByAccount, GetTransactionsByUserRequest,
    TransactionEmptyRequest,
    TransactionResponse,
    TransactionServiceController,
    TransactionServiceControllerMethods,
} from "../stubs/transaction/transaction";
import {TransactionService} from './transaction.service';
import {ExceptionFilter} from './rpc-exception.filter';
import {Metadata} from "@grpc/grpc-js";
import {UserRole} from "../stubs/user/v1alpha/message";
import {Roles} from "../auth/role.decorator";

@Controller()
@TransactionServiceControllerMethods()
@UseFilters(ExceptionFilter)
export class TransactionController implements TransactionServiceController {
    constructor(private readonly transactionService: TransactionService) {
    }

    async createTransaction(request: CreateTransactionRequest, metadata?: Metadata): Promise<TransactionResponse> {
        return {
            transaction: [
                await this.transactionService.create({
                    amount: request.amount,
                    senderAccountLabel: request.senderAccountLabel,
                    receiverAccountLabel: request.receiverAccountLabel,
                    userId: request.userId,
                }).then((transaction) => {
                    return transaction;
                }),
            ]
        }
    }

    @UseGuards(GrpcAuthGuard)
    async findAccountTransaction(request: GetTransactionsByAccount, metadata?: Metadata): Promise<TransactionResponse> {
        if (!request.accountLabel) {
            throw new RpcException({
                code: status.INVALID_ARGUMENT,
                message: 'accountLabel is required',
            });
        }

        return {
            transaction: await this.transactionService.findByAccountLabel(request.accountLabel, metadata),
        }
    }

    @UseGuards(GrpcAuthGuard)
    async findAllCurrentUserTransactions(request: TransactionEmptyRequest, metadata?: Metadata): Promise<TransactionResponse> {
        return {
            transaction: await this.transactionService.findByUserId(metadata['user'].id),
        }
    }

    @UseGuards(GrpcAuthGuard)
    @Roles(UserRole.USER_ROLE_ADMIN)
    async findAllTransactions(request: TransactionEmptyRequest, metadata?: Metadata): Promise<TransactionResponse> {
        return {
            transaction: await this.transactionService.findAll(),
        }
    }

    @UseGuards(GrpcAuthGuard)
    @Roles(UserRole.USER_ROLE_ADMIN)
    async findUserTransactions(request: GetTransactionsByUserRequest, metadata?: Metadata): Promise<TransactionResponse> {
        if (!request.userId) {
            throw new RpcException({
                code: status.INVALID_ARGUMENT,
                message: 'userId is required',
            });
        }
        return {
            transaction: await this.transactionService.findByUserId(request.userId),
        }
    }

}
