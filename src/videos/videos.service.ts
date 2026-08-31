import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VideoEntity } from './entities/video.entity';
import { CreateVideoDto, UpdateVideoDto } from './dto/video-crud.dto';

@Injectable()
export class VideosService {
  constructor(
    @InjectRepository(VideoEntity)
    private readonly videosRepo: Repository<VideoEntity>,
  ) {}

  async findAll(category?: string): Promise<VideoEntity[]> {
    const where = category ? { category } : {};
    return this.videosRepo.find({ where, order: { order: 'ASC' } });
  }

  async findOne(id: string): Promise<VideoEntity | null> {
    return this.videosRepo.findOne({ where: { id } });
  }

  async getCategories(): Promise<{ id: string; label: string }[]> {
    return [
      { id: 'cv', label: 'كتابة السيرة الذاتية' },
      { id: 'interview', label: 'التحضير للمقابلة' },
      { id: 'skills', label: 'المهارات المطلوبة' },
      { id: 'softskills', label: 'المهارات الشخصية' },
      { id: 'opportunities', label: 'البحث عن الفرص' },
      { id: 'entrepreneurship', label: 'ريادة الأعمال' },
    ];
  }

  // ── Admin CRUD ──────────────────────────────────
  async findAllAdmin(): Promise<VideoEntity[]> {
    return this.videosRepo.find({ order: { createdAt: 'DESC' } });
  }

  async create(dto: CreateVideoDto): Promise<VideoEntity> {
    const entity = this.videosRepo.create(dto);
    return this.videosRepo.save(entity);
  }

  async update(id: string, dto: UpdateVideoDto): Promise<VideoEntity | null> {
    await this.videosRepo.update(id, dto);
    return this.videosRepo.findOne({ where: { id } });
  }

  async remove(id: string): Promise<void> {
    await this.videosRepo.delete(id);
  }
}
