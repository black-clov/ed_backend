import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { EntBarriersService } from './entbarriers.service';
import { CreateEntBarrierDto } from './dto/create-ent-barrier.dto';

@Controller('entbarriers')
export class EntBarriersController {
  constructor(private readonly service: EntBarriersService) {}

  @Get('options')
  getOptions() {
    return this.service.getOptions();
  }

  @Post()
  create(@Body() dto: CreateEntBarrierDto) {
    return this.service.create(dto);
  }

  @Get(':userId')
  getByUser(@Param('userId') userId: string) {
    return this.service.getByUser(userId);
  }
}
