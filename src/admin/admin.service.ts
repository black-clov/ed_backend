import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { AnalyticsService } from '../analytics/analytics.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QuestionnaireAnswerEntity } from '../questionnaire/entities/questionnaire-answer.entity';
import { CvEntity } from '../cv/entities/cv.entity';
import { InterviewSessionEntity } from '../interview/entities/interview-session.entity';
import { BusinessPlanEntity } from '../businessplan/entities/business-plan.entity';
import { PitchEntity } from '../pitch/entities/pitch.entity';

const ADMIN_EMAIL = 'mouhsine.elmoudir@gmail.com';

@Injectable()
export class AdminService implements OnModuleInit {
  private readonly logger = new Logger(AdminService.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly analyticsService: AnalyticsService,
    @InjectRepository(QuestionnaireAnswerEntity)
    private readonly questionnaireRepo: Repository<QuestionnaireAnswerEntity>,
    @InjectRepository(CvEntity)
    private readonly cvRepo: Repository<CvEntity>,
    @InjectRepository(InterviewSessionEntity)
    private readonly interviewRepo: Repository<InterviewSessionEntity>,
    @InjectRepository(BusinessPlanEntity)
    private readonly businessPlanRepo: Repository<BusinessPlanEntity>,
    @InjectRepository(PitchEntity)
    private readonly pitchRepo: Repository<PitchEntity>,
  ) {}

  async onModuleInit() {
    const user = await this.usersService.findByEmail(ADMIN_EMAIL);
    if (user && user.role !== 'admin') {
      await this.usersService.updateRole(user.id, 'admin');
      this.logger.log(`Promoted ${ADMIN_EMAIL} to admin`);
    }
  }

  async getDashboardStats() {
    const [
      totalUsers,
      totalQuestionnaires,
      totalCvs,
      totalInterviews,
      totalBusinessPlans,
      totalPitches,
      activeUsers7d,
      eventsByAction,
      dailyEvents,
    ] = await Promise.all([
      this.usersService.countUsers(),
      this.questionnaireRepo.count(),
      this.cvRepo.count(),
      this.interviewRepo.count(),
      this.businessPlanRepo.count(),
      this.pitchRepo.count(),
      this.analyticsService.getActiveUsersCount(7),
      this.analyticsService.getEventCountByAction(),
      this.analyticsService.getDailyEventCounts(30),
    ]);

    return {
      totalUsers,
      activeUsers7d,
      features: {
        questionnaires: totalQuestionnaires,
        cvs: totalCvs,
        interviews: totalInterviews,
        businessPlans: totalBusinessPlans,
        pitches: totalPitches,
      },
      eventsByAction,
      dailyEvents,
    };
  }

  async getAllUsers() {
    return this.usersService.findAll();
  }

  async updateUserRole(userId: string, role: string) {
    return this.usersService.updateRole(userId, role);
  }

  async getAnalytics(limit: number) {
    return this.analyticsService.getRecentEvents(limit);
  }

  async getUserAnalytics(userId: string, limit: number) {
    return this.analyticsService.getUserEvents(userId, limit);
  }
}
