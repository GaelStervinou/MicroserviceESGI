import {Controller, UseFilters, UseGuards} from '@nestjs/common';
import {RpcException} from '@nestjs/microservices';
import {GrpcAuthGuard} from 'src/auth/auth.guard';
import {
    AccountResponse,
    CreateAccountRequest,
    UpdateAccountRequest,
    GetAccountRequest,
    EmptyRequest,
    DeleteAccountRequest,
    GetAccountsByUserRequest,
    CreditAccountRequest,
    DebitAccountRequest,
    SendMoneyRequest,
    SendMoneyResponse,
    Account, AccountServiceControllerMethods, AccountServiceController
} from '../stubs/account/account'
import {AccountService} from './account.service';
import {ExceptionFilter} from './rpc-exception.filter';
import {Metadata} from "@grpc/grpc-js";
import {UserRole} from "../stubs/user/v1alpha/message";
import {Roles} from "../auth/role.decorator";

@Controller()
@AccountServiceControllerMethods()
@UseFilters(ExceptionFilter)
export class AccountController implements AccountServiceController {
    constructor(private readonly accountService: AccountService) {
    }

    async findAccountByLabel(request: GetAccountRequest): Promise<AccountResponse> {
        let account: Account;

        account = await this.accountService.findByLabel({label: request.label});
        return {account: [account]};
    }

    @UseGuards(GrpcAuthGuard)
    async createAccount(req: CreateAccountRequest, metadata?: Metadata): Promise<AccountResponse> {
        const userId = metadata['user'].id;
        const countExistingAccountsForUser = await this.accountService.countAccountByUser(userId);
        if (countExistingAccountsForUser['_count']['_all'] === 5) {
            throw new RpcException({
                statusCode: 409,
                message: 'You can\'t have more than 5 accounts',
            });
        }
        const existingLabel = await this.accountService.findByLabel({label: req.label});
        if (existingLabel) {
            throw new RpcException({
                statusCode: 409,
                message: 'Account already exists',
            });
        }
        return {
            account: [
                await this.accountService
                    .create({
                        label: req.label,
                        userId: userId,
                        balance: 0
                    })
                    .then((account) => {
                        return account;
                    }),
            ],
        };
    }

    @UseGuards(GrpcAuthGuard)
    async deleteAccount(request: DeleteAccountRequest, metadata?: Metadata): Promise<EmptyRequest> {
        const accountToDelete = await this.accountService.findByLabel({label: request.accountToDeleteLabel});
        if (accountToDelete === null) {
            throw new RpcException({
                statusCode: 404,
                message: 'Account not found',
            });
        }
        if (accountToDelete.userId !== metadata['user'].id && metadata['user'].role !== UserRole.USER_ROLE_ADMIN) {
            throw new RpcException({
                statusCode: 403,
                message: 'You can\'t delete this account',
            });
        }

        const accountToTransferFunds = await this.accountService.findByLabel({label: request.accountToTransferFundsLabel});
        if (accountToTransferFunds === null) {
            throw new RpcException({
                statusCode: 404,
                message: 'Account to transfer funds not found',
            });
        }

        try {
            if (accountToDelete.balance > 0) {
                await this.sendMoney({
                    fromAccountLabel: accountToDelete.label,
                    toAccountLabel: request.accountToTransferFundsLabel,
                    amount: accountToDelete.balance
                });

            }
            await this.accountService.delete(accountToDelete.label);

            return {};
        } catch (e) {
            console.log(e)
            throw new RpcException({
                statusCode: 500,
                message: 'Error while deleting account',
            });
        }
    }

    @UseGuards(GrpcAuthGuard)
    async findAllAccounts(request: EmptyRequest, metadata?: Metadata): Promise<AccountResponse> {
        let accounts: Account[] = [];
        try {
            accounts = await this.accountService.findAll();
        } catch (error) {
            console.log(error, accounts);
        }
        return {
            account: accounts
        }
    }

    updateAccount(request: UpdateAccountRequest, metadata?: Metadata): Promise<AccountResponse> {
        return undefined;
    }

    @UseGuards(GrpcAuthGuard)
    async getAllCurrentUserAccounts(request: EmptyRequest, metadata?: Metadata): Promise<AccountResponse> {
        return {
            account: await this.accountService.findAccountsByUser(metadata['user'].id)
        };
    }

    @UseGuards(GrpcAuthGuard)
    @Roles(UserRole.USER_ROLE_ADMIN)
    async getAllUserAccountsById(request: GetAccountsByUserRequest, metadata?: Metadata): Promise<AccountResponse> {
        return {
            account: await this.accountService.findAccountsByUser(request.userId)
        };
    }

    @UseGuards(GrpcAuthGuard)
    async creditAccount(request: CreditAccountRequest, metadata?: Metadata): Promise<AccountResponse> {
        const accountToCredit = await this.accountService.findByLabel({label: request.accountLabel});
        if (accountToCredit === null) {
            throw new RpcException({
                statusCode: 404,
                message: 'Account not found',
            });
        }
        if (accountToCredit.userId !== metadata['user'].id && metadata['user'].role !== UserRole.USER_ROLE_ADMIN) {
            throw new RpcException({
                statusCode: 403,
                message: 'You can\'t credit this account',
            });
        }

        return {
            account: [await this.accountService.credit({label: accountToCredit.label, amount: Number(request.amount)})]
        }
    }

    @UseGuards(GrpcAuthGuard)
    async debitAccount(request: DebitAccountRequest, metadata?: Metadata): Promise<AccountResponse> {
        const accountToDebit = await this.accountService.findByLabel({label: request.accountLabel});
        if (accountToDebit === null) {
            throw new RpcException({
                statusCode: 404,
                message: 'Account not found',
            });
        }
        if (accountToDebit.userId !== metadata['user'].id && metadata['user'].role !== UserRole.USER_ROLE_ADMIN) {
            throw new RpcException({
                statusCode: 403,
                message: 'You can\'t credit this account',
            });
        }

        return {
            account: [await this.accountService.debit({label: accountToDebit.label, amount: Number(request.amount)})]
        }
    }

    async sendMoney(request: SendMoneyRequest, metadata?: Metadata): Promise<SendMoneyResponse> {
        // @ts-ignore
        try {
            await this.accountService.sendMoney({
                sender: request.fromAccountLabel,
                receiver: request.toAccountLabel,
                amount: request.amount
            });
            return {
                fromAccount: await this.accountService.findByLabel({label: request.fromAccountLabel}),
                toAccount: await this.accountService.findByLabel({label: request.toAccountLabel}),
                amount: request.amount
            }
        } catch (e) {
            console.log(e);
            return;
        }
    }
}
