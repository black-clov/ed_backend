import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CommTrainingService } from './commtraining.service';
import { CreateCommTrainingDto } from './dto/create-comm-training.dto';

@Controller('commtraining')
export class CommTrainingController {
  constructor(private readonly service: CommTrainingService) {}

  @Get('modules')
  getModules() {
    return this.service.getModules();
  }

  @Post()
  create(@Body() dto: CreateCommTrainingDto) {
    return this.service.create(dto);
  }

  @Get(':userId')
  getByUser(@Param('userId') userId: string) {
    return this.service.getByUser(userId);
  }
}
