import { Body, Controller, Get, Post, Put, Req } from '@nestjs/common';
import type { Request } from 'express';
import { QuestionnaireService } from './questionnaire.service';
import { SubmitQuestionnaireAnswersDto } from './dto/submit-questionnaire-answers.dto';
import { SaveInterestsDto } from './dto/save-interests.dto';
import { SaveAnswersDto } from './dto/save-answers.dto';

@Controller('questionnaire')
export class QuestionnaireController {
  constructor(private readonly questionnaireService: QuestionnaireService) {}

  @Get()
  getQuestionnaire() {
    return this.questionnaireService.getQuestionnaire();
  }

  /** The logged-in user's interests ("Centres d'intérêt" screen). */
  @Get('me/interests')
  getMyInterests(@Req() req: Request) {
    return this.questionnaireService.getMyInterests((req as any).user?.sub as string);
  }

  @Put('me/interests')
  saveMyInterests(@Req() req: Request, @Body() dto: SaveInterestsDto) {
    return this.questionnaireService.saveMyInterests((req as any).user?.sub as string, dto.selections);
  }

  /** Saved "Personnalité" + "Savoir-être" answers of the logged-in user. */
  @Get('me/answers')
  getMyAnswers(@Req() req: Request) {
    return this.questionnaireService.getMyAnswers((req as any).user?.sub as string);
  }

  @Put('me/personality')
  saveMyPersonality(@Req() req: Request, @Body() dto: SaveAnswersDto) {
    return this.questionnaireService.saveMyPersonality((req as any).user?.sub as string, dto.answers);
  }

  @Put('me/softskills')
  saveMySoftSkills(@Req() req: Request, @Body() dto: SaveAnswersDto) {
    return this.questionnaireService.saveMySoftSkills((req as any).user?.sub as string, dto.answers);
  }

  @Post('answers')
  submitAnswers(@Body() dto: SubmitQuestionnaireAnswersDto, @Req() req: Request) {
    // Always write for the logged-in user, never for an id taken from the body.
    dto.userId = (req as any).user?.sub as string;
    return this.questionnaireService.submitAnswers(dto);
  }
}
