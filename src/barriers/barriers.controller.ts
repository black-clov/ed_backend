import { Body, Controller, Post } from '@nestjs/common';
import { BarriersService } from './barriers.service';
import { CreateBarrierDto } from './dto/create-barrier.dto';

@Controller('barriers')
export class BarriersController {
  constructor(private readonly barriersService: BarriersService) {}

  @Post()
  create(@Body() dto: CreateBarrierDto) {
    return this.barriersService.create(dto);
  }
}
