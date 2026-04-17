import {
  Controller,
  Post,
  Get,
  Param,
  Body,
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
import {
  existsSync,
  mkdirSync,
  createReadStream,
  createWriteStream,
  readdirSync,
  unlinkSync,
  rmdirSync,
} from 'fs';
import { randomUUID } from 'crypto';

export const uploadsDir = join(__dirname, '..', '..', 'uploads');
const chunksDir = join(__dirname, '..', '..', 'uploads', '_chunks');

const ALLOWED_EXT =
  /\.(mp4|mov|avi|mkv|webm|mp3|pdf|jpg|jpeg|png|gif|webp|zip|tar|gz|rar|7z|bz2|xz|doc|docx|xls|xlsx|ppt|pptx|csv|txt)$/i;

@Controller()
export class UploadController {
  /* ── Single-request upload (small files < 25 MB) ───────── */
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
      limits: { fileSize: 500 * 1024 * 1024 },
      fileFilter: (_req, file, cb) => {
        if (!ALLOWED_EXT.test(extname(file.originalname))) {
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

  /* ── Chunked upload — Step 1: receive a chunk ──────────── */
  @Post('admin/upload/chunk')
  @UseGuards(RolesGuard)
  @Roles('admin')
  @UseInterceptors(
    FileInterceptor('chunk', {
      storage: diskStorage({
        destination: (_req, _file, cb) => {
          const uid = (_req as any).headers['x-upload-id'];
          if (!uid) return cb(new BadRequestException('Missing x-upload-id header'), '');
          const dir = join(chunksDir, String(uid));
          if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
          cb(null, dir);
        },
        filename: (_req, _file, cb) => {
          const idx = (_req as any).headers['x-chunk-index'];
          cb(null, `chunk_${String(idx).padStart(6, '0')}`);
        },
      }),
      limits: { fileSize: 6 * 1024 * 1024 }, // 6 MB per chunk
    }),
  )
  uploadChunk(@UploadedFile() file: Express.Multer.File) {
    if (!file) throw new BadRequestException('No chunk uploaded');
    return { ok: true, received: file.size };
  }

  /* ── Chunked upload — Step 2: merge all chunks ─────────── */
  @Post('admin/upload/merge')
  @UseGuards(RolesGuard)
  @Roles('admin')
  async mergeChunks(
    @Body() body: { uploadId: string; filename: string; totalChunks: number },
  ) {
    const { uploadId, filename, totalChunks } = body;
    if (!uploadId || !filename || !totalChunks) {
      throw new BadRequestException('uploadId, filename and totalChunks required');
    }
    const ext = extname(filename).toLowerCase();
    if (!ALLOWED_EXT.test(ext)) {
      throw new BadRequestException('File type not allowed');
    }

    const chunkFolder = join(chunksDir, uploadId);
    if (!existsSync(chunkFolder)) {
      throw new BadRequestException('No chunks found for this upload');
    }

    const finalName = `${randomUUID()}${ext}`;
    const finalPath = join(uploadsDir, finalName);
    if (!existsSync(uploadsDir)) mkdirSync(uploadsDir, { recursive: true });

    const out = createWriteStream(finalPath);
    for (let i = 0; i < totalChunks; i++) {
      const chunkPath = join(chunkFolder, `chunk_${String(i).padStart(6, '0')}`);
      if (!existsSync(chunkPath)) {
        out.end();
        throw new BadRequestException(`Missing chunk ${i}`);
      }
      await new Promise<void>((resolve, reject) => {
        const src = createReadStream(chunkPath);
        src.on('error', reject);
        src.on('end', resolve);
        src.pipe(out, { end: false });
      });
    }
    out.end();

    // Clean up chunks
    try {
      readdirSync(chunkFolder).forEach((f) => unlinkSync(join(chunkFolder, f)));
      rmdirSync(chunkFolder);
    } catch (_) {}

    const url = `/api/uploads/${finalName}`;
    return { ok: true, url, filename: finalName };
  }

  /* ── Serve uploaded files ──────────────────────────────── */
  @Get('uploads/:filename')
  @Public()
  serveFile(@Param('filename') filename: string): StreamableFile {
    const safe = filename.replace(/[^a-zA-Z0-9._-]/g, '');
    const filePath = join(uploadsDir, safe);
    if (!existsSync(filePath)) throw new NotFoundException('File not found');
    const ext = extname(safe).toLowerCase();
    const mimeMap: Record<string, string> = {
      '.mp4': 'video/mp4', '.mov': 'video/quicktime', '.avi': 'video/x-msvideo',
      '.mkv': 'video/x-matroska', '.webm': 'video/webm', '.mp3': 'audio/mpeg',
      '.pdf': 'application/pdf', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
      '.png': 'image/png', '.gif': 'image/gif', '.webp': 'image/webp',
      '.zip': 'application/zip', '.tar': 'application/x-tar',
      '.gz': 'application/gzip', '.rar': 'application/vnd.rar',
      '.7z': 'application/x-7z-compressed',
      '.doc': 'application/msword',
      '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      '.xls': 'application/vnd.ms-excel',
      '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      '.ppt': 'application/vnd.ms-powerpoint',
      '.pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      '.csv': 'text/csv', '.txt': 'text/plain',
    };
    const stream = createReadStream(filePath);
    return new StreamableFile(stream, {
      type: mimeMap[ext] || 'application/octet-stream',
      disposition: 'inline',
    });
  }
}
