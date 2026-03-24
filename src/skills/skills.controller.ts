import { Body, Controller, Get, Post } from '@nestjs/common';
import { SkillsService } from './skills.service';
import { SetUserSkillsDto } from './dto/set-user-skills.dto';

@Controller('skills')
export class SkillsController {
  constructor(private readonly skillsService: SkillsService) {}

  @Get()
  getSkills() {
    return this.skillsService.getSkills();
  }

  @Post('user')
  setUserSkills(@Body() dto: SetUserSkillsDto) {
    return this.skillsService.setUserSkills(dto);
  }
}
