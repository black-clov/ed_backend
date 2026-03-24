import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCommTrainingDto } from './dto/create-comm-training.dto';
import { CommTrainingEntity } from './entities/comm-training.entity';

@Injectable()
export class CommTrainingService {
  constructor(
    @InjectRepository(CommTrainingEntity)
    private readonly repo: Repository<CommTrainingEntity>,
  ) {}

  getModules() {
    return [
      {
        key: 'customer_talk',
        label: 'التواصل مع الزبون',
        icon: '🗣️',
        description: 'كيفاش تهضر مع الزبون بطريقة مهنية ومقنعة',
        tips: [
          'سمع مزيان قبل ما تهضر',
          'استعمل أسئلة مفتوحة باش تفهم الاحتياج',
          'كن واضح ومباشر فالشرح',
          'بيّن القيمة اللي غادي يستافد منها الزبون',
        ],
      },
      {
        key: 'negotiation',
        label: 'التفاوض',
        icon: '🤝',
        description: 'مهارات التفاوض على الأثمنة والشروط',
        tips: [
          'حضر مزيان قبل أي تفاوض',
          'عرف الحد الأدنى ديالك والحد الأقصى',
          'قلّب على حلول win-win',
          'ما تبانش يائس أو متسرع',
        ],
      },
      {
        key: 'persuasion',
        label: 'الإقناع',
        icon: '💎',
        description: 'فن الإقناع وكيفاش تخلي الناس يثقو فيك',
        tips: [
          'استعمل قصص وأمثلة واقعية',
          'بيّن الأرقام والنتائج الملموسة',
          'كن صادق وشفاف',
          'استعمل لغة الجسد بطريقة إيجابية',
        ],
      },
      {
        key: 'presentation',
        label: 'العرض والتقديم',
        icon: '🎤',
        description: 'كيفاش تقدم المشروع ديالك بطريقة احترافية',
        tips: [
          'ابدأ بقصة أو سؤال يجذب الانتباه',
          'استعمل صور وأرقام وماشي غير كلام',
          'تدرب بزاف قبل العرض',
          'خلي العرض قصير ومركز',
        ],
      },
      {
        key: 'networking',
        label: 'بناء العلاقات',
        icon: '🌐',
        description: 'كيفاش تبني شبكة علاقات مهنية قوية',
        tips: [
          'حضر الأحداث والملتقيات المهنية',
          'كن مستعد تعرف براسك ف30 ثانية',
          'تابع الناس اللي تعرفتي عليهم',
          'قدم قيمة قبل ما تطلب شي حاجة',
        ],
      },
      {
        key: 'conflict_resolution',
        label: 'حل النزاعات',
        icon: '⚖️',
        description: 'كيفاش تدير مع الخلافات بطريقة بناءة',
        tips: [
          'بقى هادئ وما تاخدش الأمور بشكل شخصي',
          'سمع لكل الأطراف قبل ما تحكم',
          'قلّب على أرضية مشتركة',
          'ركز على الحل ماشي على المشكل',
        ],
      },
    ];
  }

  async create(dto: CreateCommTrainingDto) {
    const userId = dto.userId ?? 'anonymous';
    await this.repo.delete({ userId });

    const entity = this.repo.create({
      userId,
      skills: dto.skills,
      ratings: dto.ratings ?? null,
      completedModules: dto.completedModules ?? null,
    });
    await this.repo.save(entity);
    return { ok: true, userId, skills: dto.skills };
  }

  async getByUser(userId: string) {
    const row = await this.repo.findOne({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
    return row ?? { skills: [], ratings: null, completedModules: null };
  }
}
