import { Module } from '@nestjs/common';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { QuestionnaireModule } from './questionnaire/questionnaire.module';
import { SkillsModule } from './skills/skills.module';
import { RecommendationsModule } from './recommendations/recommendations.module';
import { CvModule } from './cv/cv.module';
import { OpportunitiesModule } from './opportunities/opportunities.module';
import { MentorsModule } from './mentors/mentors.module';
import { InterviewModule } from './interview/interview.module';
import { ProgramsModule } from './programs/programs.module';
import { BarriersModule } from './barriers/barriers.module';
import { VideosModule } from './videos/videos.module';
import { NeedsModule } from './needs/needs.module';
import { SectorsModule } from './sectors/sectors.module';
import { EntrepreneurshipModule } from './entrepreneurship/entrepreneurship.module';
import { BusinessPlanModule } from './businessplan/businessplan.module';
import { PitchModule } from './pitch/pitch.module';
import { EntBarriersModule } from './entbarriers/entbarriers.module';
import { SupportModule } from './support/support.module';
import { CommTrainingModule } from './commtraining/commtraining.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { AnalyticsInterceptor } from './analytics/analytics.interceptor';
import { AdminModule } from './admin/admin.module';
import { getTypeOrmConfig } from './database/typeorm.config';



@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => getTypeOrmConfig(config),
    }),
    AuthModule,
    UsersModule,
    QuestionnaireModule,
    SkillsModule,
    RecommendationsModule,
    CvModule,
    OpportunitiesModule,
    MentorsModule,
    InterviewModule,
    ProgramsModule,
    BarriersModule,
    VideosModule,
    NeedsModule,
    SectorsModule,
    EntrepreneurshipModule,
    BusinessPlanModule,
    PitchModule,
    EntBarriersModule,
    SupportModule,
    CommTrainingModule,
    AnalyticsModule,
    AdminModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_INTERCEPTOR, useClass: AnalyticsInterceptor },
  ],
})
export class AppModule {}
