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
    const skills = await this.skillsService.getUserSkills(userId);
    const barriers = await this.barriersService.getLatestBarriers(userId);

    const suggestedTraining = ['Career orientation bootcamp'];
    const suggestedJobs = ['Junior assistant'];
    const suggestedInternships = ['General workplace immersion'];

    if (skills.includes('digital skills')) {
      suggestedTraining.push('Digital literacy accelerator');
      suggestedJobs.push('Digital support assistant');
      suggestedInternships.push('IT helpdesk internship');
    }

    if (skills.includes('communication') || skills.includes('teamwork')) {
      suggestedTraining.push('Professional communication workshop');
      suggestedJobs.push('Customer service representative');
    }

    if (barriers.includes('no experience')) {
      suggestedInternships.push('First experience internship program');
    }

    if (barriers.includes('low confidence')) {
      suggestedTraining.push('Confidence and interview preparation track');
    }

    if (barriers.includes('financial constraints')) {
      suggestedTraining.push('Scholarship-supported training pathway');
    }

    return {
      userId,
      basedOn: { skills, barriers },
      suggestedTraining,
      suggestedJobs,
      suggestedInternships,
    };
  }
}
