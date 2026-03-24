import { Body, Controller, Get, Post } from '@nestjs/common';
import { QuestionnaireService } from './questionnaire.service';
import { SubmitQuestionnaireAnswersDto } from './dto/submit-questionnaire-answers.dto';

@Controller('questionnaire')
export class QuestionnaireController {
  constructor(private readonly questionnaireService: QuestionnaireService) {}

  @Get()
  getQuestionnaire() {
    return this.questionnaireService.getQuestionnaire();
  }

  @Post('answers')
  submitAnswers(@Body() dto: SubmitQuestionnaireAnswersDto) {
    return this.questionnaireService.submitAnswers(dto);
  }
}
