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

@Controller('uploads')
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile() file: Express.Multer.File): UploadFileResponseDto {
    if (!file) {
      throw new BadRequestException('File cannot be empty');
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
      throw new BadRequestException('File does not exist');
    }

    return res.sendFile(path);
  }
}
