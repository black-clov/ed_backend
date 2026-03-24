import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateInterviewSessionDto } from './dto/create-interview-session.dto';
import { InterviewSessionEntity } from './entities/interview-session.entity';

@Injectable()
export class InterviewService {
  constructor(
    @InjectRepository(InterviewSessionEntity)
    private readonly sessionRepo: Repository<InterviewSessionEntity>,
  ) {}

  getTips() {
    return {
      tips: [
        { id: 't1', title: 'التحضير', tip: 'ابحث على الشركة وحضر 3 نقاط قوة باش تشاركهم' },
        { id: 't2', title: 'التواصل', tip: 'جاوب بوضوح مع أمثلة قصيرة من تجربتك' },
        { id: 't3', title: 'لغة الجسد', tip: 'خلي عينيك فالمحاور، كون جالس مزيان، وما تسرعش فالهضرة' },
      ],
    };
  }

  getSimulationQuestions(role?: string) {
    const generalQuestions = [
      {
        id: 'q1',
        question: 'عرف براسك فدقيقة',
        category: 'introduction',
        tips: 'ركز على الاسم، المستوى الدراسي، والمهارات اللي عندك',
        maxScore: 20,
      },
      {
        id: 'q2',
        question: 'علاش بغيتي هاد الخدمة؟',
        category: 'motivation',
        tips: 'بين حماسك وربط الجواب بالمهارات ديالك',
        maxScore: 20,
      },
      {
        id: 'q3',
        question: 'أشنو هي نقاط القوة ديالك؟',
        category: 'strengths',
        tips: 'عطي أمثلة عملية، ماشي غير كلام عام',
        maxScore: 20,
      },
      {
        id: 'q4',
        question: 'كيفاش كتعامل مع مشكل فالخدمة؟',
        category: 'problem_solving',
        tips: 'استعمل طريقة STAR: الموقف، المهمة، الفعل، النتيجة',
        maxScore: 20,
      },
      {
        id: 'q5',
        question: 'واش عندك شي سؤال لينا؟',
        category: 'engagement',
        tips: 'سول على ثقافة الشركة أو فرص التطور',
        maxScore: 20,
      },
    ];

    if (role === 'sales') {
      generalQuestions.push({
        id: 'q6',
        question: 'كيفاش غادي تقنع زبون يشري منتج؟',
        category: 'role_specific',
        tips: 'بين كيفاش كتفهم حاجة الزبون وكتقدم الحل',
        maxScore: 20,
      });
    } else if (role === 'tech') {
      generalQuestions.push({
        id: 'q6',
        question: 'أشنو آخر حاجة تعلمتيها فالمجال التقني؟',
        category: 'role_specific',
        tips: 'هضر على تجربة عملية ماشي غير نظرية',
        maxScore: 20,
      });
    }

    return { questions: generalQuestions };
  }

  evaluateAnswer(questionId: string, answer: string) {
    const minLength = 20;
    const goodLength = 80;
    const len = answer.trim().length;

    let score = 0;
    const feedback: string[] = [];

    if (len < minLength) {
      score = 5;
      feedback.push('الجواب قصير بزاف، حاول تشرح أكثر');
    } else if (len < goodLength) {
      score = 12;
      feedback.push('جواب مقبول، حاول تزيد تفاصيل وأمثلة');
    } else {
      score = 18;
      feedback.push('جواب مفصل ومزيان');
    }

    // Check for STAR method keywords
    const starKeywords = ['الموقف', 'المهمة', 'الفعل', 'النتيجة', 'كنت', 'درت', 'النتيجة كانت'];
    const usedStar = starKeywords.some((kw) => answer.includes(kw));
    if (usedStar) {
      score = Math.min(score + 2, 20);
      feedback.push('مزيان أنك استعملتي طريقة STAR');
    }

    return {
      questionId,
      score,
      maxScore: 20,
      feedback,
    };
  }

  async submitSimulation(dto: {
    userId: string;
    targetRole: string;
    answers: { questionId: string; answer: string }[];
  }) {
    const evaluations = dto.answers.map((a) =>
      this.evaluateAnswer(a.questionId, a.answer),
    );

    const totalScore = evaluations.reduce((sum, e) => sum + e.score, 0);
    const maxScore = evaluations.reduce((sum, e) => sum + e.maxScore, 0);
    const percentage = Math.round((totalScore / maxScore) * 100);

    let overallFeedback: string;
    if (percentage >= 80) {
      overallFeedback = 'أداء ممتاز! أنت جاهز للمقابلة';
    } else if (percentage >= 60) {
      overallFeedback = 'أداء جيد، مع شوية تحسين غادي تكون جاهز';
    } else if (percentage >= 40) {
      overallFeedback = 'أداء مقبول، خاصك تتدرب أكثر';
    } else {
      overallFeedback = 'خاصك تتدرب بزاف، شوف الفيديوهات والنصائح';
    }

    const session = this.sessionRepo.create({
      userId: dto.userId,
      targetRole: dto.targetRole,
      answers: dto.answers,
      feedback: evaluations,
      score: percentage,
      status: 'completed',
    });
    const saved = await this.sessionRepo.save(session);

    return {
      sessionId: saved.id,
      totalScore,
      maxScore,
      percentage,
      overallFeedback,
      evaluations,
    };
  }

  async getUserSessions(userId: string) {
    return this.sessionRepo.find({
      where: { userId },
      order: { createdAt: 'DESC' },
      take: 10,
    });
  }

  async createSession(dto: CreateInterviewSessionDto) {
    const session = this.sessionRepo.create({
      userId: dto.userId,
      targetRole: dto.targetRole,
      scheduledAt: new Date(dto.scheduledAt),
    });
    const saved = await this.sessionRepo.save(session);

    return {
      ok: true,
      session: saved,
    };
  }
}
