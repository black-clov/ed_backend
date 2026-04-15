import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ContentEntity } from './entities/content.entity';
import { CreateContentDto, UpdateContentDto } from './dto/content.dto';

@Injectable()
export class ContentService {
  constructor(
    @InjectRepository(ContentEntity)
    private readonly contentRepo: Repository<ContentEntity>,
  ) {}

  async findAll(type?: string, category?: string): Promise<ContentEntity[]> {
    const where: Record<string, unknown> = { published: true };
    if (type) where.type = type;
    if (category) where.category = category;
    return this.contentRepo.find({ where, order: { order: 'ASC', createdAt: 'DESC' } });
  }

  async findAllAdmin(): Promise<ContentEntity[]> {
    return this.contentRepo.find({ order: { createdAt: 'DESC' } });
  }

  async findOne(id: string): Promise<ContentEntity | null> {
    return this.contentRepo.findOne({ where: { id } });
  }

  async create(dto: CreateContentDto): Promise<ContentEntity> {
    const entity = this.contentRepo.create(dto);
    return this.contentRepo.save(entity);
  }

  async update(id: string, dto: UpdateContentDto): Promise<ContentEntity | null> {
    await this.contentRepo.update(id, dto);
    return this.contentRepo.findOne({ where: { id } });
  }

  async remove(id: string): Promise<void> {
    await this.contentRepo.delete(id);
  }
}
