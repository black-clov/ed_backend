import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateEntrepreneurshipDto } from './dto/create-entrepreneurship.dto';
import { EntrepreneurshipSkillEntity } from './entities/entrepreneurship-skill.entity';

@Injectable()
export class EntrepreneurshipService {
  constructor(
    @InjectRepository(EntrepreneurshipSkillEntity)
    private readonly entreRepo: Repository<EntrepreneurshipSkillEntity>,
  ) {}

  getOptions() {
    return [
      {
        key: 'project_idea',
        label: 'فكرة المشروع',
        icon: '💡',
        description: 'القدرة على تطوير فكرة مشروع واضحة ومبتكرة',
      },
      {
        key: 'management',
        label: 'التدبير والتسيير',
        icon: '📊',
        description: 'مهارات إدارة الموارد والوقت والفريق',
      },
      {
        key: 'legal_basics',
        label: 'الأساسيات القانونية',
        icon: '⚖️',
        description: 'معرفة الإجراءات القانونية لإنشاء مقاولة',
      },
      {
        key: 'financing',
        label: 'التمويل',
        icon: '💰',
        description: 'كيفية البحث عن التمويل وتدبير الميزانية',
      },
      {
        key: 'marketing',
        label: 'التسويق',
        icon: '📢',
        description: 'استراتيجيات الترويج والوصول للزبناء',
      },
      {
        key: 'partnerships',
        label: 'الشراكات',
        icon: '🤝',
        description: 'بناء علاقات مهنية وشراكات استراتيجية',
      },
    ];
  }

  async create(dto: CreateEntrepreneurshipDto) {
    const userId = dto.userId ?? 'anonymous';
    await this.entreRepo.delete({ userId });

    const entity = this.entreRepo.create({
      userId,
      skills: dto.skills,
      ratings: dto.ratings ?? null,
    });
    await this.entreRepo.save(entity);

    return { ok: true, userId, skills: dto.skills, ratings: dto.ratings };
  }

  async getByUser(userId: string) {
    const row = await this.entreRepo.findOne({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
    return row ?? { skills: [], ratings: null };
  }
}
