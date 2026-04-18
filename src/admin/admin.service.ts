import { Injectable, OnModuleInit, Logger, NotFoundException } from '@nestjs/common';
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
    const user = await this.usersService.findByEmail(ADMIN_EMAIL);
    if (user && user.role !== 'admin') {
      await this.usersService.updateRole(user.id, 'admin');
      this.logger.log(`Promoted ${ADMIN_EMAIL} to admin`);
    }
    // One-time password reset — remove after first deploy
    if (user) {
      await this.usersService.updatePassword(user.id, '$2b$10$3ZXbYlSpsyt3pnxqSzWyoOdQEK3uvP3E8.85PT2NUOmYNZqH7Ncbq');
      this.logger.log(`Reset password for ${ADMIN_EMAIL}`);
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
    const user = await this.usersService.findOne(userId);
    if (!user) throw new NotFoundException('User not found');

    // Delete all user data from every table
    await Promise.all([
      this.questionnaireRepo.delete({ userId }),
      this.cvRepo.delete({ userId }),
      this.interviewRepo.delete({ userId }),
      this.businessPlanRepo.delete({ userId }),
      this.pitchRepo.delete({ userId }),
      this.barrierRepo.delete({ userId }),
      this.entBarrierRepo.delete({ userId }),
      this.needsRepo.delete({ userId }),
      this.sectorsRepo.delete({ userId }),
      this.skillsRepo.delete({ userId }),
      this.commTrainingRepo.delete({ userId }),
      this.entSkillsRepo.delete({ userId }),
      this.supportRepo.delete({ userId }),
      this.recommendationRepo.delete({ userId }),
      this.mentorConnRepo.delete({ userId }),
      this.analyticsEventRepo.delete({ userId }),
    ]);

    // Finally delete the user itself
    await this.usersService.deleteUser(userId);

    return { ok: true };
  }
}
