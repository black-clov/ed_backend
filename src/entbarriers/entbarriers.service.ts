import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateEntBarrierDto } from './dto/create-ent-barrier.dto';
import { EntBarrierEntity } from './entities/ent-barrier.entity';

@Injectable()
export class EntBarriersService {
  constructor(
    @InjectRepository(EntBarrierEntity)
    private readonly repo: Repository<EntBarrierEntity>,
  ) {}

  getOptions() {
    return [
      { key: 'unclear_idea', label: 'فكرة غير واضحة', icon: '🌫️', description: 'ما عنديش فكرة واضحة على المشروع اللي بغيت نديرو' },
      { key: 'fear_of_failure', label: 'الخوف من الفشل', icon: '😰', description: 'كنخاف المشروع ما ينجحش ونخسر فلوسي' },
      { key: 'lack_of_funding', label: 'نقص التمويل', icon: '💸', description: 'ما عنديش الميزانية الكافية باش نبدأ' },
      { key: 'unknown_procedures', label: 'ما كنعرفش الإجراءات', icon: '📋', description: 'ما فاهمش الخطوات القانونية والإدارية' },
      { key: 'no_network', label: 'ما عنديش شبكة علاقات', icon: '🔗', description: 'ما عنديش اتصالات أو ناس يساعدوني' },
      { key: 'lack_of_skills', label: 'نقص المهارات', icon: '📚', description: 'حاس بلي ناقصني تكوين فبعض المجالات' },
      { key: 'market_competition', label: 'المنافسة فالسوق', icon: '⚔️', description: 'السوق فيه بزاف ديال المنافسة' },
      { key: 'family_pressure', label: 'ضغط العائلة', icon: '👨‍👩‍👧', description: 'العائلة ما كتشجعنيش أو كتضغط عليا' },
      { key: 'time_constraints', label: 'ما عنديش الوقت', icon: '⏰', description: 'عندي التزامات أخرى كتاخد الوقت ديالي' },
      { key: 'lack_of_confidence', label: 'قلة الثقة فالنفس', icon: '🪞', description: 'ما كنحسش بلي قادر نجح فريادة الأعمال' },
    ];
  }

  async create(dto: CreateEntBarrierDto) {
    const userId = dto.userId ?? 'anonymous';
    await this.repo.delete({ userId });

    const entity = this.repo.create({
      userId,
      barriers: dto.barriers,
      notes: dto.notes ?? null,
    });
    await this.repo.save(entity);
    return { ok: true, userId, barriers: dto.barriers };
  }

  async getByUser(userId: string) {
    const row = await this.repo.findOne({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
    return row ?? { barriers: [], notes: null };
  }
}
