import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VideoEntity } from './entities/video.entity';

@Injectable()
export class VideosService implements OnModuleInit {
  constructor(
    @InjectRepository(VideoEntity)
    private readonly videosRepo: Repository<VideoEntity>,
  ) {}

  async onModuleInit() {
    const count = await this.videosRepo.count();
    if (count === 0) {
      await this.videosRepo.save([
        {
          title: 'كيفاش تكتب CV مزيان',
          description: 'فهاد الفيديو غادي نشرحو ليكم كيفاش تكتبو CV احترافي اللي غادي يعجب الشركات',
          videoUrl: 'https://example.com/videos/cv-writing.mp4',
          thumbnailUrl: 'https://example.com/thumbs/cv-writing.jpg',
          category: 'cv',
          durationSeconds: 180,
          order: 1,
        },
        {
          title: 'التحضير ديال المقابلة',
          description: 'نصائح عملية باش تكون جاهز للمقابلة وتعطي أحسن صورة على راسك',
          videoUrl: 'https://example.com/videos/interview-prep.mp4',
          thumbnailUrl: 'https://example.com/thumbs/interview-prep.jpg',
          category: 'interview',
          durationSeconds: 240,
          order: 2,
        },
        {
          title: 'المهارات اللي كيطلبو الشركات',
          description: 'غادي نهضرو على أهم المهارات اللي خاصك تديرهم فالCV باش تلقى خدمة',
          videoUrl: 'https://example.com/videos/top-skills.mp4',
          thumbnailUrl: 'https://example.com/thumbs/top-skills.jpg',
          category: 'skills',
          durationSeconds: 150,
          order: 3,
        },
        {
          title: 'كيفاش تقدم راسك فالخدمة',
          description: 'تعلم كيفاش تهضر على راسك بطريقة مقنعة قدام المسؤولين',
          videoUrl: 'https://example.com/videos/self-presentation.mp4',
          thumbnailUrl: 'https://example.com/thumbs/self-presentation.jpg',
          category: 'softskills',
          durationSeconds: 200,
          order: 4,
        },
        {
          title: 'فين تلقى الفرص ديال الخدمة',
          description: 'المواقع والتطبيقات اللي فيهم فرص حقيقية للشباب المغربي',
          videoUrl: 'https://example.com/videos/finding-jobs.mp4',
          thumbnailUrl: 'https://example.com/thumbs/finding-jobs.jpg',
          category: 'opportunities',
          durationSeconds: 160,
          order: 5,
        },
        {
          title: 'كيفاش تبدا مشروعك الخاص',
          description: 'خطوات عملية باش تبدا مشروع صغير ناجح من الصفر',
          videoUrl: 'https://example.com/videos/start-business.mp4',
          thumbnailUrl: 'https://example.com/thumbs/start-business.jpg',
          category: 'entrepreneurship',
          durationSeconds: 300,
          order: 6,
        },
      ]);
    }
  }

  async findAll(category?: string): Promise<VideoEntity[]> {
    const where = category ? { category } : {};
    return this.videosRepo.find({ where, order: { order: 'ASC' } });
  }

  async findOne(id: string): Promise<VideoEntity | null> {
    return this.videosRepo.findOne({ where: { id } });
  }

  async getCategories(): Promise<{ id: string; label: string }[]> {
    return [
      { id: 'cv', label: 'كتابة السيرة الذاتية' },
      { id: 'interview', label: 'التحضير للمقابلة' },
      { id: 'skills', label: 'المهارات المطلوبة' },
      { id: 'softskills', label: 'المهارات الشخصية' },
      { id: 'opportunities', label: 'البحث عن الفرص' },
      { id: 'entrepreneurship', label: 'ريادة الأعمال' },
    ];
  }
}
