import { Controller, ForbiddenException, Get, Param, Req } from '@nestjs/common';
import type { Request } from 'express';
import { OpportunitiesService } from './opportunities.service';

@Controller('opportunities')
export class OpportunitiesController {
  constructor(private readonly opportunitiesService: OpportunitiesService) {}

  @Get()
  findAll() {
    return this.opportunitiesService.findAll();
  }

  /** Ranked offers for a user — only for that user (or an admin). */
  @Get('matched/:userId')
  matchForUser(@Param('userId') userId: string, @Req() req: Request) {
    const user = (req as any).user as { sub?: string; role?: string } | undefined;
    if (!user || (user.sub !== userId && user.role !== 'admin')) {
      throw new ForbiddenException('You can only see your own matches');
    }
    return this.opportunitiesService.matchForUser(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.opportunitiesService.findOne(id);
  }
}
