import {
  Controller,
  Post,
  Get,
  Param,
  Res,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  NotFoundException,
  StreamableFile,
  Header,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Public } from '../auth/public.decorator';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { existsSync, mkdirSync, createReadStream } from 'fs';
import { randomUUID } from 'crypto';

export const uploadsDir = join(__dirname, '..', '..', 'uploads');

@Controller()
export class UploadController {
  @Post('admin/upload')
  @UseGuards(RolesGuard)
  @Roles('admin')
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
    const url = `/api/uploads/${file.filename}`;
    return { ok: true, url, filename: file.filename, size: file.size };
  }

  @Get('uploads/:filename')
  @Public()
  serveFile(@Param('filename') filename: string): StreamableFile {
    // Sanitise filename — prevent directory traversal
    const safe = filename.replace(/[^a-zA-Z0-9._-]/g, '');
    const filePath = join(uploadsDir, safe);
    if (!existsSync(filePath)) throw new NotFoundException('File not found');
    const ext = extname(safe).toLowerCase();
    const mimeMap: Record<string, string> = {
      '.mp4': 'video/mp4', '.mov': 'video/quicktime', '.avi': 'video/x-msvideo',
      '.mkv': 'video/x-matroska', '.webm': 'video/webm', '.mp3': 'audio/mpeg',
      '.pdf': 'application/pdf', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
      '.png': 'image/png', '.gif': 'image/gif', '.webp': 'image/webp',
    };
    const stream = createReadStream(filePath);
    return new StreamableFile(stream, {
      type: mimeMap[ext] || 'application/octet-stream',
      disposition: 'inline',
    });
  }
}
