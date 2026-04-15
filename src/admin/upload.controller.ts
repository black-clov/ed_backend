import {
  Controller,
  Post,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { randomUUID } from 'crypto';

const uploadsDir = join(__dirname, '..', '..', 'uploads');

@Controller('admin/upload')
@UseGuards(RolesGuard)
@Roles('admin')
export class UploadController {
  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (_req, _file, cb) => {
          if (!existsSync(uploadsDir)) mkdirSync(uploadsDir, { recursive: true });
          cb(null, uploadsDir);
        },
        filename: (_req, file, cb) => {
          const ext = extname(file.originalname).toLowerCase();
          cb(null, `${randomUUID()}${ext}`);
        },
      }),
      limits: { fileSize: 500 * 1024 * 1024 }, // 500 MB
      fileFilter: (_req, file, cb) => {
        const allowed = /\.(mp4|mov|avi|mkv|webm|mp3|pdf|jpg|jpeg|png|gif|webp)$/i;
        if (!allowed.test(extname(file.originalname))) {
          return cb(new BadRequestException('File type not allowed'), false);
        }
        cb(null, true);
      },
    }),
  )
  upload(@UploadedFile() file: Express.Multer.File) {
    if (!file) throw new BadRequestException('No file uploaded');
    // Build public URL — works behind the /uploads static route
    const url = `/uploads/${file.filename}`;
    return { ok: true, url, filename: file.filename, size: file.size };
  }
}
