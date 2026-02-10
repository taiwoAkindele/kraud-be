import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string | string[] = 'Internal server error';
    let errors: any = null;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exResponse = exception.getResponse();
      if (typeof exResponse === 'string') {
        message = exResponse;
      } else if (typeof exResponse === 'object') {
        const obj = exResponse as Record<string, any>;
        message = obj.message || 'Error';
        errors = obj.errors || null;
      }
    }

    // Mongoose CastError (invalid ObjectId)
    if ((exception as any)?.name === 'CastError') {
      status = HttpStatus.BAD_REQUEST;
      message = `Invalid ID format: ${(exception as any).value}`;
    }

    // Mongoose duplicate key error
    if ((exception as any)?.code === 11000) {
      status = HttpStatus.CONFLICT;
      const field = Object.keys((exception as any).keyPattern || {})[0];
      message = `Duplicate value for field: ${field}`;
    }

    // Mongoose validation error
    if ((exception as any)?.name === 'ValidationError' && (exception as any)?.errors) {
      status = HttpStatus.BAD_REQUEST;
      const mongooseErrors = (exception as any).errors;
      message = Object.values(mongooseErrors)
        .map((err: any) => err.message)
        .join(', ');
    }

    this.logger.error(
      `${request.method} ${request.url} ${status}`,
      exception instanceof Error ? exception.stack : String(exception),
    );

    response.status(status).json({
      success: false,
      data: null,
      message,
      errors,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
