import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  Get,
  Param,
  Res,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UploadsService } from './uploads.service';
import { UploadFileResponseDto } from './dto/upload-file-response.dto';
import { existsSync } from 'fs';
import { join } from 'path';
import { Response } from 'express';
import * as multer from 'multer';

// 添加Multer类型声明
declare global {
  namespace Express {
    namespace Multer {
      interface File {
        filename: string;
        originalname: string;
        mimetype: string;
        size: number;
      }
    }
  }
}

@Controller('uploads')
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile() file: Express.Multer.File): UploadFileResponseDto {
    if (!file) {
      throw new BadRequestException('文件不能为空');
    }

    return {
      filename: file.filename,
      originalname: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
      url: this.uploadsService.getFileUrl(file.filename),
    };
  }

  @Get(':filename')
  getFile(@Param('filename') filename: string, @Res() res: Response) {
    const path = join(process.cwd(), 'uploads', filename);

    if (!existsSync(path)) {
      throw new BadRequestException('文件不存在');
    }

    return res.sendFile(path);
  }
}
