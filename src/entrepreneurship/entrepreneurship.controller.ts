import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { EntrepreneurshipService } from './entrepreneurship.service';
import { CreateEntrepreneurshipDto } from './dto/create-entrepreneurship.dto';

@Controller('entrepreneurship')
export class EntrepreneurshipController {
  constructor(private readonly entreService: EntrepreneurshipService) {}

  @Get('options')
  getOptions() {
    return this.entreService.getOptions();
  }

  @Post()
  create(@Body() dto: CreateEntrepreneurshipDto) {
    return this.entreService.create(dto);
  }

  @Get(':userId')
  getByUser(@Param('userId') userId: string) {
    return this.entreService.getByUser(userId);
  }
}
