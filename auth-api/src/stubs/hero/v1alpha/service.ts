/* eslint-disable */
import { Metadata } from "@grpc/grpc-js";
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { Observable } from "rxjs";
import {
  CreateHeroRequest,
  DeleteHeroRequest,
  EmptyRequest,
  GetHeroRequest,
  HeroResponse,
  UpdateHeroRequest,
} from "./message";

export const protobufPackage = "hero.v1alpha";

export const HERO_V1ALPHA_PACKAGE_NAME = "hero.v1alpha";

export interface HeroServiceClient {
  createHero(request: CreateHeroRequest, metadata?: Metadata): Observable<HeroResponse>;

  updateHero(request: UpdateHeroRequest, metadata?: Metadata): Observable<HeroResponse>;

  findHeroById(request: GetHeroRequest, metadata?: Metadata): Observable<HeroResponse>;

  findAllHeros(request: EmptyRequest, metadata?: Metadata): Observable<HeroResponse>;

  deleteHero(request: DeleteHeroRequest, metadata?: Metadata): Observable<HeroResponse>;
}

export interface HeroServiceController {
  createHero(
    request: CreateHeroRequest,
    metadata?: Metadata,
  ): Promise<HeroResponse> | Observable<HeroResponse> | HeroResponse;

  updateHero(
    request: UpdateHeroRequest,
    metadata?: Metadata,
  ): Promise<HeroResponse> | Observable<HeroResponse> | HeroResponse;

  findHeroById(
    request: GetHeroRequest,
    metadata?: Metadata,
  ): Promise<HeroResponse> | Observable<HeroResponse> | HeroResponse;

  findAllHeros(
    request: EmptyRequest,
    metadata?: Metadata,
  ): Promise<HeroResponse> | Observable<HeroResponse> | HeroResponse;

  deleteHero(
    request: DeleteHeroRequest,
    metadata?: Metadata,
  ): Promise<HeroResponse> | Observable<HeroResponse> | HeroResponse;
}

export function HeroServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ["createHero", "updateHero", "findHeroById", "findAllHeros", "deleteHero"];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("HeroService", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("HeroService", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const HERO_SERVICE_NAME = "HeroService";
