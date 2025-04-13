// src/common/response/response.interface.ts
export interface ResponseInterface<T = any> {
  code: number;
  message: string;
  data: T;
  timestamp: number;
}
