import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminController } from './admin.controller';
import { UploadController } from './upload.controller';
import { AdminService } from './admin.service';
import { UsersModule } from '../users/users.module';
import { AnalyticsModule } from '../analytics/analytics.module';
import { QuestionnaireAnswerEntity } from '../questionnaire/entities/questionnaire-answer.entity';
import { CvEntity } from '../cv/entities/cv.entity';
import { InterviewSessionEntity } from '../interview/entities/interview-session.entity';
import { BusinessPlanEntity } from '../businessplan/entities/business-plan.entity';
import { PitchEntity } from '../pitch/entities/pitch.entity';
import { BarrierEntity } from '../barriers/entities/barrier.entity';
import { EntBarrierEntity } from '../entbarriers/entities/ent-barrier.entity';
import { NeedsAssessmentEntity } from '../needs/entities/needs-assessment.entity';
import { SectorSelectionEntity } from '../sectors/entities/sector-selection.entity';
import { SkillEntity } from '../skills/entities/skill.entity';
import { CommTrainingEntity } from '../commtraining/entities/comm-training.entity';
import { EntrepreneurshipSkillEntity } from '../entrepreneurship/entities/entrepreneurship-skill.entity';
import { SupportPreferenceEntity } from '../support/entities/support-preference.entity';
import { RecommendationEntity } from '../recommendations/entities/recommendation.entity';
import { MentorConnectionEntity } from '../mentors/entities/mentor-connection.entity';
import { AnalyticsEventEntity } from '../analytics/entities/analytics-event.entity';
import { VideosModule } from '../videos/videos.module';
import { ContentModule } from '../content/content.module';

@Module({
  imports: [
    UsersModule,
    AnalyticsModule,
    VideosModule,
    ContentModule,
    TypeOrmModule.forFeature([
      QuestionnaireAnswerEntity,
      CvEntity,
      InterviewSessionEntity,
      BusinessPlanEntity,
      PitchEntity,
      BarrierEntity,
      EntBarrierEntity,
      NeedsAssessmentEntity,
      SectorSelectionEntity,
      SkillEntity,
      CommTrainingEntity,
      EntrepreneurshipSkillEntity,
      SupportPreferenceEntity,
      RecommendationEntity,
      MentorConnectionEntity,
      AnalyticsEventEntity,
    ]),
  ],
  controllers: [AdminController, UploadController],
  providers: [AdminService],
})
export class AdminModule {}
