import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SubmitQuestionnaireAnswersDto } from './dto/submit-questionnaire-answers.dto';
import { QuestionnaireAnswerEntity } from './entities/questionnaire-answer.entity';
import { INTEREST_CATALOG } from './interests.catalog';

@Injectable()
export class QuestionnaireService {
  constructor(
    @InjectRepository(QuestionnaireAnswerEntity)
    private readonly answersRepo: Repository<QuestionnaireAnswerEntity>,
  ) {}

  getQuestionnaire() {
    return {
      sections: {
        // `label` stays Arabic for apps ≤ 1.0.1; `labelFr` / `labelAr` for 1.0.2+.
        interestCategories: INTEREST_CATALOG.map((c) => ({
          id: c.id,
          label: c.ar,
          labelFr: c.fr,
          labelAr: c.ar,
          icon: c.icon,
          subItems: c.subItems.map((s) => ({ id: s.id, label: s.ar, labelFr: s.fr, labelAr: s.ar })),
        })),
        personalityQuestions: [
          { id: 'p1', question: 'كنستمتع بالخدمة مع ناس آخرين فالفريق' },
          { id: 'p2', question: 'كنحس براسي مرتاح ملي كنهضر قدام الناس' },
          { id: 'p3', question: 'كنبغي نحل المشاكل العملية' },
        ],
        softSkillsQuestions: [
          { id: 's1', question: 'واش كتجي فالوقت ديالك للخدمة؟', options: ['ديما', 'غالبا', 'بعض المرات', 'قليل'] },
          { id: 's2', question: 'كيفاش كتعامل مع الضغط فالخدمة؟', options: ['كنبقى هادي وكنلقى حلول', 'كنحاول نتأقلم', 'كنتوتر شوية', 'صعيب عليا'] },
          { id: 's3', question: 'واش كتقبل الملاحظات من الناس؟', options: ['بكل ارتياح', 'غالبا نعم', 'كيقلقني شوية', 'ما كنقبلش بسهولة'] },
          { id: 's4', question: 'واش كتقدر تخدم بوحدك بلا ما حد يراقبك؟', options: ['نعم، كنكون مستقل', 'غالبا نعم', 'كنحتاج توجيه أحيانا', 'كنحتاج مساعدة ديما'] },
          { id: 's5', question: 'كيفاش كتنظم الوقت ديالك؟', options: ['عندي خطة واضحة ديما', 'كنحاول نتنظم', 'مرات كنضيع الوقت', 'ما عنديش تنظيم'] },
          { id: 's6', question: 'واش كتواصل مزيان مع الآخرين؟', options: ['نعم، بسهولة', 'غالبا', 'كنلقى صعوبة أحيانا', 'صعيب عليا'] },
        ],
        workPreferences: ['remote', 'hybrid', 'on-site', 'flexible-hours'],
      },
    };
  }


  /** The user's saved interests: { categoryId: [subItemId, ...] }. */
  async getMyInterests(userId: string) {
    const row = await this.answersRepo.findOne({ where: { userId } });
    return { selections: row?.interestCategories ?? {} };
  }

  /**
   * Save the user's interests (one row per user, created on first save).
   * Unknown ids are dropped so only catalogue values reach the matching.
   */
  async saveMyInterests(userId: string, selections: Record<string, string[]>) {
    const valid: Record<string, string[]> = {};
    for (const cat of INTEREST_CATALOG) {
      const allowed = new Set(cat.subItems.map((s) => s.id));
      const picked = [...new Set((selections?.[cat.id] ?? []).filter((id) => allowed.has(id)))];
      if (picked.length) valid[cat.id] = picked;
    }
    const flat = Object.values(valid).flat();

    let row = await this.answersRepo.findOne({ where: { userId } });
    if (!row) {
      row = this.answersRepo.create({
        userId,
        personalityAnswers: {},
        workPreferences: [],
      });
    }
    row.interestCategories = valid;
    row.interests = flat;
    await this.answersRepo.save(row);
    return { selections: valid };
  }

  async submitAnswers(dto: SubmitQuestionnaireAnswersDto) {
    const userId = dto.userId ?? 'anonymous';
    const entity = this.answersRepo.create({
      userId,
      interests: dto.interests,
      interestCategories: dto.interestCategories,
      personalityAnswers: dto.personalityAnswers,
      softSkillsAnswers: dto.softSkillsAnswers,
      workPreferences: dto.workPreferences,
    });
    const saved = await this.answersRepo.save(entity);
    return {
      ok: true,
      userId,
      saved,
    };
  }

  async getLatestAnswers(userId: string) {
    return this.answersRepo.findOne({ where: { userId }, order: { id: 'DESC' } });
  }
}
