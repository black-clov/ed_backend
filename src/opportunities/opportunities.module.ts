import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OpportunitiesController } from './opportunities.controller';
import { OpportunitiesService } from './opportunities.service';
import { OpportunityEntity } from './entities/opportunity.entity';
import { SkillEntity } from '../skills/entities/skill.entity';
import { NeedsAssessmentEntity } from '../needs/entities/needs-assessment.entity';
import { QuestionnaireAnswerEntity } from '../questionnaire/entities/questionnaire-answer.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      OpportunityEntity,
      SkillEntity,
      NeedsAssessmentEntity,
      QuestionnaireAnswerEntity,
    ]),
  ],
  controllers: [OpportunitiesController],
  providers: [OpportunitiesService],
})
export class OpportunitiesModule {}
