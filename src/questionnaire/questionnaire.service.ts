import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SubmitQuestionnaireAnswersDto } from './dto/submit-questionnaire-answers.dto';
import { QuestionnaireAnswerEntity } from './entities/questionnaire-answer.entity';

@Injectable()
export class QuestionnaireService {
  constructor(
    @InjectRepository(QuestionnaireAnswerEntity)
    private readonly answersRepo: Repository<QuestionnaireAnswerEntity>,
  ) {}

  getQuestionnaire() {
    return {
      sections: {
        interestCategories: [
          {
            id: 'technology',
            label: 'التكنولوجيا',
            icon: 'computer',
            subItems: [
              { id: 'tech_web', label: 'تطوير المواقع' },
              { id: 'tech_mobile', label: 'تطبيقات الهاتف' },
              { id: 'tech_data', label: 'تحليل البيانات' },
              { id: 'tech_design', label: 'التصميم الرقمي' },
              { id: 'tech_support', label: 'الدعم التقني' },
            ],
          },
          {
            id: 'creativity',
            label: 'الإبداع',
            icon: 'palette',
            subItems: [
              { id: 'crea_art', label: 'الفنون والحرف' },
              { id: 'crea_photo', label: 'التصوير الفوتوغرافي' },
              { id: 'crea_writing', label: 'الكتابة والتحرير' },
              { id: 'crea_music', label: 'الموسيقى والصوت' },
              { id: 'crea_fashion', label: 'الأزياء والتصميم' },
            ],
          },
          {
            id: 'manual_service',
            label: 'الخدمات اليدوية',
            icon: 'build',
            subItems: [
              { id: 'man_cook', label: 'الطبخ والمطعمة' },
              { id: 'man_agri', label: 'الفلاحة' },
              { id: 'man_mech', label: 'الميكانيك والصيانة' },
              { id: 'man_beauty', label: 'التجميل والحلاقة' },
              { id: 'man_craft', label: 'الصناعة التقليدية' },
            ],
          },
          {
            id: 'people',
            label: 'التعامل مع الناس',
            icon: 'people',
            subItems: [
              { id: 'ppl_sales', label: 'البيع والتجارة' },
              { id: 'ppl_care', label: 'الرعاية الصحية' },
              { id: 'ppl_teach', label: 'التعليم والتدريب' },
              { id: 'ppl_social', label: 'العمل الاجتماعي' },
              { id: 'ppl_tourism', label: 'السياحة والضيافة' },
            ],
          },
        ],
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
