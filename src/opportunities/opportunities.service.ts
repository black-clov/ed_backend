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
import {
  NEED_TAGS,
  NEEDS_BY_TYPE,
  SKILL_TAGS,
  Tag,
  hasKeyword,
  tagById,
  toTagIds,
  wordText,
} from './matching';
import { INTEREST_ITEMS } from '../questionnaire/interests.catalog';

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

  /** Checkbox lists for the admin panel (same vocabulary as the app). */
  getTagOptions() {
    const pick = (vocab: Tag[]) => vocab.map(({ id, fr, ar }) => ({ id, fr, ar }));
    return { skills: pick(SKILL_TAGS), needs: pick(NEED_TAGS) };
  }

  /**
   * Rank offers for one young person.
   *
   * Skills and needs are both mapped to canonical tags (see matching.ts), so
   * the app's Arabic skill labels / need keys and the admin's French words or
   * checkboxes are compared on the same terms. The offer type also counts as
   * a need it answers (job → find a job, internship → practice, training →
   * learning). With no skills and no needs on the profile there is nothing to
   * compare: every offer gets 0 (the app then shows no percentage) instead of
   * the old misleading flat 10%.
   */
  async matchForUser(userId: string) {
    const [allOpportunities, userSkills, needsRow, questionnaire] = await Promise.all([
      this.opportunityRepo.find(),
      this.skillRepo.find({ where: { userId } }),
      this.needsRepo.findOne({ where: { userId }, order: { createdAt: 'DESC' } }),
      this.questionnaireRepo.findOne({ where: { userId } }),
    ]);

    const userSkillTags = toTagIds(userSkills.map((s) => s.name), SKILL_TAGS);
    const userNeedTags = toTagIds(needsRow?.needs ?? [], NEED_TAGS);
    const pickedInterestIds = new Set(
      Object.values(questionnaire?.interestCategories ?? {}).flat(),
    );
    const userInterests = INTEREST_ITEMS.filter((i) => pickedInterestIds.has(i.id));
    const profileEmpty =
      userSkillTags.size === 0 && userNeedTags.size === 0 && userInterests.length === 0;

    const SKILL_WEIGHT = 40;
    const NEED_WEIGHT = 35;
    const INTEREST_WEIGHT = 25;

    const scored = allOpportunities.map((opp) => {
      const reasonsFr: string[] = [];
      const reasonsAr: string[] = [];
      let score = 0;
      let maxScore = 0;

      if (!profileEmpty) {
        // Skills: share of the offer's required skills the person has.
        // Only counted when the person filled in their skills — otherwise a
        // "needs only" profile would be pulled down on every offer.
        const reqSkills = toTagIds(opp.requiredSkills, SKILL_TAGS);
        if (reqSkills.size > 0 && userSkillTags.size > 0) {
          maxScore += SKILL_WEIGHT;
          const matched = [...reqSkills].filter((t) => userSkillTags.has(t));
          score += (matched.length / reqSkills.size) * SKILL_WEIGHT;
          for (const id of matched) {
            const t = tagById(SKILL_TAGS, id)!;
            reasonsFr.push(t.fr);
            reasonsAr.push(t.ar);
          }
        }

        // Needs: does the offer answer at least one of the person's needs?
        // Free-text keywords (panel "Autres mots-clés") are stored with the
        // skills; let them count as needs too (e.g. "anglais" → languages).
        const skillIds = new Set(SKILL_TAGS.map((t) => t.id));
        const freeWords = (opp.requiredSkills ?? []).filter((s) => !skillIds.has(s));
        const offerNeeds = toTagIds([...(opp.suitableForNeeds ?? []), ...freeWords], NEED_TAGS);
        for (const n of NEEDS_BY_TYPE[opp.type] ?? []) offerNeeds.add(n);
        if (offerNeeds.size > 0 && userNeedTags.size > 0) {
          maxScore += NEED_WEIGHT;
          const matched = [...offerNeeds].filter((t) => userNeedTags.has(t));
          // One answered need already makes the offer relevant; two or more = full.
          score += Math.min(1, matched.length / Math.min(2, offerNeeds.size)) * NEED_WEIGHT;
          for (const id of matched) {
            const t = tagById(NEED_TAGS, id)!;
            reasonsFr.push(t.fr);
            reasonsAr.push(t.ar);
          }
        }

        // Interests: is the offer about an area the person picked?
        if (userInterests.length > 0) {
          maxScore += INTEREST_WEIGHT;
          const text = wordText(`${opp.title} ${opp.description ?? ''}`);
          const hits = userInterests.filter((i) =>
            [i.fr, i.ar, ...i.keywords].some((k) => hasKeyword(text, k)),
          );
          if (hits.length > 0) {
            score += INTEREST_WEIGHT;
            for (const i of hits.slice(0, 2)) {
              reasonsFr.push(i.fr);
              reasonsAr.push(i.ar);
            }
          }
        }
      }

      const matchScore = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;
      return {
        ...opp,
        matchScore,
        // App 1.0.1 shows `matchReasons` as-is and does not send its language,
        // so keep them short and bilingual; FR/AR lists are for later versions.
        matchReasons: reasonsFr.map((fr, i) => `${fr} · ${reasonsAr[i]}`),
        matchReasonsFr: reasonsFr,
        matchReasonsAr: reasonsAr,
      };
    });

    scored.sort((a, b) => b.matchScore - a.matchScore);
    return scored;
  }
}
