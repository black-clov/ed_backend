import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InterviewController } from './interview.controller';
import { InterviewService } from './interview.service';
import { InterviewSessionEntity } from './entities/interview-session.entity';

@Module({
  imports: [TypeOrmModule.forFeature([InterviewSessionEntity])],
  controllers: [InterviewController],
  providers: [InterviewService],
})
export class InterviewModule {}
