import { Controller, UseFilters, UseGuards } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { GrpcAuthGuard } from 'src/auth/auth.guard';
import {
  AccountResponse,
  CreateAccountRequest,
  UpdateAccountRequest,
  GetAccountRequest,
  EmptyRequest,
  DeleteAccountRequest,
  GetAccountByUserRequest,
  Account, AccountServiceControllerMethods, AccountServiceController
} from '../stubs/account/account'
import { AccountService } from './account.service';
import { ExceptionFilter } from './rpc-exception.filter';
import {Metadata} from "@grpc/grpc-js";

@Controller()
@AccountServiceControllerMethods()
@UseFilters(ExceptionFilter)
export class AccountController implements AccountServiceController{
  constructor(private readonly accountService: AccountService) {}
  async findAccountByLabel(request: GetAccountRequest): Promise<AccountResponse> {
    let account: Account;

    account = await this.accountService.findByLabel({label: request.label});
    return { account: [account] };
  }

  async createAccount(req: CreateAccountRequest): Promise<AccountResponse> {
    const countExistingAccountsForUser = await this.accountService.countAccountByUser(req.userId);
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
            userId: req.userId,
            balance: 0
          })
          .then((account) => {
            return account;
          }),
      ],
    };
  }
  /*async deleteAccount(request: DeleteAccountRequest): Promise<HeroResponse> {
    //TODO créer ici une transaction
    return {
      hero: [
        await this.accountService.delete(request.id).then((hero) => {
          return hero;
        }),
      ],
    };
  }*/
  @UseGuards(GrpcAuthGuard)
  async getAllUserAccount(request: GetAccountByUserRequest, metadata: Metadata): Promise<AccountResponse> {
    return {
      account: await this.accountService.findAccountsByUser(request.userId)
    };
  }

  deleteAccount(request: DeleteAccountRequest, metadata?: Metadata): Promise<AccountResponse>  {
    return undefined;
  }

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
}
