import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { UsersModule } from '../users/users.module';
import { AnalyticsModule } from '../analytics/analytics.module';
import { QuestionnaireAnswerEntity } from '../questionnaire/entities/questionnaire-answer.entity';
import { CvEntity } from '../cv/entities/cv.entity';
import { InterviewSessionEntity } from '../interview/entities/interview-session.entity';
import { BusinessPlanEntity } from '../businessplan/entities/business-plan.entity';
import { PitchEntity } from '../pitch/entities/pitch.entity';

@Module({
  imports: [
    UsersModule,
    AnalyticsModule,
    TypeOrmModule.forFeature([
      QuestionnaireAnswerEntity,
      CvEntity,
      InterviewSessionEntity,
      BusinessPlanEntity,
      PitchEntity,
    ]),
  ],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
