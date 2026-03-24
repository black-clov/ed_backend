import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OpportunityEntity } from './entities/opportunity.entity';
import { SkillEntity } from '../skills/entities/skill.entity';
import { NeedsAssessmentEntity } from '../needs/entities/needs-assessment.entity';
import { QuestionnaireAnswerEntity } from '../questionnaire/entities/questionnaire-answer.entity';

@Injectable()
export class OpportunitiesService implements OnModuleInit {
  constructor(
    @InjectRepository(OpportunityEntity)
    private readonly opportunityRepo: Repository<OpportunityEntity>,
    @InjectRepository(SkillEntity)
    private readonly skillRepo: Repository<SkillEntity>,
    @InjectRepository(NeedsAssessmentEntity)
    private readonly needsRepo: Repository<NeedsAssessmentEntity>,
    @InjectRepository(QuestionnaireAnswerEntity)
    private readonly questionnaireRepo: Repository<QuestionnaireAnswerEntity>,
  ) {}

  /** Seed default opportunities if the table is empty. */
  async onModuleInit() {
    const count = await this.opportunityRepo.count();
    if (count === 0) {
      await this.opportunityRepo.save([
        {
          title: 'مساعد دعم العملاء',
          type: 'job',
          location: 'الدار البيضاء',
          description: 'تدريب لمدة 3 أشهر مع دعم وتوجيه عملي في خدمة الزبناء.',
          requiredSkills: ['التواصل', 'العمل الجماعي', 'حل المشكلات'],
          suitableForNeeds: ['jobs', 'training', 'confidence'],
        },
        {
          title: 'متدرب في العمليات الرقمية',
          type: 'internship',
          location: 'الرباط',
          description: 'تدريب عملي في المجال الرقمي مع شركة رائدة.',
          requiredSkills: ['المهارات الرقمية', 'التنظيم', 'التعلم السريع'],
          suitableForNeeds: ['digital', 'training', 'learning'],
        },
        {
          title: 'برنامج أساسيات التجارة الإلكترونية',
          type: 'training',
          location: 'مراكش',
          description: 'برنامج لمدة 6 أسابيع يركز على أساسيات البيع عبر الإنترنت.',
          requiredSkills: ['المهارات الرقمية', 'الإبداع'],
          suitableForNeeds: ['entrepreneurship', 'digital', 'learning'],
        },
        {
          title: 'ورشة بناء الشبكات المهنية',
          type: 'training',
          location: 'فاس',
          description: 'ورشة تدريبية لتعلم كيفية بناء علاقات مهنية فعالة.',
          requiredSkills: ['التواصل', 'العمل الجماعي'],
          suitableForNeeds: ['networking', 'confidence'],
        },
        {
          title: 'دورة اللغة الفرنسية المهنية',
          type: 'training',
          location: 'طنجة',
          description: 'دورة لتعلم الفرنسية المستخدمة في بيئة العمل.',
          requiredSkills: ['التعلم السريع'],
          suitableForNeeds: ['languages', 'learning'],
        },
        {
          title: 'مساعد مبيعات مبتدئ',
          type: 'job',
          location: 'أكادير',
          description: 'فرصة عمل للمبتدئين مع تدريب على المبيعات والتواصل.',
          requiredSkills: ['التواصل', 'الإقناع', 'المرونة'],
          suitableForNeeds: ['jobs', 'confidence', 'training'],
        },
        {
          title: 'برنامج ريادة الأعمال الشبابية',
          type: 'training',
          location: 'الرباط',
          description: 'برنامج مكثف لدعم المشاريع الصغيرة والمتوسطة.',
          requiredSkills: ['القيادة', 'الإبداع', 'التنظيم'],
          suitableForNeeds: ['entrepreneurship', 'confidence', 'networking'],
        },
        {
          title: 'مساعد إداري',
          type: 'job',
          location: 'الدار البيضاء',
          description: 'وظيفة مكتبية تتطلب مهارات التنظيم والتواصل.',
          requiredSkills: ['التنظيم', 'المهارات الرقمية', 'التواصل'],
          suitableForNeeds: ['jobs', 'digital', 'cv'],
        },
      ]);
    }
  }

  async findAll() {
    return this.opportunityRepo.find();
  }

  async findOne(id: string) {
    return this.opportunityRepo.findOneBy({ id }) ?? null;
  }

  async matchForUser(userId: string) {
    const [allOpportunities, userSkills, needsRow, questionnaire] =
      await Promise.all([
        this.opportunityRepo.find(),
        this.skillRepo.find({ where: { userId } }),
        this.needsRepo.findOne({ where: { userId }, order: { createdAt: 'DESC' } }),
        this.questionnaireRepo.findOne({ where: { userId } }),
      ]);

    const userSkillNames = userSkills.map((s) => s.name.toLowerCase());
    const userNeeds = (needsRow?.needs ?? []).map((n) => n.toLowerCase());
    const userInterests = (questionnaire?.interests ?? []).map((i) =>
      i.toLowerCase(),
    );

    const scored = allOpportunities.map((opp) => {
      let score = 0;
      let maxScore = 0;
      const reasons: string[] = [];

      // Skill match (weight: 40%)
      const reqSkills = opp.requiredSkills ?? [];
      if (reqSkills.length > 0) {
        maxScore += 40;
        const matched = reqSkills.filter((rs) =>
          userSkillNames.some(
            (us) => us.includes(rs.toLowerCase()) || rs.toLowerCase().includes(us),
          ),
        );
        const skillScore = Math.round((matched.length / reqSkills.length) * 40);
        score += skillScore;
        if (matched.length > 0) {
          reasons.push(`مهارات متطابقة: ${matched.join('، ')}`);
        }
      }

      // Needs match (weight: 35%)
      const suitableNeeds = opp.suitableForNeeds ?? [];
      if (suitableNeeds.length > 0) {
        maxScore += 35;
        const matched = suitableNeeds.filter((sn) =>
          userNeeds.includes(sn.toLowerCase()),
        );
        const needsScore = Math.round(
          (matched.length / suitableNeeds.length) * 35,
        );
        score += needsScore;
        if (matched.length > 0) {
          reasons.push('يلبي احتياجاتك');
        }
      }

      // Interest match (weight: 25%)
      if (userInterests.length > 0) {
        maxScore += 25;
        const titleLower = opp.title.toLowerCase();
        const descLower = (opp.description ?? '').toLowerCase();
        const interestMatch = userInterests.some(
          (i) => titleLower.includes(i) || descLower.includes(i),
        );
        if (interestMatch) {
          score += 25;
          reasons.push('يتوافق مع اهتماماتك');
        }
      }

      const effectiveMax = maxScore > 0 ? maxScore : 100;
      const percentage = maxScore > 0 ? Math.round((score / effectiveMax) * 100) : 10;

      return {
        ...opp,
        matchScore: percentage,
        matchReasons: reasons,
      };
    });

    scored.sort((a, b) => b.matchScore - a.matchScore);
    return scored;
  }
}
