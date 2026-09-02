import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { RecommendationItemEntity } from './entities/recommendation-item.entity';
import {
  CreateRecommendationItemDto,
  UpdateRecommendationItemDto,
} from './dto/recommendation-item.dto';

@Injectable()
export class RecommendationsService implements OnModuleInit {
  constructor(
    @InjectRepository(RecommendationItemEntity)
    private readonly repo: Repository<RecommendationItemEntity>,
    private readonly dataSource: DataSource,
  ) {}

  /**
   * Ensure the table exists in environments where TYPEORM_SYNC is off and no
   * migration step runs on deploy. Idempotent and data-safe (schema only).
   */
  async onModuleInit(): Promise<void> {
    try {
      await this.dataSource.query(`
        CREATE TABLE IF NOT EXISTS "recommendation_items" (
          "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
          "title" varchar(255) NOT NULL,
          "description" text,
          "action_label" varchar(120),
          "action_url" varchar(1000),
          "category" varchar(100),
          "published" boolean NOT NULL DEFAULT true,
          "order" integer NOT NULL DEFAULT 0,
          "created_at" TIMESTAMP NOT NULL DEFAULT now(),
          "updated_at" TIMESTAMP NOT NULL DEFAULT now()
        )
      `);
    } catch {
      // Non-fatal: if the DB user lacks DDL rights the table is expected to
      // already exist (created by migration or a previous boot).
    }
  }

  /** Public: recommendations shown to a user (currently global, published only). */
  async getForUser(_userId: string) {
    const items = await this.repo.find({
      where: { published: true },
      order: { order: 'ASC', createdAt: 'DESC' },
    });
    return items.map((r) => ({
      title: r.title,
      description: r.description ?? '',
      actionLabel: r.actionLabel ?? '',
    }));
  }

  // ── Admin CRUD ──────────────────────────────────
  async findAllAdmin(): Promise<RecommendationItemEntity[]> {
    return this.repo.find({ order: { createdAt: 'DESC' } });
  }

  async create(dto: CreateRecommendationItemDto): Promise<RecommendationItemEntity> {
    const entity = this.repo.create(dto);
    return this.repo.save(entity);
  }

  async update(
    id: string,
    dto: UpdateRecommendationItemDto,
  ): Promise<RecommendationItemEntity | null> {
    await this.repo.update(id, dto);
    return this.repo.findOne({ where: { id } });
  }

  async remove(id: string): Promise<void> {
    await this.repo.delete(id);
  }
}
