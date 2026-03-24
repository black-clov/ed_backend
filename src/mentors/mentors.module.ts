import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MentorsController } from './mentors.controller';
import { MentorsService } from './mentors.service';
import { MentorEntity } from './entities/mentor.entity';
import { MentorConnectionEntity } from './entities/mentor-connection.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MentorEntity, MentorConnectionEntity])],
  controllers: [MentorsController],
  providers: [MentorsService],
})
export class MentorsModule {}
