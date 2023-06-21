import { Injectable, UseFilters } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Prisma, Account } from '@prisma/client';
import {PrismaClientExceptionFilter} from "./exception/prisma-exception.filter";

@Injectable()
export class AccountService {
  constructor(private prisma: PrismaService) {}

  create(data: Prisma.AccountCreateInput): Promise<Account> {
    return this.prisma.account.create({ data });
  }

  findAll() {
    return this.prisma.account.findMany();
  }
  findByLabel(data: Prisma.AccountWhereUniqueInput): Promise<Account> {
    return this.prisma.account.findUnique({
        where: data ,
    });
  }

  delete(label: string): Promise<Account> {
    return this.prisma.account.delete({
      where: { label },
    });
  }

  async update(params: {
    label: string;
    data: Prisma.AccountUpdateInput;
  }): Promise<Account> {
    const { label, data } = params;
    let account;

    try {
      account = await this.prisma.account.update({
        where: { label },
        data: data,
      });
    } catch (e) {
      throw new PrismaClientExceptionFilter();
    }

    return account;
  }

  async countAccountByUser(userId: string) {
    return await this.prisma.account.aggregate({
      where: {
        userId: userId,
      },
      _count: {
        _all: true
      },
    });
  }

  async findAccountsByUser(userId: string) {
    return await this.prisma.account.findMany({
      where: {userId}
    });
  }
}
