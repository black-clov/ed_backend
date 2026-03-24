import { Controller, Get, Param } from '@nestjs/common';
import { OpportunitiesService } from './opportunities.service';

@Controller('opportunities')
export class OpportunitiesController {
  constructor(private readonly opportunitiesService: OpportunitiesService) {}

  @Get()
  findAll() {
    return this.opportunitiesService.findAll();
  }

  @Get('matched/:userId')
  matchForUser(@Param('userId') userId: string) {
    return this.opportunitiesService.matchForUser(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.opportunitiesService.findOne(id);
  }
}
