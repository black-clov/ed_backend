import { Body, Controller, Get, Post } from '@nestjs/common';
import { MentorsService } from './mentors.service';
import { ConnectMentorDto } from './dto/connect-mentor.dto';

@Controller('mentors')
export class MentorsController {
  constructor(private readonly mentorsService: MentorsService) {}

  @Get()
  findAll() {
    return this.mentorsService.findAll();
  }

  @Post('connect')
  connect(@Body() dto: ConnectMentorDto) {
    return this.mentorsService.connect(dto);
  }
}
