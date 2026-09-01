import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OpportunityEntity } from './entities/opportunity.entity';
import {
  CreateOpportunityDto,
  UpdateOpportunityDto,
} from './dto/create-opportunity.dto';
import { SkillEntity } from '../skills/entities/skill.entity';
import { NeedsAssessmentEntity } from '../needs/entities/needs-assessment.entity';
import { QuestionnaireAnswerEntity } from '../questionnaire/entities/questionnaire-answer.entity';

@Injectable()
export class OpportunitiesService {
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


  async findAll() {
    return this.opportunityRepo.find();
  }

  async findOne(id: string) {
    return this.opportunityRepo.findOneBy({ id }) ?? null;
  }

  // ── Admin CRUD ──────────────────────────────────
  async create(dto: CreateOpportunityDto) {
    const entity = this.opportunityRepo.create({
      title: dto.title,
      type: dto.type,
      location: dto.location,
      description: dto.description ?? null,
      requiredSkills: dto.requiredSkills ?? [],
      suitableForNeeds: dto.suitableForNeeds ?? [],
    });
    return this.opportunityRepo.save(entity);
  }

  async update(id: string, dto: UpdateOpportunityDto) {
    await this.opportunityRepo.update(id, dto);
    return this.opportunityRepo.findOneBy({ id });
  }

  async remove(id: string) {
    await this.opportunityRepo.delete(id);
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
