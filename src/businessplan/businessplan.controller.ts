import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { BusinessPlanService } from './businessplan.service';
import {
  CreateBusinessPlanDto,
  SaveBusinessPlanDto,
} from './dto/business-plan.dto';

@Controller('businessplan')
export class BusinessPlanController {
  constructor(private readonly planService: BusinessPlanService) {}

  @Post('generate')
  generate(@Body() dto: CreateBusinessPlanDto) {
    return this.planService.generate(dto);
  }

  @Post('save')
  save(@Body() dto: SaveBusinessPlanDto) {
    return this.planService.save(dto);
  }

  @Get(':userId')
  getByUser(@Param('userId') userId: string) {
    return this.planService.getByUser(userId);
  }
}
