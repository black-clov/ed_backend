import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateNeedsDto } from './dto/create-needs.dto';
import { NeedsAssessmentEntity } from './entities/needs-assessment.entity';

@Injectable()
export class NeedsService {
  constructor(
    @InjectRepository(NeedsAssessmentEntity)
    private readonly needsRepo: Repository<NeedsAssessmentEntity>,
  ) {}

  getOptions() {
    return [
      { key: 'learning', label: 'التعلم والتكوين', icon: '📚' },
      { key: 'training', label: 'تدريب مهني', icon: '🏋️' },
      { key: 'confidence', label: 'الثقة بالنفس', icon: '💪' },
      { key: 'cv', label: 'المساعدة في الـ CV', icon: '📄' },
      { key: 'jobs', label: 'البحث عن عمل', icon: '💼' },
      { key: 'networking', label: 'بناء شبكة علاقات', icon: '🤝' },
      { key: 'languages', label: 'تعلم اللغات', icon: '🌍' },
      { key: 'digital', label: 'المهارات الرقمية', icon: '💻' },
      { key: 'entrepreneurship', label: 'ريادة الأعمال', icon: '🚀' },
    ];
  }

  async create(dto: CreateNeedsDto) {
    const userId = dto.userId ?? 'anonymous';
    // Replace previous assessment
    await this.needsRepo.delete({ userId });

    const entity = this.needsRepo.create({ userId, needs: dto.needs });
    await this.needsRepo.save(entity);

    return { ok: true, userId, needs: dto.needs };
  }

  async getByUser(userId: string) {
    const row = await this.needsRepo.findOne({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
    return row ? row.needs : [];
  }
}
