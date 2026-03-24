import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { InterviewService } from './interview.service';
import { CreateInterviewSessionDto } from './dto/create-interview-session.dto';
import { SubmitSimulationDto } from './dto/submit-simulation.dto';

@Controller('interview')
export class InterviewController {
  constructor(private readonly interviewService: InterviewService) {}

  @Get('tips')
  getTips() {
    return this.interviewService.getTips();
  }

  @Get('simulation/questions')
  getSimulationQuestions(@Query('role') role?: string) {
    return this.interviewService.getSimulationQuestions(role);
  }

  @Post('simulation/submit')
  submitSimulation(@Body() dto: SubmitSimulationDto) {
    return this.interviewService.submitSimulation(dto);
  }

  @Get('sessions/:userId')
  getUserSessions(@Param('userId') userId: string) {
    return this.interviewService.getUserSessions(userId);
  }

  @Post('session')
  createSession(@Body() dto: CreateInterviewSessionDto) {
    return this.interviewService.createSession(dto);
  }
}
