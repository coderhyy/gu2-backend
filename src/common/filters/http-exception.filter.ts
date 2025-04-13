// src/common/filters/http-exception.filter.ts
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ResponseResult } from '../response/response.class';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    // 处理HTTP异常
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    // 获取异常信息
    const message =
      exception instanceof HttpException
        ? exception.message
        : 'Internal server error';

    const exceptionResponse =
      exception instanceof HttpException ? exception.getResponse() : null;

    // 构建错误响应
    const errorResponse = ResponseResult.fail(
      message,
      status,
      exceptionResponse || null,
    );

    // 日志记录
    console.error(
      `[${request.method}] ${request.url} - ${status}`,
      exception instanceof HttpException ? exception.stack : exception,
    );

    // 发送响应
    response.status(status).json(errorResponse);
  }
}
