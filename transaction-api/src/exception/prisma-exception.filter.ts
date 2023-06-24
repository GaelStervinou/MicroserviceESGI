import { ArgumentsHost, Catch, RpcExceptionFilter } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { RpcException } from '@nestjs/microservices';

@Catch(PrismaClientKnownRequestError)
export class PrismaClientExceptionFilter
{
  catch( exception, host: ArgumentsHost) {
    const status = this.getRPCStatusCode(exception.code);

    throw new RpcException({
      statusCode: status,
      error: exception.message,
    });
  }

  private getRPCStatusCode(code: string): number {
    console.log('code', code);
    switch (code) {
      case 'P2000':
        return 3;
      case 'P2002':
        return 10;
      case 'P2025':
        return 5;
      default:
        return 13;
    }
  }
}
