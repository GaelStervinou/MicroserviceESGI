/* eslint-disable */
import { Metadata } from "@grpc/grpc-js";
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { Observable } from "rxjs";

export const protobufPackage = "transaction.v1alpha";

export interface TransactionEmptyRequest {
}

export interface Transaction {
  id?: number;
  amount?: number;
  senderAccountLabel?: string;
  receiverAccountLabel?: string;
}

export interface CreateTransactionRequest {
  amount?: number;
  senderAccountLabel?: string;
  receiverAccountLabel?: string;
}

export interface GetTransactionRequest {
  id?: number;
}

export interface RevertTransactionRequest {
  id?: number;
}

export interface GetTransactionsByUserRequest {
  userId?: string;
}

export interface TransactionResponse {
  transaction?: Transaction[];
}

export interface GetTransactionsByAccount {
  accountLabel?: string;
}

export const TRANSACTION_V1ALPHA_PACKAGE_NAME = "transaction.v1alpha";

export interface TransactionServiceClient {
  createTransaction(request: CreateTransactionRequest, metadata?: Metadata): Observable<TransactionResponse>;

  findAllTransactions(request: TransactionEmptyRequest, metadata?: Metadata): Observable<TransactionResponse>;

  findAllCurrentUserTransactions(
    request: TransactionEmptyRequest,
    metadata?: Metadata,
  ): Observable<TransactionResponse>;

  findUserTransactions(request: TransactionEmptyRequest, metadata?: Metadata): Observable<TransactionResponse>;

  findAccountTransaction(request: GetTransactionsByAccount, metadata?: Metadata): Observable<TransactionResponse>;
}

export interface TransactionServiceController {
  createTransaction(
    request: CreateTransactionRequest,
    metadata?: Metadata,
  ): Promise<TransactionResponse> | Observable<TransactionResponse> | TransactionResponse;

  findAllTransactions(
    request: TransactionEmptyRequest,
    metadata?: Metadata,
  ): Promise<TransactionResponse> | Observable<TransactionResponse> | TransactionResponse;

  findAllCurrentUserTransactions(
    request: TransactionEmptyRequest,
    metadata?: Metadata,
  ): Promise<TransactionResponse> | Observable<TransactionResponse> | TransactionResponse;

  findUserTransactions(
    request: TransactionEmptyRequest,
    metadata?: Metadata,
  ): Promise<TransactionResponse> | Observable<TransactionResponse> | TransactionResponse;

  findAccountTransaction(
    request: GetTransactionsByAccount,
    metadata?: Metadata,
  ): Promise<TransactionResponse> | Observable<TransactionResponse> | TransactionResponse;
}

export function TransactionServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = [
      "createTransaction",
      "findAllTransactions",
      "findAllCurrentUserTransactions",
      "findUserTransactions",
      "findAccountTransaction",
    ];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("TransactionService", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("TransactionService", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const TRANSACTION_SERVICE_NAME = "TransactionService";
