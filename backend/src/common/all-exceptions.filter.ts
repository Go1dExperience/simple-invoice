import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const res = host.switchToHttp().getResponse();
    const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
    const body = exception instanceof HttpException ? exception.getResponse() : { message: 'Internal server error' };
    const payload = typeof body === 'string' ? { message: body } : (body as Record<string, unknown>);
    res.status(status).json({
      statusCode: status,
      message: (payload.message as unknown) ?? 'Error',
      error: (payload.error as string) ?? HttpStatus[status],
    });
  }
}
