/* eslint-disable */
import { Metadata } from "@grpc/grpc-js";
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { Observable } from "rxjs";

export const protobufPackage = "account.v1alpha";

export interface EmptyRequest {
}

export interface Account {
  label?: string;
  balance?: number;
  userId?: string;
}

export interface CreateAccountRequest {
  label?: string;
  userId?: string;
}

export interface GetAccountRequest {
  label?: string;
}

export interface DeleteAccountRequest {
  accountToDeleteLabel?: string;
  accountToTransferFundsLabel?: string;
}

export interface UpdateAccountRequest {
  account?: Account;
}

export interface CreditAccountRequest {
  accountLabel?: string;
  amount?: number;
}

export interface DebitAccountRequest {
  accountLabel?: string;
  amount?: number;
}

export interface GetAccountsByUserRequest {
  userId?: string;
}

export interface AccountResponse {
  account?: Account[];
}

export interface SendMoneyRequest {
  fromAccountLabel?: string;
  toAccountLabel?: string;
  amount?: number;
}

export interface SendMoneyResponse {
  fromAccount?: Account;
  toAccount?: Account;
  amount?: number;
  userId?: string;
}

export const ACCOUNT_V1ALPHA_PACKAGE_NAME = "account.v1alpha";

export interface AccountServiceClient {
  createAccount(request: CreateAccountRequest, metadata?: Metadata): Observable<AccountResponse>;

  updateAccount(request: UpdateAccountRequest, metadata?: Metadata): Observable<AccountResponse>;

  findAccountByLabel(request: GetAccountRequest, metadata?: Metadata): Observable<AccountResponse>;

  findAllAccounts(request: EmptyRequest, metadata?: Metadata): Observable<AccountResponse>;

  deleteAccount(request: DeleteAccountRequest, metadata?: Metadata): Observable<EmptyRequest>;

  getAllCurrentUserAccounts(request: EmptyRequest, metadata?: Metadata): Observable<AccountResponse>;

  getAllUserAccountsById(request: GetAccountsByUserRequest, metadata?: Metadata): Observable<AccountResponse>;

  creditAccount(request: CreditAccountRequest, metadata?: Metadata): Observable<AccountResponse>;

  debitAccount(request: DebitAccountRequest, metadata?: Metadata): Observable<AccountResponse>;

  sendMoney(request: SendMoneyRequest, metadata?: Metadata): Observable<SendMoneyResponse>;
}

export interface AccountServiceController {
  createAccount(
    request: CreateAccountRequest,
    metadata?: Metadata,
  ): Promise<AccountResponse> | Observable<AccountResponse> | AccountResponse;

  updateAccount(
    request: UpdateAccountRequest,
    metadata?: Metadata,
  ): Promise<AccountResponse> | Observable<AccountResponse> | AccountResponse;

  findAccountByLabel(
    request: GetAccountRequest,
    metadata?: Metadata,
  ): Promise<AccountResponse> | Observable<AccountResponse> | AccountResponse;

  findAllAccounts(
    request: EmptyRequest,
    metadata?: Metadata,
  ): Promise<AccountResponse> | Observable<AccountResponse> | AccountResponse;

  deleteAccount(
    request: DeleteAccountRequest,
    metadata?: Metadata,
  ): Promise<EmptyRequest> | Observable<EmptyRequest> | EmptyRequest;

  getAllCurrentUserAccounts(
    request: EmptyRequest,
    metadata?: Metadata,
  ): Promise<AccountResponse> | Observable<AccountResponse> | AccountResponse;

  getAllUserAccountsById(
    request: GetAccountsByUserRequest,
    metadata?: Metadata,
  ): Promise<AccountResponse> | Observable<AccountResponse> | AccountResponse;

  creditAccount(
    request: CreditAccountRequest,
    metadata?: Metadata,
  ): Promise<AccountResponse> | Observable<AccountResponse> | AccountResponse;

  debitAccount(
    request: DebitAccountRequest,
    metadata?: Metadata,
  ): Promise<AccountResponse> | Observable<AccountResponse> | AccountResponse;

  sendMoney(
    request: SendMoneyRequest,
    metadata?: Metadata,
  ): Promise<SendMoneyResponse> | Observable<SendMoneyResponse> | SendMoneyResponse;
}

export function AccountServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = [
      "createAccount",
      "updateAccount",
      "findAccountByLabel",
      "findAllAccounts",
      "deleteAccount",
      "getAllCurrentUserAccounts",
      "getAllUserAccountsById",
      "creditAccount",
      "debitAccount",
      "sendMoney",
    ];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("AccountService", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("AccountService", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const ACCOUNT_SERVICE_NAME = "AccountService";
