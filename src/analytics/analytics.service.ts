import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AnalyticsEventEntity } from './entities/analytics-event.entity';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectRepository(AnalyticsEventEntity)
    private readonly repo: Repository<AnalyticsEventEntity>,
  ) {}

  async track(data: {
    userId?: string | null;
    action: string;
    target?: string | null;
    metadata?: Record<string, any> | null;
    ipAddress?: string | null;
  }) {
    const event = this.repo.create({
      userId: data.userId ?? null,
      action: data.action,
      target: data.target ?? null,
      metadata: data.metadata ?? null,
      ipAddress: data.ipAddress ?? null,
    });
    return this.repo.save(event);
  }

  async getRecentEvents(limit = 50) {
    return this.repo.find({
      order: { createdAt: 'DESC' },
      take: limit,
    });
  }

  async getEventCountByAction() {
    return this.repo
      .createQueryBuilder('e')
      .select('e.action', 'action')
      .addSelect('COUNT(*)', 'count')
      .groupBy('e.action')
      .orderBy('count', 'DESC')
      .getRawMany();
  }

  async getActiveUsersCount(sinceDays = 7) {
    const since = new Date();
    since.setDate(since.getDate() - sinceDays);
    const result = await this.repo
      .createQueryBuilder('e')
      .select('COUNT(DISTINCT e.user_id)', 'count')
      .where('e.created_at >= :since', { since })
      .andWhere('e.user_id IS NOT NULL')
      .getRawOne();
    return Number(result?.count ?? 0);
  }

  async getDailyEventCounts(days = 30) {
    const since = new Date();
    since.setDate(since.getDate() - days);
    return this.repo
      .createQueryBuilder('e')
      .select("TO_CHAR(e.created_at, 'YYYY-MM-DD')", 'date')
      .addSelect('COUNT(*)', 'count')
      .where('e.created_at >= :since', { since })
      .groupBy("TO_CHAR(e.created_at, 'YYYY-MM-DD')")
      .orderBy('date', 'ASC')
      .getRawMany();
  }

  async getUserEvents(userId: string, limit = 50) {
    return this.repo.find({
      where: { userId },
      order: { createdAt: 'DESC' },
      take: limit,
    });
  }
}
