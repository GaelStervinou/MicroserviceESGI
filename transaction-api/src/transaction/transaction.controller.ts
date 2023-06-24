import {Controller, UseFilters, UseGuards} from '@nestjs/common';
import {RpcException} from '@nestjs/microservices';
import {GrpcAuthGuard} from 'src/auth/auth.guard';
import {
    CreateTransactionRequest, GetTransactionsByAccount, TransactionEmptyRequest, TransactionResponse,
    TransactionServiceController,
    TransactionServiceControllerMethods,
} from "../stubs/transaction/transaction";
import {TransactionService} from './transaction.service';
import {ExceptionFilter} from './rpc-exception.filter';
import {Metadata} from "@grpc/grpc-js";
import {AccountResponse, UpdateAccountRequest} from "../stubs/account/account";

@Controller()
@TransactionServiceControllerMethods()
@UseFilters(ExceptionFilter)
export class TransactionController implements TransactionServiceController {
    constructor(private readonly transactionService: TransactionService) {
    }

    updateAccount(request: UpdateAccountRequest, metadata?: Metadata): Promise<AccountResponse> {
        return undefined;
    }

    async createTransaction(request: CreateTransactionRequest, metadata?: Metadata): Promise<TransactionResponse> {
        throw new RpcException("test");
        return {
            transaction: [
                await this.transactionService.create({
                    amount: request.amount,
                    senderAccountLabel: request.senderAccountLabel,
                    receiverAccountLabel: request.receiverAccountLabel,
                }).then((transaction) =>
                {
                    return transaction;
                }),
            ]
        }
    }

    findAccountTransaction(request: GetTransactionsByAccount, metadata?: Metadata): Promise<TransactionResponse> {
        return undefined;
    }

    findAllCurrentUserTransactions(request: TransactionEmptyRequest, metadata?: Metadata): Promise<TransactionResponse> {
        return undefined;
    }

    async findAllTransactions(request: TransactionEmptyRequest, metadata?: Metadata): Promise<TransactionResponse> {
        return {
            transaction: await this.transactionService.findAll(),
        }
    }

    findUserTransactions(request: TransactionEmptyRequest, metadata?: Metadata): Promise<TransactionResponse> {
        return undefined;
    }
}
