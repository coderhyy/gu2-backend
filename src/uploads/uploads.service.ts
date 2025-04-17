import { Injectable } from '@nestjs/common';

@Injectable()
export class UploadsService {
  getFileUrl(filename: string): string {
    // 修改文件URL以匹配实际访问路径
    return `/api/v1/uploads/${filename}`;
  }
}
