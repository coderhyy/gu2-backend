// src/common/response/response.class.ts
import { ResponseInterface } from './response.interface';

export class ResponseResult<T = any> {
  constructor(code: number, message: string, data: T) {
    this.code = code;
    this.message = message;
    this.data = data;
    this.timestamp = Date.now();
  }

  code: number;
  message: string;
  data: T;
  timestamp: number;

  static success<T>(data: T, message = 'success'): ResponseInterface<T> {
    return new ResponseResult<T>(200, message, data);
  }

  static fail(
    message = 'fail',
    code = 400,
    data: any = null,
  ): ResponseInterface {
    return new ResponseResult(code, message, data);
  }

  static error(message = 'error', code = 500): ResponseInterface {
    return new ResponseResult(code, message, null);
  }
}
