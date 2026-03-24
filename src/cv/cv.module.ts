import { Module } from '@nestjs/common';
import { CvController } from './cv.controller';
import { CvService } from './cv.service';
import { UsersModule } from '../users/users.module';
import { SkillsModule } from '../skills/skills.module';
import { QuestionnaireModule } from '../questionnaire/questionnaire.module';

@Module({
  imports: [UsersModule, SkillsModule, QuestionnaireModule],
  controllers: [CvController],
  providers: [CvService],
})
export class CvModule {}
