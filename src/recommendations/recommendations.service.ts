import { Injectable } from '@nestjs/common';
import { OpportunitiesService } from '../opportunities/opportunities.service';

@Injectable()
export class RecommendationsService {
  constructor(private readonly opportunitiesService: OpportunitiesService) {}

  /**
   * Recommendations are now derived from the admin-managed opportunities
   * table, personalised per user via the matching algorithm. When an admin
   * adds/edits offers, recommendations update automatically — no static data.
   */
  async getForUser(userId: string) {
    const matched = await this.opportunitiesService.matchForUser(userId);
    return matched.slice(0, 8).map((o) => ({
      title: o.title,
      description: o.description ?? '',
      actionLabel: this.actionLabelFor(o.type),
      type: o.type,
      location: o.location,
      matchScore: o.matchScore,
    }));
  }

  private actionLabelFor(type: string): string {
    switch (type) {
      case 'job':
        return 'التقديم';
      case 'internship':
        return 'استكشاف';
      case 'training':
        return 'عرض البرنامج';
      default:
        return 'عرض';
    }
  }
}
