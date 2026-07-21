import { Injectable, OnModuleInit, Logger, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { AnalyticsService } from '../analytics/analytics.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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

@Injectable()
export class AdminService implements OnModuleInit {
  private readonly logger = new Logger(AdminService.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly analyticsService: AnalyticsService,
    private readonly config: ConfigService,
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
    @InjectRepository(BarrierEntity)
    private readonly barrierRepo: Repository<BarrierEntity>,
    @InjectRepository(EntBarrierEntity)
    private readonly entBarrierRepo: Repository<EntBarrierEntity>,
    @InjectRepository(NeedsAssessmentEntity)
    private readonly needsRepo: Repository<NeedsAssessmentEntity>,
    @InjectRepository(SectorSelectionEntity)
    private readonly sectorsRepo: Repository<SectorSelectionEntity>,
    @InjectRepository(SkillEntity)
    private readonly skillsRepo: Repository<SkillEntity>,
    @InjectRepository(CommTrainingEntity)
    private readonly commTrainingRepo: Repository<CommTrainingEntity>,
    @InjectRepository(EntrepreneurshipSkillEntity)
    private readonly entSkillsRepo: Repository<EntrepreneurshipSkillEntity>,
    @InjectRepository(SupportPreferenceEntity)
    private readonly supportRepo: Repository<SupportPreferenceEntity>,
    @InjectRepository(RecommendationEntity)
    private readonly recommendationRepo: Repository<RecommendationEntity>,
    @InjectRepository(MentorConnectionEntity)
    private readonly mentorConnRepo: Repository<MentorConnectionEntity>,
    @InjectRepository(AnalyticsEventEntity)
    private readonly analyticsEventRepo: Repository<AnalyticsEventEntity>,
  ) {}

  async onModuleInit() {
    // Optionally promote a single bootstrap account to admin. The email comes
    // from the ADMIN_EMAIL env var (never hardcoded), and we only elevate the
    // role — the password is NEVER touched, so the user keeps whatever they set.
    const adminEmail = this.config.get<string>('ADMIN_EMAIL');
    if (!adminEmail) return;

    const user = await this.usersService.findByEmail(adminEmail);
    if (user && user.role !== 'admin') {
      await this.usersService.updateRole(user.id, 'admin');
      this.logger.log(`Promoted ${adminEmail} to admin`);
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

  async getUserDetails(userId: string) {
    const user = await this.usersService.findOne(userId);
    if (!user) throw new NotFoundException('User not found');

    const [
      questionnaire,
      cv,
      interviews,
      businessPlan,
      pitch,
      barriers,
      entBarriers,
      needs,
      sectors,
      skills,
      commTraining,
      entSkills,
      support,
      recommendation,
      mentorConnections,
    ] = await Promise.all([
      this.questionnaireRepo.findOne({ where: { userId } }),
      this.cvRepo.findOne({ where: { userId } }),
      this.interviewRepo.find({ where: { userId }, order: { createdAt: 'DESC' } }),
      this.businessPlanRepo.findOne({ where: { userId } }),
      this.pitchRepo.findOne({ where: { userId } }),
      this.barrierRepo.find({ where: { userId } }),
      this.entBarrierRepo.findOne({ where: { userId } }),
      this.needsRepo.findOne({ where: { userId } }),
      this.sectorsRepo.findOne({ where: { userId } }),
      this.skillsRepo.find({ where: { userId } }),
      this.commTrainingRepo.findOne({ where: { userId } }),
      this.entSkillsRepo.findOne({ where: { userId } }),
      this.supportRepo.findOne({ where: { userId } }),
      this.recommendationRepo.findOne({ where: { userId } }),
      this.mentorConnRepo.find({ where: { userId } }),
    ]);

    return {
      user,
      sections: {
        questionnaire: questionnaire || null,
        cv: cv?.payload || null,
        interviews: interviews || [],
        businessPlan: businessPlan || null,
        pitch: pitch || null,
        barriers: barriers.map(b => b.barrier),
        entBarriers: entBarriers?.barriers || null,
        needs: needs?.needs || null,
        sectors: sectors?.sectors || null,
        skills: skills.map(s => s.name),
        commTraining: commTraining || null,
        entSkills: entSkills || null,
        support: support || null,
        recommendation: recommendation || null,
        mentorConnections: mentorConnections || [],
      },
    };
  }

  async deleteUser(userId: string) {
    // Delegates to the single transactional purge in UsersService so admin
    // deletion and user self-deletion stay in sync.
    return this.usersService.deleteAccount(userId);
  }
}
