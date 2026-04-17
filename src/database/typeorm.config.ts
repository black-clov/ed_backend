import { DataSourceOptions } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { UserEntity } from '../users/entities/user.entity';
import { QuestionnaireAnswerEntity } from '../questionnaire/entities/questionnaire-answer.entity';
import { SkillEntity } from '../skills/entities/skill.entity';
import { RecommendationEntity } from '../recommendations/entities/recommendation.entity';
import { OpportunityEntity } from '../opportunities/entities/opportunity.entity';
import { MentorEntity } from '../mentors/entities/mentor.entity';
import { MentorConnectionEntity } from '../mentors/entities/mentor-connection.entity';
import { ProgramEntity } from '../programs/entities/program.entity';
import { BarrierEntity } from '../barriers/entities/barrier.entity';
import { CvEntity } from '../cv/entities/cv.entity';
import { InterviewSessionEntity } from '../interview/entities/interview-session.entity';
import { VideoEntity } from '../videos/entities/video.entity';
import { NeedsAssessmentEntity } from '../needs/entities/needs-assessment.entity';
import { SectorSelectionEntity } from '../sectors/entities/sector-selection.entity';
import { EntrepreneurshipSkillEntity } from '../entrepreneurship/entities/entrepreneurship-skill.entity';
import { BusinessPlanEntity } from '../businessplan/entities/business-plan.entity';
import { PitchEntity } from '../pitch/entities/pitch.entity';
import { EntBarrierEntity } from '../entbarriers/entities/ent-barrier.entity';
import { SupportPreferenceEntity } from '../support/entities/support-preference.entity';
import { CommTrainingEntity } from '../commtraining/entities/comm-training.entity';
import { AnalyticsEventEntity } from '../analytics/entities/analytics-event.entity';
import { ContentEntity } from '../content/entities/content.entity';

export const entities = [
  UserEntity,
  QuestionnaireAnswerEntity,
  SkillEntity,
  RecommendationEntity,
  OpportunityEntity,
  MentorEntity,
  MentorConnectionEntity,
  ProgramEntity,
  BarrierEntity,
  CvEntity,
  InterviewSessionEntity,
  VideoEntity,
  NeedsAssessmentEntity,
  SectorSelectionEntity,
  EntrepreneurshipSkillEntity,
  BusinessPlanEntity,
  PitchEntity,
  EntBarrierEntity,
  SupportPreferenceEntity,
  CommTrainingEntity,
  AnalyticsEventEntity,
  ContentEntity,
];

export function getTypeOrmConfig(config: ConfigService): DataSourceOptions {
  const nodeEnv = config.get<string>('NODE_ENV', 'development');
  const isProduction = nodeEnv === 'production';
  return {
    type: 'postgres',
    host: config.get<string>('DB_HOST', 'localhost'),
    port: config.get<number>('DB_PORT', 5432),
    username: config.get<string>('DB_USERNAME', 'postgres'),
    password: config.get<string>('DB_PASSWORD', 'postgres'),
    database: config.get<string>('DB_DATABASE', 'edmaj'),
    entities,
    synchronize: config.get<string>('TYPEORM_SYNC', 'false') === 'true',
    migrationsRun: false,
    migrations: [],
    ...(isProduction && {
      ssl: { rejectUnauthorized: false },
    }),
  };
}
