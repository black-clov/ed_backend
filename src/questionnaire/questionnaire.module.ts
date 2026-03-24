import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuestionnaireController } from './questionnaire.controller';
import { QuestionnaireService } from './questionnaire.service';
import { QuestionnaireAnswerEntity } from './entities/questionnaire-answer.entity';

@Module({
  imports: [TypeOrmModule.forFeature([QuestionnaireAnswerEntity])],
  controllers: [QuestionnaireController],
  providers: [QuestionnaireService],
  exports: [QuestionnaireService],
})
export class QuestionnaireModule {}
