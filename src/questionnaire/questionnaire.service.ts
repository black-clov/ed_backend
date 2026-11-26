import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SubmitQuestionnaireAnswersDto } from './dto/submit-questionnaire-answers.dto';
import { QuestionnaireAnswerEntity } from './entities/questionnaire-answer.entity';
import { INTEREST_CATALOG } from './interests.catalog';
import {
  PERSONALITY_QUESTIONS,
  ProfileQuestion,
  SOFT_SKILL_QUESTIONS,
  validAnswers,
} from './profile-questions.catalog';

function toApiQuestion(q: ProfileQuestion) {
  return {
    id: q.id,
    question: q.ar,
    options: q.choices.map((c) => c.ar),
    questionFr: q.fr,
    questionAr: q.ar,
    choices: q.choices,
  };
}

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
        // `question` / `options` keep the old Arabic-only shape; 1.0.2+ uses
        // questionFr / questionAr and `choices` [{ id, fr, ar }].
        personalityQuestions: PERSONALITY_QUESTIONS.map(toApiQuestion),
        softSkillsQuestions: SOFT_SKILL_QUESTIONS.map(toApiQuestion),
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
    const row = await this.getOrCreateRow(userId);
    row.interestCategories = valid;
    row.interests = Object.values(valid).flat();
    await this.answersRepo.save(row);
    return { selections: valid };
  }

  /** Saved "Personnalité" and "Savoir-être" answers: { questionId: choiceId }. */
  async getMyAnswers(userId: string) {
    const row = await this.answersRepo.findOne({ where: { userId } });
    return {
      personality: validAnswers(PERSONALITY_QUESTIONS, row?.personalityAnswers),
      softSkills: validAnswers(SOFT_SKILL_QUESTIONS, row?.softSkillsAnswers),
    };
  }

  async saveMyPersonality(userId: string, answers: Record<string, string>) {
    const row = await this.getOrCreateRow(userId);
    row.personalityAnswers = validAnswers(PERSONALITY_QUESTIONS, answers);
    await this.answersRepo.save(row);
    return { personality: row.personalityAnswers };
  }

  async saveMySoftSkills(userId: string, answers: Record<string, string>) {
    const row = await this.getOrCreateRow(userId);
    row.softSkillsAnswers = validAnswers(SOFT_SKILL_QUESTIONS, answers);
    await this.answersRepo.save(row);
    return { softSkills: row.softSkillsAnswers };
  }

  /** One questionnaire row per user (required jsonb columns get empty values). */
  private async getOrCreateRow(userId: string) {
    const row = await this.answersRepo.findOne({ where: { userId } });
    if (row) return row;
    return this.answersRepo.create({
      userId,
      interests: [],
      interestCategories: {},
      personalityAnswers: {},
      softSkillsAnswers: {},
      workPreferences: [],
    });
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
