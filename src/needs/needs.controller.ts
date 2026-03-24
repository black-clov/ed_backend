import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { NeedsService } from './needs.service';
import { CreateNeedsDto } from './dto/create-needs.dto';

@Controller('needs')
export class NeedsController {
  constructor(private readonly needsService: NeedsService) {}

  @Get('options')
  getOptions() {
    return this.needsService.getOptions();
  }

  @Post()
  create(@Body() dto: CreateNeedsDto) {
    return this.needsService.create(dto);
  }

  @Get(':userId')
  getByUser(@Param('userId') userId: string) {
    return this.needsService.getByUser(userId);
  }
}
