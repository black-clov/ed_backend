import { Body, Controller, Get, Post, Query, Req } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Post('track')
  async track(
    @Body() body: { action: string; target?: string; metadata?: Record<string, any> },
    @Req() req: any,
  ) {
    const userId = req.user?.sub ?? null;
    return this.analyticsService.track({
      userId,
      action: body.action,
      target: body.target,
      metadata: body.metadata,
      ipAddress: req.ip,
    });
  }

  @Get('my-events')
  async myEvents(@Req() req: any, @Query('limit') limit?: number) {
    return this.analyticsService.getUserEvents(req.user.sub, limit || 50);
  }
}
