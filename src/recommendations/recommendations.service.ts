import { Injectable } from '@nestjs/common';
import { SkillsService } from '../skills/skills.service';
import { BarriersService } from '../barriers/barriers.service';

@Injectable()
export class RecommendationsService {
  constructor(
    private readonly skillsService: SkillsService,
    private readonly barriersService: BarriersService,
  ) {}

  async getForUser(userId: string) {
    // Static placeholder suggestions removed. Recommendations now return the
    // user's own signals (skills/barriers) with empty suggestion lists until
    // real, admin-managed recommendations are wired in.
    const skills = await this.skillsService.getUserSkills(userId);
    const barriers = await this.barriersService.getLatestBarriers(userId);

    return {
      userId,
      basedOn: { skills, barriers },
      suggestedTraining: [] as string[],
      suggestedJobs: [] as string[],
      suggestedInternships: [] as string[],
    };
  }
}
