import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateSupportPreferenceDto } from './dto/create-support.dto';
import { SupportPreferenceEntity } from './entities/support-preference.entity';

@Injectable()
export class SupportService {
  constructor(
    @InjectRepository(SupportPreferenceEntity)
    private readonly repo: Repository<SupportPreferenceEntity>,
  ) {}

  getOptions() {
    return [
      {
        category: 'incubator',
        label: 'الحاضنة',
        icon: '🏢',
        description: 'مكان يوفر ليك مكتب ومرافقة ودعم لوجيستيكي',
        choices: [
          { key: 'incubator_physical', label: 'حاضنة فمكان فيزيكي' },
          { key: 'incubator_virtual', label: 'حاضنة عن بعد (أونلاين)' },
          { key: 'incubator_none', label: 'ما محتاجش حاضنة' },
        ],
      },
      {
        category: 'mentor_type',
        label: 'نوع المرشد',
        icon: '🧑‍🏫',
        description: 'شكون بغيتي يوجهك فالمشوار ديالك',
        choices: [
          { key: 'mentor_entrepreneur', label: 'مقاول ناجح' },
          { key: 'mentor_expert', label: 'خبير فالمجال ديالي' },
          { key: 'mentor_coach', label: 'كوتش تنمية ذاتية' },
          { key: 'mentor_peer', label: 'شاب مقاول بحالي (peer mentoring)' },
        ],
      },
      {
        category: 'training_type',
        label: 'نوع التكوين',
        icon: '📖',
        description: 'شنو نوع التكوين اللي كيناسبك',
        choices: [
          { key: 'training_online', label: 'تكوين أونلاين (فيديوهات)' },
          { key: 'training_workshop', label: 'ورشات عمل حضورية' },
          { key: 'training_bootcamp', label: 'بوتكامب مكثف (أسبوع أو أكثر)' },
          { key: 'training_one_on_one', label: 'تكوين فردي مخصص' },
        ],
      },
      {
        category: 'funding_stage',
        label: 'مرحلة التمويل',
        icon: '💰',
        description: 'فين وصلتي فمسار التمويل',
        choices: [
          { key: 'funding_idea', label: 'عندي غير الفكرة (ما بديتش)' },
          { key: 'funding_seeking', label: 'كنقلب على تمويل' },
          { key: 'funding_applied', label: 'قدمت طلب تمويل' },
          { key: 'funding_self', label: 'غادي نمول راسي' },
          { key: 'funding_partner', label: 'كنقلب على شريك مالي' },
        ],
      },
    ];
  }

  async create(dto: CreateSupportPreferenceDto) {
    const userId = dto.userId ?? 'anonymous';
    await this.repo.delete({ userId });

    const entity = this.repo.create({
      userId,
      preferences: dto.preferences,
      details: dto.details ?? null,
    });
    await this.repo.save(entity);
    return { ok: true, userId, preferences: dto.preferences };
  }

  async getByUser(userId: string) {
    const row = await this.repo.findOne({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
    return row ?? { preferences: [], details: null };
  }
}
