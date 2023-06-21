/* eslint-disable */

export const protobufPackage = "hero.v1alpha";

export interface EmptyRequest {
}

export interface Hero {
  id?: number;
  name?: string;
  power?: number;
  hp?: number;
}

export interface CreateHeroRequest {
  name?: string;
  power?: number;
  hp?: number;
}

export interface GetHeroRequest {
  id?: number;
}

export interface DeleteHeroRequest {
  id?: number;
}

export interface UpdateHeroRequest {
  hero?: Hero;
}

export interface HeroResponse {
  hero?: Hero[];
}

export const HERO_V1ALPHA_PACKAGE_NAME = "hero.v1alpha";
