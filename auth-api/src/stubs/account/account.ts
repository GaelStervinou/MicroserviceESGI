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
  accountToDelete?: Account;
  accountToTransferFunds?: Account;
}

export interface UpdateAccountRequest {
  account?: Account;
}

export interface CreditAccount {
  account?: Account;
  amount?: number;
}

export interface DebitAccount {
  account?: Account;
  amount?: number;
}

export interface GetAccountByUserRequest {
  userId?: string;
}

export interface AccountResponse {
  account?: Account[];
}

export const ACCOUNT_V1ALPHA_PACKAGE_NAME = "account.v1alpha";

export interface AccountServiceClient {
  createAccount(request: CreateAccountRequest, metadata?: Metadata): Observable<AccountResponse>;

  updateAccount(request: UpdateAccountRequest, metadata?: Metadata): Observable<AccountResponse>;

  findAccountByLabel(request: GetAccountRequest, metadata?: Metadata): Observable<AccountResponse>;

  findAllAccounts(request: EmptyRequest, metadata?: Metadata): Observable<AccountResponse>;

  deleteAccount(request: DeleteAccountRequest, metadata?: Metadata): Observable<AccountResponse>;

  getAllUserAccount(request: GetAccountByUserRequest, metadata?: Metadata): Observable<AccountResponse>;
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
  ): Promise<AccountResponse> | Observable<AccountResponse> | AccountResponse;

  getAllUserAccount(
    request: GetAccountByUserRequest,
    metadata?: Metadata,
  ): Promise<AccountResponse> | Observable<AccountResponse> | AccountResponse;
}

export function AccountServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = [
      "createAccount",
      "updateAccount",
      "findAccountByLabel",
      "findAllAccounts",
      "deleteAccount",
      "getAllUserAccount",
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
