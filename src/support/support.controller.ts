import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { SupportService } from './support.service';
import { CreateSupportPreferenceDto } from './dto/create-support.dto';

@Controller('support')
export class SupportController {
  constructor(private readonly service: SupportService) {}

  @Get('options')
  getOptions() {
    return this.service.getOptions();
  }

  @Post()
  create(@Body() dto: CreateSupportPreferenceDto) {
    return this.service.create(dto);
  }

  @Get(':userId')
  getByUser(@Param('userId') userId: string) {
    return this.service.getByUser(userId);
  }
}
